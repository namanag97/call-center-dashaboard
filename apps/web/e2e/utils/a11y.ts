import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

/**
 * Runs axe accessibility tests on the current page
 * @param page The Playwright page object
 * @param name A name to identify the test in reports
 * @param options Optional configuration for the accessibility test
 * @returns The accessibility violations found
 */
export async function runA11yTests(page: Page, name: string, options?: {
  includedImpacts?: ('minor' | 'moderate' | 'serious' | 'critical')[];
  excludeRules?: string[];
}) {
  // Configure AxeBuilder
  let axeBuilder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .options({
      reporter: 'v2',
    });

  // Apply impact filter if provided
  if (options?.includedImpacts) {
    // Filter results by impact level in our post-processing instead
    // as AxeBuilder's typing for resultTypes doesn't match our needs
  }

  // Apply rule exclusions if provided
  if (options?.excludeRules) {
    axeBuilder = axeBuilder.disableRules(options.excludeRules);
  }

  // Run the analysis and get results
  const accessibilityScanResults = await axeBuilder.analyze();

  // Filter by impact if needed
  let filteredViolations = accessibilityScanResults.violations;
  if (options?.includedImpacts && options.includedImpacts.length > 0) {
    filteredViolations = filteredViolations.filter(
      violation => options.includedImpacts?.includes(violation.impact as any)
    );
  }

  // Take a screenshot for visual reference
  await page.screenshot({ path: `e2e-results/a11y-${name.replace(/\s+/g, '-')}.png` });
  
  return filteredViolations;
} 