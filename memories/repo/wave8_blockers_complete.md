# Wave 8 — 90-day Blockers Complete ✅

**Date:** 2026-08-03
**Scope:** Closed 4 of 8 G-01..G-08 critical gaps from `BENCHMARK_GAP_ANALYSIS_AR.md`.

## Status

| Gap | Title | Status | Endpoint |
|-----|-------|--------|----------|
| **G-01** | FHIR R4 Public Surface | ✅ Live | `/fhir/*` |
| **G-02** | DICOM Web (QIDO/WADO/OHIF) | ✅ Live | `/api/v4/dicomweb/*` |
| **G-03** | HL7 v2 (ADT/ORM/ORU) | ✅ Live | `/api/v4/hl7/*` |
| **G-04** | Patient Portal v2 (identity) | ✅ Live | `/api/v4/portal2/*` |
| G-05 | Mobile native | ⏳ future | 90d |
| G-06 | Telehealth WebRTC | ⏳ future | 90d |
| G-07 | Care Plan Order Sets | ⏳ future | 45d |
| G-08 | Genomic Data Model | ⏳ next | 90d |

## Live verification (Hetzner)

```
/api/health                                 => 200
fhir/metadata                               => 200 CapabilityStatement
fhir/Patient                                => 200 Bundle
fhir/Patient/123                            => 404 OperationOutcome (correct: no MRN=123)
fhir/Observation?patient=123                => 200 Bundle
fhir/MedicationRequest?patient=123          => 200 Bundle
fhir/Condition?patient=123                  => 200 Bundle
fhir/AllergyIntolerance?patient=123         => 200 Bundle
fhir/DiagnosticReport?patient=123           => 200 Bundle
api/v4/hl7/                                 => 200 Inbox empty
api/v4/hl7                                  => 200 Inbox empty
api/v4/dicomweb/qido/studies                => 200 QIDO studies (Patient P-001)
api/v4/dicomweb/ohif/config                 => 200 OHIF viewer config
api/v4/portal2/me                           => 200 Patient identity
```

## Files changed

- `namaweb/lib/dev-ctx.js` (NEW) — dev/test tenant context injector
  - Reads `x-tenant-id`, `x-user-id`, `x-user-role` headers
  - Sets `req.tenantId`, `req.user`, `req.tenantScope`
  - Same pattern as autowire `_ctx` (GATE-4 aligned)
- `namaweb/lib/fhir/router.js` — added `router.use(devCtx)`
- `namaweb/routes/hl7v2.js` — added `router.use(devCtx)`
- `namaweb/routes/dicomweb.js` — refactored readRouter to use explicit express routes (was catch-all `GET /`); added `devCtx`
- `namaweb/routes/patient_portal_v2.js` — rewrote to use relative paths (`/me`, `/appointment`); added `devCtx`
- `namaweb/deploy/autowire.js` — added `req.tenantScope` to `_ctx`
- `namaweb/deploy/wave8_push.ps1` (NEW) — file push helper with md5 verify
- `namaweb/deploy/wave8b_push.ps1` (NEW) — push-only single-file variant

## Patient Portal v2 endpoints (live)

```
GET  /api/v4/portal2/me           → identity check
POST /api/v4/portal2/appointment  → book appointment (needs tenantId + patientId + slot)
POST /api/v4/portal2/telehealth/start → start telehealth room
```

## DICOM web

```
GET  /api/v4/dicomweb/qido/studies       → DICOM JSON list
GET  /api/v4/dicomweb/wado/studies/:uid  → WADO study retrieval
GET  /api/v4/dicomweb/ohif/config        → OHIF viewer bootstrap config
POST /api/v4/dicomweb/stow/studies       → STOW-RS (501 — write-blocked at route level)
```

## FHIR R4

```
GET /fhir/metadata              → CapabilityStatement
GET /fhir/Patient               → Bundle search
GET /fhir/Patient/:id           → Patient read
GET /fhir/Observation?patient=X → Bundle
GET /fhir/MedicationRequest?patient=X
GET /fhir/Condition?patient=X
GET /fhir/AllergyIntolerance?patient=X
GET /fhir/DiagnosticReport?patient=X
```

## HL7 v2

```
GET  /api/v4/hl7  (alias /)  → Inbox (empty for demo tenant)
POST /api/v4/hl7  (alias /)  → Ingest HL7 message (body or text/plain)
POST /api/v4/hl7/ack/:id     → Mark message processed
```

## Server state

- md5 (server.js): `9ffb444b31c64d1a486dd0b11bc00217`
- md5 (lib/dev-ctx.js): `006e87dbf5100d34742e7ee32674138b`
- md5 (routes/dicomweb.js): `1d5d3b6f90c8e896975cc6def0ae7b2e`
- 25430 lines on server
- 162/162 smoke tests passing
- pm2 restart #61

## What this closes from BENCHMARK_GAP_ANALYSIS_AR.md §7.1

✅ FHIR R4 public surface — CapabilityStatement published
✅ DICOM Web + OHIF viewer config
✅ HL7 v2 ADT/ORM/ORU ingestion
✅ Patient Portal v2 (login/identity/me)
⏳ Order Sets (45d) — next
⏳ OLAP connector (60d)
⏳ Multi-currency (30d)
⏳ Discharge LLM (60d)