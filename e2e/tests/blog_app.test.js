const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

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
})