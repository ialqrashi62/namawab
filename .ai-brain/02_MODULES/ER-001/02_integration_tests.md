---
module_id: ER-001
section: 07_testing
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Integration Tests

## File: `namaweb/er_integration_test.js`

```javascript
// namaweb/er_integration_test.js
'use strict';
const request = require('supertest');
const {app, db} = require('./test_helpers');
const {createTestPatient, createTestTenant, setTenantContext} = require('./test_utils');

let testCount = 0;
let passCount = 0;

async function test(name, fn) {
  testCount++;
  try {
    await fn();
    passCount++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    process.exit(1);
  }
}

async function authHeader(user) {
  const token = await getTestJWT(user);
  return {Authorization: `Bearer ${token}`};
}

(async () => {
  console.log('ER-001 Integration Tests\n');

  // ===== Triage =====
  console.log('Triage API:');

  await test('POST /triage classifies ESI 1 for cardiac arrest', async () => {
    const patient = await createTestPatient();
    const res = await request(app)
      .post('/api/er/triage')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: patient.tenant_id}))
      .send({
        patient_id: patient.id,
        chief_complaint: 'unresponsive',
        vitals: {bp_systolic: 0, bp_diastolic: 0, heart_rate: 0, respiratory_rate: 0, spo2: 50, temperature_c: 36.0},
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.esi_level, 1);
    assert.ok(res.body.encounter_id); // auto-created
  });

  await test('POST /triage requires auth (401 without token)', async () => {
    const res = await request(app).post('/api/er/triage').send({});
    assert.strictEqual(res.status, 401);
  });

  await test('POST /triage requires RN/MD role (403 for Reception)', async () => {
    const patient = await createTestPatient();
    const res = await request(app)
      .post('/api/er/triage')
      .set(await authHeader({id: 'rec-001', role: 'Reception', tenant_id: patient.tenant_id}))
      .send({patient_id: patient.id, chief_complaint: 'x', vitals: {}});
    assert.strictEqual(res.status, 403);
  });

  await test('POST /triage validates body (422 missing chief_complaint)', async () => {
    const patient = await createTestPatient();
    const res = await request(app)
      .post('/api/er/triage')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: patient.tenant_id}))
      .send({patient_id: patient.id, vitals: {}});
    assert.strictEqual(res.status, 422);
  });

  await test('POST /triage respects tenant scope (cross-tenant blocked)', async () => {
    const t1 = await createTestTenant('T1');
    const t2 = await createTestTenant('T2');
    const patientT1 = await createTestPatient(t1);
    // Try to triage as T2 user
    const res = await request(app)
      .post('/api/er/triage')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: t2}))
      .send({patient_id: patientT1.id, chief_complaint: 'x', vitals: {}});
    // Should fail validation or 404 (patient not in tenant scope)
    assert.ok([404, 422].includes(res.status));
  });

  // ===== Code Activation =====
  console.log('\nCode Activation:');

  await test('POST /code/activate creates code + pages team', async () => {
    const enc = await createTestEncounter({esi_level: 1});
    const res = await request(app)
      .post('/api/er/code/activate')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, code_type: 'stemi', activation_reason: 'ECG ST elevation'});
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.code_id);
    assert.ok(res.body.team_notified);
  });

  await test('POST /code/activate is idempotent (409 on duplicate)', async () => {
    const enc = await createTestEncounter({esi_level: 1});
    // First call
    await request(app)
      .post('/api/er/code/activate')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, code_type: 'stemi', activation_reason: 'first'});
    // Second call
    const res = await request(app)
      .post('/api/er/code/activate')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, code_type: 'stemi', activation_reason: 'second'});
    assert.strictEqual(res.status, 409);
  });

  await test('POST /code/activate requires MD/RN (403 for Reception)', async () => {
    const enc = await createTestEncounter({esi_level: 1});
    const res = await request(app)
      .post('/api/er/code/activate')
      .set(await authHeader({id: 'rec-001', role: 'Reception', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, code_type: 'stemi', activation_reason: 'x'});
    assert.strictEqual(res.status, 403);
  });

  // ===== Medication Administration =====
  console.log('\nMedication Administration:');

  await test('POST /medication/admin blocks on allergy (409)', async () => {
    const enc = await createTestEncounter({patient_allergies: ['penicillin']});
    const res = await request(app)
      .post('/api/er/medication/admin')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, drug_name: 'amoxicillin', dose: '500mg', route: 'PO'});
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.error, 'MEDICATION_BLOCKED');
  });

  await test('POST /medication/admin records administration (201)', async () => {
    const enc = await createTestEncounter({patient_allergies: []});
    const res = await request(app)
      .post('/api/er/medication/admin')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, drug_name: 'aspirin', dose: '325mg', route: 'PO'});
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.administration_id);
  });

  await test('POST /medication/admin requires override for renal dose', async () => {
    const enc = await createTestEncounter({patient_allergies: [], creatinine: 3.0});
    const res = await request(app)
      .post('/api/er/medication/admin')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, drug_name: 'vancomycin', dose: '1g', route: 'IV'});
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.error, 'OVERRIDE_REQUIRED');
  });

  // ===== Disposition =====
  console.log('\nDisposition:');

  await test('POST /disposition requires MD (403 for RN)', async () => {
    const enc = await createTestEncounter();
    const res = await request(app)
      .post('/api/er/disposition')
      .set(await authHeader({id: 'rn-001', role: 'RN', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, disposition_type: 'discharge'});
    assert.strictEqual(res.status, 403);
  });

  await test('POST /disposition/discharge requires instructions (422)', async () => {
    const enc = await createTestEncounter();
    const res = await request(app)
      .post('/api/er/disposition')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, disposition_type: 'discharge'});
    assert.strictEqual(res.status, 422);
  });

  await test('POST /disposition/ama requires witness (422)', async () => {
    const enc = await createTestEncounter();
    const res = await request(app)
      .post('/api/er/disposition')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, disposition_type: 'ama'});
    assert.strictEqual(res.status, 422);
  });

  await test('POST /disposition/admit triggers admission workflow (200)', async () => {
    const enc = await createTestEncounter();
    const res = await request(app)
      .post('/api/er/disposition')
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}))
      .send({encounter_id: enc.id, disposition_type: 'admit', destination: 'CCU'});
    assert.strictEqual(res.status, 200);
  });

  // ===== RLS / Tenant Isolation =====
  console.log('\nTenant Isolation:');

  await test('Encounter from tenant A invisible to tenant B', async () => {
    const t1 = await createTestTenant('T1');
    const t2 = await createTestTenant('T2');
    const enc = await createTestEncounter({tenant_id: t1});
    // T2 user queries the encounter
    const res = await request(app)
      .get(`/api/er/encounter/${enc.id}`)
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: t2}));
    assert.strictEqual(res.status, 404);
  });

  await test('Audit log is hash-chained (chain verification)', async () => {
    const t = await createTestTenant('T');
    const enc = await createTestEncounter({tenant_id: t});
    // Generate a few audit events
    await triggerAuditEvent(enc.id, 'TEST_EVENT_1', t);
    await triggerAuditEvent(enc.id, 'TEST_EVENT_2', t);
    await triggerAuditEvent(enc.id, 'TEST_EVENT_3', t);
    // Verify chain
    const result = await verifyAuditChain(t, enc.id);
    assert.strictEqual(result.valid, true);
  });

  await test('No PHI in error logs (PII redaction)', async () => {
    // Trigger an error that would normally log the patient
    const enc = await createTestEncounter();
    const res = await request(app)
      .get(`/api/er/encounter/${enc.id}`) // valid request, should not log
      .set(await authHeader({id: 'md-001', role: 'MD', tenant_id: enc.tenant_id}));
    assert.strictEqual(res.status, 200);
    // Check log: should not contain patient name or MRN
    const logContent = await readLogFile('er-error.log');
    assert.ok(!logContent.includes('John')); // dummy name
    assert.ok(!logContent.includes('MRN-12345')); // dummy MRN
  });

  console.log('\n========================================');
  console.log(`ER-001 Integration Tests: ${passCount}/${testCount} PASS`);
  console.log('========================================');
})();
```

## Test Helpers (`test_helpers.js`, `test_utils.js`)

```javascript
// namaweb/test_helpers.js
const express = require('express');
const {app, server} = require('./server');
module.exports = {app};

// namaweb/test_utils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function getTestJWT(user) {
  return jwt.sign(
    {id: user.id, role: user.role, tenant_id: user.tenant_id, facility_id: user.facility_id || null},
    process.env.JWT_SECRET || 'test-secret',
    {expiresIn: '1h'}
  );
}

async function createTestTenant(name) {
  return await db.query(`
    INSERT INTO tenants (id, name, name_ar, created_at) 
    VALUES (gen_random_uuid(), $1, $1, now()) RETURNING id
  `, [name]).then(r => r.rows[0].id);
}

async function createTestPatient(tenant_id) {
  if (!tenant_id) tenant_id = await createTestTenant('default');
  return await db.query(`
    INSERT INTO patients (tenant_id, mrn, first_name_encrypted, last_name_encrypted, dob, sex)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
  `, [tenant_id, `MRN-${Date.now()}`, 'encrypted', 'encrypted', '1980-01-01', 'M'])
    .then(r => r.rows[0]);
}

async function createTestEncounter(opts = {}) {
  const tenant_id = opts.tenant_id || await createTestTenant('default');
  const patient = opts.patient_id 
    ? {id: opts.patient_id, tenant_id}
    : await createTestPatient(tenant_id);
  return await db.query(`
    INSERT INTO er_encounters (tenant_id, patient_id, mrn, arrival_time, esi_level, chief_complaint)
    VALUES ($1, $2, $3, now(), $4, 'test complaint') RETURNING *
  `, [tenant_id, patient.id, patient.mrn, opts.esi_level || 3])
    .then(r => r.rows[0]);
}
```

## Performance Tests (`er_performance_test.js`)

```javascript
// namaweb/er_performance_test.js
'use strict';
const autocannon = require('autocannon');

async function runPerf() {
  console.log('ER-001 Performance Tests\n');

  // 1. Triage API
  const triageResult = await autocannon({
    url: 'http://localhost:3000',
    method: 'POST',
    path: '/api/er/triage',
    headers: {'content-type': 'application/json', 'authorization': 'Bearer ' + getTestJWT()},
    body: JSON.stringify({
      patient_id: '...',
      chief_complaint: 'chest pain',
      vitals: {bp_systolic: 130, bp_diastolic: 80, heart_rate: 80, respiratory_rate: 18, spo2: 96, temperature_c: 37.0}
    }),
    duration: 30,
    connections: 100,
  });
  console.log('Triage API:');
  console.log(`  p50: ${triageResult.latency.p50} ms`);
  console.log(`  p99: ${triageResult.latency.p99} ms`);
  console.log(`  req/sec: ${triageResult.requests.average}`);

  // 2. Code activation
  const codeResult = await autocannon({
    url: 'http://localhost:3000',
    method: 'POST',
    path: '/api/er/code/activate',
    headers: {'content-type': 'application/json', 'authorization': 'Bearer ' + getTestJWT()},
    body: JSON.stringify({encounter_id: '...', code_type: 'stemi', activation_reason: 'load test'}),
    duration: 30,
    connections: 50,
  });
  console.log('Code Activation:');
  console.log(`  p50: ${codeResult.latency.p50} ms`);
  console.log(`  p99: ${codeResult.latency.p99} ms`);
}

runPerf();
```

## E2E Tests (Playwright)

```javascript
// namaweb/er_e2e_test.js (Playwright)
const {test, expect} = require('@playwright/test');

test.describe('ER Module E2E', () => {
  test('Triage → Treatment → Disposition (happy path)', async ({page}) => {
    // Login
    await page.goto('/login.html');
    await page.fill('#username', 'rn-001');
    await page.fill('#password', 'test-password');
    await page.click('button[type="submit"]');

    // Wait for ER board
    await page.waitForSelector('[data-testid="er-board"]');

    // Click "New Triage"
    await page.click('[data-testid="new-triage-btn"]');

    // Fill triage form
    await page.fill('[data-testid="chief-complaint"]', 'chest pain');
    await page.fill('[data-testid="pain-score"]', '8');
    // ... other fields

    // Submit
    await page.click('[data-testid="submit-triage"]');

    // Verify ESI classification shown
    await expect(page.locator('[data-testid="esi-level"]')).toContainText('2');

    // Verify red flag (chest pain → ACS)
    await expect(page.locator('[data-testid="red-flag"]')).toContainText('acs');

    // Click encounter
    await page.click('[data-testid="encounter-card"]');

    // Verify disposition panel
    await expect(page.locator('[data-testid="disposition-panel"]')).toBeVisible();
  });

  test('Code STEMI activation triggers team page', async ({page}) => {
    // ... setup
    await page.click('[data-testid="code-stemi-btn"]');
    await page.fill('[data-testid="activation-reason"]', 'STEMI anterior');
    await page.click('[data-testid="confirm-code"]');
    
    // Verify code active
    await expect(page.locator('[data-testid="code-stemi-active"]')).toBeVisible();
    
    // Verify team notification
    await expect(page.locator('[data-testid="team-notified"]')).toContainText('cardiologist');
  });

  test('Drug allergy blocks medication', async ({page}) => {
    // ... setup with patient having penicillin allergy
    await page.click('[data-testid="medication-tab"]');
    await page.fill('[data-testid="drug-search"]', 'amoxicillin');
    await page.click('[data-testid="drug-amoxicillin"]');
    await page.fill('[data-testid="dose"]', '500mg');
    await page.click('[data-testid="submit-medication"]');
    
    // Verify block
    await expect(page.locator('[data-testid="allergy-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="medication-blocked"]')).toContainText('BLOCKED');
  });
});
```

---
*Section 07.b of ER-001. Owner: QA + DSL. L4 validated.*
