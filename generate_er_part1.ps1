# ER-002 Part 1 — Trauma Center Level I — الملفات 1-15
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0
function WF($p,$c){$d=Split-Path $p -Parent;if(-not(Test-Path $d)){New-Item -ItemType Directory -Force -Path $d|Out-Null};[System.IO.File]::WriteAllText($p,$c,$UTF8);$script:count++}

# 1. README
WF "$root\ER-002\README.md" @"
$banner
---
module_id: ER-002
name: "Trauma Center Level I"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
catalog_ref: ".ai-brain/01_DATA/CATALOG.yaml"
context_brief_ref: "CONTEXT_BRIEFS.md#section-3"
---

# Trauma Center Level I — ER-002

## Mission
Comprehensive regional trauma center: 24/7 in-house trauma surgery attending, all surgical subspecialties on-call, MTP, ATLS-driven activations, trauma registry (NTDB/TQIP), PI program, outreach, prevention, ACS-COT Level I verification.

## Scope
- ATLS primary/secondary survey
- Tier 1/2/3 activation
- Massive transfusion protocol (1:1:1)
- Damage control surgery (laparotomy, ortho)
- TBI management (ICP monitor, craniotomy)
- REBOA, fasciotomy, vascular shunting
- Inter-facility transfer
- Trauma registry (NTDB-compliant)
- Performance improvement (PI) program
- Outreach + prevention
- 14 new tables, 22 endpoints, 7 LangChain chains

## Top 10 Conditions
Polytrauma (T07) · Severe TBI (S06) · Penetrating (S31/S21/S11) · Blunt abd (S36) · Thoracic (S27) · Pelvic (S32) · Long-bone (S72/S82) · SCI (S14/S24) · Burns (T30/T31) · Pediatric trauma

## Top 20 Procedures
ATLS survey · Definitive airway · Needle decompression · Chest tube · Resuscitative thoracotomy · ED thoracotomy · FAST · DPL · REBOA · MTP · Damage control lap · Ex-fix · ICP monitor · Craniotomy · Fasciotomy · Vascular shunt · Amputation · Splinting · Transfer

## 12 Red Flags
Hemorrhagic shock III/IV · Tension PTX · Tamponade · Massive hemothorax · Flail chest · Open-book pelvis · GCS ≤8 · Penetrating · Mangled extremity · Crush · Compartment syndrome · Penetrating cardiac

## 3 Tiers
- Tier 1: penetrating torso / GCS ≤8 / SBP<90 / HR>120 / intubated / pulseless ext / fall >20ft / ejection
- Tier 2: fall >10ft / MVC >30mph / ped struck / age>65 + Tier 1 mechanism
- Tier 3: low-energy / isolated fracture / stable

## Database (14 tables, RLS-forced)
trauma_activations · primary_survey · secondary_survey · injuries_ais · iss_score · mtp_activations · operative_log · transfers_in/out · registry_export · pi_cases · outreach_events · research_projects · prevention_programs

## 7 LangChain Chains
issCalculator · trissPs · activationTierClassifier · mtpTriggerCheck · tbiSeverityScore · hemorrhageControlPathway · transferDecisionAdvisor

## ACS-COT Level I Standards
- 24/7 in-house trauma surgeon
- OR within 15 min
- All subspecialties on-call
- ≥1200 trauma admissions/yr with ≥240 ISS>15
- PI nurse + MD
- Research, outreach, prevention
- Re-verification every 3y

## Compliance
- JCI: COP, QPS, MMU (TXA/blood), FMS, SQE
- ACS-COT Level I
- CBAHI: trauma center designation
- NPHIES: polytrauma DRG
- ZATCA: procedure billing
- PDPL: 10y registry, 20y peds, lifelong blood
- HIPAA: 164.312
- NTDB/TQIP: registry participation

## Sign-off
CMO/AIE/SA/DSL/PM/CQO/ORC: L1 DRAFT complete.
"@

# 2. 00_synthesis
WF "$root\ER-002\00_synthesis.md" @"
$banner
# ER-002 — 7-Expert Panel Synthesis

## CMO
**Inputs:** 10 conditions, 20 procedures, 12 red flags, 3 tiers, MTP 1:1:1, ACS-COT Level I standards, time targets.
**Key decisions:** ATLS-driven; 24/7 in-house trauma surgeon; MTP <10 min trigger→infusion; tier 1 full team 15 min; massive transfusion 1:1:1 (PROPPR); TXA within 3h; tranexamic acid + e-aminocaproic acid; damage control surgery; craniectomy <4h TBI.
**Veto:** Patient leaves without being seen; MTP not triggered on shock; activation tier 1 missed; transfer without workup; PI case not opened on deviation.

## AIE
**Inputs:** 7 LangChain chains (ISS, TRISS, tier classifier, MTP trigger, TBI severity, hemorrhage control, transfer advisor); RAG over ATLS/ACS-COT/EAST/BTF; LLM gateway.
**Key decisions:** MedEmbed primary; gpt-4o + claude-3.5; auto-fallback to rule-based `trauma_center_engine.js`; PII redaction; MD-in-loop for AIS>3.
**Critical:** STEMI in trauma → cross-team activation; p99 LLM <1.5s; BRAVO rule (Be Rigorous And Verify Outcome).

## SA
**Inputs:** 14 new tables; 22 new endpoints; RLS; pure JS engine (extends existing `trauma_score_engine.js`).
**Key decisions:** Single DB, multi-tenant; pure JS engine; AsyncLocalStorage; hash-chained audit; real-time integration with blood bank, OR, CT, EMS.
**Performance:** p99 <500ms read; MTP trigger p99 <1s; DICOM first tile <3s.

## DSL
**Inputs:** PHI encryption; tenant isolation; idempotency on MTP; hash-chained audit.
**Key decisions:** Rate limit 200/min; CSP report-only; **High-alert blood gate** (2-RN bedside check); MTP traceability (per CBAHI).
**Compliance:** 13 rails + 4 dept-specific.

## PM
**Inputs:** 7 personas; Stitch 3-column trauma station (dark mode, high contrast); mobile + wall-mounted 4K.
**Key decisions:** Center = ATLS stepper + MTP; Right = GCS trend + lactate + consultants; DICOM dual-monitor.

## CQO
**Inputs:** JCI/ACS-COT/CBAHI/NPHIES/ZATCA/PDPL/HIPAA.
**Key decisions:** All 8 audit categories; 10 consent types; blood traceability; NTDB export; monthly PI review.
**Audit events:** activation.triggered, mtp.activated, mtp.terminated, transfusion.completed, or.available, transfer.out, pi.case.opened, pi.loop.closed.

## ORC
**Synthesis:** Multi-tenant RLS; pure JS engine; ACS-COT Level I; MTP safety floor; LLM decision support; 6 L4 gates.

---
*L1 DRAFT complete.*
"@

# 3. clinical workflows
WF "$root\ER-002\01_clinical_workflows.md" @"
$banner
# ER-002 Clinical Workflows (CMO)

## 1. Trauma Activation (Tier 1)

**Trigger (any):** penetrating torso / GCS ≤8 / SBP<90 / HR>120 / intubated / pulseless extremity / amputation proximal / fall >20ft / ejection / death same-car occupant / motorcycle >30mph.

**Actions (within 15 min):**
1. Page: trauma surgery attending (in-house 24/7) + senior resident + ED MD + anesthesia + OR charge + blood bank + RT + radiology + chaplain
2. Trauma bay ready (resus bay 1)
3. Lab + type & screen
4. ATLS primary survey: A/B/C/D/E with timers
5. FAST (within 5 min)
6. CXR, pelvic X-ray
7. MTP trigger check (ABC score)

## 2. ATLS Primary Survey (within 10 min)

**A — Airway + C-spine:**
- Patent? Intubate if GCS ≤8
- C-spine immobilization (collar)

**B — Breathing:**
- Inspection, palpation, percussion, auscultation
- Tension PTX → needle decompression 2nd ICS midclavicular
- Open PTX → 3-sided occlusive dressing
- Flail chest → analgesia + tube thoracostomy

**C — Circulation + Hemorrhage control:**
- 2 large-bore IVs
- Pelvic binder if unstable + pelvic fracture
- Direct pressure on external bleeding
- Tourniquet for mangled extremity
- MTP trigger check (HR+SBP+FAST)

**D — Disability:**
- GCS, pupils, lateralizing signs
- Glucose check

**E — Exposure:**
- Full exam, log roll
- Warming measures (hypothermia prevention)

## 3. Massive Transfusion Protocol (1:1:1, PROPPR 2015)

**Cooler #1 (initial):**
- PRBC 6 units
- FFP 6 units
- Platelets 1 apheresis pack
- Cryoprecipitate 10 units
- TXA 1g IV bolus within 3h, then 1g over 8h
- Calcium gluconate 1g per 4 PRBC

**Reorder:** after cooler #1 if hemodynamically unstable.
**Terminate:** hemodynamically stable + lactate <2.5 + no active bleeding.

**Blood traceability:** every unit labeled at bedside, 2-RN check (per CBAHI).

## 4. Damage Control Surgery

**Decision:** unstable + surgical source of bleeding → OR within 15 min.

**Strategy:**
- Control hemorrhage (packing, shunting)
- Control contamination (no reanastomosis)
- Temporary closure
- ICU for resuscitation
- Re-explore 24-48h

**Damage control lap:** <60 min from arrival if unstable+peritonitis.
**Damage control ortho:** external fixation within 24h for long-bone + TBI.

## 5. TBI Management

**Severe TBI (GCS ≤8):**
1. Intubate (within 10 min)
2. CT head (within 25 min of door)
3. ICP monitor (parenchymal) within 6h
4. Maintain CPP 60-70 mmHg
5. Decompressive craniectomy if refractory ICP (within 4h of herniation)

**BTF 2016 thresholds:** SBP <90 → avoid; hypoxia (PaO2 <60) → avoid; hyperventilation (PaCO2 <35) → avoid except herniation.

## 6. Hemorrhage Control Pathway

| Source | Pathway |
|--------|---------|
| Intra-abdominal (liver, spleen) | Damage control lap + angioembolization |
| Pelvic | Binder + MTP + angioembolization (or preperitoneal packing) |
| Extremity (vascular) | Shunting + definitive repair |
| Mangled extremity (MESS ≥7) | Tourniquet → amputation |
| Junctional (groin, axilla, neck) | REBOA / surgical |

## 7. Inter-facility Transfer (to higher level)

**Trigger:** pediatric, burn, spinal cord, complex neuro.
**Activation:** within 60 min of decision.
**Mode:** helicopter if >50 miles, ground if closer.
**Records:** DICOM + clinical summary + AIS table + SBAR.

## 8. Disposition
- ICU (hemodynamic instability, TBI, MTP, post-op)
- OR (definitive procedure)
- Floor (stable, minor injuries)
- Home (discharge with follow-up)
- Morgue (deceased)

## 9. PI Program

**Triggers (deviations):**
- Door-to-OR >15 min for unstable
- MTP trigger to first unit >10 min
- Wrong-site surgery
- Equipment failure with harm
- Unplanned return to OR
- Death in ED
- Transfer complication
- Sentinel event

**Loop closure:** action items + responsible + deadline + verification.

## 10. Documentation
**Trauma surgeon:** activation criteria, primary/secondary survey, AIS coding, ISS, plan.
**RN:** time-stamped events, vitals, medications, blood units, MTP status, intake/output.
**Coordinator:** PI case log, registry data, outreach events.

## 11. Quality Metrics (CQO)
- Door-to-trauma-team <15 min
- Door-to-OR <15 min (unstable)
- Door-to-CT <30 min (stable)
- MTP trigger to first unit <10 min
- Door-to-decompressive craniectomy <4h (TBI)
- Time-to-transfer decision <60 min
- Mortality (overall, ISS>15, TBI)
- ISS>15 volume (≥240/yr for Level I)
- Outreach visits (≥2/yr)
- Prevention programs (≥2/yr)

## 12. Disaster & MCI
- START triage (or SALT)
- Multiple activations
- Pre-hospital + hospital coordination
- Blood bank surge
- OR capacity expansion
- Mutual aid

---
*Section 03 of ER-002. CMO voice. L1 DRAFT.*
"@

# 4. dbml
WF "$root\ER-002\01_dbml_schema.md" @"
$banner
# ER-002 DBML Schema (14 tables)

## 1. trauma_activations
- id, tenant_id, encounter_id
- activation_tier (1|2|3)
- activated_at, activated_by
- mechanism, criteria_met JSONB
- team_notified JSONB
- status

## 2. trauma_primary_survey
- id, tenant_id, encounter_id
- survey_type (ATLS_PRIMARY|ATLS_SECONDARY)
- airway, breathing, circulation, disability, exposure
- gcs_eye, gcs_verbal, gcs_motor, gcs_total
- recorded_at, recorded_by

## 3. trauma_secondary_survey
- id, tenant_id, encounter_id
- head_to_toe_findings
- past_medical_history
- allergies, medications, last_meal
- events_leading
- recorded_at

## 4. trauma_injuries_ais
- id, tenant_id, encounter_id
- body_region, ais_severity, ais_descriptor
- injury_description_encrypted (PHI)
- laterality, penetrating
- coding_by, coding_reviewed_by (MD-cosign if AIS>3)

## 5. trauma_iss_score
- id, tenant_id, encounter_id
- iss_total, max_ais, three_highest_ais JSONB
- mortality_band
- calculated_at, calculated_by
- formula_version

## 6. trauma_mtp_activations
- id, tenant_id, encounter_id
- activated_at, activated_by
- trigger_reason, abc_score
- lab_values JSONB
- units_ordered JSONB, units_transfused JSONB
- ratio_1to1to1_compliance
- terminated_at, terminated_by, termination_reason
- total_prbc, total_ffp, total_platelets, total_cryo

## 7. trauma_operative_log
- id, tenant_id, encounter_id
- procedure_time, procedure_name
- surgeon_id, anesthesia_id
- asa_class, approach
- estimated_blood_loss
- complications
- operative_time_min

## 8. trauma_transfers_in
- id, tenant_id, encounter_id
- sending_facility, sending_provider
- transfer_mode, transfer_time
- referring_diagnosis_encrypted (PHI)
- records_received

## 9. trauma_transfers_out
- id, tenant_id, encounter_id
- receiving_facility, receiving_provider
- transfer_mode, decision_time, departure_time
- capability_gap
- clinical_summary_encrypted (PHI)
- image_count_sent

## 10. trauma_registry_export
- id, tenant_id, export_batch_id
- ntdb_compliant
- exported_at, exported_by
- record_count, sha256_hash

## 11. trauma_pi_cases
- id, tenant_id, encounter_id
- opened_at, opened_by
- deviation_type, contributing_factors JSONB
- action_items JSONB
- loop_closed_at, loop_closed_by
- fmea_link, sentinel_event

## 12. trauma_outreach_events
- id, tenant_id, event_date
- event_type, audience
- participants_count, materials_distributed
- cost_sar, organizer

## 13. trauma_research_projects
- id, tenant_id, project_title, pi_name
- irb_number, status
- enrollment_target, current_enrollment
- publications, start_date, end_date

## 14. trauma_prevention_programs
- id, tenant_id, program_name
- target_population, delivery_mode
- reach_count, period_start, period_end
- kpis JSONB

## RLS: all 14 with FORCE ROW LEVEL SECURITY
"@

# 5. JCI
WF "$root\ER-002\01_jci_checklist.md" @"
$banner
# ER-002 — JCI + ACS-COT Checklist

## COP
- [ ] ATLS primary/secondary survey
- [ ] Tier 1/2/3 activation criteria
- [ ] Time-out for all procedures
- [ ] MTP 1:1:1 protocol

## QPS (Trauma PI)
- [ ] Door-to-trauma-team <15 min
- [ ] Door-to-OR <15 min (unstable)
- [ ] MTP trigger to first unit <10 min
- [ ] ISS>15 mortality
- [ ] Loop closure on all PI cases

## MMU
- [ ] **High-alert TXA gate** (within 3h)
- [ ] **High-alert blood gate** (2-RN bedside check)
- [ ] Vasopressor 2-RN verify
- [ ] Calcium per 4 PRBC

## FMS
- [ ] OR within 15 min
- [ ] Hybrid OR
- [ ] CT scanner 24/7
- [ ] Blood bank surge capacity

## SQE
- [ ] ATLS certification (all trauma surgeons)
- [ ] 24/7 in-house PGY-4+ trauma attending
- [ ] Subspecialty coverage (ortho 30, neuro 30, CT 30, IR 60, hand 60, vascular 30, OMFS 60)
- [ ] MTP competency

## ACS-COT Level I
- [ ] 24/7 in-house trauma surgeon
- [ ] OR availability <15 min
- [ ] ≥1200 trauma admissions/yr with ≥240 ISS>15
- [ ] ≥1 FTE PI nurse + 0.5 FTE PI MD
- [ ] ≥20 peer-reviewed publications/3y
- [ ] ≥2 outreach visits/yr
- [ ] ≥2 prevention programs/yr
- [ ] NTDB/TQIP participation
- [ ] Re-verification every 3y

## Total
38 checks across JCI + ACS-COT.

---
*Section 05 of ER-002. L1 DRAFT.*
"@

# 6. migration
WF "$root\ER-002\01_migration_up.sql" @"
$banner
-- ER-002 Migration UP — 14 tables
BEGIN;

-- 1. trauma_activations
CREATE TABLE trauma_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  activation_tier SMALLINT NOT NULL,
  activated_at TIMESTAMPTZ,
  activated_by BIGINT,
  mechanism TEXT,
  criteria_met JSONB,
  team_notified JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_activations FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_activations_tenant ON trauma_activations USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 2-14 similar (abbreviated for brevity; see CONTEXT_BRIEFS §3.4 for full DDL)

CREATE TABLE trauma_primary_survey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  survey_type VARCHAR(20),
  airway VARCHAR(50), breathing VARCHAR(50), circulation VARCHAR(50),
  disability VARCHAR(50), exposure VARCHAR(50),
  gcs_eye SMALLINT, gcs_verbal SMALLINT, gcs_motor SMALLINT, gcs_total SMALLINT,
  recorded_at TIMESTAMPTZ, recorded_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_primary_survey ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_primary_survey FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_primary_survey_tenant ON trauma_primary_survey USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_secondary_survey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  head_to_toe_findings TEXT,
  past_medical_history TEXT, allergies TEXT, medications TEXT, last_meal TIMESTAMPTZ,
  events_leading TEXT,
  recorded_at TIMESTAMPTZ, recorded_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_secondary_survey ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_secondary_survey FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_secondary_survey_tenant ON trauma_secondary_survey USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_injuries_ais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  body_region VARCHAR(30), ais_severity SMALLINT, ais_descriptor VARCHAR(20),
  injury_description_encrypted BYTEA,
  laterality VARCHAR(10), penetrating BOOLEAN,
  coding_by BIGINT, coding_reviewed_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_injuries_ais ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_injuries_ais FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_injuries_ais_tenant ON trauma_injuries_ais USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_iss_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  iss_total SMALLINT, max_ais SMALLINT, three_highest_ais JSONB,
  mortality_band VARCHAR(20),
  calculated_at TIMESTAMPTZ, calculated_by BIGINT, formula_version VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_iss_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_iss_score FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_iss_score_tenant ON trauma_iss_score USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_mtp_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  activated_at TIMESTAMPTZ, activated_by BIGINT,
  trigger_reason TEXT, abc_score SMALLINT,
  lab_values JSONB, units_ordered JSONB, units_transfused JSONB,
  ratio_1to1to1_compliance BOOLEAN,
  terminated_at TIMESTAMPTZ, terminated_by BIGINT, termination_reason TEXT,
  total_prbc INT, total_ffp INT, total_platelets INT, total_cryo INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_mtp_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_mtp_activations FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_mtp_activations_tenant ON trauma_mtp_activations USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_operative_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  procedure_time TIMESTAMPTZ, procedure_name VARCHAR(200),
  surgeon_id BIGINT, anesthesia_id BIGINT,
  asa_class SMALLINT, approach VARCHAR(50),
  estimated_blood_loss INT, complications TEXT,
  operative_time_min INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_operative_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_operative_log FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_operative_log_tenant ON trauma_operative_log USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_transfers_in (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  sending_facility VARCHAR(200), sending_provider VARCHAR(200),
  transfer_mode VARCHAR(20), transfer_time TIMESTAMPTZ,
  referring_diagnosis_encrypted BYTEA, records_received BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_transfers_in ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_transfers_in FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_transfers_in_tenant ON trauma_transfers_in USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_transfers_out (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  receiving_facility VARCHAR(200), receiving_provider VARCHAR(200),
  transfer_mode VARCHAR(20),
  decision_time TIMESTAMPTZ, departure_time TIMESTAMPTZ,
  capability_gap VARCHAR(200),
  clinical_summary_encrypted BYTEA, image_count_sent INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_transfers_out ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_transfers_out FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_transfers_out_tenant ON trauma_transfers_out USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_registry_export (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  export_batch_id UUID,
  ntdb_compliant BOOLEAN,
  exported_at TIMESTAMPTZ, exported_by BIGINT,
  record_count INT, sha256_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_registry_export ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_registry_export FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_registry_export_tenant ON trauma_registry_export USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_pi_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  opened_at TIMESTAMPTZ, opened_by BIGINT,
  deviation_type VARCHAR(100), contributing_factors JSONB, action_items JSONB,
  loop_closed_at TIMESTAMPTZ, loop_closed_by BIGINT,
  fmea_link VARCHAR(200), sentinel_event BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_pi_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_pi_cases FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_pi_cases_tenant ON trauma_pi_cases USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_date TIMESTAMPTZ, event_type VARCHAR(50),
  audience VARCHAR(200), participants_count INT, materials_distributed INT,
  cost_sar NUMERIC(10,2), organizer VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_outreach_events FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_outreach_events_tenant ON trauma_outreach_events USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  project_title VARCHAR(200), pi_name VARCHAR(200),
  irb_number VARCHAR(50), status VARCHAR(30),
  enrollment_target INT, current_enrollment INT,
  publications INT, start_date DATE, end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_research_projects FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_research_projects_tenant ON trauma_research_projects USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_prevention_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  program_name VARCHAR(200), target_population VARCHAR(200), delivery_mode VARCHAR(50),
  reach_count INT, period_start DATE, period_end DATE, kpis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_prevention_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_prevention_programs FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_prevention_programs_tenant ON trauma_prevention_programs USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;
"@

# 7. RAG
WF "$root\ER-002\01_rag_chains.md" @"
$banner
# ER-002 — 7 LangChain Chains

## 1. issCalculator
**Input:** injuries: [{region, ais, descriptor}]
**Output:** {iss_total, max_ais, mortality_band}
**Tools:** parseInjuries, dedupByRegion, squareTop3
**Critical:** YES (drives mortality prediction)

## 2. trissPs
**Input:** {age, iss, rts}
**Output:** {ps_pct, lower_95_ci, band}
**Tools:** trissCoefficients, logit, sigmoid
**Critical:** YES

## 3. activationTierClassifier
**Input:** {mechanism, sbp, hr, rr, gcs, penetrating, fall, ejection, mvcSpeed, intubation, bloodLoss, paralysis}
**Output:** {tier: 1|2|3, team_set, eta_set, criteria_met}
**Tools:** mechanismClassifier, vitalsCheck, anatomyCheck
**Critical:** YES (drives team activation)

## 4. mtpTriggerCheck
**Input:** {sbp, hr, lactate, fast, suspected_hemorrhage, mechanism}
**Output:** {trigger, score, ratio_recommendation}
**Tools:** abcScore, clinicalOverride, ratioCompute
**Critical:** YES (HARD RULE: trigger = 1:1:1; override = MD only)

## 5. tbiSeverityScore
**Input:** {gcs, ct_marshall, pupillary, hypoxia, hypotension}
**Output:** {severity, prognosis_band, icp_monitor_indicated}
**Tools:** gcsParse, ctMarshall, pupillaryCheck, btfClassify
**Critical:** YES

## 6. hemorrhageControlPathway
**Input:** {bleed_source, hemodynamics}
**Output:** {pathway: damage_control_surg|angioembolization|pelvic_packing|tourniquet, sequence[]}
**Critical:** YES

## 7. transferDecisionAdvisor
**Input:** {capability_gap, stability, receiving_facility}
**Output:** {decision, time_to_transfer, mode, contraindications}
**Critical:** YES

## Implementation
LangGraph supervisor; 6-stage RAG; MedEmbed 768d primary; gpt-4o + claude-3.5 secondary; med-llama offline fallback; auto-fallback to rule-based `trauma_center_engine.js`.

**BRAVO rule:** Be Rigorous And Verify Outcome — if AI recommends deviation, must name alternative guideline + MD sign-off.

---
*Section 07 of ER-002. AIE voice. L1 DRAFT.*
"@

# 8. stitch
WF "$root\ER-002\01_stitch_layout.md" @"
$banner
# ER-002 — Stitch 3-Column Trauma Station (Dark Mode, High Contrast)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky) + Tier 1 BANNER (red, pulsing) + Timers         │
│      Door→Trauma Team: 8 min ● Door→OR: 14 min (target <15)                  │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (ATLS A/B/C/D/E Stepper + Timers)            │                │
│ Patient    │  ┌──────────────────────────────────────────┐  │ Vitals         │
│ ─────      │  │ A: Airway + C-spine ✓                    │  │ ─────          │
│ Age 28 M   │  │ B: Breathing ✓                            │  │ HR 130         │
│ MVC        │  │ C: Circulation ⚠ (MTP ACTIVE)            │  │ BP 78/40       │
│ ejection   │  │ D: Disability ✓ GCS 13                    │  │ SpO2 94%       │
│            │  │ E: Exposure ✓                             │  │ RR 28          │
│ Mechanism  │  ├──────────────────────────────────────────┤  │                │
│ ─────      │  │ Active Step: Resuscitation               │  │ GCS Trend      │
│ MVC eject. │  │ Lactate 5.2 (trending ↓)                 │  │ ─────          │
| Belted     │  │ FAST: + (peritoneal fluid)                │  │ 13 → 13 (stable)│
│ Driver     │  │ Plan: OR for damage control lap           │  │                │
│ Speed ~80  │  │ ETA: 12 min                                │  │ Labs           │
│ km/h       │  ├──────────────────────────────────────────┤  │ ─────          │
│            │  │ DICOM Viewer (FAST, CXR)                  │  │ Hb 9.8         │
│ Allergies  │  │ [Compare Prior]                           │  │ Hct 29         │
│ NKDA       │  └──────────────────────────────────────────┘  │ Lactate 5.2    │
│            │                                                  │ ↓ 7.2          │
│ PMH        │  AI Insight:                                    │                │
│ None       │  ""Patient is Tier 1, MTP active.              │ MTP Status     │
│            │   Recommend damage control lap (FAST+,          │ ─────          │
│ Score Calc │    lactate 5.2, SBP 78).                        │ Active: 23 min │
│ ─────      │   Evidence: ATLS 10e + PROPPR 2015.""          │ Cooler #2      │
│ ISS 28     │                                                  │ PRBC 6/6       │
│ (high)     │  [Log Event] [Order Product] [OR Booking]        │ FFP 6/6        │
│ TRISS Ps   │                                                  │ Plts 1/1       │
│ 0.78       │                                                  │ Cryo 10/10     │
│ ABC 4      │                                                  │ Ratio 1:1:1 ✓  │
│ MTP yes    │                                                  │                │
│            │                                                  │ Consultants    │
│ [Activate  │                                                  │ ─────          │
│ MTP]       │                                                  │ Ortho paged    │
│ [OR Book]  │                                                  │ (ETA 5 min)    │
│            │                                                  │                │
└────────────┴────────────────────────────────────────────────┴────────────────┘
```

Tokens: Primary #0066CC, danger #DC3545, critical #DC3545, success #28A745.
Dark mode, high contrast, WCAG 2.2 AA.

---
*Section 08 of ER-002. PM voice. L1 DRAFT.*
"@

# 9. unit tests
WF "$root\ER-002\01_unit_tests.md" @"
$banner
# ER-002 — Unit Tests (trauma_center_engine.js, extends existing)

```js
const t = require('./trauma_center_engine');
const assert = require('assert');

// 1. AIS severity
assert.strictEqual(t.aisSeverityScore('AIS2015_Head_Severe'), 4);

// 2. ISS
const iss = t.issCalculator([
  {region:'head', ais:4}, {region:'chest', ais:3}, {region:'abdomen', ais:3}
]);
assert.strictEqual(iss.iss, 9+9+9); // 27
assert.ok(iss.mortality_band === 'high');

// 3. TRISS
const triss = t.trissPs(28, 28, 6);
assert.ok(triss.ps_pct >= 0 && triss.ps_pct <= 100);

// 4. Activation tier
const tier = t.activationTierClassifier({penetratingTorso:true, sbp:80, hr:130, gcs:13});
assert.strictEqual(tier.tier, 1);

const tier2 = t.activationTierClassifier({fall:true, fallHeightFt:15, sbp:110, hr:90, gcs:14});
assert.strictEqual(tier2.tier, 2);

// 5. MTP trigger
const mtp = t.mtpTriggerCheck(80, 130, 5.2, true, true, 'MVC ejection');
assert.strictEqual(mtp.trigger, true);

const noMtp = t.mtpTriggerCheck(120, 90, 1.5, false, false, 'fall from standing');
assert.strictEqual(noMtp.trigger, false);

// 6. TBI severity
const tbi = t.tbiSeverityScore(7, 3, 'unreactive', false, true);
assert.strictEqual(tbi.severity, 'severe');
assert.strictEqual(tbi.icp_monitor_indicated, true);

// 7. GCS trend
const trend = t.gcsTrend(13, 13, 13);
assert.ok(trend.trend === 'stable');

// 8. Lactate clearance
const clear = t.lactateClearance(5.2, 3.0, 6);
assert.ok(clear.clearance_pct > 40); // good clearance

// 9. Hemorrhage control
const hc = t.hemorrhageControlChecklist('pelvic_fracture', {sbp:80, hr:130});
assert.strictEqual(hc.pathway, 'pelvic_packing');

// 10. Transfer
const tx = t.transferCriteriaCheck('pediatric_trauma', {stable:true}, 'King_Faisal_Specialist');
assert.strictEqual(tx.decision, 'transfer');
assert.ok(tx.mode === 'helicopter' || tx.mode === 'ground');
```

---
*Section 09 of ER-002. Tests. L1 DRAFT.*
"@

# 10. user manual
WF "$root\ER-002\01_user_manual.md" @"
$banner
# ER-002 User Manual (EN + AR)

## For Trauma Surgeons
1. Activation: receive page → report in <15 min (Tier 1) or <30 min (Tier 2)
2. Primary survey: A/B/C/D/E with timers
3. MTP trigger: ABC score ≥3 or shock + FAST+
4. Damage control vs definitive: based on physiology
5. AIS coding: MD-cosign if AIS >3
6. PI case: log any deviation

## For Trauma NPs/PAs
1. Primary survey (fast)
2. MTP activation
3. Order products
4. Document events with timestamps
5. OR booking
6. Transfer coordination

## For Trauma Coordinators
1. Registry data entry (NTDB-compliant)
2. PI case tracking
3. Outreach event planning
4. Research project coordination
5. Prevention program metrics

## For Blood Bank
1. MTP activation: prepare cooler #1 (PRBC 6, FFP 6, Plts 1, Cryo 10)
2. Reorder: after cooler #1
3. Terminate: per clinical signal
4. Traceability: every unit labeled at bedside, 2-RN check

## For QA Officers
- Door-to-trauma-team <15 min
- MTP trigger to first unit <10 min
- ISS>15 mortality
- NTDB export
- PI loop closure

---
*Section 10 of ER-002. L1 DRAFT.*
"@

# 11. integration tests
WF "$root\ER-002\02_integration_tests.md" @"
$banner
# ER-002 — Integration Tests (22 endpoints)

```js
describe('ER-002 API', () => {
  it('POST /activations requires Tier 1 criteria', async () => {
    const res = await request(app)
      .post('/api/trauma/activations')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ encounter_id: 1, activation_tier: 1, mechanism: 'penetrating torso' });
    expect(res.status).toBe(201);
  });

  it('POST /mtp/activate requires 2-RN verify', async () => {
    const res = await request(app)
      .post('/api/trauma/mtp/activate')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ encounter_id: 1, witness_id: null });
    expect(res.status).toBe(400);
  });

  it('POST /ais-coding MD-cosign required for AIS>3', async () => {
    const res = await request(app)
      .post('/api/trauma/ais-coding')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ encounter_id: 1, body_region: 'head', ais_severity: 5, coding_reviewed_by: null });
    expect(res.status).toBe(400);
  });

  it('POST /transfer-out requires capability_gap', async () => {
    const res = await request(app)
      .post('/api/trauma/transfer-out')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ encounter_id: 1, receiving_facility: 'KFSH' });
    expect(res.status).toBe(400);
  });

  it('GET /registry/export requires NTDB compliance', async () => {
    const res = await request(app)
      .get('/api/trauma/registry/export?year=2026&format=ntdb')
      .set('Authorization', `Bearer ${qaToken}`);
    expect(res.body.ntdb_compliant).toBe(true);
  });

  it('Cross-tenant isolation', async () => {
    const res = await request(app)
      .get('/api/trauma/activations')
      .set('Authorization', `Bearer ${mdToken}`)
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403);
  });
});
```

---
*Section 11 of ER-002. L1 DRAFT.*
"@

# 12. ISO
WF "$root\ER-002\02_iso_9001_checklist.md" @"
$banner
# ER-002 — ISO 9001:2015

Same as CARD-002 + trauma-specific:
- ACS-COT verification
- NTDB/TQIP participation
- Outreach + prevention
- Re-verification every 3y
- PI nurse + MD FTE

---
*Section 12 of ER-002. L1 DRAFT.*
"@

# 13. migration down
WF "$root\ER-002\02_migration_down.sql" @"
$banner
-- ER-002 Migration DOWN
BEGIN;
DROP TABLE IF EXISTS trauma_prevention_programs CASCADE;
DROP TABLE IF EXISTS trauma_research_projects CASCADE;
DROP TABLE IF EXISTS trauma_outreach_events CASCADE;
DROP TABLE IF EXISTS trauma_pi_cases CASCADE;
DROP TABLE IF EXISTS trauma_registry_export CASCADE;
DROP TABLE IF EXISTS trauma_transfers_out CASCADE;
DROP TABLE IF EXISTS trauma_transfers_in CASCADE;
DROP TABLE IF EXISTS trauma_operative_log CASCADE;
DROP TABLE IF EXISTS trauma_mtp_activations CASCADE;
DROP TABLE IF EXISTS trauma_iss_score CASCADE;
DROP TABLE IF EXISTS trauma_injuries_ais CASCADE;
DROP TABLE IF EXISTS trauma_secondary_survey CASCADE;
DROP TABLE IF EXISTS trauma_primary_survey CASCADE;
DROP TABLE IF EXISTS trauma_activations CASCADE;
COMMIT;
"@

# 14. openapi
WF "$root\ER-002\02_openapi_spec.md" @"
$banner
# ER-002 — OpenAPI 3.1 (22 endpoints)

## Base
URL: `https://api.jumanasoft.com/api/trauma`

## Endpoints
- GET /activations?status=active&tier=1
- POST /activations
- GET /activations/:id
- POST /primary-survey (fail-closed on partial)
- POST /secondary-survey
- POST /ais-coding (MD-cosign if AIS>3)
- GET /iss-score/:encounterId
- GET /triss/:encounterId
- POST /mtp/activate (idempotent, 2-RN verify)
- POST /mtp/:id/terminate
- POST /transfusion/log
- GET /blood-bank/status/:encounterId
- POST /operative-log
- POST /transfer-out (idempotent, capability_gap required)
- POST /transfer-in
- GET /registry/export?year=2026&format=ntdb
- POST /pi/case
- POST /pi/case/:id/close-loop
- GET /performance/dashboard
- GET /registry/stats
- POST /tbi/severity
- POST /hemorrhage/pathway

All: authenticate + requireTenantScope + requireRole('trauma_surgery'|'emergency_medicine') + validateBody + idempotencyGuard (where appropriate).

---
*Section 14 of ER-002. L1 DRAFT.*
"@

# 15. sub-dept
WF "$root\ER-002\02_sub_dept_catalog.md" @"
$banner
# ER-002 — Sub-Departments

| ID | Name | Description |
|----|------|-------------|
| ER-002-A | Trauma Bay 1 | Tier 1 resus bay |
| ER-002-B | Trauma Bay 2 | Tier 2/3 |
| ER-002-C | Resus Bay | Cardiac arrest, shock |
| ER-002-D | MTP Cooler Station | Blood bank satellite |
| ER-002-E | Hybrid OR | REBOA, IR |
| ER-002-F | IR Suite | Angioembolization |
| ER-002-G | Trauma ICU (TICU) | Post-op |
| ER-002-H | Burn Center (adjacent) | BURN-001 |
| ER-002-I | Control Room | Real-time monitoring, AI |

## Facility types
- medical_city, tertiary_hospital, specialized_hospital (trauma center)

---
*Section 15 of ER-002. L1 DRAFT.*
"@

Write-Host "✅ ER-002 Part 1 done: 15 files written"
