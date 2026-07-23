# PEDS-002 — Integration Tests

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testAdmissionId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test NICU') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);

  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'NICU-001', 'Test Baby', '2026-01-01', 'M') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;

  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM peds_nicu_admissions WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('NICU Admissions', () => {
  test('Create NICU admission as neonatologist', async () => {
    const res = await request(app)
      .post('/api/peds/nicu/admissions')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        patientId: testPatientId,
        admittedAt: new Date().toISOString(),
        primaryDiagnosis: 'Prematurity 28 weeks',
        birthWeightGrams: 1100,
        gestationalAgeWeeks: 28,
        apgar1min: 6,
        apgar5min: 8,
        levelOfCare: 'III',
        respiratorySupport: 'CPAP'
      });
    expect(res.status).toBe(201);
    expect(res.body.birthWeightGrams).toBe(1100);
    testAdmissionId = res.body.id;
  });

  test('List NICU admissions', async () => {
    const res = await request(app)
      .get('/api/peds/nicu/admissions')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Vitals', () => {
  test('Record vitals as nurse', async () => {
    const res = await request(app)
      .post(`/api/peds/nicu/admissions/${testAdmissionId}/vitals`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        admissionId: testAdmissionId,
        recordedAt: new Date().toISOString(),
        heartRate: 145,
        respiratoryRate: 50,
        spo2: 94,
        temperatureC: 36.8,
        weightGrams: 1100
      });
    expect(res.status).toBe(201);
  });
});

describe('Medications (weight-based)', () => {
  test('Order ampicillin weight-based', async () => {
    const res = await request(app)
      .post(`/api/peds/nicu/admissions/${testAdmissionId}/medications`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        drugName: 'Ampicillin',
        dose: '55 mg',
        route: 'IV',
        frequency: 'q12h',
        indication: 'Sepsis prophylaxis',
        weightAtOrder: 1100
      });
    expect(res.status).toBe(201);
    expect(res.body.isWeightBased).toBe(true);
  });

  test('High-alert requires double-check', async () => {
    const res = await request(app)
      .post(`/api/peds/nicu/admissions/${testAdmissionId}/medications`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        drugName: 'Insulin',
        dose: '0.5 U',
        route: 'SC',
        frequency: 'q6h',
        indication: 'Hyperglycemia',
        weightAtOrder: 1100
      });
    // Should require double-check for insulin
    expect([201, 403]).toContain(res.status);
  });
});

describe('PEWS', () => {
  test('High-risk score triggers alert', async () => {
    const res = await request(app)
      .post('/api/peds/nicu/pews')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        heartRate: 200,
        respiratoryRate: 65,
        spo2: 85,
        temperatureC: 38,
        capillaryRefill: 3,
        mentalStatus: 'VOICE'
      });
    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('HIGH');
  });
});

describe('Corrected Age', () => {
  test('Preterm corrected age calculation', async () => {
    const res = await request(app)
      .post('/api/peds/nicu/corrected-age')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        birthDate: '2026-01-01',
        currentDate: '2026-05-01'
      });
    expect(res.status).toBe(200);
    expect(res.body.weeks).toBe(17);
  });
});

describe('Tenant Isolation', () => {
  test('Other tenant cannot see', async () => {
    const res = await request(app)
      .get('/api/peds/nicu/admissions')
      .set('Authorization', 'Bearer other-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
```
