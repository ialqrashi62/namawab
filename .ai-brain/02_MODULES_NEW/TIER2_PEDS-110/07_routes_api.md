# PEDS-110 — Routes API

```ts
import { Router } from 'express';
import { requireAuth, requireTenantScope, requireRole } from 'src/middleware';
import { validateBody } from 'src/middleware/validate';
import { RS_PEDS_110 } from 'src/route_schemas';

const r = Router();
r.post('/engagements', requireAuth, requireTenantScope, requireRole('doctor','nurse'), validateBody(RS_PEDS_110.create), async (req, res) => { /* engine.execute */ });
r.get('/tasks/mine', requireAuth, requireTenantScope, async (req, res) => { /* tasks */ });

export default r;
```

Mounted at `/api/v4/peds_110`.

---

*Owner: SA — 2026-08-01*
