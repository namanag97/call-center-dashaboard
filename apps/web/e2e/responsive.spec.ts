import { test, expect } from '@playwright/test';

// Helper function for logging in
async function login(page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()
}

// Define viewports to test
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 }
];

test.describe('Responsive Tests', () => {
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
      });

      test('Login form renders correctly', async ({ page }) => {
        await page.goto('/login');
        
        // Check login form is visible
        await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
        
        // Take a screenshot for visual reference
        await page.screenshot({ 
          path: `e2e-results/responsive-login-${viewport.name.toLowerCase()}.png` 
        });
      });

      test('Call list renders correctly', async ({ page }) => {
        // Login first
        await login(page);
        
        // Go to calls page
        await page.goto('/calls');
        
        // Check that the table or mobile card view is visible
        if (viewport.width >= 768) {
          // On larger screens, expect a table
          await expect(page.getByRole('table')).toBeVisible();
        } else {
          // On mobile, we might have cards instead of a table, or a responsive table
          // This depends on your actual implementation, adjust as needed
          await expect(page.getByRole('heading', { name: /call recordings/i })).toBeVisible();
        }
        
        // Take a screenshot for visual reference
        await page.screenshot({ 
          path: `e2e-results/responsive-calls-${viewport.name.toLowerCase()}.png`
        });
      });

      test('Navigation works correctly', async ({ page }) => {
        // Login first
        await login(page);
        
        // Check that navigation is accessible
        if (viewport.width < 768) {
          // On mobile, we might have a hamburger menu
          const menuButton = page.getByRole('button', { name: /menu|toggle navigation/i });
          if (await menuButton.isVisible()) {
            await menuButton.click();
          }
        }
        
        // Check that navigation links are visible
        await expect(page.getByRole('link', { name: /calls/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
        
        // Take a screenshot for visual reference
        await page.screenshot({ 
          path: `e2e-results/responsive-nav-${viewport.name.toLowerCase()}.png`
        });
      });
    });
  }
}); 