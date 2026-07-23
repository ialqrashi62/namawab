# SURG-001 — Integration Tests

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testProcedureId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test Surg') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);

  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'SURG-001', 'Test Patient', '1970-01-01', 'M') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;

  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM surg_procedures WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('Surgical Procedure Lifecycle', () => {
  test('Schedule procedure', async () => {
    const res = await request(app)
      .post('/api/surg/procedures')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        patientId: testPatientId,
        scheduledAt: '2026-08-01T08:00:00Z',
        procedureName: 'Laparoscopic Cholecystectomy',
        cptCode: '47562',
        urgency: 'ELECTIVE',
        asaClass: '2',
        woundClass: 'CLEAN_CONTAMINATED'
      });
    expect(res.status).toBe(201);
    testProcedureId = res.body.id;
  });

  test('Pre-op checklist complete', async () => {
    const res = await request(app)
      .put(`/api/surg/procedures/${testProcedureId}/preop-check`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        npoConfirmed: true,
        siteMarked: true,
        antibioticGiven: true,
        antibioticName: 'Cefazolin',
        consentSigned: true,
        anesthesiaPlan: 'General',
        vteProphylaxis: true
      });
    expect(res.status).toBe(200);
  });

  test('Intra-op record', async () => {
    const res = await request(app)
      .post(`/api/surg/procedures/${testProcedureId}/intraop`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        anesthesiaType: 'GENERAL',
        estimatedBloodLossMl: 50,
        timeoutPerformed: true,
        siteMarked: true,
        countsCorrect: true,
        procedurePerformed: 'Lap chole, no complications',
        findings: 'Chronic cholecystitis'
      });
    expect(res.status).toBe(201);
  });

  test('Post-op note', async () => {
    const res = await request(app)
      .post(`/api/surg/procedures/${testProcedureId}/postop`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        disposition: 'WARD',
        painManagement: 'Paracetamol + ketorolac',
        dietPlan: 'Clear fluids → regular',
        activityPlan: 'Early ambulation',
        woundCare: 'Standard',
        followUpPlan: 'Clinic 2 weeks'
      });
    expect(res.status).toBe(201);
  });

  test('Add complication (Clavien-Dindo 2)', async () => {
    const res = await request(app)
      .post(`/api/surg/procedures/${testProcedureId}/complications`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        complicationType: 'SSI',
        severity: 'MODERATE',
        clavienDindoGrade: 2,
        treatment: 'Antibiotics'
      });
    expect(res.status).toBe(201);
  });
});

describe('OR Booking Idempotency', () => {
  test('Same idempotency key + different body → 409', async () => {
    const key = 'or-1';
    const r1 = await request(app)
      .post('/api/surg/procedures')
      .set('Authorization', `Bearer ${testToken}`)
      .set('Idempotency-Key', key)
      .send({
        patientId: testPatientId,
        scheduledAt: '2026-08-02T08:00:00Z',
        procedureName: 'Procedure 1',
        cptCode: '12345',
        urgency: 'ELECTIVE',
        asaClass: '2'
      });
    expect(r1.status).toBe(201);

    const r2 = await request(app)
      .post('/api/surg/procedures')
      .set('Authorization', `Bearer ${testToken}`)
      .set('Idempotency-Key', key)
      .send({
        patientId: testPatientId,
        scheduledAt: '2026-08-02T08:00:00Z',
        procedureName: 'DIFFERENT',
        cptCode: '99999',
        urgency: 'EMERGENCY',
        asaClass: '4'
      });
    expect(r2.status).toBe(409);
  });
});

describe('Tenant Isolation', () => {
  test('Other tenant cannot see this procedure', async () => {
    const res = await request(app)
      .get('/api/surg/procedures')
      .set('Authorization', 'Bearer other-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
```
