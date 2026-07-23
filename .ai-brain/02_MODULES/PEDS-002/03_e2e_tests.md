# PEDS-002 — E2E Tests

```js
const { test, expect } = require('@playwright/test');

test.describe('PEDS-002 E2E - NICU Admission', () => {
  test('Neonatologist admits 28w preterm', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'neonatol@peds.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/peds/nicu"]');
    await page.click('button[data-test=new-admission]');
    await page.fill('input[name=patientId]', '2001');
    await page.fill('input[name=birthWeightGrams]', '1100');
    await page.fill('input[name=gestationalAgeWeeks]', '28');
    await page.fill('input[name=apgar1min]', '6');
    await page.fill('input[name=apgar5min]', '8');
    await page.selectOption('select[name=levelOfCare]', 'III');
    await page.selectOption('select[name=respiratorySupport]', 'CPAP');
    await page.click('button[data-test=save-admission]');

    await expect(page.locator('[data-test=success-message]')).toContainText('Admitted');
  });
});

test.describe('PEDS-002 E2E - Weight-Based Dose', () => {
  test('Order ampicillin → recalculate based on current weight', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'neonatol@peds.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/peds/nicu"]');
    await page.click('tr[data-test=admission-row] >> nth=0');
    await page.click('button[data-test=order-med]');
    await page.selectOption('select[name=drugName]', 'Ampicillin');
    await page.fill('input[name=weightAtOrder]', '1100');
    await page.click('button[data-test=recalculate-dose]');

    // System should show 55 mg for 50 mg/kg
    await expect(page.locator('[data-test=calculated-dose]')).toContainText('55 mg');
    await page.click('button[data-test=save-order]');
    await expect(page.locator('[data-test=success-message]')).toContainText('Medication ordered');
  });
});

test.describe('PEDS-002 E2E - ROP Screening', () => {
  test('Schedule ROP exam for preemie', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'neonatol@peds.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/peds/nicu"]');
    await page.click('tr[data-test=admission-row] >> nth=0');
    await page.click('button[data-test=add-screening]');
    await page.selectOption('select[name=screeningType]', 'ROP');
    await page.fill('input[name=scheduledDate]', '2026-02-15');
    await page.click('button[data-test=save-screening]');

    await expect(page.locator('[data-test=screening-list]')).toContainText('ROP');
  });
});
```
