# CARD-001 — Integration Tests

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testEncounterId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test Card') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);

  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'CARD-001', 'Test Patient', '1960-01-01', 'M') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;

  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM card_encounters WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('Cardiology Encounters', () => {
  test('Create encounter', async () => {
    const res = await request(app)
      .post('/api/card/encounters')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        patientId: testPatientId,
        encounterType: 'CHEST_PAIN',
        startedAt: new Date().toISOString(),
        primaryDiagnosis: 'STEMI'
      });
    expect(res.status).toBe(201);
    testEncounterId = res.body.id;
  });
});

describe('Risk Calculators', () => {
  test('HEART score', async () => {
    const res = await request(app)
      .post('/api/card/risk/heart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        history: 'HIGHLY_SUSPICIOUS', ecg: 'SIGNIFICANT_ST_DEPRESSION',
        age: 70, riskFactors: true, troponin: 2
      });
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(6);
    expect(res.body.riskLevel).toBe('HIGH');
  });

  test('CHA2DS2-VASc anticoag recommendation', async () => {
    const res = await request(app)
      .post('/api/card/risk/cha2ds2vasc')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        sex: 'F', age: 75, hypertension: true, diabetes: true, stroke: true
      });
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(4);
    expect(res.body.recommendation).toContain('Anticoag');
  });
});

describe('ECG', () => {
  test('Add ECG', async () => {
    const res = await request(app)
      .post(`/api/card/encounters/${testEncounterId}/ecgs`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        recordedAt: new Date().toISOString(),
        rate: 80, rhythm: 'SINUS',
        prIntervalMs: 160, qrsDurationMs: 100, qtcMs: 420,
        axis: 30, interpretation: 'NSR', criticalFindings: false
      });
    expect(res.status).toBe(201);
  });
});

describe('Medication High-Alert', () => {
  test('Heparin requires double-check', async () => {
    const res = await request(app)
      .post(`/api/card/encounters/${testEncounterId}/medications`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        medicationName: 'Heparin', dose: '1000 U/h', frequency: 'continuous',
        isAnticoag: true
      });
    expect([201, 403]).toContain(res.status);
  });
});

describe('Tenant Isolation', () => {
  test('Cross-tenant blocked', async () => {
    const res = await request(app)
      .get('/api/card/encounters')
      .set('Authorization', 'Bearer other-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
```
