import { test, expect } from '@playwright/test';
import { runA11yTests } from './utils/a11y';

// Helper function for logging in - we'll use this in multiple tests
async function login(page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()
}

test.describe('Accessibility Tests', () => {
  test('Login page passes accessibility checks', async ({ page }) => {
    await page.goto('/login');
    
    // Run accessibility tests
    const violations = await runA11yTests(page, 'login-page');
    
    // Check for critical or serious violations
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations on login page:', 
        criticalViolations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }
    
    // Assert no critical violations
    expect(criticalViolations.length, 
      `Found ${criticalViolations.length} critical accessibility violations`
    ).toBe(0);
  });
  
  test('Call List page passes accessibility checks', async ({ page }) => {
    // Login first
    await login(page);
    await page.goto('/calls');
    
    // Run accessibility tests
    const violations = await runA11yTests(page, 'call-list-page');
    
    // Check for critical or serious violations
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations on call list page:', 
        criticalViolations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }
    
    // Assert no critical violations
    expect(criticalViolations.length, 
      `Found ${criticalViolations.length} critical accessibility violations`
    ).toBe(0);
  });
  
  test('Call Detail page passes accessibility checks', async ({ page }) => {
    // Login first
    await login(page);
    
    // Go to calls page and click first call
    await page.goto('/calls');
    await page.getByRole('table').waitFor();
    await page.getByRole('row').nth(1).click();
    
    // Run accessibility tests
    const violations = await runA11yTests(page, 'call-detail-page');
    
    // Check for critical or serious violations
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations on call detail page:', 
        criticalViolations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }
    
    // Assert no critical violations
    expect(criticalViolations.length, 
      `Found ${criticalViolations.length} critical accessibility violations`
    ).toBe(0);
  });
  
  test('Settings page passes accessibility checks', async ({ page }) => {
    // Login first
    await login(page);
    await page.goto('/settings');
    
    // Run accessibility tests
    const violations = await runA11yTests(page, 'settings-page');
    
    // Check for critical or serious violations
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations on settings page:', 
        criticalViolations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }
    
    // Assert no critical violations
    expect(criticalViolations.length, 
      `Found ${criticalViolations.length} critical accessibility violations`
    ).toBe(0);
  });
}); 