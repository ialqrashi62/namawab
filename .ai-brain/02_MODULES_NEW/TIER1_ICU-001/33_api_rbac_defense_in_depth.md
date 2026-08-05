# ICU-001 — API RBAC (defense in depth)

- Layer 1: `requireAuth` rejects if not logged in
- Layer 2: `requireTenantScope` rejects cross-tenant (RLS at row level)
- Layer 3: `requireRole('<role>')` checks user role vs route
- Layer 4: `requireSpecialtyAccess` checks doctor's specialty in scope
- Layer 5: SQL `FORCE ROW LEVEL SECURITY` enforces at DB

Tested in `15-testing/TESTING_QA.md#cross-tenant-tests`.

---

*Owner: SA+DSL — 2026-08-01*
