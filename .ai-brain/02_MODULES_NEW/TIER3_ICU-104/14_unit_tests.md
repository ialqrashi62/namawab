# ICU-104 — Unit Tests

```ts
import { icu_104_Engine } from '../../../engines/icu_104/main.engine';

describe('ICU-104 engine', () => {
  it('returns output with citations', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('cross-tenant attempt throws', async () => { /* ... */ });
});
```

Target: ≥80% coverage.

---

*Owner: SA — 2026-08-01*
