# RHEUM-001 — Unit Tests

```ts
// namaweb/tests/unit/rheum_001/initial_assessment.test.ts
import { RHEUM_001_Engine } from '../../../engines/rheum_001/initial_assessment.engine';

describe('RHEUM-001 initial assessment engine', () => {
  it('returns differential with citations', async () => { /* ... */ });
  it('red-flag override is HARD', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('citation_required enforces >=3', async () => { /* ... */ });
});
```

Target: ≥80% coverage per engine.

---

*Owner: SA+AIE — 2026-08-01*
