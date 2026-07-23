# PULM-001 — Integration Tests

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testEncounterId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test Pulm') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);
  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'PULM-001', 'Test Patient', '1965-01-01', 'M') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;
  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM pulm_encounters WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('Pulm Encounters', () => {
  test('Create encounter', async () => {
    const res = await request(app)
      .post('/api/pulm/encounters')
      .set('Authorization', `Bearer ${testToken}`)
      .send({patientId: testPatientId, encounterType: 'COPD_EXAC', startedAt: new Date().toISOString(), primaryDiagnosis: 'COPD exacerbation'});
    expect(res.status).toBe(201);
    testEncounterId = res.body.id;
  });
});

describe('PFT', () => {
  test('Add PFT', async () => {
    const res = await request(app)
      .post(`/api/pulm/encounters/${testEncounterId}/pft`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({testDate: new Date().toISOString(), fev1: 2.0, fvc: 4.0, fev1PercentPredicted: 60, fvcPercentPredicted: 80, fev1FvcRatio: 0.5, pattern: 'OBSTRUCTIVE', severity: 'MODERATE'});
    expect(res.status).toBe(201);
  });
});

describe('Wells Score', () => {
  test('High risk', async () => {
    const res = await request(app)
      .post('/api/pulm/risk/wells')
      .set('Authorization', `Bearer ${testToken}`)
      .send({clinicalSignsDvt: true, peMostLikely: true, heartRateGt100: true});
    expect(res.body.riskLevel).toBe('HIGH');
  });
});

describe('Oxygen Order', () => {
  test('Add O2', async () => {
    const res = await request(app)
      .post(`/api/pulm/encounters/${testEncounterId}/oxygen`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({deliveryMethod: 'NC', flowRateLMin: 2, targetSpo2Low: 88, targetSpo2High: 92});
    expect(res.status).toBe(201);
  });
});
```
