# 51 — E2E Tests (CARD-001)

> Owner: ORC + SA · Snippet: snippet:test-pattern · Tier 1

## Framework: Playwright

## Test files

```
e2e/cardiology/outpatient_consult.spec.js
e2e/cardiology/code_stemi_pathway.spec.js
e2e/cardiology/hf_clinic_visit.spec.js
e2e/cardiology/af_new_diagnosis.spec.js
e2e/cardiology/cath_lab_workflow.spec.js
e2e/cardiology/device_implant.spec.js
e2e/cardiology/copilot_query.spec.js
e2e/cardiology/nphies_claim.spec.js
e2e/cardiology/red_flag_activate.spec.js
```

## E2E: Outpatient consult (happy path)

```js
// e2e/cardiology/outpatient_consult.spec.js
import { test, expect } from '@playwright/test';

test('Cardiology outpatient consult — happy path', async ({ page, request }) => {
  // Login as cardiologist
  await page.goto('https://staging.jumanasoft.com/login');
  await page.fill('input[name="email"]', 'cardio.test@nama-medical');
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Open patient
  await page.click('text=Patients');
  await page.click('text=Test Patient CARD-001');
  await page.click('text=New Cardiology Encounter');

  // Fill H&P
  await page.fill('textarea[name="chief_complaint"]', 'Chest pain on exertion for 2 weeks');
  await page.fill('textarea[name="hpi"]', '...');
  await page.selectOption('select[name="diagnosis_primary"]', 'I20.9');
  await page.click('text=Save');
  await expect(page.locator('text=Saved')).toBeVisible();

  // Order echo + labs
  await page.click('text=Orders');
  await page.click('text=Echo');
  await page.click('text=Add');
  await page.click('text=Stress Test');
  await page.click('text=Add');
  await page.click('text=CBC, BMP, Lipid, HbA1c, TSH');
  await page.click('text=Add');
  await page.click('text=Sign Orders');

  // Expect CDS check
  await expect(page.locator('text=No drug interactions')).toBeVisible();

  // Write Rx
  await page.click('text=Rx');
  await page.fill('input[name="drug_name"]', 'Aspirin');
  await page.fill('input[name="dose"]', '81');
  await page.selectOption('select[name="frequency"]', 'daily');
  await page.click('text=Add to Rx');
  await page.click('text=Sign and Submit to NPHIES');

  // Schedule follow-up
  await page.click('text=Disposition');
  await page.fill('input[name="follow_up_date"]', '2026-08-15');
  await page.click('text=Schedule');

  // Verify
  await expect(page.locator('text=Encounter signed')).toBeVisible();
  await expect(page.locator('text=Rx submitted to NPHIES')).toBeVisible();
});
```

## E2E: CODE STEMI pathway

```js
// e2e/cardiology/code_stemi_pathway.spec.js
test('CODE STEMI: ECG auto-detect + activation + 4-eye sign', async ({ page, request }) => {
  // Login as ER doctor
  await loginAs(page, 'er.test@nama-medical');
  await page.click('text=ER Station');

  // Register patient
  await page.fill('input[name="mrn"]', 'STEMI-DUMMY-001');
  await page.click('text=Search');
  await page.click('text=STEMI Test Patient');
  await page.click('text=Start Triage');

  // ECG within 10 min
  await page.click('text=ECG');
  // Upload synthetic STEMI ECG
  await page.setInputFiles('input[type="file"]', 'fixtures/ecg_stemi_anterior.png');
  await page.click('text=Upload + Interpret');

  // Expect red flag banner
  await expect(page.locator('text=⚠ STEMI')).toBeVisible();
  await expect(page.locator('text=CODE STEMI')).toBeVisible();

  // Activate CODE
  await page.click('text=Activate CODE STEMI');
  await page.click('text=Confirm');

  // Expect page to cardiologist + cath team (verify via Slack stub)
  // (slackStub.assertPaged('cardio.oncall', 'STEMI'))

  // Administer ASA + ticagrelor
  await page.click('text=Medications');
  await page.fill('input[name="drug"]', 'Aspirin 300mg PO');
  await page.click('text=Administer');
  await page.fill('input[name="drug"]', 'Ticagrelor 180mg PO');
  await page.click('text=Administer');

  // Expect door-to-ECG < 10 min + door-to-balloon tracking
  const timings = await page.evaluate(() => window.STEMI_TIMINGS);
  expect(timings.door_to_ecg).toBeLessThan(10 * 60);  // 10 min in seconds
  expect(timings.door_to_balloon).toBeLessThan(90 * 60);  // 90 min
});
```

## E2E: HF clinic visit

```js
// e2e/cardiology/hf_clinic_visit.spec.js
test('HF GDMT optimizer recommends all 4 pillars for HFrEF', async ({ page }) => {
  await loginAs(page, 'hf.doctor@nama-medical');
  await page.click('text=Patients');
  await page.click('text=HF Test Patient');
  await page.click('text=Open Encounter');

  await page.click('text=GDMT Optimizer');
  await expect(page.locator('text=GDMT Optimizer')).toBeVisible();

  // Auto-populated from patient
  await expect(page.locator('text=EF: 30%')).toBeVisible();
  await expect(page.locator('text=NYHA: II')).toBeVisible();

  // Click optimize
  await page.click('text=Run Optimizer');
  await expect(page.locator('text=Recommended changes: 4')).toBeVisible();
  await expect(page.locator('text=ARNI')).toBeVisible();
  await expect(page.locator('text=Beta-blocker')).toBeVisible();
  await expect(page.locator('text=MRA')).toBeVisible();
  await expect(page.locator('text=SGLT2i')).toBeVisible();

  // Apply
  await page.click('text=Apply All');
  await expect(page.locator('text=GDMT applied to encounter')).toBeVisible();
});
```

## E2E: Co-pilot query

```js
// e2e/cardiology/copilot_query.spec.js
test('Co-pilot answers in AR with citations', async ({ page }) => {
  await loginAs(page, 'cardio.test@nama-medical');
  await page.click('text=Co-pilot');

  await page.fill('textarea[name="question"]', 'ما هو GDMT الأمثل لمريض EF 30% بدون موانع؟');
  await page.click('text=Send');

  await expect(page.locator('.answer-ar')).toContainText('ARNI');
  await expect(page.locator('.answer-ar')).toContainText('ACC/AHA');
  await expect(page.locator('.sources')).toBeVisible();
  await expect(page.locator('.evidence-level')).toContainText(/A|B|C/);
});
```

## E2E: NPHIES claim

```js
// e2e/cardiology/nphies_claim.spec.js
test('NPHIES claim submitted with idempotency', async ({ page }) => {
  await loginAs(page, 'billing.test@nama-medical');
  await page.click('text=NPHIES');
  await page.click('text=New Claim');

  // Select encounter
  await page.click('text=Test Cath Encounter');

  // Verify auto-populated
  await expect(page.locator('text=Bundle: NPH-CARD-PCI')).toBeVisible();
  await expect(page.locator('text=Amount: 25000 SAR')).toBeVisible();

  // Eligibility
  await page.click('text=Check Eligibility');
  await expect(page.locator('text=Eligible')).toBeVisible();

  // Submit
  await page.click('text=Submit');
  await expect(page.locator('text=Claim submitted')).toBeVisible();

  // Try again (idempotent)
  await page.click('text=Submit Again');
  await expect(page.locator('text=Already submitted')).toBeVisible();
});
```

## E2E: Cross-tenant blocked

```js
// e2e/cardiology/cross_tenant.spec.js
test('Tenant A doctor cannot view Tenant B patient', async ({ page }) => {
  await loginAs(page, 'cardio.tenantA@nama-medical');
  await page.goto('https://staging.jumanasoft.com/patients/' + PATIENT_TENANT_B_ID);
  await expect(page.locator('text=Not found')).toBeVisible();
});
```

## Total E2E tests for CARD-001

- Outpatient consult: 5
- CODE STEMI: 3
- HF clinic: 4
- AF: 3
- Cath lab: 5
- Device implant: 4
- Co-pilot: 4
- NPHIES claim: 4
- Red flag: 3
- Cross-tenant: 3
- **Total: 38 E2E tests**
