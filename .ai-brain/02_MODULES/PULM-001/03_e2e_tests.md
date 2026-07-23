# PULM-001 — E2E

```js
const { test, expect } = require('@playwright/test');

test.describe('PULM-001 E2E - PFT Entry', () => {
  test('Pulmonologist enters PFT, gets obstructive pattern', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@pulm.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');
    await page.click('a[href="/pulm"]');
    await page.click('button[data-test=new-pft]');
    await page.fill('input[name=fev1]', '2.0');
    await page.fill('input[name=fvc]', '4.0');
    await page.fill('input[name=fev1PercentPredicted]', '60');
    await page.click('button[data-test=save-pft]');
    await expect(page.locator('[data-test=pattern]')).toContainText('OBSTRUCTIVE');
  });
});
```
