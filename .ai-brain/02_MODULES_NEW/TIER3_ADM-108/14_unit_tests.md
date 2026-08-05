# ADM-108 — Unit Tests

```ts
import { adm_108_Engine } from '../../../engines/adm_108/main.engine';

describe('ADM-108 engine', () => {
  it('returns output with citations', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('cross-tenant attempt throws', async () => { /* ... */ });
});
```

Target: ≥80% coverage.

---

*Owner: SA — 2026-08-01*
