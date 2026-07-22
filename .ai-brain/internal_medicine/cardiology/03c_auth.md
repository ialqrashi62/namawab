# Auth — Cardiology

> **Owner:** Architect
> **Date:** 2026-07-22

---

## Authentication

- **Provider:** Keycloak (OIDC) + JWT bearer
- **Token TTL:** 8 hours
- **Refresh:** yes, sliding window
- **MFA:** TOTP (RFC-6238) optional, mandatory for Doctors
- **Password policy:** min 12 chars, complexity, 90-day rotation, no reuse last 12
- **Lockout:** 5 failed attempts → 15 min lockout

## Session

- **express-session** + connect-redis
- **Cookie:** httpOnly, sameSite=lax, secure in production
- **rolling:** true (TTL refreshed on activity)

## Authorization (per route)

| Route | requireAuth | requireTenantScope | requireRole |
|---|---|---|---|
| GET /api/cardiology/patients/:id/echo | ✅ | ✅ | doctor, cardiology_nurse, sonographer, ep_doctor |
| POST /api/cardiology/echo | ✅ | ✅ | sonographer, doctor |
| GET /api/cardiology/patients/:id/ecg | ✅ | ✅ | doctor, cardiology_nurse, ep_doctor |
| POST /api/cardiology/procedures | ✅ | ✅ | doctor |
| PATCH /api/cardiology/procedures/:id | ✅ | ✅ | doctor |
| POST /api/cardiology/cds/* | ✅ | ✅ | doctor, cardiology_nurse |
| GET /api/cardiology/cohorts/* | ✅ | ✅ | doctor, researcher |

## Tenant Scope

- All routes pass through `requireTenantScope` middleware
- `req.session.user.tenantId` injected into AsyncLocalStorage
- DB queries auto-filtered by `current_setting('app.tenant_id')`

## Role Mapping (Keycloak)

| Keycloak role | App role | Specialty |
|---|---|---|
| `cardiology_doctor` | Doctor | cardiology |
| `cardiology_nurse` | Nurse | cardiology |
| `sonographer` | Sonographer | cardiology |
| `ep_doctor` | Doctor | cardiology (EP sub) |
| `cardiology_researcher` | Researcher | cardiology |

## Audit

- All auth events logged (login, logout, failed attempts, MFA events)
- Hash-chained audit log (7-year retention)
- PII redacted in logs

---

End of auth spec.
