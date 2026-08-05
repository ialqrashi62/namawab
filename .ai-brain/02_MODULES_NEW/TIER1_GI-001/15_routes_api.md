# GI-001 — Routes API

```ts
// namaweb/routes/gi_001/index.ts
import { Router } from 'express';
import { requireAuth, requireTenantScope, requireRole } from 'src/middleware';
import { validateBody } from 'src/middleware/validate';
import { RS_GI_001 } from 'src/route_schemas';

const r = Router();
r.post('/visits', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_GI_001.createVisit), async (req, res) => { /* engine.execute */ });
r.post('/visits/:visitId/assessment', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_GI_001.assessment), async (req, res) => { /* CHAIN:GI-001:initial_assessment */ });
r.post('/visits/:visitId/orders', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_GI_001.placeOrders), idempotencyGuard, async (req, res) => { /* order adapter */ });
r.get('/tasks/mine', requireAuth, requireTenantScope, async (req, res) => { /* tasks/mine */ });
r.get('/patients/:patientId/results', requireAuth, requireTenantScope, requireRole('doctor','nurse'), async (req, res) => { /* */ });

export default r;
```

Mounted under `/api/v4/gi_001` in `server.js`.

---

*Owner: SA — 2026-08-01*
