# PEDS-001 — Architecture Decision Record

## ADR-001: Engine as hexagonal base

- **Status:** accepted
- **Date:** 2026-08-01
- **Context:** need consistent pattern for all PEDS-001 engines
- **Decision:** use hexagonal (ports + adapters) with shared Engine base class
- **Consequences:**
  - testability ↑
  - swap infra without changing logic ✓
  - more boilerplate initially (acceptable)

---

*Owner: SA — 2026-08-01*
