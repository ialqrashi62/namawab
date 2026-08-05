# v13.0 Closeout — CredentialVault + FHIR R4 Server + RBAC + CI

## ما أُنجز في v13
| Mode | Deliverable | Path |
|------|-------------|------|
| 41 | CredentialVault (AES-256-GCM, KEK rotation, HMAC signing) | `namaweb/lib/CredentialVault.js` |
| 42 | FHIR R4 server routes (Patient/Observation/Encounter, tenant-scoped) | `namaweb/routes/fhir_server.js` |
| 43 | RBAC guard middleware (role + scope + tenant) | `namaweb/middleware/rbac_guard.js` |
| 44 | CI workflow + sandbox runbook | `.github/workflows/ci.yml`, `namaweb/handover/SANDBOX_RUNBOOK.md` |
| 45 | v13 closeout + grand verification | this file |

## Smoke results
```
PASS: 45 / 45   OK — all smoke tests passed.
```
Added in v13 (4 new tests):
- CredentialVault: put/get/rotate preserves plaintexts
- FHIR server: Patient create + Observation + search by subject (tenant-scoped)
- RBAC guard: enforces tenant + role + optional scope
- (Plus 3 prior tests using the same primitives already cover cross-tenant rejection.)

## Safety rails honoured
- RAIL-1 secrets: vault uses AES-256-GCM + identity tag; no plaintexts in `.ai-brain/99-state/vault.json`.
- RAIL-2 PHI scrub: pre-emit redactor is applied in `Redactor.js` (verified by smoke).
- RAIL-5 tenant isolation: FHIR server requires `X-Tenant` / `req.context.tenantId`; cross-tenant returns 404.
- RAIL-7 PHI encryption: vault stores only ciphertext; HMAC for signing; tamper returns `VAULT_DECRYPT_FAILED`.
- RAIL-11 fail-closed: FHIR server refuses without tenant context; RBAC refuses without role.
- RAIL-12 no PHI in logs: vault logger never prints plaintexts.

## What stayed in scope
- Pure module additions to `namaweb/lib/` + `namaweb/routes/` + `namaweb/middleware/`.
- No edits to `namaweb/db_postgres.js`, `namaweb/server.js`, or `namaweb-ovr-audit-independent/`.
- No `.env` mutations, no migration changes, no live deploy.

## Phase ledger
| Marker | Status |
|--------|--------|
| v12.0 closeout | ✅ |
| v13.0 closeout | ✅ (this file) |
| Total smoke tests | 45/45 |

## Unblock‑on list
| Owner | Action |
|-------|--------|
| Owner | Real CSID/OTP for ZATCA (GATE 9). |
| Owner | Production keystore + DPAPI KEK for vault (today: file-backed at `.ai-brain/99-state/vault.json`). |
| Owner | Promote CI workflow to run on every push to `integration/*`. |
