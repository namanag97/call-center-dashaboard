import { test, expect } from '@playwright/test'

test('homepage has expected layout and buttons', async ({ page }) => {
  await page.goto('/')
  
  // Check heading
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  
  // Check welcome text
  await expect(page.getByText(/welcome to the conista dashboard/i)).toBeVisible()
  
  // Check buttons
  await expect(page.getByRole('button', { name: /primary button/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /secondary button/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /outline button/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /ghost button/i })).toBeVisible()
  
  // Check button styles and interactions  
  const primaryButton = page.getByRole('button', { name: /primary button/i })
  await expect(primaryButton).toHaveClass(/bg-primary-600/)
  
  // Take a screenshot of the dashboard
  await page.screenshot({ path: 'e2e-results/homepage.png' })
}) 