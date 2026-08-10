<!-- NamaMedical PR checklist — PHI/financial system: review carefully. -->

## What & why


## Checklist
- [ ] `node run_safe_tests.js` passes locally (DB-free unit tests)
- [ ] Integration suite run on an **isolated/staging** DB (never production) if DB-affecting
- [ ] No secrets/PHI in code, logs, or test fixtures
- [ ] Tenant-scoped: any new query respects RLS / `app.tenant_id` (no cross-tenant leak)
- [ ] AuthZ added for new routes (`requireAuth` + role/permission)
- [ ] Input validated (`validation.js` / engine fail-closed) for new mutations
- [ ] DDL changes shipped as `migrations/*_{up,down,validate}.sql` (owner-run, not auto-applied)
- [ ] Money columns use `NUMERIC`, not floating `REAL`

## Risk / rollback

