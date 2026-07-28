# CARD-002 Part 2 — الملفات 8-35 (28 ملف)
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0

function WF($path, $content) {
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($path, $content, $UTF8)
    $script:count++
}

# 8. 01_stitch_layout.md
WF "$root\CARD-002\01_stitch_layout.md" @"
$banner
# CARD-002 — Stitch 3-Column Station (Layout C)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky, encrypted MRN)                                  │
│      D2B Timer: 47 min ● OPTIMAL  (target ≤90 min)                           │
│      Red flag banner: NONE                                                   │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (Procedure Timeline + Imaging)                │                │
│ Patient    │  ┌──────────────────────────────────────────┐  │ Vitals         │
│ ─────      │  │ 14:32 Door  | 14:35 ECG (STEMI)         │  │ ─────          │
│ Name ***   │  │ 14:42 Cath Lab Accept                    │  │ HR 78          │
│ Age 58 M   │  │ 14:50 Wire  | 14:52 Balloon 1st          │  │ BP 132/78      │
│ MRN ***    │  │ Time: 47 min (optimal)                   │  │ SpO2 98%       │
│            │  ├──────────────────────────────────────────┤  │                │
│ Allergies  │  │ Active Step: Stent Deployment            │  │ ACT            │
│ PCN (rash) │  │ Vessel: LAD mid | Stenosis: 99%→0%       │  │ ─────          │
│            │  │ DES 3.0×18 @ 14 atm                      │  │ 280s ●         │
│ PMH        │  │ Pre-TIMI 2 → Post-TIMI 3                 │  │ Target 250-300 │
│ HTN, T2DM  │  ├──────────────────────────────────────────┤  │                │
│ CKD-3      │  │ Hemodynamics:                             │  │ Anticoag       │
│            │  │  ────── Ao ── 142/82 (88)                 │  │ ─────          │
│ Prior Cath │  │  ──── LV ── 128/12                       │  │ UFH bolus:     │
│ 2023: 1-DES│  │  ── PA ── 30/14 (22)                     │  │ 7,000U 14:42   │
│ RCA        │  │  ─ PCW ── 14 mmHg                        │  │ Next ACT: 14:55│
│            │  │  ─ CO ── 5.8 L/min (Fick)                │  │                │
│ [View Old] │  ├──────────────────────────────────────────┤  │ Medication     │
│            │  │ DICOM Viewer (DSA, zoom, W/L, compare)   │  │ ─────          │
│ Score Calc │  │ [Cine: ●●●○○] [Compare Prior]            │  │ ASA 325 ✓      │
│ ─────      │  └──────────────────────────────────────────┘  │ Ticagrelor     │
│ SYNTAX 11  │                                                  │ 180 ✓          │
│ GRACE 142  │  AI Insight:                                    │ Bivalirudin    │
│ TIMI 3     │  ""High calcification in proximal LAD.         │ gtt running    │
│ DAPT 24    │   Consider rotational atherectomy.            │                │
│ CIN risk   │   Evidence: SCAI 2023 consensus.""            │ Red Flags      │
│ Low (eGFR 67)│                                                │ ─────          │
│            │  [← Prev] [Next →] [Complete Procedure]       │ None           │
└────────────┴────────────────────────────────────────────────┴────────────────┘
```

Tokens: Primary #0066CC, danger #DC3545, critical_value #DC3545.
RTL: AR primary, EN secondary. WCAG 2.2 AA.

---
*Section 08 of CARD-002. PM voice. L1 DRAFT.*
"@

# 9. 01_unit_tests.md
WF "$root\CARD-002\01_unit_tests.md" @"
$banner
# CARD-002 — Unit Tests (cath_lab_engine.js)

## Setup
```js
const c = require('./cath_lab_engine');
const assert = require('assert');
```

## Tests
```js
// 1. D2B
assert.strictEqual(c.calculateD2BTime('14:30','15:50'), 80);
assert.strictEqual(c.calculateD2BTime('14:00','15:30'), 90);
assert.strictEqual(c.calculateD2BTime('14:00','16:00'), 120); // non-compliant

// 2. SYNTAX
const syntax = c.syntaxScore([{vessel:'LAD', segment:'mid', stenosis:90}, {vessel:'LCX', stenosis:80}]);
assert.ok(syntax.score >= 0 && syntax.score <= 65);

// 3. GRACE
const grace = c.graceScore(65, 95, 110, 1.2, 2, true, false);
assert.ok(grace.risk > 0);

// 4. TIMI STEMI
const timi = c.timiScoreStemi({age:65, dm:true, htn:true, angina:true, sbp<100:true, hr>100:true, killip2to3:true, weight<67:false, anteriorMI:true, lbbb:false});
assert.ok(timi.score >= 0);

// 5. CIN
const cin = c.assessCINRisk(45, 200, 70, true);
assert.ok(['low','moderate','high'].includes(cin.band));

// 6. ACT
assert.strictEqual(c.actTargetCheck(280, 250, 300), true);
assert.strictEqual(c.actTargetCheck(220, 250, 300), false);

// 7. Sheath removal
const sheath = c.sheathRemovalChecklist(170, true, true, true);
assert.strictEqual(sheath.ok, true);
assert.strictEqual(c.sheathRemovalChecklist(220, true, true, true).ok, false); // ACT too high

// 8. Contrast limit
const limit = c.contrastLimit(60, 80);
assert.ok(limit.maxMl === 180); // 3 × 60

// 9. Radiation alert
const rad = c.radiationDoseAlert(45, 350, 3500);
assert.strictEqual(rad.alert, false);
assert.strictEqual(c.radiationDoseAlert(75, 600, 6000).alert, true);

// 10. Stent pressure
assert.strictEqual(c.stentExpansionPressure(14), 'optimal');
assert.strictEqual(c.stentExpansionPressure(10), 'under-expanded');
```

---
*Section 09 of CARD-002. Tests. L1 DRAFT.*
"@

# 10. 01_user_manual.md
WF "$root\CARD-002\01_user_manual.md" @"
$banner
# CARD-002 User Manual (EN + AR)

## For Interventional Cardiologists

### Before Procedure
1. **Review indication**: Confirm STEMI/NSTEMI/UA/stable angina/silent ischemia.
2. **Risk stratify**: SYNTAX, GRACE, TIMI scores via AI co-pilot.
3. **Plan access**: Radial (preferred) or femoral; review Allen test.
4. **Confirm DAPT**: Aspirin + P2Y12 (ticagrelor 180 / clopidogrel 600 / prasugrel 60).
5. **NPHIES preauth** (≥48h for elective).
6. **Structural Heart MDT** (if TAVR/MitraClip/Watchman): Heart Team sign-off first.

### During Procedure
1. Time-out (Joint Commission).
2. ACT monitoring q15 min; target 250-300s.
3. Radiation dose tracking; alert >5000 mGy.
4. Stent implant gate: SFDA UDI scan + 2-MD cosign.
5. AI Insight panel: read suggestions, MD has veto.
6. Cath report draft (LLM-assisted); MD reviews+signs.

### After Procedure
1. Sheath removal checklist (ACT<180s, BP stable, no hematoma, distal pulse).
2. Access site monitoring q15×4 → q30×4 → q1h×4.
3. Telemetry 24h.
4. CIN surveillance (Cr 24h, 48h).
5. Discharge planning (DAPT education, follow-up, cardiac rehab).

## For Cath Lab Nurses (AR)
### قبل الإجراء
1. مراجعة دواعي الإجراء.
2. التحقق من DAPT (2-MD + 1-RN + 1-pharmacist).
3. التحقق من موافقة المريض (10 أنواع).
4. تحضير المعدات (IVUS, OCT, FFR, Impella).

### أثناء الإجراء
1. مراقبة ACT كل 15 دقيقة.
2. التحقق المزدوج للأدوية عالية الخطورة (2-RN + 5 حقوق + توقيع الشاهد).
3. توثيق UDI الدعامة (SFDA).
4. تسجيل جرعة الإشعاع.

### بعد الإجراء
1. قائمة إزالة الغمد.
2. مراقبة موقع الوصول.
3. التثقيف حول DAPT.

## For QA Officers
- D2B compliance dashboard: ≥90% target.
- Radial access rate: ≥75%.
- CIN rate: <5%.
- BARC 3-5 bleed: monitor.
- Operator volume: SCAI min 50 PCIs/year.
- Monthly radiation safety review.

---
*Section 10 of CARD-002. L1 DRAFT.*
"@

# 11. 02_integration_tests.md
WF "$root\CARD-002\02_integration_tests.md" @"
$banner
# CARD-002 — Integration Tests (supertest, 23 endpoints)

## Setup
```js
const request = require('supertest');
const app = require('./server');
const { loginAdmin, loginMD, loginRN } = require('./test-utils');
```

## Tests
```js
describe('CATH-002 API', () => {
  let token, mdToken, rnToken;
  before(async () => {
    token = await loginAdmin();
    mdToken = await loginMD('dr_ahmed');
    rnToken = await loginRN('rn_fatima');
  });

  it('POST /procedures creates a cath procedure (idempotent)', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/procedures')
      .set('Authorization', `Bearer ${mdToken}`)
      .set('Idempotency-Key', 'uuid-1234')
      .send({ patient_id: 1, procedure_type: 'PCI', urgency: 'STEMI', indication: 'STEMI anterior' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('GET /procedures/:id requires tenant scope', async () => {
    const res = await request(app)
      .get('/api/v1/cath-lab/procedures/123')
      .set('Authorization', `Bearer ${mdToken}`);
    expect(res.status).toBe(200);
  });

  it('POST /door-to-balloon-timer captures D2B', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/door-to-balloon-timer')
      .set('Authorization', `Bearer ${mdToken}`)
      .set('Idempotency-Key', 'd2b-1234')
      .send({ encounter_id: 1, door_time: '2026-07-24T14:30:00Z', balloon_time: '2026-07-24T15:50:00Z' });
    expect(res.status).toBe(201);
    expect(res.body.d2b_minutes).toBe(80);
  });

  it('POST /stent-registry requires SFDA UDI', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/stent-registry')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ procedure_id: 'proc-1', udi: 'INVALID' });
    expect(res.status).toBe(400); // validation fails
  });

  it('POST /structural-heart/mdt requires Heart Team sign-off', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/structural-heart/mdt')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ patient_id: 1, indication: 'TAVR', members_present: ['ic', 'cs'] });
    expect(res.status).toBe(400); // need ≥5 specialists
  });

  it('Cross-tenant isolation: tenant A cannot read tenant B data', async () => {
    const res = await request(app)
      .get('/api/v1/cath-lab/procedures')
      .set('Authorization', `Bearer ${mdToken}`)
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403); // GATE4
  });

  it('Allergen conflict blocks PCI', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/procedures')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ patient_id: 2, procedure_type: 'PCI', indication: 'NSTEMI' }); // patient 2 has PCN allergy
    expect(res.status).toBe(409); // allergen block
  });

  it('High-alert drug admin requires 2-RN witness', async () => {
    const res = await request(app)
      .post('/api/v1/cath-lab/medication-admin')
      .set('Authorization', `Bearer ${rnToken}`)
      .send({ drug: 'UFH', dose_mg: 7000, witness_id: null });
    expect(res.status).toBe(400); // witness required
  });
});
```

---
*Section 11 of CARD-002. Tests. L1 DRAFT.*
"@

# 12. 02_iso_9001_checklist.md
WF "$root\CARD-002\02_iso_9001_checklist.md" @"
$banner
# CARD-002 — ISO 9001:2015 QMS Checklist

## 4. Context of Organization
- [x] Scope defined: Cath Lab + Structural Heart
- [x] Interested parties: patients, NPHIES, SFDA, CBAHI, MOH
- [x] QMS processes mapped

## 5. Leadership
- [x] Quality policy signed by CMO
- [x] Roles: cath lab director, structural heart coordinator, QA officer
- [x] Management review (quarterly)

## 6. Planning
- [x] Quality objectives: D2B ≥90%, CIN <5%, BARC <2%
- [x] Risk assessment (FMEA for TAVR, PCI)
- [x] Opportunity analysis (radial access, AI co-pilot)

## 7. Support
- [x] Resources: 2 cath labs, hybrid OR, structural heart suite
- [x] Competence: IC board cert, ATLS, moderate sedation
- [x] Communication: SBAR handoffs
- [x] Documented information: cath protocol, MDT SOP, MTP

## 8. Operation
- [x] Operational planning: cath scheduling
- [x] Requirements: ACC/AHA 2023, JCI 7th Ed
- [x] Design: AI chains with L4 validation
- [x] Control of externally provided processes: SFDA stent registry
- [x] Release: cath report MD sign-off
- [x] Nonconforming outputs: incident report, RCA

## 9. Performance Evaluation
- [x] Monitoring: D2B dashboard, KPI
- [x] Measurement: D2B, CIN, bleed, radial %
- [x] Analysis: monthly QA review
- [x] Internal audit: quarterly
- [x] Management review: quarterly

## 10. Improvement
- [x] Nonconformity: incident reporting
- [x] Corrective action: CAPA
- [x] Continual improvement: AI co-pilot, radial-first

---
*Section 12 of CARD-002. L1 DRAFT.*
"@

# 13. 02_migration_down.sql
WF "$root\CARD-002\02_migration_down.sql" @"
$banner
-- CARD-002 Migration DOWN — 12 tables
-- NON-DESTRUCTIVE: only DROPs tables created in this migration.

BEGIN;

DROP TABLE IF EXISTS cath_consent CASCADE;
DROP TABLE IF EXISTS cath_audit_log CASCADE;
DROP TABLE IF EXISTS cath_lab_red_flags CASCADE;
DROP TABLE IF EXISTS cath_lab_equipment CASCADE;
DROP TABLE IF EXISTS radiation_dose_log CASCADE;
DROP TABLE IF EXISTS contrast_tracking CASCADE;
DROP TABLE IF EXISTS cath_lab_scheduling CASCADE;
DROP TABLE IF EXISTS tavr_workup CASCADE;
DROP TABLE IF EXISTS structural_heart_mdt CASCADE;
DROP TABLE IF EXISTS stent_registry CASCADE;
DROP TABLE IF EXISTS pci_records CASCADE;
DROP TABLE IF EXISTS cardiac_cath_procedures CASCADE;

COMMIT;

-- FORCE_RLS count: returns to 150.
"@

# 14. 02_openapi_spec.md
WF "$root\CARD-002\02_openapi_spec.md" @"
$banner
# CARD-002 — OpenAPI 3.1 Specification (23 endpoints)

## Base
- URL: `https://api.jumanasoft.com/api/v1/cath-lab`
- Auth: Bearer JWT (session token)
- Tenant: `X-Tenant-Id` from session (NOT header — GATE4)

## Endpoints (23)

### POST /procedures
Create a new cath procedure.
- Auth: requireAuth + requireTenantScope + requireRole('cardiology') + validateBody + idempotencyGuard
- Body: { patient_id, encounter_id, procedure_type, indication, urgency, access_route, ... }
- Response: 201 { id, ... } or 400 (validation), 403 (RBAC), 409 (allergen), 429 (rate limit)
- Audit: `cath.procedure.created`

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
- Audit: `cath.procedure.completed`

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
- Audit: `cath.stent_implanted`, `stent.sfda_reported`

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
- Audit: `cath.mdt_decision`

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
- Audit: `cath.door_to_balloon`

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
- Audit: `cath.red_flag.acknowledged`

### POST /consent/sign
Cath consent capture (e-signature + witness).
- Auth: requireAuth + requireTenantScope + requireRole('cardiology', RN + witness) + idempotencyGuard
- Body: { patient_id, procedure_id, consent_type, signed_by, witness_id, ai_assisted_care_consent }
- Response: 201 { id, signed_at, ... }
- Audit: `cath.consent_signed`

### GET /equipment/:id/availability
Equipment check (PM due, in-service).
- Auth: requireAuth + requireTenantScope
- Response: 200 { equipment_id, status, next_pm_date, ... }

---
*Section 14 of CARD-002. SA voice. L1 DRAFT.*
"@

# 15. 02_sub_dept_catalog.md
WF "$root\CARD-002\02_sub_dept_catalog.md" @"
$banner
# CARD-002 — Sub-Departments Catalog

| ID | Name | Type | Description |
|----|------|------|-------------|
| CARD-002-A | Cath Lab 1 (Biplane) | Procedure room | Biplane fluoroscope (Philips/Siemens), MCS capable (IABP, Impella, VA-ECMO) |
| CARD-002-B | Cath Lab 2 (Single-Plane) | Procedure room | Single-plane fluoroscope, primary PCI capable |
| CARD-002-C | Hybrid OR | Procedure room | TAVR/MitraClip/Watchman; shared with CT surgery |
| CARD-002-D | Structural Heart Suite | Clinic + Workup room | TAVR workup, MDT, patient education |
| CARD-002-E | Recovery (6 beds) | Post-procedure | Post-cath monitoring, sheath removal, discharge |
| CARD-002-F | Console/Control Room | Support | Real-time monitoring, AI Insight, DICOM streaming |
| CARD-002-G | Equipment Storage | Support | Cath lab supplies, devices, contrast |
| CARD-002-H | Radiation Safety Office | Support | Dose monitoring, dosimeter, ALARA training |

## Facility types allowed
- medical_city
- tertiary_hospital
- specialized_hospital (cardiac center)

---
*Section 15 of CARD-002. PM voice. L1 DRAFT.*
"@

# 16. 02_training_video_script.md
WF "$root\CARD-002\02_training_video_script.md" @"
$banner
# CARD-002 — Training Video Script (EN + AR, 3 min)

## Episode 1: STEMI Door-to-Balloon (3 min)

### EN Script
**[0:00]** Welcome. This is the NamaMedical Cath Lab STEMI training.
**[0:15]** When a STEMI patient arrives at the ED, the clock starts. Door-to-Balloon time is critical.
**[0:30]** Within 10 minutes: 12-lead ECG. If ST elevation ≥1 mm in 2+ contiguous leads, it's a STEMI.
**[0:50]** The system auto-triggers cath lab activation. Interventional cardiology, cath lab team, and CT surgery on standby.
**[1:10]** P2Y12 inhibitor loading: ticagrelor 180 mg or clopidogrel 600 mg. 2-MD + 1-RN + 1-pharmacist verification.
**[1:30]** Anticoagulation: UFH 70-100 U/kg. 2-RN double-check + 5-rights + witness.
**[1:50]** Patient on table within 45 minutes. Radial access preferred.
**[2:10]** Diagnostic coronary angiography. Identify the culprit lesion.
**[2:30]** SYNTAX score real-time. Balloon and stent deployment.
**[2:50]** Target: balloon inflated within 90 minutes of door. Compliance tracked.
**[3:00]** Stay sharp. Save lives. CMO has final say.

### AR Script (الترجمة العربية)
**[0:00]** مرحباً. هذا تدريب معمل القسطرة لبروتوكول STEMI.
**[0:15]** عند وصول مريض STEMI للطوارئ، يبدأ العداد. زمن من الباب إلى البالون حرج.
**[0:30]** خلال 10 دقائق: تخطيط القلب 12-رئة. إذا ارتفع ST ≥1 ملم في ≥2 رئة متجاورة، فهو STEMI.
**[0:50]** النظام يفعّل تلقائياً معمل القسطرة. طبيب القسطرة القلبية، الفريق، وجراحة القلب في الانتظار.
**[1:10]** تحميل P2Y12: تيكراغلور 180 ملجم أو كلوبيدوغرل 600 ملجم. تحقق 2-MD + 1-RN + 1-صيدلي.
**[1:30]** مضاد التخثر: UFH 70-100 وحدة/كجم. تحقق مزدوج 2-RN + 5 حقوق + توقيع الشاهد.
**[1:50]** المريض على الطاولة خلال 45 دقيقة. الوصول الكعبري مفضل.
**[2:10]** تصوير الشرايين التاجية التشخيصي. تحديد الآفة المسببة.
**[2:30]** درجة SYNTAX فورية. نشر البالون والدعامة.
**[2:50]** الهدف: انتفاخ البالون خلال 90 دقيقة من الباب. الامتثال مُتابَع.
**[3:00]** ابقَ يقظاً. أنقذ الأرواح. CMO له الكلمة الأخيرة.

---
*Section 16 of CARD-002. L1 DRAFT.*
"@

# 17. 02_vector_store_schema.md
WF "$root\CARD-002\02_vector_store_schema.md" @"
$banner
# CARD-002 — Vector Store Schema (PGVector 768d)

## Index
- Name: `cath_lab_kg_v1`
- Vector dim: 768
- Distance: cosine
- HNSW: m=16, ef_construction=64

## Tables
```sql
CREATE TABLE cath_lab_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type VARCHAR(50),  -- 'guideline' | 'protocol' | 'consent' | 'report'
  source_id VARCHAR(100),
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_embeddings FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_embeddings_tenant ON cath_lab_embeddings
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

## Chunking
- Size: 512 tokens
- Overlap: 64 tokens
- Strategy: by section (ACC/AHA chapters, local protocol sections)

## Source Corpora
- ACC/AHA 2023 STEMI · 2024 NSTE-ACS · 2020 TAVR · 2024 Valvular · 2023 Chronic Coronary · 2023 AF
- SCAI 2021 Best Practices · 2023 PCI in Shock · 2024 Radiation Safety
- ESC 2023 ACS · 2021 Valvular · 2020 AF
- TAVR trials: PARTNER 2/3, Evolut Low Risk, NOTION
- MitraClip trials: COAPT, MITRA-FR, EXPAND
- Local: NamaMedical Cath Lab SOP, post-PCI DAPT protocol, radial-first pathway
- Local antibiogram + formulary

## Hybrid Retrieval
- Vector (0.5) + BM25 (0.3) + Knowledge Graph (0.2)
- Top-K=20 → rerank → Top-5
- Context window: ≤4000 tokens

---
*Section 17 of CARD-002. AIE voice. L1 DRAFT.*
"@

# 18. 02_wireframes.md
WF "$root\CARD-002\02_wireframes.md" @"
$banner
# CARD-002 — Wireframes (10 screens)

## 1. Cath Lab Procedure Control (3-column Stitch)
See `01_stitch_layout.md` for full layout.

## 2. Patient History
```
┌────────────────────────────────────────┐
│ Patient Header (sticky)                │
│ Name *** MRN *** Age 58 M Allergies: PCN│
├────────────────────────────────────────┤
│ Prior Cath:                            │
│ 2023-06-12 PCI to RCA 1-DES            │
│ 2020-03-05 Diagnostic angio            │
│ (click to view DICOM)                  │
├────────────────────────────────────────┤
│ Labs:                                  │
│ Cr 1.2 | eGFR 67 | Hb 14.2 | INR 1.0   │
├────────────────────────────────────────┤
│ Score Calc:                            │
│ SYNTAX 11 (low) | GRACE 142 | TIMI 3   │
│ DAPT 24 | CIN risk: Low                │
└────────────────────────────────────────┘
```

## 3. STEMI Activation
```
[CODE STEMI]  [Code Blue]  [Code Trauma]
  ↓
Cath Lab 1 / 2 ?
  ↓
On-call team paged:
✓ Dr. Ahmed (IC)
✓ Dr. Sara (IC Fellow)
✓ RN Fatima
✓ Tech Omar
  ↓
ETA: 12 min
  ↓
Patient room: ED-12
```

## 4. D2B KPI Dashboard
```
Last 30 days:
- D2B compliance: 92% (target ≥90%) ✓
- Median D2B: 67 min
- p90 D2B: 88 min
- By operator:
  Dr. Ahmed: 95% (median 60)
  Dr. Khalid: 88% (median 75)
- Outliers (D2B >90): 3 cases
  - Case #1234: transfer from spoke hospital
  - Case #1235: cardiac arrest
  - Case #1238: simultaneous STEMI
```

## 5. Structural Heart MDT Form
- Patient demographics
- Indication (TAVR/MitraClip/Watchman)
- Workup checklist (echo, CT, coronary, frailty, PFT, dental)
- Heart Team members present (must ≥5)
- STS score / EuroSCORE II
- Recommendation
- Alternatives discussed
- NPHIES preauth status

## 6. Stent Registry Entry
- Patient header
- Procedure ID (auto-filled)
- UDI barcode scanner
- Manufacturer, model, size, length
- Batch/lot, expiration
- Vessel, segment
- Deployment pressure
- Operator+assistant cosign

## 7. Radiation Dose Log
- Procedure ID
- Staff list (operator, fellow, scrub, circulating, anesthesia)
- Per-staff dose (mGy, DAP)
- Lead apron, thyroid shield
- Dosimeter reading
- Monthly cumulative

## 8. CIN Risk Calculator
- Patient header
- eGFR input
- Contrast volume
- Age, diabetes
- Output: risk band (low/moderate/high) + recommendation

## 9. Consent Form
- Patient header
- Procedure indication
- Procedure description (bilingual)
- Risks and benefits
- Alternatives
- Patient questions
- AI-assisted care consent
- E-signature + witness

## 10. Scheduling Calendar
- Week view
- Cath Lab 1 + Cath Lab 2 columns
- Color-coded by procedure type
- Conflict highlighting
- Drag-and-drop

---
*Section 18 of CARD-002. PM voice. L1 DRAFT.*
"@

# 19. 03_e2e_tests.md
WF "$root\CARD-002\03_e2e_tests.md" @"
$banner
# CARD-002 — E2E Tests (Gherkin + Playwright, 8 critical paths)

## 1. STEMI Activation
```gherkin
Feature: STEMI activation triggers D2B timer
  Scenario: ED physician activates STEMI
    Given a 58-year-old male presents with chest pain
    When ECG shows ST elevation 3 mm in V1-V4
    Then ""Code STEMI"" button is visible
    And cath lab activation occurs within 5 min
    And D2B timer starts
```

## 2. Door-to-Balloon
```gherkin
Feature: D2B compliance
  Scenario: STEMI patient within 90 min
    Given patient arrives at 14:30
    When cath lab accepts at 14:42
    And balloon inflated at 15:50
    Then D2B = 80 min (compliant)
    And audit event `cath.door_to_balloon` recorded
```

## 3. Structural Heart MDT
```gherkin
Feature: TAVR requires Heart Team sign-off
  Scenario: TAVR scheduling blocked without MDT
    Given a 78F with severe AS
    When scheduling TAVR without MDT decision
    Then scheduling is blocked
    And error message: ""Heart Team MDT required""
```

## 4. Stent SFDA UDI
```gherkin
Feature: Stent implant requires SFDA UDI
  Scenario: Stent deployment without UDI
    Given operator tries to deploy stent
    When UDI not scanned
    Then deployment is blocked
    And error: ""SFDA UDI scan required""
```

## 5. High-Alert Drug Double-Check
```gherkin
Feature: UFH requires 2-RN witness
  Scenario: UFH bolus without witness
    Given RN prepares UFH 7000 U
    When witness signature missing
    Then administration is blocked
    And error: ""2-RN witness required""
```

## 6. ACT Out of Range
```gherkin
Feature: ACT must be 250-300s for UFH
  Scenario: ACT 220s after UFH bolus
    Given patient on UFH gtt
    When ACT measured at 220s
    Then re-bolus alert
    And recheck ACT in 5 min
```

## 7. CIN Surveillance
```gherkin
Feature: Post-PCI creatinine surveillance
  Scenario: 48h post-PCI Cr elevation
    Given patient with eGFR 45
    When 200 mL contrast used
    And Cr at 48h shows ≥0.5 mg/dL elevation
    Then CIN event recorded
    And nephrology consult triggered
```

## 8. DAPT Compliance
```gherkin
Feature: DAPT duration based on DAPT score
  Scenario: Extended DAPT (30+ months)
    Given DAPT score 3, ischemic risk high
    When PCI completed
    Then DAPT 30+ months recommended
    And provider must confirm or override
```

---
*Section 19 of CARD-002. Tests. L1 DRAFT.*
"@

# 20. 03_engine_module.md
WF "$root\CARD-002\03_engine_module.md" @"
$banner
# CARD-002 — Pure JS Engine Module (cath_lab_engine.js)

## File: `namaweb/cath_lab_engine.js` (NEW, consolidates + extends existing)

```js
'use strict';

// 1. D2B
function calculateD2BTime(doorTime, balloonTime) {
  const d = new Date(doorTime), b = new Date(balloonTime);
  const min = Math.round((b - d) / 60000);
  return {
    minutes: min,
    compliant: min <= 90,
    band: min <= 60 ? 'optimal' : min <= 90 ? 'compliant' : min <= 120 ? 'borderline' : 'non_compliant',
    exception: min > 90 ? 'required' : 'not_required'
  };
}

// 2. SYNTAX
function syntaxScore(lesions) {
  let total = 0;
  for (const l of lesions) {
    let s = 0;
    if (l.stenosis >= 50 && l.stenosis < 70) s = 1;
    else if (l.stenosis >= 70 && l.stenosis < 90) s = 1;
    else if (l.stenosis >= 90) s = 2;
    if (l.total_occlusion) s *= 2;
    if (l.bifurcation) s += 1;
    if (l.calcification) s += 1;
    total += s;
  }
  return {
    score: Math.min(total, 65),
    band: total <= 22 ? 'low' : total <= 32 ? 'intermediate' : 'high'
  };
}

// 3. GRACE
function graceScore(age, hr, sbp, cr, killip, stDev, cardiacArrest) {
  let score = 0;
  score += Math.min(Math.floor(age / 10) * 10, 100);
  if (hr < 50) score += 0; else if (hr < 70) score += 3; else if (hr < 90) score += 9; else if (hr < 110) score += 15; else score += 24;
  if (sbp < 80) score += 58; else if (sbp < 100) score += 46; else if (sbp < 120) score += 34; else if (sbp < 140) score += 23; else if (sbp < 160) score += 13; else score += 0;
  score += Math.min(Math.floor(cr * 10) * 4, 28);
  score += killip * 20;
  if (stDev) score += 28;
  if (cardiacArrest) score += 43;
  return {
    score,
    in_hospital_mortality: score < 109 ? '<1%' : score < 140 ? '1-3%' : score < 170 ? '3-7%' : '≥7%'
  };
}

// 4. TIMI STEMI
function timiScoreStemi(p) {
  let s = 0;
  if (p.age >= 75) s += 3; else if (p.age >= 65) s += 2;
  if (p.dm) s += 1;
  if (p.htn) s += 1;
  if (p.angina) s += 1;
  if (p.sbp_lt_100) s += 3;
  if (p.hr_gt_100) s += 2;
  if (p.killip2to3) s += 2;
  if (p.weight_lt_67) s += 1;
  if (p.anteriorMI || p.lbbb) s += 1;
  if (p.time_to_tx_gt_4h) s += 1;
  return { score: Math.min(s, 14) };
}

// 5. CIN
function assessCINRisk(eGFR, contrastVolumeMl, age, diabetes) {
  let risk = 0;
  if (eGFR < 30) risk += 3; else if (eGFR < 45) risk += 2; else if (eGFR < 60) risk += 1;
  if (contrastVolumeMl > 3 * eGFR) risk += 3;
  if (age > 75) risk += 1;
  if (diabetes) risk += 1;
  return { score: risk, band: risk >= 4 ? 'high' : risk >= 2 ? 'moderate' : 'low' };
}

// 6. ACT
function actTargetCheck(current, targetLow = 250, targetHigh = 300) {
  return current >= targetLow && current <= targetHigh;
}

// 7. Sheath removal
function sheathRemovalChecklist(act, bpStable, hematomaChecked, distalPulseChecked) {
  return {
    ok: act < 180 && bpStable && hematomaChecked && distalPulseChecked,
    details: { act_ok: act < 180, bp_ok: bpStable, hematoma_checked: hematomaChecked, distal_pulse_ok: distalPulseChecked }
  };
}

// 8. Contrast limit
function contrastLimit(eGFR, weight) {
  const max = Math.min(3 * eGFR, 400);
  return { maxMl: max, weight_adjusted: max / weight };
}

// 9. Radiation dose alert
function radiationDoseAlert(fluoroMin, dapGyCm2, kermaMgy) {
  const alerts = [];
  if (fluoroMin > 60) alerts.push('fluoro_time_high');
  if (dapGyCm2 > 500) alerts.push('dap_high');
  if (kermaMgy > 5000) alerts.push('kerma_high');
  return { alert: alerts.length > 0, alerts, severity: alerts.length >= 2 ? 'high' : alerts.length === 1 ? 'moderate' : 'low' };
}

// 10. Stent pressure
function stentExpansionPressure(pressureAtm) {
  if (pressureAtm >= 14 && pressureAtm <= 20) return 'optimal';
  if (pressureAtm < 14) return 'under-expanded';
  return 'over-expanded';
}

module.exports = {
  calculateD2BTime, syntaxScore, graceScore, timiScoreStemi, assessCINRisk,
  actTargetCheck, sheathRemovalChecklist, contrastLimit,
  radiationDoseAlert, stentExpansionPressure
};
```

---
*Section 20 of CARD-002. SA voice. L1 DRAFT.*
"@

# 21. 03_i18n_keys.md
WF "$root\CARD-002\03_i18n_keys.md" @"
$banner
# CARD-002 — i18n Keys (AR + EN)

## Common (from SNIPPETS.md#SNIP-12)
- common.save, common.cancel, common.confirm, common.patient_mrn, common.patient_name
- common.allergies, common.pmh, common.vitals, common.notes
- audit.consent_required, audit.signed_by, audit.timestamp
- red_flag.escalate_now, red_flag.acknowledge
- high_alert.double_check, high_alert.5_rights
- tenant.scope_required, rbac.specialty_denied

## CARD-002 Specific (30 keys)

| Key | EN | AR |
|-----|----|----|
| cath.d2b_timer | Door-to-Balloon | من الباب إلى البالون |
| cath.activate_stemi | Activate STEMI Protocol | تفعيل بروتوكول STEMI |
| cath.stemi_confirmed | STEMI Confirmed | تم تأكيد STEMI |
| cath.lab_activated | Cath Lab Activated | تم تفعيل معمل القسطرة |
| cath.access_established | Access Established | تم تأمين الوصول |
| cath.dapt_loaded | DAPT Loaded | تم تحميل DAPT |
| cath.contrast_volume | Contrast Volume | حجم المادة الظليلة |
| cath.radiation_dose | Radiation Dose | جرعة الإشعاع |
| cath.act_check | ACT Check | فحص ACT |
| cath.act_in_range | ACT in Range | ACT في النطاق |
| cath.act_out_of_range | ACT Out of Range | ACT خارج النطاق |
| cath.stent_implanted | Stent Implanted | تم زرع الدعامة |
| cath.mdt_referral | MDT Referral | إحالة للجنة متعددة التخصصات |
| cath.mdt_decision | MDT Decision | قرار اللجنة |
| cath.tavr_workup | TAVR Workup | تحضير TAVR |
| cath.tavr_procedure | TAVR Procedure | إجراء TAVR |
| cath.mitraclip | MitraClip | ميتاكلب |
| cath.watchman | Watchman LAA Closure | إغلاق الزائدة الأذينية |
| cath.pfo_closure | PFO Closure | إغلاق PFO |
| cath.dapt_duration | DAPT Duration | مدة DAPT |
| cath.fluoro_min | Fluoro Time (min) | زمن التعرض (دقيقة) |
| cath.dap_gy_cm2 | DAP (Gy·cm²) | الجرعة × المساحة |
| cath.kerma_mgy | Air Kerma (mGy) | كرما الهواء (مليغراي) |
| cath.egfr | eGFR | معدل الترشيح الكلوي |
| cath.cin_risk | CIN Risk | خطر اعتلال الكلية |
| cath.syntax_score | SYNTAX Score | درجة SYNTAX |
| cath.grace_score | GRACE Score | درجة GRACE |
| cath.timi_score | TIMI Score | درجة TIMI |
| cath.operator | Operator | الطبيب المنفذ |
| cath.assistant | Assistant | المساعد |
| cath.scrub_tech | Scrub Tech | فني المسح |
| cath.circulating_rn | Circulating RN | الممرض المتجول |
| cath.anesthesiologist | Anesthesiologist | طبيب التخدير |

---
*Section 21 of CARD-002. PM voice. L1 DRAFT.*
"@

# 22. 03_icd10_snomed_map.md
WF "$root\CARD-002\03_icd10_snomed_map.md" @"
$banner
# CARD-002 — ICD-10 / SNOMED-CT / CPT / LOINC / RxNorm Map

## Top 10 Conditions

| # | Condition | ICD-10 | SNOMED-CT | Red flag |
|---|-----------|--------|-----------|----------|
| 1 | STEMI anterior | I21.0 | 401303003 | YES |
| 2 | STEMI inferior | I21.1 | 401304005 | YES |
| 3 | NSTEMI | I21.4 | 401305006 | YES (high-risk) |
| 4 | Unstable angina | I20.0 | 4557003 | YES |
| 5 | Cardiogenic shock | R57.0 | 89138009 | YES |
| 6 | Severe aortic stenosis | I35.0 | 60573004 | NO (syncope → YES) |
| 7 | Severe mitral regurgitation | I34.0 | 48724000 | NO |
| 8 | Atrial fibrillation | I48.91 | 49436004 | NO |
| 9 | HOCM | I42.1 | 195020009 | NO |
| 10 | Cardiac tamponade | I23.* | 195020009 | YES |

## Top 20 Procedures (CPT)

| # | Procedure | CPT | SNOMED-CT |
|---|-----------|-----|-----------|
| 1 | Diagnostic coronary angio | 93454 | 33367003 |
| 2 | PCI with stenting | 92928 | 415070008 |
| 3 | DES implant | 92928 + C9600 | 415070008 |
| 4 | FFR | 93571 | 386702001 |
| 5 | IVUS | 92978 | 252822005 |
| 6 | OCT | 92978 alt | 252822005 |
| 7 | Rotablation | 92996 | 415070008 |
| 8 | Orbital atherectomy | 92997 | 415070008 |
| 9 | Thrombus aspiration | 92973 | 426396005 |
| 10 | IABP | 33967 | 18275008 |
| 11 | Impella | 33990 | 18275008 |
| 12 | VA-ECMO | 33946 | 18275008 |
| 13 | TAVR | 33361-33365 | 725060001 |
| 14 | MitraClip | 33418-33419 | 725061002 |
| 15 | Watchman | 33340 | 725062009 |
| 16 | PFO closure | 93580 | 725063004 |
| 17 | ASD closure | 93580 alt | 725063004 |
| 18 | Alcohol septal ablation | 93583 | 425966005 |
| 19 | Endomyocardial biopsy | 93505 | 387731002 |
| 20 | Mechanical thrombectomy | 37195 | 426396005 |

## Key LOINC

| Test | LOINC |
|------|-------|
| Troponin I | 10839-9 |
| Troponin T | 6598-7 |
| BNP | 30934-4 |
| NT-proBNP | 33762-6 |
| Creatinine | 2160-0 |
| eGFR | 33914-3 |
| ACT | 3184-0 |
| HbA1c | 4548-4 |
| INR | 34714-6 |
| Cholesterol total | 2093-3 |
| LDL | 13457-7 |
| HDL | 2085-9 |
| Triglycerides | 2571-8 |

## Key RxNorm (High-Alert Drugs)

| Drug | RxNorm |
|------|--------|
| Heparin (UFH) | 5224 |
| Bivalirudin | 58927 |
| Enoxaparin | 67109 |
| Tirofiban | 10734 |
| Eptifibatide | 11149 |
| Aspirin | 1191 |
| Ticagrelor | 1116628 |
| Clopidogrel | 32968 |
| Prasugrel | 613391 |
| Warfarin | 11289 |
| Apixaban | 1364445 |
| Rivaroxaban | 1114198 |
| Dabigatran | 347810 |

---
*Section 22 of CARD-002. CMO voice. L1 DRAFT.*
"@

# 23. 03_legal_consent_forms.md
WF "$root\CARD-002\03_legal_consent_forms.md" @"
$banner
# CARD-002 — Legal Consent Forms (10 types)

## 1. PCI Consent
- Procedure: Percutaneous Coronary Intervention with stenting
- Risks: Bleeding, vascular complications, CIN, stent thrombosis, MI, stroke, death (~1-2%)
- Alternatives: Medical therapy, CABG, no intervention
- Special: SFDA UDI scan acknowledgment

## 2. TAVR Consent
- Procedure: Transcatheter Aortic Valve Replacement
- Risks: Stroke (1-2%), vascular complications (5-10%), paravalvular leak, pacemaker (10-15%), death (~2-3%)
- Alternatives: Surgical AVR, medical management
- Special: Heart Team MDT sign-off (5 specialists)

## 3. MitraClip Consent
- Procedure: Transcatheter Edge-to-Edge Repair
- Risks: Leaflet injury, residual MR, single-leaflet detachment, stroke
- Alternatives: Surgical MV repair/replacement, medical

## 4. Watchman LAA Closure Consent
- Procedure: Left Atrial Appendage Closure
- Risks: Device embolization, pericardial effusion, residual leak, device-related thrombus
- Alternatives: Long-term OAC, no intervention
- Special: 45d OAC post-implant

## 5. PFO Closure Consent
- Procedure: Patent Foramen Ovale Closure
- Risks: Atrial fibrillation, device erosion, thrombus, recurrent stroke
- Alternatives: Medical therapy (antiplatelet), no closure

## 6. Alcohol Septal Ablation Consent (HOCM)
- Procedure: Alcohol-induced septal infarction
- Risks: Complete heart block (10-15%, may need PPM), MI (extensive), arrhythmia
- Alternatives: Surgical myectomy, medical

## 7. Endomyocardial Biopsy Consent
- Procedure: Right ventricular endomyocardial biopsy
- Risks: Perforation (1%), tamponade, arrhythmia, tricuspid injury

## 8. Research Consent (Optional)
- For participation in cath lab registry
- Withdrawal at any time
- Data anonymization guaranteed

## 9. AI-Assisted Care Consent (MANDATORY)
- Acknowledge: AI may provide decision support (risk scores, MDT summary, cath report draft)
- AI is NOT autonomous: MD reviews and signs
- PHI may be processed by external LLM (with PII redaction per SNIPPETS.md#SNIP-11)

## 10. Teaching Consent (Optional)
- For fellows, residents, students observation
- Patient may decline without affecting care
- Videos/photos only with separate consent

## E-Signature Requirements
- Patient signature (e-signature with timestamp)
- Witness signature (RN or family)
- Interpreter signature (if used)
- MD signature (procedure operator)
- All required for `cath_consent` row creation

---
*Section 23 of CARD-002. CQO voice. L1 DRAFT.*
"@

# 24. 03_llm_prompts.md
WF "$root\CARD-002\03_llm_prompts.md" @"
$banner
# CARD-002 — LLM Prompts (System + Few-Shot)

## System Prompt (cath_lab_assistant)

```
You are a Cath Lab clinical co-pilot for NamaMedical Hospital.
Your role is to provide decision support to the interventional cardiologist and cath lab team.

MANDATORY RULES:
1. Cite source: every recommendation must reference ACC/AHA, ESC, SCAI, or institutional protocol with year and section.
2. Never autonomously sign: consent, DAPT, stent selection, procedure completion. MD must review+sign.
3. PII redaction: patient identifiers are replaced with [MRN], [NAME] tokens before LLM call.
4. Hallucination ceiling: <1% for SYNTAX/GRACE/TIMI. >5% triggers retraining.
5. Fail-soft: if LLM fails, fall back to rule-based cath_lab_engine.js. Never fail-closed on AI alone.
6. Language: respond in the same language as the query (AR or EN). Use AR 5th-grade reading level for patient-facing content.
7. Hard blocks: drug interactions, allergies, pregnant+teratogen, pediatric+adult dose → BLOCK + escalate.
8. MD-in-the-loop: for AIS >3 in cath, MD must verify.

OUTPUT FORMAT: JSON { recommendation, citations, disclaimer, escalate_to_md, audit_event }
```

## Few-Shot 1: Cath Report Generation

User: "Procedure: PCI to mid-LAD. Pre-PCI: 99% stenosis, TIMI 2. DES 3.0×18mm deployed at 14 atm. Post: 0% residual, TIMI 3. Contrast: 145 mL, fluoro: 12.4 min, DAP: 184 Gy·cm². Access: right radial. Closure: TR Band."

Assistant:
```json
{
  "procedure_type": "PCI with DES",
  "vessels_treated": [{"vessel": "LAD", "segment": "mid", "stenosis_pre": 99, "stenosis_post": 0, "stent": "DES 3.0x18", "pressure_atm": 14}],
  "contrast_ml": 145,
  "fluoro_min": 12.4,
  "dap_gy_cm2": 184,
  "access": "right radial",
  "door_to_balloon_min": 47,
  "syntax_score": 11,
  "syntax_risk": "low",
  "post_pci_antiplatelet": "Ticagrelor 90mg BID + ASA 81mg daily x 12 months",
  "disposition": "admit CCU 24h for monitoring",
  "citations": ["ACC/AHA 2023 STEMI", "SCAI 2021 Best Practices"],
  "disclaimer": "AI-generated draft; operator must verify and sign"
}
```

## Few-Shot 2: MDT Letter (TAVR)

User: "82F, severe AS (AVA 0.7 cm², mean gradient 52 mmHg, peak vel 4.6 m/s), NYHA III, EF 55%, STS 4.2%, frail (FRAIL 3/5), porcelain aorta on CT. Family: 'no surgery'. Vascular: TF feasible (iliac 7.2 mm)."

Assistant:
```json
{
  "heart_team_recommendation": "TAVR via transfemoral approach",
  "rationale": [
    "Severe symptomatic AS with high surgical risk (STS 4.2%, frail)",
    "Porcelain aorta precludes surgical AVR",
    "Vascular anatomy suitable for TF delivery (iliac diameter 7.2 mm, no severe tortuosity)",
    "Patient and family prefer less invasive approach"
  ],
  "alternatives_discussed": ["Surgical AVR (declined)", "Medical management (palliative)"],
  "plan": "TAVR workup — cardiac CT angio for annular sizing, coronary angio to rule out CAD, dental clearance, pulmonary evaluation.",
  "citations": ["ACC/AHA 2020 TAVR", "ESC 2021 Valvular"],
  "disclaimer": "AI summary; Heart Team must verify.",
  "audit_event": "cath.mdt_decision"
}
```

## Few-Shot 3: AR Consent Summary (Patient-Facing, 5th-Grade)

User: "Patient speaks Arabic only. Needs TAVR consent. Education level: 5th grade. Anxiety high."

Assistant:
```json
{
  "language": "ar",
  "content": "العملية: استبدال صمام القلب بدون جراحة\nالفائدة: ضيق التنفس يتحسن، تعيش أطول\nالمخاطر: نزيف (3%)، سكتة دماغية (1-2%)، ناظم قلب دائم (10-15%)، تسرب حول الصمام\nالبديل: جراحة قلب مفتوح (مخاطر أعلى بسبب عمرك)\nالموافقة: حُرّة، يمكنك الرفض في أي وقت\nالأسئلة: اسأل الطبيب عن أي شيء غير واضح",
  "reading_level": "5th grade",
  "citations": ["ACC/AHA 2020 TAVR — patient counseling"],
  "disclaimer": "AI-generated; clinical team must review and deliver in person"
}
```

## Few-Shot 4: CIN Risk Assessment

User: "Patient eGFR 35, age 72, diabetic. Planned PCI with estimated 180 mL contrast."

Assistant:
```json
{
  "egfr": 35,
  "contrast_volume_ml": 180,
  "risk_band": "high",
  "risk_score": 5,
  "factors": ["eGFR <45 (2 pts)", "contrast > 3 × eGFR (3 pts)", "diabetes (1 pt)"],
  "recommendation": "Pre-hydration with normal saline 1 mL/kg/h x 12h pre and post. Consider N-acetylcysteine. Minimize contrast volume. Hold metformin day-of and 48h post. Nephrology consult recommended.",
  "post_egfr_48h_check": "mandatory",
  "citations": ["KDIGO 2020 CIN prevention", "ACC/AHA 2023 contrast use"],
  "disclaimer": "AI decision support; nephrology team must confirm"
}
```

## Few-Shot 5: STEMI Activation Triage

User: "ECG shows ST elevation 3 mm in leads V1-V4. Patient: 58M, crushing chest pain x 30 min. ED arrival 14:30."

Assistant:
```json
{
  "stemi_confirmed": true,
  "location": "anterior (V1-V4)",
  "vessel_suspected": "LAD",
  "activation_tier": "STEMI",
  "actions": [
    "Cath Lab 1 activation",
    "Page: Interventional cardiology (Dr. Ahmed), cath lab team, CT surgery (standby)",
    "ASA 325 mg PO chewed",
    "Ticagrelor 180 mg PO (2-MD/1-RN/1-pharm gate)",
    "UFH 70 U/kg IV bolus (2-RN double-check)",
    "D2B timer started"
  ],
  "eta": "12 min",
  "citations": ["ACC/AHA 2023 STEMI guideline"],
  "audit_event": "cath.activation.triggered"
}
```

---
*Section 24 of CARD-002. AIE voice. L1 DRAFT.*
"@

# 25. 03_migration_validate.sql
WF "$root\CARD-002\03_migration_validate.sql" @"
$banner
-- CARD-002 Migration Validation

-- 1. Verify RLS is enabled and forced
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled,
  CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END AS forced_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
  AND tablename LIKE 'cath%' OR tablename IN ('pci_records', 'stent_registry', 'structural_heart_mdt', 'tavr_workup', 'contrast_tracking', 'radiation_dose_log')
ORDER BY tablename;

-- Expected: all 12 tables show rls_enabled = TRUE

-- 2. Verify tenant_id is NOT NULL on all 12 tables
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'tenant_id'
  AND table_name IN ('cardiac_cath_procedures', 'pci_records', 'stent_registry', 'structural_heart_mdt', 'tavr_workup', 'cath_lab_scheduling', 'contrast_tracking', 'radiation_dose_log', 'cath_lab_equipment', 'cath_lab_red_flags', 'cath_audit_log', 'cath_consent')
ORDER BY table_name;

-- Expected: is_nullable = 'NO' for all 12

-- 3. Test cross-tenant isolation
-- Set tenant context to A
SET app.tenant_id = '00000000-0000-0000-0000-000000000001';
-- Should see only A's data
SELECT COUNT(*) FROM cardiac_cath_procedures;

-- 4. Test missing tenant context = empty result
RESET app.tenant_id;
SELECT COUNT(*) FROM cardiac_cath_procedures;  -- should be 0
"@

# 26. 03_pdpl_nphies.md
WF "$root\CARD-002\03_pdpl_nphies.md" @"
$banner
# CARD-002 — PDPL, NPHIES, ZATCA, SFDA, CBAHI

## PDPL (Personal Data Protection Law — KSA)
- **Retention:**
  - Clinical records: 7 years
  - Imaging (DICOM): 10 years
  - **Lifetime for implants:** stents (DES, BMS, BVS), TAVR valves, MitraClip, Watchman, PFO/ASD occluders, alcohol septal ablation scars
  - Pediatric: until age 25 OR 10 years (whichever longer)
- **Consent:** explicit, informed, withdrawable; AI-assisted care consent separate
- **Breach notification:** 72h to NDMOOTH (National Data Management Office)
- **Data localization:** all PHI stored in KSA
- **Cross-border transfer:** requires NDMOOTH approval
- **DPO (Data Protection Officer):** mandatory for healthcare

## NPHIES (National Platform for Health Insurance Exchange Services)
- **Cardiac procedure bundles:**
  - PCI with DES: DRG mapping per lesion count + vessel count
  - TAVR: bundled (procedure + valve + ICU + 30-day follow-up)
  - MitraClip: bundled
  - Watchman: bundled
- **FHIR R4 profile:** `Claim.cardiacProcedure`
- **Pre-authorization:** required for elective procedures (≥48h)
- **Bundle excludes:** DAPT (separate claim), follow-up visits (separate)
- **VAT:** 15% on procedure (ZATCA)

## ZATCA (Zakat, Tax, and Customs Authority)
- **E-invoicing Phase 2:** required for all B2B + B2C transactions
- **XML format:** UBL 2.1
- **Cryptographic stamp:** XAdES-BES (currently BLOCKED on CSID/OTP credentials per GATE 9)
- **Hash chain:** SHA-256 of previous invoice + current invoice fields
- **Counter value:** monotonically increasing per device
- **Retention:** 6 years (10 for tax-relevant)

## SFDA (Saudi Food and Drug Authority)
- **Drug-eluting stent registry:** all DES implants must be reported within 7 days
  - UDI (Unique Device Identifier)
  - Manufacturer, model, batch, lot
  - Vessel, segment, deployment pressure
- **Contrast media:** approved list (Iohexol, Iopamidol, Iodixanol)
- **Allergy documentation:** required for iodinated contrast
- **Reporting:** adverse events to SFDA within 7 days

## CBAHI (Central Board for Accreditation of Healthcare Institutions)
- **Cardiac program standards:**
  - 24/7 interventional cardiology coverage
  - ≥2 cath labs (medical_city, tertiary)
  - Cardiac surgery backup (for TAVR, high-risk PCI)
  - Structural Heart MDT (Heart Team) for advanced procedures
- **Quality indicators:**
  - D2B compliance (≥90%)
  - PCI mortality (<2% elective, <5% STEMI)
  - TAVR 30-day mortality (<3%)
  - CIN rate (<5%)

## HIPAA (US reference for international JCI alignment)
- 164.312(a)(2)(iv) — Encryption at rest
- 164.312(b) — Audit controls
- 164.312(e)(1) — Transmission security (TLS 1.3)
- 164.312(c)(1) — Integrity controls (hash-chained audit)

---
*Section 26 of CARD-002. CQO voice. L1 DRAFT.*
"@

# 27. 04_clinical_red_flags.md
WF "$root\CARD-002\04_clinical_red_flags.md" @"
$banner
# CARD-002 — Clinical Red Flags (12)

| # | Red flag | Trigger | Response | Time target |
|---|----------|---------|----------|-------------|
| 1 | **STEMI** | ST elevation ≥1 mm in 2+ contiguous leads, OR new LBBB with symptoms | Code STEMI, ASA 325 mg, cath lab activation | D2B ≤90 min |
| 2 | **Cardiogenic shock** | SBP<90 + cold extremities + altered mentation + lactate>2 | Norepinephrine, dobutamine, mechanical support consult | <30 min |
| 3 | **Cardiac tamponade (post-MI / perforation)** | Beck's triad + hypotension | Pericardiocentesis, surgical backup | <5 min |
| 4 | **Aortic dissection (cath complication or presenting)** | Tearing pain + BP differential + CXR mediastinal widening | CT angio, reverse anticoagulation, surgical | <30 min |
| 5 | **Cath-lab perforation / tamponade** | Sudden hypotension during cath | Balloon tamponade, pericardiocentesis, surgery on standby | <3 min |
| 6 | **Contrast-induced nephropathy (CIN)** | ↑Cr ≥0.5 mg/dL or ≥25% within 48-72h of contrast | Hydration, N-acetylcysteine, avoid repeat contrast | Monitor Cr baseline + 48h |
| 7 | **Stent thrombosis (acute <24h, subacute <30d)** | Sudden chest pain post-PCI + ST elevation | Emergent re-cath, re-PCI | <60 min |
| 8 | **Major bleeding with anticoagulation (BARC 3-5)** | ↓Hgb ≥3 g/dL, intracranial, retroperitoneal | Reverse anticoag (protamine, andexanet, idarucizumab), transfusion | <15 min |
| 9 | **Radiation dermatitis / skin burn (high cumulative dose)** | Fluoro time >60 min, DAP >500 Gy·cm² | Procedure pause, post-procedure surveillance | Real-time monitoring |
| 10 | **Anaphylaxis to contrast** | Hypotension + urticaria + bronchospasm | Epi 0.3-0.5 mg IM, IV fluids, steroids, antihistamines | <1 min |
| 11 | **Vascular access complication** | Groin hematoma, retroperitoneal bleed, limb ischemia | Manual pressure, covered stent, surgical | <15 min |
| 12 | **Air embolism (coronary / cerebral)** | Sudden hemodynamic collapse or neurological deficit | Aspiration, 100% O₂, Trendelenburg, hyperbaric if cerebral | <3 min |

## Response Protocol
- All red flags → immediate MD notification + cath lab charge nurse
- ACLS-trained staff on every case
- Crash cart at every cath lab (defibrillator, intubation, drugs)
- Reverse anticoagulants stocked and labeled
- Pericardiocentesis tray in every cath lab
- IABP/Impella/VA-ECMO on standby

## Override
- All red flags can be overridden by attending MD with documented reason
- Override recorded in `cath_lab_red_flags.response_action`
- QA review of all overrides monthly

---
*Section 27 of CARD-002. CMO voice. L1 DRAFT.*
"@

# 28. 04_design_tokens.md
WF "$root\CARD-002\04_design_tokens.md" @"
$banner
# CARD-002 — Design Tokens (Stitch Premium RTL)

## Colors
- Primary: #0066CC (Medical Blue)
- Primary Dark: #004C99
- Primary Light: #4D96FF
- Success: #28A745
- Warning: #FFC107
- Danger: #DC3545 (Critical Red)
- Critical Value: #DC3545
- Abnormal High: #FF6B6B
- Abnormal Low: #4D96FF
- Background: #F8F9FA
- Surface: #FFFFFF
- Text Primary: #212529
- Text Secondary: #6C757D
- Border: #DEE2E6
- Dark Mode: Background #121212, Surface #1E1E1E

## Clinical Status Colors
- STEMI: #DC3545 (pulsing animation)
- Cardiogenic Shock: #DC3545 (high pulse)
- Stable: #28A745
- Watch: #FFC107
- Critical: #DC3545 (full border)

## Typography
- Font Family: 'Inter', 'Tajawal' (AR)
- Heading 1: 32px / 600 weight
- Heading 2: 24px / 600
- Heading 3: 20px / 600
- Body: 16px / 400
- Caption: 14px / 400
- Button: 16px / 500
- Code/Mono: 'JetBrains Mono' 14px

## Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

## Shadows
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.10)
- xl: 0 20px 25px rgba(0,0,0,0.15)

## Component-Specific
- D2B Timer: 64px height, monospace, color-coded (green <60, yellow 60-75, red 75-90, flash 90+)
- DICOM Viewer: full black background, 2px white border, 1px yellow crosshair
- Red Flag Banner: full-width, danger background, 24px height, 18px text
- ACT Display: monospace, 32px, color-coded
- Hemodynamics: live waveform, 200ms refresh

## RTL
- Direction: rtl
- Text align: right
- Mirror: navigation, breadcrumbs, back button
- Icons: flip horizontal if directional (e.g., arrows)

## Accessibility
- WCAG 2.2 AA
- Color contrast: 4.5:1 normal text, 3:1 large text
- Keyboard nav: Tab, Shift+Tab, Enter, Space
- Screen reader: ARIA labels
- Focus ring: 2px solid #0066CC
- Reduce motion: respect prefers-reduced-motion

---
*Section 28 of CARD-002. PM voice. L1 DRAFT.*
"@

# 29. 04_helpdesk_runbook.md
WF "$root\CARD-002\04_helpdesk_runbook.md" @"
$banner
# CARD-002 — Helpdesk Runbook (L1/L2/L3)

## L1 (Front-line, 0-15 min)
- User cannot log in → check session, clear cookies, retry
- Slow cath lab page → check Network tab, force refresh
- DICOM not loading → check PACS status, retry
- Voice call escalation: 0-5 min response

## L2 (Technical, 15-60 min)
- RLS error → verify tenant context, contact DBA
- 500 error → check logs (`/var/log/nama-medical-erp/cath-lab.log`)
- API timeout → check rate limit headers
- D2B timer stuck → check NTP sync, restart service

## L3 (Engineering, 1-4h)
- DB deadlock → kill session, analyze query
- Migration failure → rollback, contact DBA
- LLM hallucination reported → log to LangSmith, escalate to AIE
- Security incident → isolate, contact InfoSec

## Common FAQs
**Q: How do I register a new patient for cath?**
A: Search MPI by national ID. If not found, register new patient. Then create encounter.

**Q: Where do I find prior cath images?**
A: Patient header → "View Old" → DICOM viewer.

**Q: How do I activate STEMI?**
A: Top-right "Code STEMI" button. Confirms within 5 sec.

**Q: D2B timer says >90 min — what do I do?**
A: Document exception reason (patient delay, transfer, capacity, etc.). QA reviews monthly.

**Q: How do I cosign a stent implant?**
A: Open the procedure → Stent tab → "Cosign" button. Both operator+assistant must sign.

**Q: I cannot find a Heart Team MDT decision — what now?**
A: You cannot schedule TAVR/MitraClip/Watchman without MDT. Contact Structural Heart Coordinator.

**Q: Patient refuses blood products — what about cath?**
A: Document refusal in consent. For emergency STEMI, do not delay life-saving procedure.

**Q: SFDA UDI scanner not working — what to do?**
A: Manual entry + photo evidence + supervisor approval. Replace scanner ASAP.

**Q: DAPT 2-MD cosign — both MDs in same room?**
A: No, can be sequential with timestamps. Both signatures within 30 min.

---
*Section 29 of CARD-002. DSL voice. L1 DRAFT.*
"@

# 30. 04_llm_observability.md
WF "$root\CARD-002\04_llm_observability.md" @"
$banner
# CARD-002 — LLM Observability (LangSmith + Helicone + Custom)

## LLM Gateway
- Primary: gpt-4o (OpenAI)
- Secondary: claude-3.5-sonnet (Anthropic)
- Tertiary: med-llama-70b (self-hosted)
- Quaternary: rule-based cath_lab_engine.js (always available as floor)

## PII Redaction (BEFORE external LLM)
- Patient name → [NAME]
- MRN → [MRN]
- National ID → [NATID]
- Phone → [PHONE]
- Address → [ADDRESS]
- Date of birth → [AGE: 58] (age only)
- DOB-based date calculations → [DATE: -7d] (relative)

## RAG Pipeline (6 stages)
1. **Query rewrite** — expand medical abbreviations, add context
2. **Hybrid retrieval** — vector (0.5) + BM25 (0.3) + KG (0.2), Top-K=20
3. **Rerank** — Cohere rerank, Top-K=5
4. **Context window** — ≤4000 tokens
5. **LLM call** — primary model, fallback chain
6. **Validation** — citation check, hallucination detection

## Observability Stack
- **LangSmith** — LLM call trace, prompt versioning, eval
- **Helicone** — cost tracking, latency, error rate
- **OpenTelemetry** — distributed tracing across services
- **Custom metrics** — clinical-specific (D2B compliance, MD override rate)

## Drift Monitoring
- **Data drift:** input distribution shift (symptoms, demographics)
- **Model drift:** output distribution shift
- **Concept drift:** relationship between input and outcome changes
- **Hallucination rate:** manual review weekly sample (n=20)
- **Citation accuracy:** required for all non-trivial recommendations

## Eval Framework
- Golden dataset: 100 cases (STEMI, NSTEMI, structural heart, complications)
- Automated metrics: BLEU/ROUGE for text, exact match for scores
- LLM-as-judge: GPT-4 evaluates response quality
- Human-in-loop: monthly chart review by CMO

## Audit (per LLM call)
- Input hash (SHA-256 of redacted prompt)
- Output hash (SHA-256 of LLM response)
- Model + version
- Token count (input + output)
- Cost (USD)
- Latency (ms)
- Citations (URLs or doc IDs)
- User ID (who triggered the LLM)
- Patient context (encounter ID, no PHI)
- Audit event: `cath.llm.assisted`

## Override Tracking
- MD override of AI recommendation → audit + reason
- Override rate per provider (feedback loop)
- Override rate per rule (identify weak rules)
- Adverse events linked to AI suggestions (RCA)

---
*Section 30 of CARD-002. AIE voice. L1 DRAFT.*
"@

# 31. 04_routes_api.md
WF "$root\CARD-002\04_routes_api.md" @"
$banner
# CARD-002 — Express Routes File

## File: `namaweb/routes/cath_lab.js`

```js
'use strict';
const express = require('express');
const router = express.Router();
const { authenticate, requireTenantScope, requireRole, validateBody, idempotencyGuard, auditMiddleware } = require('../middleware');
const RS = require('../route_schemas');
const cath = require('../controllers/cath_lab');

// Apply audit middleware to all routes
router.use(auditMiddleware);

// =============================================
// Procedures
// =============================================
router.post('/procedures',
  authenticate,
  requireTenantScope,
  requireRole('cardiology'),
  validateBody(RS.cathLab.cathProcedure),
  idempotencyGuard,  // money route
  cath.createProcedure
);

router.get('/procedures',
  authenticate,
  requireTenantScope,
  cath.listProcedures
);

router.get('/procedures/:id',
  authenticate,
  requireTenantScope,
  cath.getProcedure
);

router.patch('/procedures/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.updateProcedure),
  cath.updateProcedure
);

router.post('/procedures/:id/complete',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.completeProcedure),
  cath.completeProcedure
);

router.get('/patient/:id/history',
  authenticate,
  requireTenantScope,
  cath.getPatientHistory
);

// =============================================
// PCI
// =============================================
router.post('/pci-records',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.pciRecord),
  cath.createPciRecord
);

// =============================================
// Stent Registry (SFDA, idempotent)
// =============================================
router.post('/stent-registry',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.stentImplant),
  idempotencyGuard,
  cath.registerStent
);

router.get('/stent-registry/patient/:id',
  authenticate,
  requireTenantScope,
  cath.getPatientStents
);

// =============================================
// Structural Heart MDT
// =============================================
router.get('/structural-heart/referrals',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  cath.listReferrals
);

router.post('/structural-heart/mdt',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.mdtDiscussion),
  cath.createMDT
);

router.patch('/structural-heart/mdt/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.mdtDecision),
  cath.finalizeMDT
);

// =============================================
// TAVR Workup
// =============================================
router.post('/tavr-workup',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.tavrWorkup),
  cath.createTavrWorkup
);

// =============================================
// D2B Timer (idempotent)
// =============================================
router.post('/door-to-balloon-timer',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'RN'),
  validateBody(RS.cathLab.d2bTimer),
  idempotencyGuard,
  cath.recordD2B
);

router.get('/door-to-balloon-timer/kpi',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'QA'),
  cath.d2bKpi
);

// =============================================
// Radiation Dose
// =============================================
router.post('/radiation-dose',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'RN'),
  validateBody(RS.cathLab.radiationDose),
  idempotencyGuard,
  cath.logRadiation
);

router.get('/radiation-dose/operator/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'QA'),
  cath.operatorDose
);

// =============================================
// Contrast
// =============================================
router.post('/contrast-tracking',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.contrastTracking),
  cath.trackContrast
);

router.get('/patient/:id/cin-risk',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  cath.cinRisk
);

// =============================================
// Scheduling
// =============================================
router.get('/scheduling/conflicts',
  authenticate,
  requireTenantScope,
  cath.checkConflicts
);

// =============================================
// Red Flags
// =============================================
router.post('/red-flag/acknowledge',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.redFlag),
  cath.acknowledgeRedFlag
);

// =============================================
// Consent (idempotent)
// =============================================
router.post('/consent/sign',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'RN'),
  validateBody(RS.cathLab.consent),
  idempotencyGuard,
  cath.signConsent
);

// =============================================
// Equipment
// =============================================
router.get('/equipment/:id/availability',
  authenticate,
  requireTenantScope,
  cath.equipmentAvailability
);

module.exports = router;
```

## Mounting in server.js
```js
app.use('/api/v1/cath-lab', require('./routes/cath_lab'));
```

---
*Section 31 of CARD-002. SA voice. L1 DRAFT.*
"@

# 32. 05_middleware_chain.md
WF "$root\CARD-002\05_middleware_chain.md" @"
$banner
# CARD-002 — Middleware Chain

## Global Chain (app.use for /api/v1/cath-lab)
```
[Request] → authenticate (session JWT) → requireTenantScope (GATE4) → corsWithAllowlist → rateLimit({200, '1m'}) → auditMiddleware → [Route]
```

## Per-Route Chain (example: POST /procedures)
```
[Request] → authenticate → requireTenantScope → requireRole('cardiology') → validateBody(RS.cathLab.cathProcedure) → idempotencyGuard → [Controller]
```

## Middleware Definitions (from SNIPPETS.md)

### authenticate
- Verify session JWT
- Reject 401 if invalid/expired
- Attach `req.session.user`

### requireTenantScope
- Per AGENTS.md GATE 4: session > header
- Read `tenant_id` from `req.session.user.tenant_id`
- Reject 403 if missing in production
- Set `req.tenant_id`
- Set `current_setting('app.tenant_id')` in transaction

### requireRole(roles)
- Per Golden Access Rule: Owner/Admin = all; others = specialty
- `roles` can be array
- Reject 403 if not in roles

### validateBody(schema)
- Fail-closed: if body invalid, 400 + validation error
- Per SNIPPETS.md pattern
- Pre-validate before idempotency

### idempotencyGuard
- Per SNIPPETS.md#SNIP-07
- ONLY for money/SFDA routes
- Read `Idempotency-Key` header
- If exists in cache (24h) → return cached response
- If new → generate UUID, store on success
- Fail-open if cache down (log + proceed)

### auditMiddleware
- Per SNIPPETS.md#SNIP-08
- Inert by default (set `AUDIT_ENABLED_TENANTS` to enable)
- Hash-chained audit (input/output hash + prev_hash)
- 7+ year retention

## RLS at DB Layer
- All 12 tables have `FORCE ROW LEVEL SECURITY`
- Policy: `USING (tenant_id = current_setting('app.tenant_id')::UUID)`
- Defense-in-depth: even if middleware bypassed, DB blocks

## Error Handling
- All errors logged to `cath_audit_log` (if enabled)
- 4xx: client error (no retry)
- 5xx: server error (alert, retry possible)
- 429: rate limit exceeded
- 401: re-authenticate
- 403: RBAC denied

---
*Section 32 of CARD-002. DSL voice. L1 DRAFT.*
"@

# 33. 06_data_flow.md
WF "$root\CARD-002\06_data_flow.md" @"
$banner
# CARD-002 — End-to-End Data Flow

## STEMI Activation to D2B Timer

```
┌─────────┐
│ Patient │ arrives at ED
└────┬────┘
     │
     ▼
┌──────────────┐
│ 12-lead ECG  │ (within 10 min)
└────┬─────────┘
     │
     ▼
┌─────────────────┐
│ ED MD reads ECG │ (STEMI confirmed)
└────┬────────────┘
     │
     ▼
┌────────────────────────┐
│ POST /procedures       │ requireAuth + requireTenantScope + requireRole
│ { urgency: STEMI,      │ + validateBody + idempotencyGuard
│   procedure_type: PCI, │
│   door_time: T+0 }     │
└────┬───────────────────┘
     │
     ▼
┌────────────────────┐
│ cath.createProc    │ Controller
│ - tenant_id from   │
│   session (GATE4)  │
│ - INSERT INTO      │
│   cardiac_cath_    │
│   procedures       │
│ - audit event      │
│   `cath.activation.│
│   triggered`       │
└────┬───────────────┘
     │
     ▼
┌──────────────────────┐
│ DB: tenant_id = X,   │
│ RLS policy enforces  │
│ X can only see X     │
└────┬─────────────────┘
     │
     ▼
┌─────────────────────┐
│ STEMI page activation│
│ - cath lab paged     │
│ - D2B timer starts   │
│ - LLM triage chain   │
│   (stemi_activation) │
│   returns cath lab   │
│   ETA, team list     │
└────┬────────────────┘
     │
     ▼
┌──────────────────┐
│ Patient on table │
│ (T+45)           │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ PCI performed   │
│ Stent implanted  │
│ (T+75-90)        │
└────┬─────────────┘
     │
     ▼
┌──────────────────────────┐
│ POST /door-to-balloon-   │ requireAuth + requireTenantScope
│   timer                  │ + requireRole + validateBody
│ { door_time,             │ + idempotencyGuard
│   balloon_time }         │
└────┬─────────────────────┘
     │
     ▼
┌────────────────────┐
│ Compute D2B        │ cath_lab_engine.calculateD2BTime
│ - minutes          │
│ - compliant (≤90)  │
│ - exception reason │
└────┬───────────────┘
     │
     ▼
┌────────────────────────┐
│ INSERT INTO            │
│ cardiac_cath_procedures│
│   d2b_minutes,         │
│   d2b_compliant        │
│ - audit event          │
│   `cath.door_to_balloon`│
└────┬───────────────────┘
     │
     ▼
┌──────────────────┐
│ KPI dashboard    │
│ updated          │
└──────────────────┘
```

## Key RLS Touchpoints
- Every INSERT/UPDATE/SELECT enforces `tenant_id = current_setting('app.tenant_id')::UUID`
- Even if middleware bypassed, DB blocks
- `FORCE ROW LEVEL SECURITY` ensures even table owner respects RLS

## Key Audit Touchpoints
- `cath.activation.triggered` — STEMI page
- `cath.door_to_balloon` — D2B recorded
- `cath.stent_implanted` — SFDA UDI scanned
- `cath.procedure.completed` — MD signed
- `cath.consent_signed` — patient + witness
- `cath.llm.assisted` — LLM call

---
*Section 33 of CARD-002. SA voice. L1 DRAFT.*
"@

# 34. 07_erd_diagram.md
WF "$root\CARD-002\07_erd_diagram.md" @"
$banner
# CARD-002 — ERD (Mermaid)

```mermaid
erDiagram
    tenants ||--o{ cardiac_cath_procedures : has
    tenants ||--o{ pci_records : has
    tenants ||--o{ stent_registry : has
    tenants ||--o{ structural_heart_mdt : has
    tenants ||--o{ tavr_workup : has
    tenants ||--o{ cath_lab_scheduling : has
    tenants ||--o{ contrast_tracking : has
    tenants ||--o{ radiation_dose_log : has
    tenants ||--o{ cath_lab_equipment : has
    tenants ||--o{ cath_lab_red_flags : has
    tenants ||--o{ cath_audit_log : has
    tenants ||--o{ cath_consent : has

    cardiac_cath_procedures ||--o{ pci_records : produces
    cardiac_cath_procedures ||--o{ stent_registry : uses
    cardiac_cath_procedures ||--o{ radiation_dose_log : logs
    cardiac_cath_procedures ||--o{ cath_lab_red_flags : has
    cardiac_cath_procedures ||--o{ cath_consent : has
    cardiac_cath_procedures ||--o{ contrast_tracking : tracks

    structural_heart_mdt ||--o{ tavr_workup : refers

    cardiac_cath_procedures {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        bigint encounter_id
        varchar procedure_type
        text indication
        varchar urgency
        varchar access_route
        smallint sheath_size_fr
        timestamptz door_time
        timestamptz balloon_time
        int d2b_minutes
        boolean d2b_compliant
        bigint operator_user_id
        varchar status
        bytea findings_encrypted
        jsonb complications
        jsonb cpt_codes
        timestamptz created_at
        timestamptz soft_deleted_at
    }

    pci_records {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        smallint lesion_count
        jsonb lesions
        int syntax_score
        int grace_score
        smallint timi_score
        smallint pre_timi_flow
        smallint post_timi_flow
        numeric residual_stenosis_pct
        jsonb devices
        bigint operator_cosign_user_id
    }

    stent_registry {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint patient_id
        varchar udi
        varchar manufacturer
        varchar model
        numeric size_diameter_mm
        smallint length_mm
        varchar batch_lot
        date expiration_date
        varchar vessel
        timestamptz sfda_reported_at
        timestamptz implanted_at
    }

    structural_heart_mdt {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid referral_id
        timestamptz mdt_date
        varchar indication
        jsonb members_present
        numeric sts_score
        text recommendation
        varchar status
    }

    tavr_workup {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid mdt_id FK
        numeric ct_annular_area_mm2
        varchar access_route_planned
        varchar valve_size_predicted
        jsonb frailty_assessment
    }

    contrast_tracking {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid procedure_id FK
        int contrast_volume_ml
        numeric baseline_egfr
        numeric post_egfr_48h
        boolean cin_event
    }

    radiation_dose_log {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint staff_id
        varchar role
        numeric role_dose_mgy
        numeric role_dap_gy_cm2
        numeric cumulative_ytd_mgy
    }

    cath_lab_red_flags {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        varchar flag_type
        timestamptz detected_at
        int response_time_seconds
    }

    cath_audit_log {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint user_id
        varchar action
        varchar input_hash
        varchar output_hash
        varchar prev_hash
    }

    cath_consent {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid procedure_id FK
        varchar consent_type
        text consent_text_ar
        text consent_text_en
        timestamptz signed_at
        bigint signed_by
        bigint witness_id
    }
```

---
*Section 34 of CARD-002. SA voice. L1 DRAFT.*
"@

# 35. 08_architecture_decision_record.md
WF "$root\CARD-002\08_architecture_decision_record.md" @"
$banner
# CARD-002 — Architecture Decision Records (5 ADRs)

## ADR-001: Cath Lab Stack (Node.js + Express + PostgreSQL + Vanilla JS)

**Status:** Accepted
**Context:** Align with existing `namaweb/` stack (per `AGENTS.md` §2 + `DECISIONS_PENDING.md` Option A).
**Decision:** Use Node.js 22 + Express 4 + PostgreSQL 16 + vanilla JS (no React, no TypeScript) for the cath lab module.
**Consequences:**
- ✅ Reuse existing middleware (auth, tenant scope, RBAC, validation, idempotency, audit)
- ✅ Reuse existing 150 RLS-forced tables + add 12 new
- ✅ Reuse existing 13 safety rails
- ❌ No advanced AI libraries (limited to LangChain via shim)
- ❌ Larger bundle (1.7 MB) but acceptable for hospital intranet

## ADR-002: Multi-Tenancy via RLS (NOT DB-per-Tenant)

**Status:** Accepted
**Context:** Multi-tenant SaaS for 16 facility types.
**Decision:** Single PostgreSQL database with `tenant_id` on every table + `FORCE ROW LEVEL SECURITY`. App layer sets `current_setting('app.tenant_id')` per request.
**Consequences:**
- ✅ Easy backup, migration, upgrade (one DB)
- ✅ Defense-in-depth (middleware + DB RLS)
- ✅ FORCE_RLS prevents table owner from bypassing
- ❌ Connection pool size (mitigated by AsyncLocalStorage per `tenant_context_pg_session.js`)
- ❌ Migrations must be backward-compatible

## ADR-003: Idempotency on Money Routes Only (GATE7)

**Status:** Accepted
**Context:** AGENTS.md §2.2 #6 — money routes idempotent + opt-in + fail-open.
**Decision:** Apply `idempotencyGuard` ONLY to 4 money/SFDA routes:
- POST `/procedures` (billing)
- POST `/stent-registry` (SFDA + billing)
- POST `/consent/sign` (NPHIES pre-auth)
- POST `/door-to-balloon-timer` (audit + KPI)
NOT to clinical reads.
**Consequences:**
- ✅ Money routes protected from double-charge
- ✅ Clinical reads fast (no Redis cache check)
- ❌ Manual `Idempotency-Key` header required for 4 routes

## ADR-004: LLM = Decision Support, NOT Authority (CMO Veto)

**Status:** Accepted
**Context:** Patient safety > AI convenience. AGENTS.md §2.2 #13 (Golden Access Rule).
**Decision:** LLM provides DRAFT for: cath report, MDT summary, DAPT recommendation, patient education. MD must review+sign. LLM NEVER autonomously:
- Signs consent
- Selects stent size
- Approves DAPT duration
- Completes procedure
- Activates STEMI without ECG confirm
**Consequences:**
- ✅ Patient safety: MD in the loop
- ✅ LLM failure → fall back to rule-based engine
- ❌ Slower than auto-approval (acceptable tradeoff)

## ADR-005: Observability via LangSmith + Helicone + OpenTelemetry

**Status:** Accepted
**Context:** MASTER_PROMPT_v3.md + AI_OBSERVABILITY.yaml.
**Decision:** All LLM calls traced to LangSmith; cost+latency tracked via Helicone; distributed tracing via OpenTelemetry; custom clinical metrics (D2B compliance, MD override rate).
**Consequences:**
- ✅ Hallucination detection via weekly sample review
- ✅ Drift monitoring (data + model + concept)
- ✅ Per-call audit (input/output hash, never raw PHI)
- ❌ PII redaction overhead (necessary for HIPAA/PDPL)

---
*Section 35 of CARD-002. SA voice. L1 DRAFT.*
"@

Write-Host "✅ CARD-002 PART 2 DONE: 28 more files written (total CARD-002: 35/35)"
Write-Host "Total files written this run: $count"
