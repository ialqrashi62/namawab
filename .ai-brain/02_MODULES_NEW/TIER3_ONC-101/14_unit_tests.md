# ONC-101 — Unit Tests

```ts
import { onc_101_Engine } from '../../../engines/onc_101/main.engine';

describe('ONC-101 engine', () => {
  it('returns output with citations', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('cross-tenant attempt throws', async () => { /* ... */ });
});
```

Target: ≥80% coverage.

---

*Owner: SA — 2026-08-01*
