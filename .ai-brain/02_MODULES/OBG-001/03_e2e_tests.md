# OBG-001 — E2E Tests (Playwright)

```js
const { test, expect } = require('@playwright/test');

test.describe('OBG E2E - Pregnancy Registration', () => {
  test('Midwife registers new pregnancy', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'midwife@obg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/obg"]');
    await page.click('button[data-test=new-pregnancy]');
    await page.fill('input[name=patientId]', '1001');
    await page.fill('input[name=lmpDate]', '2026-01-01');
    await page.selectOption('select[name=bloodType]', 'O');
    await page.selectOption('select[name=rhFactor]', '+');
    await page.fill('input[name=gravida]', '1');
    await page.fill('input[name=para]', '0');
    await page.fill('input[name=bmi]', '24');
    await page.click('button[data-test=save-pregnancy]');

    await expect(page.locator('[data-test=success-message]')).toContainText('Pregnancy registered');
  });
});

test.describe('OBG E2E - Preeclampsia Detection', () => {
  test('High BP → auto-classify severe preeclampsia', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'midwife@obg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/obg"]');
    await page.click('tr[data-test=pregnancy-row] >> nth=0');
    await page.click('button[data-test=preeclampsia-screen]');
    await page.fill('input[name=bpSystolic]', '165');
    await page.fill('input[name=bpDiastolic]', '115');
    await page.selectOption('select[name=proteinuria]', '2+');
    await page.check('input[name=symptoms][value=severe_headache]');
    await page.fill('input[name=platelets]', '80000');
    await page.click('button[data-test=save-screen]');

    await expect(page.locator('[data-test=classification]')).toContainText('SEVERE');
    await expect(page.locator('[data-test=critical-alert]')).toBeVisible();
  });
});

test.describe('OBG E2E - Delivery Recording', () => {
  test('Record SVD + Apgar + Newborn', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doctor@obg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/obg"]');
    await page.click('tr[data-test=pregnancy-row] >> nth=0');
    await page.click('button[data-test=record-delivery]');
    await page.selectOption('select[name=deliveryMode]', 'SVD');
    await page.fill('input[name=estimatedBloodLossMl]', '400');
    await page.fill('input[name=apgar1min]', '9');
    await page.fill('input[name=apgar5min]', '10');
    await page.click('button[data-test=save-delivery]');

    await page.fill('input[name=sex]', 'F');
    await page.fill('input[name=weightGrams]', '3200');
    await page.click('button[data-test=save-newborn]');

    await expect(page.locator('[data-test=success-message]')).toContainText('Newborn recorded');
  });
});

test.describe('OBG E2E - PPH Activation', () => {
  test('EBL >500 → PPH protocol activated', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'doctor@obg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/obg"]');
    await page.click('button[data-test=record-delivery]');
    await page.selectOption('select[name=deliveryMode]', 'SVD');
    await page.fill('input[name=estimatedBloodLossMl]', '800');
    await page.click('button[data-test=save-delivery]');

    // PPH alert should appear
    await expect(page.locator('[data-test=pph-alert]')).toBeVisible();
    await expect(page.locator('[data-test=pph-protocol]')).toContainText('Activate');
  });
});
```
