# SURG-001 — E2E Tests

```js
const { test, expect } = require('@playwright/test');

test.describe('SURG-001 E2E - Procedure Lifecycle', () => {
  test('Schedule → Pre-op → OR → Post-op', async ({ page }) => {
    // Login as surgeon
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'surgeon@surg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    // Schedule procedure
    await page.click('a[href="/surg"]');
    await page.click('button[data-test=schedule-procedure]');
    await page.fill('input[name=patientId]', '3001');
    await page.fill('input[name=procedureName]', 'Laparoscopic Cholecystectomy');
    await page.selectOption('select[name=urgency]', 'ELECTIVE');
    await page.selectOption('select[name=asaClass]', '2');
    await page.click('button[data-test=save-procedure]');

    await expect(page.locator('[data-test=success-message]')).toContainText('Scheduled');

    // Pre-op checklist
    await page.click('tr[data-test=procedure-row] >> nth=0');
    await page.click('button[data-test=preop-check]');
    await page.check('input[name=npoConfirmed]');
    await page.check('input[name=siteMarked]');
    await page.check('input[name=antibioticGiven]');
    await page.check('input[name=consentSigned]');
    await page.check('input[name=vteProphylaxis]');
    await page.click('button[data-test=save-preop]');

    // OR
    await page.click('button[data-test=start-procedure]');
    await page.click('button[data-test=time-out-confirm]');
    await page.selectOption('select[name=anesthesiaType]', 'GENERAL');
    await page.fill('input[name=estimatedBloodLossMl]', '50');
    await page.check('input[name=countsCorrect]');
    await page.click('button[data-test=save-intraop]');

    // Post-op
    await page.click('button[data-test=postop]');
    await page.selectOption('select[name=disposition]', 'WARD');
    await page.click('button[data-test=save-postop]');

    await expect(page.locator('[data-test=success-message]')).toContainText('Post-op saved');
  });
});

test.describe('SURG-001 E2E - Complication', () => {
  test('Add SSI Clavien-Dindo 2', async ({ page }) => {
    await page.goto('https://jumanasoft.com/login');
    await page.fill('input[name=email]', 'surgeon@surg.test');
    await page.fill('input[name=password]', 'Test1234!');
    await page.click('button[type=submit]');

    await page.click('a[href="/surg"]');
    await page.click('tr[data-test=procedure-row] >> nth=0');
    await page.click('button[data-test=add-complication]');
    await page.selectOption('select[name=complicationType]', 'SSI');
    await page.selectOption('select[name=severity]', 'MODERATE');
    await page.selectOption('select[name=clavienDindoGrade]', '2');
    await page.fill('textarea[name=treatment]', 'Antibiotics');
    await page.click('button[data-test=save-complication]');

    await expect(page.locator('[data-test=complication-list]')).toContainText('SSI');
  });
});
```
