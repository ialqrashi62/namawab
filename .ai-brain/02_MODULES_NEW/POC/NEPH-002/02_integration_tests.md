<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Integration Tests (26 endpoints)

`js
const request = require('supertest');
const app = require('./server');
const { loginMD, loginCoordinator, loginPharmacist } = require('./test-utils');

describe('NEPH-002 API', () => {
  let mdToken, coordToken, pharmToken;
  before(async () => {
    mdToken = await loginMD('dr_ahmed', ['nephrology']);
    coordToken = await loginCoordinator('coord_fatima');
    pharmToken = await loginPharmacist('pharm_omar');
  });

  it('POST /waitlist requires MD role', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/waitlist')
      .set('Authorization', Bearer )
      .send({ patient_id: 1, blood_type: 'A+' });
    expect(res.status).toBe(201);
  });

  it('GET /matching returns donor-recipient match score', async () => {
    const res = await request(app)
      .get('/api/v1/transplant/matching?recipient_id=1&donor_id=1')
      .set('Authorization', Bearer );
    expect(res.body).toHaveProperty('match_score');
    expect(res.body.recommendation).toBeDefined();
  });

  it('POST /crossmatch positive CDC XM = absolute decline', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/crossmatch')
      .set('Authorization', Bearer )
      .send({ donor_id: 1, recipient_id: 1, cdc_t_cell: 'POS' });
    expect(res.body.decision).toBe('absolute_decline');
  });

  it('POST /immunosuppression requires 2-pharmacist verify', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/immunosuppression')
      .set('Authorization', Bearer )
      .send({ patient_id: 1, drug: 'TACROLIMUS', dose_mg: 2, pharmacist_verified_id: null });
    expect(res.status).toBe(400);
  });

  it('POST /immunosuppression HARD BLOCK on trough >20', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/immunosuppression')
      .set('Authorization', Bearer )
      .send({ patient_id: 1, drug: 'TACROLIMUS', dose_mg: 4, trough_level: 22, pharmacist_verified_id: 2 });
    expect(res.status).toBe(409); // blocked
    expect(res.body.action).toBe('escalate_to_physician');
  });

  it('POST /procedure requires SCOT donor ID', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/procedure')
      .set('Authorization', Bearer )
      .send({ recipient_id: 1, donor_id: 1, transplant_type: 'LRD' });
    expect(res.status).toBe(201);
    expect(res.body.scot_report_id).toBeDefined();
  });

  it('Cross-tenant isolation: tenant A cannot read tenant B data', async () => {
    const res = await request(app)
      .get('/api/v1/transplant/waitlist')
      .set('Authorization', Bearer )
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403);
  });

  it('POST /biopsy requires MD + indication', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/biopsy')
      .set('Authorization', Bearer )
      .send({ transplant_id: 1, biopsy_type: 'FOR_CAUSE', cores_taken: 0 });
    expect(res.status).toBe(400); // indication required for for-cause
  });
});
`

---
*Section 11 of NEPH-002. Tests. L1 DRAFT.*