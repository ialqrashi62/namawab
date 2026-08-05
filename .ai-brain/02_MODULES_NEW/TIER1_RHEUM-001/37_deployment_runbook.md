# RHEUM-001 — Deployment Runbook

1. Lint + typecheck + unit + integration tests pass
2. Migration up applied to staging
3. Feature flag (if applicable) enabled in staging
4. Smoke tests on staging
5. Canary 10% -> 50% -> 100%
6. SLO monitor (rollback if violation)
7. Post-deploy verify (sample visits, sample orders)

---

*Owner: DSL — 2026-08-01*
