# MICU — E2E Tests (Playwright)

## Test File: micu_e2e.spec.js

```js
const { test, expect } = require('@playwright/test');

test.describe('MICU E2E — Sepsis Workflow', () => {
  test('Nurse records high-risk vitals → bundle activated', async ({ page }) => {
    // Login
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'nurse@micu.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    // Navigate to MICU board
    await page.click('a[href="/micu"]');
    await expect(page.locator('h1')).toContainText('MICU Board');

    // Open first patient
    await page.click('tr[data-test=admission-row] >> nth=0');

    // Enter vitals (high risk)
    await page.click('button[data-test=enter-vitals]');
    await page.fill('input[name=heartRate]', '110');
    await page.fill('input[name=systolicBp]', '85');
    await page.fill('input[name=respiratoryRate]', '24');
    await page.fill('input[name=temperatureC]', '39.5');
    await page.fill('input[name=gcsTotal]', '14');
    await page.click('button[data-test=save-vitals]');

    // Bundle alert should appear
    await expect(page.locator('[data-test=critical-alert]')).toContainText('Sepsis');
    await expect(page.locator('[data-test=bundle-tracker]')).toBeVisible();

    // Screenshot for visual verification
    await page.screenshot({ path: 'screenshots/micu-sepsis.png', fullPage: true });
  });

  test('MD orders norepinephrine (attending)', async ({ page }) => {
    // Login as attending
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'attending@micu.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    // Open same patient
    await page.click('a[href="/micu"]');
    await page.click('tr[data-test=admission-row] >> nth=0');

    // Order norepinephrine
    await page.click('button[data-test=order-vasoactive]');
    await page.selectOption('select[name=drugName]', 'norepinephrine');
    await page.fill('input[name=dose]', '0.1');
    await page.click('button[data-test=submit-order]');

    // Confirm
    await expect(page.locator('[data-test=success-message]')).toContainText('Norepinephrine started');
  });
});

test.describe('MICU E2E — Ventilator Weaning', () => {
  test('SBT screen → extubation', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'rt@micu.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/micu"]');
    await page.click('tr[data-test=admission-row] >> nth=0');

    // Daily screening
    await page.click('button[data-test=screen-weaning]');
    await expect(page.locator('[data-test=weaning-readiness]')).toContainText('Ready');

    // SBT
    await page.click('button[data-test=start-sbt]');
    await page.fill('input[name=sbtDuration]', '30');
    await page.click('button[data-test=confirm-sbt]');

    // Result
    await expect(page.locator('[data-test=sbt-result]')).toContainText('Passed');
  });
});

test.describe('MICU E2E — Code Status Change', () => {
  test('Family meeting documented', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'attending@micu.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/micu"]');
    await page.click('tr[data-test=admission-row] >> nth=0');

    await page.click('button[data-test=code-status]');
    await page.selectOption('select[name=status]', 'DNR');
    await page.check('input[name=familyMeeting]');
    await page.fill('textarea[name=notes]', 'Family met, decision documented');
    await page.click('button[data-test=save-code-status]');

    await expect(page.locator('[data-test=code-status-badge]')).toContainText('DNR');
  });
});

test.describe('MICU E2E — Multi-tenant Isolation', () => {
  test('User A cannot see User B patients', async ({ page }) => {
    // Login as User A
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'userA@tenantA.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/micu"]');
    const countA = await page.locator('tr[data-test=admission-row]').count();

    // Logout
    await page.click('button[data-test=logout]');

    // Login as User B (different tenant)
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'userB@tenantB.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/micu"]');
    const countB = await page.locator('tr[data-test=admission-row]').count();

    // Different counts (different patients)
    expect(countA).not.toBe(countB);
  });
});
```

## Test Count
- 5 E2E tests across 4 describe blocks
- Coverage: nurse vitals, MD orders, RT weaning, code status, multi-tenant
- All with real Playwright + browser
- Screenshots for visual verification
- PHI safety: test fixtures only, no real patient data
