---
name: nm-multi-agent-wave-splitter-v1
description: Splits a wave into parallel workstreams (DB, API, Frontend, QA, Ops, Docs) and merges outputs with conflict checks.
---

# nm-multi-agent-wave-splitter-v1

## Parallel Lanes
- Lane A: DB + migrations
- Lane B: Backend + routers + engines
- Lane C: Frontend + stations + admin panel
- Lane D: QA + security tests
- Lane E: Ops + metrics + backups
- Lane F: Docs + compliance + closeout

## Merge Rules
1. Merge A before B if schema touched.
2. Merge B before C if API contract changed.
3. Merge D must validate A/B/C.
4. Merge E/F after D pass.

## SP-MA snippets
- `SP-MA-01`: lane task matrix
- `SP-MA-02`: dependency map
- `SP-MA-03`: merge order checklist
- `SP-MA-04`: conflict resolution log

## Token Policy
- Prefer skill snippets over raw long prompts.
- Keep lane prompts <= 120 lines.
- Reuse shared context IDs.
