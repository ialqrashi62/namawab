# GI-001 — E2E Tests

```js
const { test, expect } = require('@playwright/test');

test.describe('GI-001 E2E - Massive Bleed', () => {
  test('High GBS → EGD + IV PPI activated', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@gi.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');
    await page.click('a[href="/gi"]');
    await page.click('button[data-test=new-bleed]');
    await page.fill('input[name=systolicBp]', '85');
    await page.fill('input[name=heartRate]', '110');
    await page.fill('input[name=hemoglobin]', '8');
    await page.check('input[name=melena]');
    await page.check('input[name=syncope]');
    await page.click('button[data-test=save-assessment]');
    await expect(page.locator('[data-test=critical-alert]')).toBeVisible();
    await expect(page.locator('[data-test=egd-button]')).toBeVisible();
  });
});

test.describe('GI-001 E2E - Cirrhosis MELD', () => {
  test('High MELD → transplant priority', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@gi.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');
    await page.click('a[href="/gi"]');
    await page.click('button[data-test=calculate-meld]');
    await page.fill('input[name=bilirubin]', '5');
    await page.fill('input[name=inr]', '2');
    await page.fill('input[name=creatinine]', '2');
    await page.click('button[data-test=save]');
    await expect(page.locator('[data-test=transplant-priority]')).toBeVisible();
  });
});
```
