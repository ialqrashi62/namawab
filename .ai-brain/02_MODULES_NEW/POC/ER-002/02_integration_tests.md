<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Integration Tests (22 endpoints)

`js
describe('ER-002 API', () => {
  it('POST /activations requires Tier 1 criteria', async () => {
    const res = await request(app)
      .post('/api/trauma/activations')
      .set('Authorization', Bearer )
      .send({ encounter_id: 1, activation_tier: 1, mechanism: 'penetrating torso' });
    expect(res.status).toBe(201);
  });

  it('POST /mtp/activate requires 2-RN verify', async () => {
    const res = await request(app)
      .post('/api/trauma/mtp/activate')
      .set('Authorization', Bearer )
      .send({ encounter_id: 1, witness_id: null });
    expect(res.status).toBe(400);
  });

  it('POST /ais-coding MD-cosign required for AIS>3', async () => {
    const res = await request(app)
      .post('/api/trauma/ais-coding')
      .set('Authorization', Bearer )
      .send({ encounter_id: 1, body_region: 'head', ais_severity: 5, coding_reviewed_by: null });
    expect(res.status).toBe(400);
  });

  it('POST /transfer-out requires capability_gap', async () => {
    const res = await request(app)
      .post('/api/trauma/transfer-out')
      .set('Authorization', Bearer )
      .send({ encounter_id: 1, receiving_facility: 'KFSH' });
    expect(res.status).toBe(400);
  });

  it('GET /registry/export requires NTDB compliance', async () => {
    const res = await request(app)
      .get('/api/trauma/registry/export?year=2026&format=ntdb')
      .set('Authorization', Bearer );
    expect(res.body.ntdb_compliant).toBe(true);
  });

  it('Cross-tenant isolation', async () => {
    const res = await request(app)
      .get('/api/trauma/activations')
      .set('Authorization', Bearer )
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403);
  });
});
`

---
*Section 11 of ER-002. L1 DRAFT.*