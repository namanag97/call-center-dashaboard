import { test, expect } from '@playwright/test'

// Helper function for logging in - we'll use this in multiple tests
async function login(page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()
}

test.describe('Calls Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
    
    // Navigate to the calls page
    await page.goto('/calls')
    
    // Verify we're on the calls page
    await expect(page.getByRole('heading', { name: /call recordings/i })).toBeVisible()
  })

  test('displays call list with filtering and pagination', async ({ page }) => {
    // Verify page elements
    await expect(page.getByRole('button', { name: /upload new call/i })).toBeVisible()
    await expect(page.getByLabel(/search/i)).toBeVisible()
    await expect(page.getByLabel(/status/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /reset filters/i })).toBeVisible()
    
    // Check table is visible (assuming it loads with data from MSW)
    await expect(page.getByRole('table')).toBeVisible()
    
    // Apply a filter
    await page.getByLabel(/search/i).fill('test call')
    
    // Wait for the table to update
    await expect(page.getByText(/loading/i)).toBeVisible({ timeout: 1000 }).catch(() => {
      // It's ok if we don't see loading state, it might be fast
    })
    
    // Select status filter
    await page.getByLabel(/status/i).selectOption('new')
    
    // Try pagination if it exists
    const nextButton = page.getByRole('button', { name: /next|next page/i })
    if (await nextButton.isVisible()) {
      await nextButton.click()
      
      // Verify page changed
      await expect(page.getByText(/page 2/i)).toBeVisible()
    }
    
    // Reset filters and verify
    await page.getByRole('button', { name: /reset filters/i }).click()
    await expect(page.getByLabel(/search/i)).toHaveValue('')
    await expect(page.getByLabel(/status/i)).toHaveValue('')
  })
  
  test('navigates to call detail page', async ({ page }) => {
    // Wait for table to load
    await page.getByRole('table').waitFor()
    
    // Click on the first call in the list
    await page.getByRole('row').nth(1).click()
    
    // Verify we're on the call detail page
    await expect(page.getByText(/call information/i)).toBeVisible()
    await expect(page.getByText(/transcript/i)).toBeVisible()
    
    // Check key elements
    await expect(page.getByText(/id:/i)).toBeVisible()
    await expect(page.getByText(/date:/i)).toBeVisible()
    await expect(page.getByText(/duration:/i)).toBeVisible()
    
    // Verify navigation back to call list
    await page.getByRole('button', { name: /back to call list/i }).click()
    await expect(page.getByRole('heading', { name: /call recordings/i })).toBeVisible()
  })
  
  test('shows empty state when no calls match filters', async ({ page }) => {
    // Enter a search term unlikely to match any calls
    await page.getByLabel(/search/i).fill('nonexistentcall12345xyz')
    
    // Verify empty state message
    await expect(page.getByText(/no calls found/i)).toBeVisible()
    await expect(page.getByText(/try changing your filters/i)).toBeVisible()
  })
}) 