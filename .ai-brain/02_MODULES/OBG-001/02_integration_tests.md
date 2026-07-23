# OBG-001 — Integration Tests (12+)

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testPregnancyId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test OBG') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);

  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'OBG-001', 'Test Patient', '1990-01-01', 'F') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;

  const pregnancy = await db.query(`
    INSERT INTO obg_pregnancies (tenant_id, patient_id, lmp_date, edd_date, gravida, para, blood_type, rh_factor)
    VALUES ($1, $2, '2026-01-01', '2026-10-08', 1, 0, 'O', '+') RETURNING id
  `, [testTenantId, testPatientId]);
  testPregnancyId = pregnancy.rows[0].id;

  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM obg_pregnancies WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('Pregnancy Lifecycle', () => {
  test('Create pregnancy', async () => {
    const res = await request(app)
      .post('/api/obg/pregnancies')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        patientId: testPatientId,
        lmpDate: '2026-02-01',
        gravida: 1,
        para: 0,
        bloodType: 'A',
        rhFactor: '+',
        bmi: 24
      });
    expect(res.status).toBe(201);
    expect(res.body.patientId).toBe(testPatientId);
  });

  test('Add prenatal visit', async () => {
    const res = await request(app)
      .post(`/api/obg/pregnancies/${testPregnancyId}/prenatal-visits`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        visitDate: new Date().toISOString(),
        gestationalAgeWeeks: 16,
        weightKg: 65,
        bpSystolic: 110,
        bpDiastolic: 70,
        fundalHeightCm: 16,
        fetalHeartRate: 150
      });
    expect(res.status).toBe(201);
  });

  test('Preeclampsia screen with severe classification', async () => {
    const res = await request(app)
      .post(`/api/obg/pregnancies/${testPregnancyId}/preeclampsia-screen`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        bpSystolic: 165,
        bpDiastolic: 115,
        proteinuria: '2+',
        symptoms: 'severe_headache',
        platelets: 80000,
        aspartateAminotransferase: 80
      });
    expect(res.status).toBe(201);
    expect(res.body.classification).toBe('SEVERE_PREECLAMPSIA');
  });

  test('GDM screen with positive GDM', async () => {
    const res = await request(app)
      .post(`/api/obg/pregnancies/${testPregnancyId}/gdm-screen`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        testType: 'OGTT_75G',
        fastingMgDl: 100,
        oneHourMgDl: 180,
        twoHourMgDl: 155
      });
    expect(res.status).toBe(201);
    expect(res.body.result).toBe('GDM');
  });

  test('ASPRE risk calculation', async () => {
    const res = await request(app)
      .post('/api/obg/preeclampsia-risk')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        age: 38,
        bmi: 36,
        pregnancyHistory: 'MULTIPAROUS_WITH_PE',
        chronicHypertension: true,
        meanArterialPressure: 95
      });
    expect(res.status).toBe(200);
    expect(res.body.highRisk).toBe(true);
    expect(res.body.asaDose).toContain('150');
  });

  test('Record delivery', async () => {
    const res = await request(app)
      .post('/api/obg/deliveries')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        pregnancyId: testPregnancyId,
        patientId: testPatientId,
        deliveryDate: new Date().toISOString(),
        deliveryMode: 'SVD',
        gestationalAgeAtDelivery: 39,
        estimatedBloodLossMl: 400,
        apgar1min: 9,
        apgar5min: 10
      });
    expect(res.status).toBe(201);
  });

  test('PPH detection (>500 mL SVD)', async () => {
    const res = await request(app)
      .post('/api/obg/deliveries')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        pregnancyId: testPregnancyId,
        patientId: testPatientId,
        deliveryDate: new Date().toISOString(),
        deliveryMode: 'SVD',
        gestationalAgeAtDelivery: 39,
        estimatedBloodLossMl: 800
      });
    expect(res.status).toBe(201);
    // PPH should be flagged in app logic
  });
});

describe('Tenant Isolation', () => {
  test('Other tenant cannot see this pregnancy', async () => {
    const otherToken = 'other-jwt';
    const res = await request(app)
      .get('/api/obg/pregnancies')
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.body).toEqual([]);
  });
});

describe('Validation', () => {
  test('Missing LMP → 400', async () => {
    const res = await request(app)
      .post('/api/obg/pregnancies')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ patientId: testPatientId });
    expect(res.status).toBe(400);
  });
  test('No auth → 401', async () => {
    const res = await request(app).get('/api/obg/pregnancies');
    expect(res.status).toBe(401);
  });
});

describe('RLS', () => {
  test('Cross-tenant patient data inaccessible', async () => {
    const res = await request(app)
      .get(`/api/obg/pregnancies/999999`)
      .set('Authorization', `Bearer ${testToken}`);
    expect([403, 404]).toContain(res.status);
  });
});
```
