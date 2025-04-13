import { test, expect } from '@playwright/test'
import path from 'path'

// Helper function for logging in - we'll use this in multiple tests
async function login(page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()
}

test.describe('Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
    
    // Navigate to the upload page
    await page.goto('/upload')
    
    // Verify we're on the upload page
    await expect(page.getByRole('heading', { name: /upload calls/i })).toBeVisible()
  })

  test('uploads audio files and shows success message', async ({ page }) => {
    // Check page elements
    await expect(page.getByText(/upload audio files for transcription/i)).toBeVisible()
    
    // Create a mock file input
    const fileInput = page.locator('input[type="file"]')
    
    // Mock file upload - note we don't actually have a file, but Playwright can simulate one
    // The file path is a dummy path, MSW will intercept the actual upload
    await fileInput.setInputFiles({
      name: 'test-recording.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('dummy audio content')
    })
    
    // Verify the file appears in the list
    await expect(page.getByText('test-recording.mp3')).toBeVisible()
    
    // Click the upload button
    await page.getByRole('button', { name: /upload files/i }).click()
    
    // Verify success message
    await expect(page.getByText(/files uploaded successfully/i)).toBeVisible()
    
    // Verify clear completed button works
    await page.getByRole('button', { name: /clear completed/i }).click()
    await expect(page.getByText('test-recording.mp3')).not.toBeVisible()
  })
})

test.describe('Settings Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
    
    // Navigate to the settings page
    await page.goto('/settings')
    
    // Verify we're on the settings page
    await expect(page.getByRole('tab', { name: /providers/i })).toBeVisible()
  })

  test('adds, edits, and deletes a provider', async ({ page }) => {
    // Providers tab should be active by default
    await expect(page.getByRole('tab', { name: /providers/i })).toHaveAttribute('aria-selected', 'true')
    
    // Click add provider button
    await page.getByRole('button', { name: /add provider/i }).click()
    
    // Fill out provider form
    await page.getByLabel(/provider name/i).fill('Test Provider')
    await page.getByLabel(/api key/i).fill('test-api-key-12345')
    await page.getByLabel(/provider type/i).selectOption('transcription')
    
    // Enable the provider
    const enabledCheckbox = page.getByLabel(/enabled/i)
    if (!(await enabledCheckbox.isChecked())) {
      await enabledCheckbox.check()
    }
    
    // Submit the form
    await page.getByRole('button', { name: /save/i }).click()
    
    // Verify success message
    await expect(page.getByText(/provider added successfully/i)).toBeVisible()
    
    // Verify provider appears in the list
    await expect(page.getByText('Test Provider')).toBeVisible()
    await expect(page.getByText('transcription')).toBeVisible()
    await expect(page.getByText('Active')).toBeVisible()
    
    // Edit the provider
    await page.getByRole('button', { name: /edit/i }).first().click()
    await page.getByLabel(/provider name/i).fill('Updated Provider')
    await page.getByRole('button', { name: /save/i }).click()
    
    // Verify success message
    await expect(page.getByText(/provider updated successfully/i)).toBeVisible()
    
    // Verify provider was updated
    await expect(page.getByText('Updated Provider')).toBeVisible()
    
    // Delete the provider
    page.on('dialog', dialog => dialog.accept())  // Handle confirmation dialog
    await page.getByRole('button', { name: /delete/i }).first().click()
    
    // Verify success message
    await expect(page.getByText(/provider deleted successfully/i)).toBeVisible()
    
    // Verify provider is removed from the list
    await expect(page.getByText('Updated Provider')).not.toBeVisible()
  })

  test('switches between settings tabs', async ({ page }) => {
    // Click on Categories tab
    await page.getByRole('tab', { name: /categories/i }).click()
    await expect(page.getByRole('tab', { name: /categories/i })).toHaveAttribute('aria-selected', 'true')
    
    // Verify categories content is visible
    // This will depend on your actual implementation, but looking for a key element
    await expect(page.getByText(/categories/i)).toBeVisible()
    
    // Switch to System tab if it exists
    const systemTab = page.getByRole('tab', { name: /system/i })
    if (await systemTab.isVisible()) {
      await systemTab.click()
      await expect(systemTab).toHaveAttribute('aria-selected', 'true')
      
      // Verify system settings content
      await expect(page.getByText(/system settings/i)).toBeVisible()
    }
  })
}) 