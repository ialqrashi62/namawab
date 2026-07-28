<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Integration Tests (supertest, 23 endpoints)

## Setup
`js
const request = require('supertest');
const app = require('./server');
const { loginAdmin, loginMD, loginRN } = require('./test-utils');
`

## Tests
`js
describe('CATH-002 API', () => {
  let token, mdToken, rnToken;
  before(async () => {
    token = await loginAdmin();
    mdToken = await loginMD('dr_ahmed');
    rnToken = await loginRN('rn_fatima');
  });

  it('POST /procedures creates a cath procedure (idempotent)', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/procedures')
      .set('Authorization', Bearer )
      .set('Idempotency-Key', 'uuid-1234')
      .send({ patient_id: 1, procedure_type: 'PCI', urgency: 'STEMI', indication: 'STEMI anterior' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('GET /procedures/:id requires tenant scope', async () => {
    const res = await request(app)
      .get('/api/v1/cath-lab/procedures/123')
      .set('Authorization', Bearer );
    expect(res.status).toBe(200);
  });

  it('POST /door-to-balloon-timer captures D2B', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/door-to-balloon-timer')
      .set('Authorization', Bearer )
      .set('Idempotency-Key', 'd2b-1234')
      .send({ encounter_id: 1, door_time: '2026-07-24T14:30:00Z', balloon_time: '2026-07-24T15:50:00Z' });
    expect(res.status).toBe(201);
    expect(res.body.d2b_minutes).toBe(80);
  });

  it('POST /stent-registry requires SFDA UDI', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/stent-registry')
      .set('Authorization', Bearer )
      .send({ procedure_id: 'proc-1', udi: 'INVALID' });
    expect(res.status).toBe(400); // validation fails
  });

  it('POST /structural-heart/mdt requires Heart Team sign-off', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/structural-heart/mdt')
      .set('Authorization', Bearer )
      .send({ patient_id: 1, indication: 'TAVR', members_present: ['ic', 'cs'] });
    expect(res.status).toBe(400); // need ≥5 specialists
  });

  it('Cross-tenant isolation: tenant A cannot read tenant B data', async () => {
    const res = await request(app)
      .get('/api/v1/cath-lab/procedures')
      .set('Authorization', Bearer )
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403); // GATE4
  });

  it('Allergen conflict blocks PCI', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/procedures')
      .set('Authorization', Bearer )
      .send({ patient_id: 2, procedure_type: 'PCI', indication: 'NSTEMI' }); // patient 2 has PCN allergy
    expect(res.status).toBe(409); // allergen block
  });

  it('High-alert drug admin requires 2-RN witness', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/medication-admin')
      .set('Authorization', Bearer )
      .send({ drug: 'UFH', dose_mg: 7000, witness_id: null });
    expect(res.status).toBe(400); // witness required
  });
});
`

---
*Section 11 of CARD-002. Tests. L1 DRAFT.*