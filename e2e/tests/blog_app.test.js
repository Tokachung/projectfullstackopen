const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3000/api/testing/reset')
  
    const response = await request.post('http://localhost:3000/api/users', {
      data: {
          name: "user",
          username: "root",
          password: "password"
      }
    });

    console.log('Status:', response.status());
    const body = await response.text();
    console.log('Response body:', body);

    await page.goto('http://localhost:5173')
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

  describe('when logged in', () => {
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
    })
  })
})