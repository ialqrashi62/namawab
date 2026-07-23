# GI-001 — Integration Tests (8+)

```js
const request = require('supertest');
const app = require('../app');
const db = require('../db_postgres');

let testToken, testTenantId, testPatientId, testEncounterId;

beforeAll(async () => {
  const tenant = await db.query(`INSERT INTO tenants (name) VALUES ('Test GI') RETURNING id`);
  testTenantId = tenant.rows[0].id;
  await db.query(`SET app.tenant_id = '${testTenantId}'`);
  const patient = await db.query(`INSERT INTO patients (tenant_id, mrn, full_name, dob, sex) VALUES ($1, 'GI-001', 'Test', '1970-01-01', 'M') RETURNING id`, [testTenantId]);
  testPatientId = patient.rows[0].id;
  testToken = 'test-jwt';
});

afterAll(async () => {
  await db.query(`DELETE FROM gi_encounters WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM patients WHERE tenant_id = $1`, [testTenantId]);
  await db.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});

describe('GI Encounters', () => {
  test('Create', async () => {
    const res = await request(app)
      .post('/api/gi/encounters')
      .set('Authorization', `Bearer ${testToken}`)
      .send({patientId: testPatientId, encounterType: 'BLEED_UPPER', startedAt: new Date().toISOString(), primaryDiagnosis: 'Bleeding ulcer'});
    expect(res.status).toBe(201);
    testEncounterId = res.body.id;
  });
  test('Add EGD', async () => {
    const res = await request(app)
      .post(`/api/gi/encounters/${testEncounterId}/endoscopies`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({procedureType: 'EGD', procedureDate: new Date().toISOString(), indication: 'GI bleed', findings: 'Gastric ulcer with active bleeding', interventions: {clip: true}});
    expect(res.status).toBe(201);
  });
});

describe('Risk Scores', () => {
  test('MELD', async () => {
    const res = await request(app)
      .post('/api/gi/risk/meld')
      .set('Authorization', `Bearer ${testToken}`)
      .send({bilirubin: 5, inr: 2, creatinine: 2});
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(15);
  });
  test('Child-Pugh', async () => {
    const res = await request(app)
      .post('/api/gi/risk/childpugh')
      .set('Authorization', `Bearer ${testToken}`)
      .send({bilirubin: 3, albumin: 2.5, inr: 2, ascites: true, encephalopathy: true});
    expect(res.body.class).toBe('C');
  });
  test('GBS high risk', async () => {
    const res = await request(app)
      .post('/api/gi/risk/gbs')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ureaNitrogen: 50, hemoglobin: 8, systolicBp: 85, pulse: 110, melena: true, syncope: true});
    expect(res.body.needForIntervention).toBe(true);
  });
});

describe('Bleed Assessment', () => {
  test('Add assessment', async () => {
    const res = await request(app)
      .post(`/api/gi/encounters/${testEncounterId}/bleed`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({assessmentType: 'UPPER', gbsScore: 12, hemoglobin: 8, heartRate: 110, systolicBp: 85, melena: true});
    expect(res.status).toBe(201);
  });
});

describe('Tenant Isolation', () => {
  test('Cross-tenant blocked', async () => {
    const res = await request(app).get('/api/gi/encounters').set('Authorization', 'Bearer other');
    expect(res.body).toEqual([]);
  });
});
```
