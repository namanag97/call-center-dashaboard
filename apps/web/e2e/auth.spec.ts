import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('shows login page and handles successful login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Verify login page elements
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    
    // Fill and submit the form
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Verify we're redirected to the dashboard/home
    await expect(page.url()).toContain('/')
    await expect(page.getByRole('heading', { name: /dashboard/i, exact: false })).toBeVisible()
  })
  
  test('displays error on invalid login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Fill invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Check for error message
    await expect(page.getByText(/invalid credentials|unauthorized/i)).toBeVisible()
    
    // Verify we're still on the login page
    await expect(page.url()).toContain('/login')
  })
  
  test('validates login form inputs', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Check for validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
    
    // Test invalid email format
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/email is invalid/i)).toBeVisible()
    
    // Test short password
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('12345')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })
  
  test('handles logout properly', async ({ page }) => {
    // First log in
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Verify we're logged in
    await expect(page.url()).toContain('/')
    
    // Find and click the logout button/link (assuming it's in the user menu)
    // This might need adjustment based on your actual UI implementation
    await page.getByRole('button', { name: /account|profile|user/i, exact: false }).click()
    await page.getByRole('menuitem', { name: /logout|sign out/i }).click()
    
    // Verify we're redirected back to login
    await expect(page.url()).toContain('/login')
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible()
  })
}) 