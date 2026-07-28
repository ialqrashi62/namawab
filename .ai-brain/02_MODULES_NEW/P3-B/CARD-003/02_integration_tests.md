<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-003 Integration Tests (16 endpoints)


`js
describe('EP API', () => {
  it('POST /procedures creates EP study', async () => { /* validateBody + idempotencyGuard */ });
  it('POST /device-registry requires SFDA UDI', async () => { });
  it('GET /remote-monitoring returns alerts', async () => { });
  it('Cross-tenant isolation enforced', async () => { expect(res.status).toBe(403); });
});
`

---
*Section 11. Tests. L1 DRAFT.*