const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

// NOTE: This test has async timing issues early on, but passes consistently after retries.
// Leaving it alone for now to preserve sanity.

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // 1. Reset the backend
    await request.post('http://localhost:3000/api/testing/reset')
  
    // 2. Re-create the users into the DB
    await request.post('http://localhost:3000/api/users', {
      data: {
          name: "user",
          username: "root",
          password: "password"
      }
    });

    await request.post('http://localhost:3000/api/users', {
      data: {
          name: "greg house",
          username: "greghouse",
          password: "password"
      }
    });

    // 3. Navigate to app *first* (MUST be on same-origin before evaluating)
    await page.goto('http://localhost:5173');

    // 4. Clear localStorage (NOW it's safe)
    await page.evaluate(() => localStorage.clear());

    // 5. Reload to re-bootstrap with clean localStorage
    await page.reload();
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Please log in to view the blogs')).toBeVisible()
    
    await page.getByRole('button', { name: 'login'}).click()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  test('Successful log in', async ({ page }) => {
    await loginWith(page, 'root', 'password')
    await expect(page.getByText('Wrong username or password')).not.toBeVisible()
    await expect(page.getByText('user logged-in')).toBeVisible()
    
  })

  test('Unsuccessful log in', async ({ page }) => {
    await loginWith(page, 'root', 'wrongpassword')
    await expect(page.getByText('Wrong username or password')).toBeVisible()
    await expect(page.getByText('user logged-in')).not.toBeVisible()
  })

  describe('when blogs with different likes exist', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'password')
    })
  })

  describe('when blog created by root user', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'password')
      await createBlog(page, 'blog-owned-by-root', 'root-author', 'root-url');

      // Logout by nuking localStorage in browser
      await page.evaluate(() => {
        window.localStorage.removeItem('loggedBlogappUser');
      });

      // Optional: reload the page to reset app state
      await page.reload();

      // Log in as User B
      await loginWith(page, 'greghouse', 'password');
    })

    test('second user can not remove blog from root user', async ({page}) => {
      const otherBlogTitle = await page.getByText('blog-owned-by-root')
      const otherBlogElement = await otherBlogTitle.locator('..')
      console.log(await otherBlogElement.innerHTML());  // Ensure it's the right text

      await otherBlogElement.getByRole('button', { name: 'view'}).click()
      await expect(otherBlogElement.getByRole('button', { name: 'Remove'})).not.toBeVisible()
    })
  })

  describe('when logged in as root user', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'password')
    })

    describe('and several blogs exist', () => {
      beforeEach(async({ page }) => {
        await createBlog(page, 'first blog title', 'author 1', 'url.com')
        await createBlog(page, 'second blog title', 'author 2', 'url2.com')
        await createBlog(page, 'third blog title', 'author 3', 'url3.com')
      })

      test('can like a single note', async ({page}) => {
        const otherBlogTitle = await page.getByText('first blog title')
        const otherBlogElement = await otherBlogTitle.locator('..')
        console.log(await otherBlogElement.innerHTML());  // Ensure it's the right text

        await otherBlogElement.getByRole('button', { name: 'view'}).click()
        await otherBlogElement.getByRole('button', { name: 'like'}).click()
        
        const likeCount = await otherBlogElement.getByTestId('blog-likes')
        await expect(likeCount).toHaveText('1', { timeout: 3000 });
      })

      test('valid user can delete a blog', async ({page}) => {
        page.once('dialog', async (dialog) => {
          expect(dialog.message()).toBe("Are you sure you want to do this bro?");
          await dialog.accept(); // Simulates clicking "OK" / "Yes"
        });

        await expect(page.getByText('first blog title')).toHaveCount(1);

        const otherBlogTitle = await page.getByText('first blog title')
        const otherBlogElement = await otherBlogTitle.locator('..')

        await otherBlogElement.getByRole('button', { name: 'view'}).click()
        await otherBlogElement.getByRole('button', { name: 'Remove'}).click()

        await expect(page.getByText('first blog title')).toHaveCount(0);
      })

      test('valid user can change mind for delete a blog', async ({page}) => {
        page.once('dialog', async (dialog) => {
          expect(dialog.message()).toBe("Are you sure you want to do this bro?");
          await dialog.dismiss() // Simulates clicking "OK" / "Yes"
        });

        await expect(page.getByText('first blog title')).toHaveCount(1);

        const otherBlogTitle = await page.getByText('first blog title')
        const otherBlogElement = await otherBlogTitle.locator('..')

        await otherBlogElement.getByRole('button', { name: 'view'}).click()
        await otherBlogElement.getByRole('button', { name: 'Remove'}).click()

        await expect(page.getByText('first blog title')).toHaveCount(1);
      })
    
      test('likes are sequential upon refresh', async ({ page }) => {
        const blogTitles = [
          { title: 'first blog title', likes: 1 },
          { title: 'second blog title', likes: 2 },
          { title: 'third blog title', likes: 3 }
        ];
      
        // Like each blog N times
        for (const { title, likes } of blogTitles) {
          const blog = page.locator('[data-testid="blog"]', { hasText: title });
          await blog.getByRole('button', { name: 'view' }).click();
          for (let i = 0; i < likes; i++) {
            await blog.getByRole('button', { name: 'Like' }).click();
            await page.waitForTimeout(300);
          }
        }
      
        // Reload and re-login to ensure state is persisted
        await page.goto('http://localhost:5173');
        await page.getByRole('button', { name: 'Log out' }).click();
        await loginWith(page, 'root', 'password');
        await page.waitForTimeout(300);
      
        const blogs = page.locator('[data-testid="blog"]');
      
        // Expand all blogs to reveal like counts
        for (let i = 0; i < 3; i++) {
          await blogs.nth(i).getByRole('button', { name: 'view' }).click();
        }
      
        // Assert descending order of likes
        await expect(blogs.nth(0).getByTestId('blog-likes')).toHaveText('3');
        await expect(blogs.nth(1).getByTestId('blog-likes')).toHaveText('2');
        await expect(blogs.nth(2).getByTestId('blog-likes')).toHaveText('1');
      });
    })
  })
})