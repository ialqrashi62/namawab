# ADM-107 — Unit Tests

```ts
import { adm_107_Engine } from '../../../engines/adm_107/main.engine';

describe('ADM-107 engine', () => {
  it('returns output with citations', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('cross-tenant attempt throws', async () => { /* ... */ });
});
```

Target: ≥80% coverage.

---

*Owner: SA — 2026-08-01*
