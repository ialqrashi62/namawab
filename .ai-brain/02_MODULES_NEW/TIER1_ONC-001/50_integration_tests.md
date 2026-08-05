# ONC-001 — Integration Tests

```ts
// tests/integration/onc_001/route.test.ts
import request from 'supertest';
import { app } from '../../../server';

describe('ONC-001 routes', () => {
  it('POST /api/v4/onc_001/visits with valid body returns 201', async () => {
    const r = await request(app).post('/api/v4/onc_001/visits')
      .set('Authorization', 'Bearer VALID_JWT')
      .send({ patient_id: 'P-001', visit_type: 'initial', chief_complaint: 'pain' });
    expect(r.status).toBe(201);
  });

  it('cross-tenant returns 403', async () => {
    // Attempt to access tenant_B resource from tenant_A token
    const r = await request(app).get('/api/v4/onc_001/patients/OTHER_TENANT_PATIENT')
      .set('Authorization', 'Bearer TENANT_A_JWT');
    expect(r.status).toBe(403);
  });
});
```

---

*Owner: SA — 2026-08-01*
