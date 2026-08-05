# ORTHO-001 — Unit Tests

```ts
// namaweb/tests/unit/ortho_001/initial_assessment.test.ts
import { ORTHO_001_Engine } from '../../../engines/ortho_001/initial_assessment.engine';

describe('ORTHO-001 initial assessment engine', () => {
  it('returns differential with citations', async () => { /* ... */ });
  it('red-flag override is HARD', async () => { /* ... */ });
  it('confidence <0.7 returns UNCERTAIN', async () => { /* ... */ });
  it('citation_required enforces >=3', async () => { /* ... */ });
});
```

Target: ≥80% coverage per engine.

---

*Owner: SA+AIE — 2026-08-01*
