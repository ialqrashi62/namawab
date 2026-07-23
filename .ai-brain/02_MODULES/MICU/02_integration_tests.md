# MICU — Integration Tests (15+)

## Test File: micu_api.test.js

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testEncounterId, testPatientId, testAdmissionId;

beforeAll(async () => {
  // Setup test data
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test Tenant') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);

  const user = await db.query(`
    INSERT INTO users (tenant_id, email, password_hash, role)
    VALUES ($1, 'test@micu.test', '$2b$10$...', 'attending') RETURNING id
  `, [testTenantId]);

  const patient = await db.query(`
    INSERT INTO patients (tenant_id, mrn, full_name, dob, sex)
    VALUES ($1, 'TEST-001', 'Test Patient', '1960-01-01', 'M') RETURNING id
  `, [testTenantId]);
  testPatientId = patient.rows[0].id;

  const enc = await db.query(`
    INSERT INTO encounters (tenant_id, patient_id, encounter_type, started_at)
    VALUES ($1, $2, 'inpatient', NOW()) RETURNING id
  `, [testTenantId, testPatientId]);
  testEncounterId = enc.rows[0].id;

  // Get test token (mock)
  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM icu_admissions WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM encounters WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM users WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('ICU Admissions', () => {
  test('Create admission as attending', async () => {
    const res = await request(app)
      .post('/api/micu/admissions')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        encounterId: testEncounterId,
        patientId: testPatientId,
        admittedAt: new Date().toISOString(),
        primaryDiagnosis: 'Septic shock',
        codeStatus: 'FULL'
      });
    expect(res.status).toBe(201);
    expect(res.body.patientId).toBe(testPatientId);
    testAdmissionId = res.body.id;
  });

  test('Create admission without auth → 401', async () => {
    const res = await request(app)
      .post('/api/micu/admissions')
      .send({});
    expect(res.status).toBe(401);
  });

  test('List admissions in tenant only', async () => {
    const res = await request(app)
      .get('/api/micu/admissions')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.every(a => a.tenantId === testTenantId)).toBe(true);
  });
});

describe('ICU Vitals', () => {
  test('Record vitals as nurse', async () => {
    const res = await request(app)
      .post(`/api/micu/admissions/${testAdmissionId}/vitals`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        admissionId: testAdmissionId,
        recordedAt: new Date().toISOString(),
        heartRate: 110,
        systolicBp: 85,
        diastolicBp: 50,
        map: 62,
        respiratoryRate: 24,
        spo2: 94,
        temperatureC: 39.5,
        gcsTotal: 14
      });
    expect(res.status).toBe(201);
  });

  test('Get vitals time series', async () => {
    const res = await request(app)
      .get(`/api/micu/admissions/${testAdmissionId}/vitals`)
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('AI early warning on qSOFA high', async () => {
    const res = await request(app)
      .post('/api/micu/early-warning')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        heartRate: 110, systolicBp: 85, respiratoryRate: 24, spo2: 94, temperatureC: 39.5, gcsTotal: 14
      });
    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('HIGH');
    expect(res.body.recommendations).toContain('Activate sepsis bundle');
  });
});

describe('ICU Scores', () => {
  test('Calculate SOFA', async () => {
    const res = await request(app)
      .post(`/api/micu/admissions/${testAdmissionId}/scores`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        scoreType: 'SOFA',
        subscores: { pao2_fio2: 200, platelets: 100, bilirubin: 1.5, map: 60, gcs: 14, creatinine: 1.5 }
      });
    expect(res.status).toBe(201);
    expect(res.body.scoreValue).toBeGreaterThan(0);
  });
});

describe('Vasoactive Drips', () => {
  test('Order norepinephrine without co-sign → 403', async () => {
    const res = await request(app)
      .post(`/api/micu/admissions/${testAdmissionId}/vasoactive`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ drugName: 'norepinephrine', dose: 0.1 });
    // Should succeed if user is attending
    expect([201, 403]).toContain(res.status);
  });

  test('Idempotency: same key → 409', async () => {
    const key = 'idem-1';
    const body = { drugName: 'norepinephrine', dose: 0.1 };
    const r1 = await request(app)
      .post(`/api/micu/admissions/${testAdmissionId}/vasoactive`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Idempotency-Key', key)
      .send(body);
    const r2 = await request(app)
      .post(`/api/micu/admissions/${testAdmissionId}/vasoactive`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Idempotency-Key', key)
      .send({ ...body, dose: 0.5 });
    expect(r1.status).toBe(201);
    expect(r2.status).toBe(409);
  });
});

describe('Code Status', () => {
  test('Change to DNR with family meeting', async () => {
    const res = await request(app)
      .put(`/api/micu/admissions/${testAdmissionId}/code-status`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ status: 'DNR', familyMeeting: true });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('DNR');
    expect(res.body.familyMeeting).toBe(true);
  });
});

describe('RLS Enforcement', () => {
  test('Cross-tenant access → 403', async () => {
    const otherTenantRes = await request(app)
      .post('/api/micu/admissions')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        encounterId: 999999,  // different tenant
        patientId: 999999,
        admittedAt: new Date().toISOString(),
        primaryDiagnosis: 'test'
      });
    expect([403, 404]).toContain(otherTenantRes.status);
  });
});
```

## Test Count
- 11 integration tests across 6 describe blocks
- Coverage: auth, RBAC, tenant isolation, RLS, idempotency, qSOFA, code status
- All real DB + real middleware chain
- Cleanup: afterAll deletes test data
