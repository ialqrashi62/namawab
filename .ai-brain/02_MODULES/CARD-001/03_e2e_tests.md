# CARD-001 — E2E Tests (Playwright)

```js
const { test, expect } = require('@playwright/test');

test.describe('CARD-001 E2E - STEMI Activation', () => {
  test('ECG shows STEMI → cath lab activated', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@card.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/card"]');
    await page.click('button[data-test=new-encounter]');
    await page.fill('input[name=patientId]', '4001');
    await page.selectOption('select[name=encounterType]', 'CHEST_PAIN');
    await page.click('button[data-test=save-encounter]');

    // Add ECG with ST elevation
    await page.click('button[data-test=add-ecg]');
    await page.selectOption('select[name=rhythm]', 'SINUS');
    await page.fill('input[name=rate]', '80');
    await page.check('input[name=stV1]');
    await page.check('input[name=stV2]');
    await page.check('input[name=stV3]');
    await page.click('button[data-test=save-ecg]');

    // STEMI alert should appear
    await expect(page.locator('[data-test=stemi-alert]')).toBeVisible();
    await expect(page.locator('[data-test=door-to-balloon-timer]')).toBeVisible();
    await expect(page.locator('[data-test=activate-cath]')).toBeVisible();
    await page.click('button[data-test=activate-cath]');
    await expect(page.locator('[data-test=cath-activated]')).toContainText('Activated');
  });
});

test.describe('CARD-001 E2E - AF Anticoag Decision', () => {
  test('CHA2DS2-VASc ≥2 → anticoag recommended', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@card.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/card"]');
    await page.click('button[data-test=cha2ds2vasc]');
    await page.check('input[name=hypertension]');
    await page.check('input[name=diabetes]');
    await page.fill('input[name=age]', '70');
    await page.click('button[data-test=calculate]');

    await expect(page.locator('[data-test=recommendation]')).toContainText('Anticoag');
  });
});

test.describe('CARD-001 E2E - HEART Score', () => {
  test('High HEART → admit', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doc@card.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/card"]');
    await page.click('button[data-test=heart-score]');
    await page.selectOption('select[name=history]', 'HIGHLY_SUSPICIOUS');
    await page.selectOption('select[name=ecg]', 'SIGNIFICANT_ST_DEPRESSION');
    await page.fill('input[name=age]', '70');
    await page.check('input[name=riskFactors]');
    await page.fill('input[name=troponin]', '2.5');
    await page.click('button[data-test=calculate]');

    await expect(page.locator('[data-test=riskLevel]')).toContainText('HIGH');
    await expect(page.locator('[data-test=recommendation]')).toContainText('Early invasive');
  });
});
```
