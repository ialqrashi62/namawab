<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — OpenAPI 3.1 Specification (23 endpoints)

## Base
- URL: https://api.jumanasoft.com/api/v1/cath-lab
- Auth: Bearer JWT (session token)
- Tenant: X-Tenant-Id from session (NOT header — GATE4)

## Endpoints (23)

### POST /procedures
Create a new cath procedure.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology') + validateBody + idempotencyGuard
- Body: { patient_id, encounter_id, procedure_type, indication, urgency, access_route, ... }
- Response: 201 { id, ... } or 400 (validation), 403 (RBAC), 409 (allergen), 429 (rate limit)
- Audit: cath.procedure.created

### GET /procedures
List procedures.
- Auth: requireAuth + requireTenantScope
- Query: { status, operator_id, from, to, limit, offset }
- Response: 200 [ { id, ... } ]

### GET /procedures/:id
Procedure detail.
- Auth: requireAuth + requireTenantScope
- Response: 200 { id, ... } or 404

### PATCH /procedures/:id
Update intra-procedure fields.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { status, complications, ... }
- Response: 200 { id, ... } or 403, 404

### POST /procedures/:id/complete
Close procedure, sign cath report.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { operator_signature, final_findings_encrypted, ... }
- Response: 200 { id, ... } or 403, 404
- Audit: cath.procedure.completed

### GET /patient/:id/history
Patient cath + PCI + stent history.
- Auth: requireAuth + requireTenantScope
- Response: 200 [ { procedure_id, date, type, ... } ]

### POST /pci-records
Save PCI detail.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { procedure_id, syntax_score, grace_score, devices, ... }
- Response: 201 { id, ... } or 400, 403

### POST /stent-registry
Register implanted stent.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD) + idempotencyGuard
- Body: { procedure_id, udi, manufacturer, batch_lot, ... }
- Response: 201 { id, ... } or 400 (UDI invalid), 403
- Audit: cath.stent_implanted, stent.sfda_reported

### GET /stent-registry/patient/:id
Patient's device registry.
- Auth: requireAuth + requireTenantScope
- Response: 200 [ { udi, manufacturer, vessel, ... } ]

### GET /structural-heart/referrals
Pending structural heart referrals.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Response: 200 [ { id, patient_id, indication, ... } ]

### POST /structural-heart/mdt
Create MDT discussion.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { patient_id, indication, members_present (≥5 specialists), recommendation, ... }
- Response: 201 { id, ... } or 400 (insufficient members)
- Audit: cath.mdt_decision

### PATCH /structural-heart/mdt/:id
Finalize MDT decision.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { recommendation, decided_by (all voting members cosign) }
- Response: 200 { id, ... } or 403, 404

### POST /tavr-workup
TAVR workup checklist.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { patient_id, ct_annular_area_mm2, access_route_planned, frailty_assessment, ... }
- Response: 201 { id, ... }

### POST /door-to-balloon-timer
Capture STEMI activation timestamps.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD or RN) + idempotencyGuard
- Body: { encounter_id, door_time, ecg_time, cath_lab_arrival_time, first_device_time }
- Response: 201 { id, d2b_minutes, d2b_compliant, ... }
- Audit: cath.door_to_balloon

### GET /door-to-balloon-timer/kpi
D2B compliance KPI (tenant, last 30 days).
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD, QA)
- Query: { from, to, operator_id }
- Response: 200 { d2b_compliance_pct, median_d2b, p90_d2b, ... }

### POST /radiation-dose
Log per-staff + per-procedure dose.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD or RN) + idempotencyGuard
- Body: { procedure_id, staff_id, role, dose_mgy, dap_gy_cm2, ... }
- Response: 201 { id, ... }

### GET /radiation-dose/operator/:id
Operator cumulative dose.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD, QA)
- Response: 200 { operator_id, cumulative_ytd_mgy, ... }

### POST /contrast-tracking
Track contrast volume (CIN risk).
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { patient_id, procedure_id, contrast_volume_ml, baseline_egfr, ... }
- Response: 201 { id, ... }

### GET /patient/:id/cin-risk
Pre-cath CIN risk.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Response: 200 { egfr, risk_band, recommendation, ... }

### GET /scheduling/conflicts
Cath lab slot conflict check.
- Auth: requireAuth + requireTenantScope
- Query: { room_id, slot_start, slot_end, operator_id }
- Response: 200 { conflicts: [ ... ] }

### POST /red-flag/acknowledge
Acknowledge intra-procedure red flag.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', MD)
- Body: { procedure_id, flag_type, response_action }
- Response: 200 { id, ... }
- Audit: cath.red_flag.acknowledged

### POST /consent/sign
Cath consent capture (e-signature + witness).
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', RN + witness) + idempotencyGuard
- Body: { patient_id, procedure_id, consent_type, signed_by, witness_id, ai_assisted_care_consent }
- Response: 201 { id, signed_at, ... }
- Audit: cath.consent_signed

### GET /equipment/:id/availability
Equipment check (PM due, in-service).
- Auth: requireAuth + requireTenantScope
- Response: 200 { equipment_id, status, next_pm_date, ... }

---
*Section 14 of CARD-002. SA voice. L1 DRAFT.*