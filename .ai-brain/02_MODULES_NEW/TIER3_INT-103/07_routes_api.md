# INT-103 — Routes API

```ts
import { Router } from 'express';
import { requireAuth, requireTenantScope, requireRole } from 'src/middleware';
import { validateBody } from 'src/middleware/validate';
import { RS_INT_103 } from 'src/route_schemas';

const r = Router();
r.post('/engagements', requireAuth, requireTenantScope, requireRole('doctor','nurse'), validateBody(RS_INT_103.create), async (req, res) => { /* engine.execute */ });
r.get('/tasks/mine', requireAuth, requireTenantScope, async (req, res) => { /* tasks */ });

export default r;
```

Mounted at `/api/v4/int_103`.

---

*Owner: SA — 2026-08-01*
