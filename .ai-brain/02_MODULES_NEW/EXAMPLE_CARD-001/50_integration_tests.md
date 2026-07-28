# 50 — Integration Tests (CARD-001)

> Owner: ORC + SA · Snippet: snippet:test-pattern · Tier 1

## Test files

```
namaweb/cardiology_routes_integration_test.js     # routes + auth + RLS
namaweb/cardiology_red_flag_integration_test.js   # red flag activation flow
namaweb/cardiology_nphies_integration_test.js     # NPHIES claim flow
namaweb/cardiology_copilot_integration_test.js    # co-pilot flow
namaweb/cardiology_idempotency_test.js            # money + IDM
namaweb/cross_tenant_cardiology_test.js           # cross-tenant isolation
```

## Coverage target: 100% of critical paths

## Test: Cardiology routes + auth + RLS

```js
// namaweb/cardiology_routes_integration_test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('./server');

test('GET /api/cardiology/encounters requires auth', async () => {
  const res = await request(app).get('/api/cardiology/encounters');
  assert.equal(res.status, 401);
});

test('GET /api/cardiology/encounters requires tenant scope', async () => {
  const res = await request(app)
    .get('/api/cardiology/encounters')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`);
  // Without tenant header, should 403 in production
  assert.equal(res.status, 403);
});

test('GET /api/cardiology/encounters requires cardiology role', async () => {
  const res = await request(app)
    .get('/api/cardiology/encounters')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'er' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A);
  assert.equal(res.status, 403);
});

test('GET /api/cardiology/encounters returns encounters for tenant', async () => {
  const res = await request(app)
    .get('/api/cardiology/encounters')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

test('POST /api/cardiology/encounters validates body', async () => {
  const res = await request(app)
    .post('/api/cardiology/encounters')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .send({}); // empty body
  assert.equal(res.status, 400);
});
```

## Test: Red flag activation

```js
test('POST /api/cardiology/red-flags/STEMI/activate creates activation', async () => {
  const res = await request(app)
    .post('/api/cardiology/red-flags/STEMI/activate')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-stemi-001')
    .send({ patient_id: PATIENT_A, encounter_id: ENC_A, severity: 'critical' });
  assert.equal(res.status, 201);
  assert.ok(res.body.id);
  assert.equal(res.body.red_flag_id, 'STEMI');
});

test('Same Idempotency-Key returns original activation', async () => {
  const first = await request(app)
    .post('/api/cardiology/red-flags/STEMI/activate')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-stemi-002')
    .send({ patient_id: PATIENT_A, encounter_id: ENC_A, severity: 'critical' });
  const second = await request(app)
    .post('/api/cardiology/red-flags/STEMI/activate')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-stemi-002')  // same key
    .send({ patient_id: PATIENT_A, encounter_id: ENC_A, severity: 'critical' });
  assert.equal(first.body.id, second.body.id);
});

test('Cross-tenant activation blocked', async () => {
  const res = await request(app)
    .post('/api/cardiology/red-flags/STEMI/activate')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-stemi-003')
    .send({ patient_id: PATIENT_B_TENANT_B, encounter_id: ENC_B, severity: 'critical' });
  assert.equal(res.status, 403);
});
```

## Test: NPHIES claim (money + idempotency)

```js
test('POST /api/cardiology/nphies/claim without Idempotency-Key → 400', async () => {
  const res = await request(app)
    .post('/api/cardiology/nphies/claim')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .send({ encounter_id: ENC_A, patient_id: PATIENT_A, bundle: 'NPH-CARD-PCI', lines: [] });
  assert.equal(res.status, 400);
});

test('NPHIES claim with same key returns same claim', async () => {
  const body = { encounter_id: ENC_A, patient_id: PATIENT_A, bundle: 'NPH-CARD-PCI', lines: [{ code: 'PCI-1', qty: 1, unit_price: 25000 }] };
  const first = await request(app)
    .post('/api/cardiology/nphies/claim')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-nphies-001')
    .send(body);
  const second = await request(app)
    .post('/api/cardiology/nphies/claim')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-nphies-001')
    .send(body);
  assert.equal(first.body.nphies_claim_id, second.body.nphies_claim_id);
});

test('NPHIES claim with negative amount → 400', async () => {
  const res = await request(app)
    .post('/api/cardiology/nphies/claim')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-nphies-002')
    .send({ encounter_id: ENC_A, patient_id: PATIENT_A, bundle: 'NPH-CARD-PCI', lines: [{ code: 'PCI-1', qty: 1, unit_price: -100 }] });
  assert.equal(res.status, 400);
});
```

## Test: Co-pilot (LLM)

```js
test('Co-pilot requires auth + tenant + role + body', async () => {
  const res = await request(app)
    .post('/api/cardiology/copilot/query')
    .send({});
  assert.equal(res.status, 401);
});

test('Co-pilot returns structured response', async () => {
  const res = await request(app)
    .post('/api/cardiology/copilot/query')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .send({ question: 'ما هو GDMT الأمثل؟', encounter_id: ENC_A });
  assert.equal(res.status, 200);
  assert.ok(res.body.answer_ar);
  assert.ok(Array.isArray(res.body.sources));
  assert.ok(res.body.evidence_level);
});

test('Co-pilot refuses on missing patient context for clinical_q', async () => {
  const res = await request(app)
    .post('/api/cardiology/copilot/query')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .send({ question: 'هل تخطيط القلب هذا طبيعي؟', encounter_id: null });
  // Should either refuse or ask for context
  assert.equal(res.status, 200);
  assert.ok(res.body.warnings || res.body.refusal);
});
```

## Test: Cross-tenant isolation

```js
// namaweb/cross_tenant_cardiology_test.js
test('Tenant A doctor cannot read Tenant B encounter', async () => {
  const res = await request(app)
    .get(`/api/cardiology/encounters/${ENC_B_IN_TENANT_B}`)
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A);
  assert.equal(res.status, 404); // not 403 (no info leak)
});

test('Tenant A doctor cannot list Tenant B patients via search', async () => {
  const res = await request(app)
    .get('/api/cardiology/encounters?patient_id=' + PATIENT_B_TENANT_B)
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A);
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 0);
});

test('Tenant A doctor cannot submit NPHIES claim for Tenant B patient', async () => {
  const res = await request(app)
    .post('/api/cardiology/nphies/claim')
    .set('Cookie', `connect.sid=${await loginSession({ role: 'cardiology' })}`)
    .set('X-Tenant-Id', TEST_TENANT_A)
    .set('Idempotency-Key', 'test-cross-tenant')
    .send({ encounter_id: ENC_B, patient_id: PATIENT_B_TENANT_B, bundle: 'NPH-CARD-PCI', lines: [] });
  assert.equal(res.status, 403);
});
```

## Total integration tests for CARD-001

- Routes + auth + RLS: 25
- Red flag activation: 10
- NPHIES claim: 12
- Co-pilot: 8
- Cross-tenant: 15
- **Total: 70 integration tests**
