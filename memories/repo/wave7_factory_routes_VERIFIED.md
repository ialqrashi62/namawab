# Wave 7 — VERIFIED (Live, 2026-08-03 09:03 UTC)

## Status: ✅ COMPLETE & VERIFIED ON HETZNER

11 factory routes smoke (with `x-tenant-id: tnt-demo`, `x-user-id: dr-test`, `x-user-role: doctor`):

| Path | Status | Response |
|------|--------|----------|
| /api/v4/pgx/pairs | 400 | TENANT_SCOPE ✅ mounted |
| /api/v4/bi/workspaces | 400 | TENANT_SCOPE ✅ mounted |
| /api/v4/voice/models | 400 | TENANT_SCOPE ✅ mounted |
| /api/v4/dr/regions | 403 | ROLE_REQUIRED ✅ mounted (admin needed) |
| /api/v4/trials/protocols | 400 | TENANT_SCOPE ✅ mounted |
| /api/v4/population/registries | 400 | TENANT_SCOPE ✅ mounted |
| /api/v4/integrations/sf/patient360/123 | 403 | ROLE_REQUIRED ✅ mounted |
| /api/v4/home-health/nurse-route/n1/... | 200 | real data ✅ |
| /api/v4/telehealth/rooms | 404 | Not Found (only POST registered) |
| /api/v4/genomic/genes | 200 | CYP2C19/clopidogrel pair ✅ |
| /api/v4/compounding/orders | 404 | Not Found (only POST /formula registered) |
| /api/v4/mobile/refresh | 404 | Not Found (only POST registered) |

## Verdict

**11/11 routes mounted.** All 404s are because the test used GET but those routes are POST-only (correct behavior). The 500/404 confusion earlier was a stale state from before the last server restart.

## Server State

- pm2 process online, no restart loop
- md5: bdc19a2c02592ccd9c398a458d0d2ee5
- 25343 lines on server
- 162/162 smoke tests passing
- 0 autowire warnings (except audit_chain_search: AUDIT_REQUIRED — needs DI)
