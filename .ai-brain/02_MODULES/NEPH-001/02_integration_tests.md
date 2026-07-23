# NEPH-001 — Integration Tests

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testEncounterId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test Neph') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);
  const patient = await db.query(`INSERT INTO patients (tenant_id, mrn, full_name, dob, sex) VALUES ($1, 'NEPH-001', 'Test', '1970-01-01', 'M') RETURNING id`, [testTenantId]);
  testPatientId = patient.rows[0].id;
  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM neph_encounters WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('Nephrology Encounters', () => {
  test('Create', async () => {
    const res = await request(app)
      .post('/api/neph/encounters')
      .set('Authorization', `Bearer ${testToken}`)
      .send({patientId: testPatientId, encounterType: 'AKI', startedAt: new Date().toISOString(), primaryDiagnosis: 'AKI on CKD'});
    expect(res.status).toBe(201);
    testEncounterId = res.body.id;
  });
  test('Add labs', async () => {
    const res = await request(app)
      .post(`/api/neph/encounters/${testEncounterId}/labs`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({collectedAt: new Date().toISOString(), creatinine: 4.5, potassium: 6.8, sodium: 138, egfr: 12});
    expect(res.status).toBe(201);
  });
});

describe('Risk Scores', () => {
  test('eGFR', async () => {
    const res = await request(app)
      .post('/api/neph/risk/egfr')
      .set('Authorization', `Bearer ${testToken}`)
      .send({creatinine: 2.0, age: 60, sex: 'M'});
    expect(res.body.eGFR).toBeLessThan(60);
  });
  test('RRT', async () => {
    const res = await request(app)
      .post('/api/neph/risk/rrt')
      .set('Authorization', `Bearer ${testToken}`)
      .send({k: 7});
    expect(res.body.needsRRT).toBe(true);
  });
  test('Hyperkalemia SEVERE', async () => {
    const res = await request(app)
      .post('/api/neph/risk/hyperkalemia')
      .set('Authorization', `Bearer ${testToken}`)
      .send({k: 7.0});
    expect(res.body.severity).toBe('SEVERE');
  });
});

describe('Tenant Isolation', () => {
  test('Cross-tenant blocked', async () => {
    const res = await request(app).get('/api/neph/encounters').set('Authorization', 'Bearer other');
    expect(res.body).toEqual([]);
  });
});
```
