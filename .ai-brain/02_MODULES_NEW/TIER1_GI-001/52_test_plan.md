# GI-001 — Test Plan

| Layer | Tool | Owner | When |
|-------|------|-------|------|
| Unit | jest/vitest | SA | every PR |
| Integration | jest + supertest | SA | every PR |
| Contract | Pact | SA | every PR |
| Clinical safety | custom | AIE+CMO | every PR touching prompt |
| Cross-tenant | custom | DSL | nightly |
| E2E | Playwright | QA | weekly |
| Load | k6 | DSL | monthly |
| Pentest | external | DSL | quarterly |

Definition of Done: 100% safety suite; cross-tenant 0/0 violations.

---

*Owner: SA+CQO — 2026-08-01*
