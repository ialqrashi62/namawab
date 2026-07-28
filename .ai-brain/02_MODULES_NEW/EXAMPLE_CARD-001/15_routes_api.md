# 15 — Routes API (CARD-001)

> Owner: SA · Snippet: snippet:openapi-3-1 · Tier 1

## REST routes

| Method | Path | Auth | Body schema | Idempotent | Notes |
|--------|------|------|-------------|------------|-------|
| GET | /api/cardiology/encounters | Auth+T+Role | — | yes | List encounters |
| GET | /api/cardiology/encounters/:id | Auth+T+Role | — | yes | One encounter |
| POST | /api/cardiology/encounters | Auth+T+Role+VB | RS.cardio.encounter.create | yes | New encounter |
| PUT | /api/cardiology/encounters/:id | Auth+T+Role+VB | RS.cardio.encounter.update | yes | Update |
| GET | /api/cardiology/ecg | Auth+T+Role | — | yes | List ECG records |
| GET | /api/cardiology/ecg/:id | Auth+T+Role | — | yes | One ECG (PHI vault) |
| POST | /api/cardiology/ecg | Auth+T+Role+VB | RS.cardio.ecg.create | yes | Upload + auto-interpret |
| PUT | /api/cardiology/ecg/:id | Auth+T+Role+VB | RS.cardio.ecg.update | yes | Doctor sign-off |
| GET | /api/cardiology/echo | Auth+T+Role | — | yes | List echo |
| GET | /api/cardiology/echo/:id | Auth+T+Role | — | yes | One echo (PHI vault) |
| POST | /api/cardiology/echo | Auth+T+Role+VB | RS.cardio.echo.create | yes | Upload |
| PUT | /api/cardiology/echo/:id | Auth+T+Role+VB | RS.cardio.echo.update | yes | Sign-off |
| GET | /api/cardiology/stress | Auth+T+Role | — | yes | List |
| POST | /api/cardiology/stress | Auth+T+Role+VB | RS.cardio.stress.create | yes | New stress test |
| GET | /api/cardiology/holter | Auth+T+Role | — | yes | List |
| POST | /api/cardiology/holter | Auth+T+Role+VB | RS.cardio.holter.create | yes | New holter |
| GET | /api/cardiology/cath | Auth+T+Role | — | yes | List cath reports |
| POST | /api/cardiology/cath | Auth+T+Role+VB+IDM | RS.cardio.cath.create | **yes** | Cath report (money) |
| PUT | /api/cardiology/cath/:id | Auth+T+Role+VB+IDM | RS.cardio.cath.update | **yes** | Sign-off (money) |
| GET | /api/cardiology/devices | Auth+T+Role | — | yes | List device implants (PM/ICD/CRT) |
| POST | /api/cardiology/devices | Auth+T+Role+VB+IDM | RS.cardio.device.create | **yes** | New device (money) |
| GET | /api/cardiology/rehab/plans | Auth+T+Role | — | yes | List rehab plans |
| POST | /api/cardiology/rehab/plans | Auth+T+Role+VB | RS.cardio.rehab.create | yes | New plan |
| GET | /api/cardiology/risk-scores/heart | Auth+T+Role+VB | RS.cardio.heart.input | yes | Compute HEART |
| GET | /api/cardiology/risk-scores/cha2ds2vasc | Auth+T+Role+VB | RS.cardio.cha2ds2vasc.input | yes | Compute CHA2DS2-VASc |
| GET | /api/cardiology/risk-scores/hasbled | Auth+T+Role+VB | RS.cardio.hasbled.input | yes | Compute HAS-BLED |
| GET | /api/cardiology/risk-scores/hf-gdmt | Auth+T+Role+VB | RS.cardio.hfgdmt.input | yes | HF GDMT optimizer |
| POST | /api/cardiology/copilot/query | Auth+T+Role+VB+AU | RS.cardio.copilot.input | yes | LLM co-pilot |
| GET | /api/cardiology/copilot/trace/:id | Auth+T+Role | — | yes | Langfuse trace link |
| POST | /api/cardiology/red-flags/:rf_id/activate | Auth+T+Role+VB | RS.cardio.redflag.input | **yes** | Activate CODE pathway |
| GET | /api/cardiology/nphies/eligibility | Auth+T+Role+VB | RS.cardio.nphies.input | yes | NPHIES check |
| POST | /api/cardiology/nphies/claim | Auth+T+Role+VB+IDM | RS.cardio.nphies.claim | **yes** | NPHIES claim |
| GET | /api/cardiology/reports/* | Auth+T+Role | — | yes | All reports (encounter, HF, AF, etc.) |

**Legend:**
- Auth = requireAuth (session)
- T = requireTenantScope (RLS)
- Role = requireRole('cardiology')
- VB = validateBody (fail-closed)
- IDM = idempotencyGuard (money/claim)
- AU = audit log write

## Tenant isolation matrix

| Resource | Tenant-scoped | Branch-scoped | Owner-only |
|----------|---------------|---------------|------------|
| Encounter | yes | yes | doctor + admin |
| ECG | yes | yes | doctor (PHI vault) |
| Cath | yes | yes | cardiologist + admin (money) |
| Device | yes | yes | cardiologist + admin (money) |
| Copilot trace | yes | yes | doctor + admin |
| Red-flag activation | yes | yes | any doctor (cross-specialty) |
| NPHIES claim | yes | yes | admin + billing |

## Cross-tenant

- Copilot queries: strictly tenant-scoped (RLS + retriever filter)
- Red-flag activation: same tenant only
- NPHIES claims: tenant + facility + NPHIES payer binding
