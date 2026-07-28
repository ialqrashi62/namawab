# AUTOPILOT POC Generator — جميع الملفات (105 ملف)
# يُشغّل مرة واحدة لكتابة 35 ملف × 3 أقسام
# تشغيل: pwsh -File generate_all_poc.ps1

$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8NoBom = [System.Text.UTF8Encoding]::new($false)
$fileCount = 0
$lineCount = 0

function Write-File($path, $content) {
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($path, $content, $UTF8NoBom)
    $script:fileCount++
    $script:lineCount += ($content -split "`n").Count
}

# =============================================================
# ============= CARD-002: 35 FILES =============================
# =============================================================

# --- File 1: README.md (already written via create_file, skip)
# --- File 2: 00_synthesis.md (already written, skip)
# --- File 3: 01_clinical_workflows.md (already written via ps1, skip)

# File 4: 01_dbml_schema.md
$content = @"
$banner
# CARD-002 DBML Schema (dbdiagram.io) — 12 tables

## Pattern
All tables: `tenant_id UUID NOT NULL`, RLS + FORCE RLS, `soft_deleted_at`, audit columns.
Reference: SNIPPETS.md#SNIP-02 for full RLS DDL.

## Tables

### 1. cardiac_cath_procedures (master encounter)
- id UUID PK
- tenant_id UUID FK→tenants.id
- patient_id, encounter_id
- procedure_type (PCI|TAVR|MitraClip|Watchman|diagnostic|endomyocardial_biopsy|other)
- indication, urgency (STEMI|urgent|elective|emergent)
- access_route (radial_r|radial_l|femoral_r|femoral_l|brachial)
- sheath_size_fr
- door_time, balloon_time
- d2b_minutes, d2b_compliant (≤90), d2b_exception_reason
- operator_user_id, assistant_user_id, scrub_tech_user_id, circulating_rn_user_id, anesthesiologist_user_id
- status (scheduled|in_progress|completed|cancelled|aborted)
- findings_encrypted bytea (PHI envelope per SNIP-03)
- complications jsonb
- cpt_codes jsonb
- nphies_claim_id
- created_at, updated_at, created_by_user_id, updated_by_user_id, soft_deleted_at
- Indexes: (tenant_id, patient_id), (tenant_id, status, door_time), (tenant_id, operator_user_id, door_time)

### 2. pci_records
- id UUID PK
- tenant_id UUID FK
- procedure_id UUID FK→cardiac_cath_procedures
- lesion_count, lesions jsonb
- syntax_score, syntax_score_band (low|intermediate|high)
- grace_score, timi_score
- pre_timi_flow, post_timi_flow
- residual_stenosis_pct
- devices jsonb
- final_pressure_atm
- dapt_score, bleeding_risk_score
- operator_cosign_user_id, assistant_cosign_user_id
- dapt_2md_cosign jsonb
- Index: (tenant_id, procedure_id)

### 3. stent_registry (SFDA-tracked, lifetime retention)
- id UUID PK
- tenant_id UUID FK
- procedure_id UUID FK
- pci_record_id UUID FK
- patient_id
- udi (SFDA UDI barcode)
- manufacturer, model
- size_diameter_mm, length_mm
- batch_lot, expiration_date
- vessel, segment
- deployment_pressure_atm, post_dilation
- sfda_reported_at, sfda_report_id
- implanted_at
- operator_user_id, assistant_user_id
- soft_deleted_at (lifetime retention)

### 4. structural_heart_mdt
- id UUID PK
- tenant_id UUID FK
- patient_id, referral_id
- mdt_date, indication
- members_present jsonb (≥5 specialists)
- sts_score, frailty_score, euroscore_ii
- recommendation
- recommendation_alternatives jsonb
- patient_consent_summary
- decided_by (all voting members cosign)
- status
- nphies_preauth_id

### 5. tavr_workup
- id UUID PK
- tenant_id UUID FK
- patient_id, mdt_id FK
- ct_annular_area_mm2, ct_annular_perimeter_mm
- valve_calcification_score
- access_route_planned (TF|TA|TC|TLa)
- valve_size_predicted, valve_type_planned
- coronary_height_mm, aortic_root_dims
- frailty_assessment
- dental_clearance, pulm_clearance
- completed_at

### 6. cath_lab_scheduling
- id UUID PK
- tenant_id UUID FK
- facility_id, room_id (CATH-LAB-1..N)
- scheduled_date, slot_start, slot_end
- procedure_type
- operator_user_id
- estimated_duration_min
- equipment_ids jsonb
- status, conflict_check

### 7. contrast_tracking (CIN risk)
- id UUID PK
- tenant_id UUID FK
- patient_id, procedure_id FK
- contrast_agent, contrast_volume_ml
- cumulative_30day_ml
- baseline_egfr, post_egfr_48h
- cin_event, hydration_protocol

### 8. radiation_dose_log (per-staff + per-procedure)
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- staff_id, role (operator|nurse|tech)
- role_dose_mgy, role_dap_gy_cm2
- lead_apron_used, thyroid_shield_used
- dosimeter_reading_monthly_mgy, cumulative_ytd_mgy

### 9. cath_lab_equipment
- id UUID PK
- tenant_id UUID FK
- facility_id
- equipment_type (fluoroscope|IVUS|OCT|Impella|IABP|rotational_atherectomy|FFR)
- manufacturer, model, serial
- install_date, last_pm_date, next_pm_date
- status (active|service|retired)
- sfda_registration

### 10. cath_lab_red_flags
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- flag_type (perforation|dissection|no_reflow|thrombosis|air_embolism|tamponade|anaphylaxis)
- detected_at, detected_by (monitor|ai|md)
- response_action, response_time_seconds
- resolved_at, audit_critical

### 11. cath_audit_log (hash-chained, 7+ years)
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- user_id, action
- input_hash, output_hash (SHA-256)
- prev_hash (hash chain)
- created_at

### 12. cath_consent
- id UUID PK
- tenant_id UUID FK
- patient_id, procedure_id FK
- consent_type (PCI|TAVR|MitraClip|Watchman|PFO|ASD|ablation|biopsy|research|ai_assisted_care)
- consent_text_ar, consent_text_en
- signed_at, signed_by, witness_id
- interpreter_used
- ai_assisted_care_consent bool
- withdrawal_at

## RLS Pattern (apply to all 12)
```sql
ALTER TABLE {t} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {t} FORCE ROW LEVEL SECURITY;
CREATE POLICY {t}_tenant ON {t} USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

---
*Section 04 of CARD-002. SA voice. L1 DRAFT.*
"@
Write-File "$root\CARD-002\01_dbml_schema.md" $content

# File 5: 01_jci_checklist.md
$content = @"
$banner
# CARD-002 — JCI 7th Ed Checklist

## ACC — Access to Care
- [ ] STEMI pathway with D2B ≤90 min
- [ ] Cath lab activation within 30 min
- [ ] 24/7 interventional cardiology coverage
- [ ] TAVR/MitraClip/Watchman via MDT (no individual override)
- [ ] Radial-first access (≥75% per SCAI 2021)

## COP — Care of Patients
- [ ] Pre-procedure H&P within 30 days
- [ ] Time-out (Joint Commission Universal Protocol)
- [ ] DAPT compliance assessment
- [ ] CIN surveillance (Cr 24h + 48h)
- [ ] Post-PCI telemetry 24h
- [ ] Discharge planning (DAPT education, cardiac rehab, follow-up)

## MMU — Medication Management & Use
- [ ] High-alert drug list (UFH, bivalirudin, enoxaparin, GP IIb/IIIa, P2Y12, warfarin, DOACs)
- [ ] 2-RN independent double-check + 5-rights + witness
- [ ] Pharmacy verification before administration
- [ ] Anticoagulant reversal agents stocked (protamine, andexanet, idarucizumab)
- [ ] TDM for tacrolimus (transplant co-management)

## QPS — Quality & Patient Safety
- [ ] D2B compliance KPI (≥90%)
- [ ] Cath lab activation time (median ≤30 min)
- [ ] Radial access rate (≥75%)
- [ ] CIN rate (target <5%)
- [ ] BARC 3-5 bleed rate
- [ ] Operator volume (SCAI min 50 PCIs/year)
- [ ] TAVR/MitraClip outcomes (mortality, stroke, vascular complications)
- [ ] Monthly radiation safety review

## MOI — Management of Information
- [ ] Hash-chained audit log (cath_audit_log)
- [ ] 23 audit events
- [ ] PHI encrypted (DPAPI KEK)
- [ ] FHIR R4 profiles
- [ ] Provenance: AI-assisted decisions marked

## PCI — Prevention & Control of Infection
- [ ] Chlorhexidine skin prep
- [ ] Prophylactic antibiotic (per formulary)
- [ ] Sterile technique for femoral access
- [ ] Hand hygiene compliance
- [ ] Bundle compliance audit

## SQE — Staff Qualifications & Education
- [ ] Interventional cardiology board certification
- [ ] ATLS/ACLS certification
- [ ] TAVR proctoring (first 5 cases)
- [ ] Annual radiation safety training
- [ ] Moderate sedation certification (cath lab RNs)
- [ ] Sheath removal competency

## FMS — Facility Management & Safety
- [ ] Hybrid OR certification
- [ ] Radiation safety (ALARA, dose limits)
- [ ] Lead aprons + thyroid shields
- [ ] Dosimeter monitoring (monthly)
- [ ] Emergency power for cath lab

## PFR — Patient & Family Rights
- [ ] Informed consent (10 types per `03_legal_consent_forms.md`)
- [ ] AI-assisted care consent (explicit)
- [ ] Interpreter access
- [ ] Family communication (TAVR MDT)
- [ ] Discharge education (DAPT, return precautions)

## Total
46 checks across 9 JCI chapters.

---
*Section 05 of CARD-002. CQO voice. L1 DRAFT.*
"@
Write-File "$root\CARD-002\01_jci_checklist.md" $content

# File 6: 01_migration_up.sql
$content = @"
$banner
-- CARD-002 Migration UP — 12 tables
-- Generated: 2026-07-24 (L1 DRAFT)
-- Reference: SNIPPETS.md#SNIP-02 for RLS pattern

BEGIN;

-- =============================================
-- 1. cardiac_cath_procedures
-- =============================================
CREATE TABLE cardiac_cath_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  encounter_id BIGINT,
  procedure_type VARCHAR(50) NOT NULL,
  indication TEXT,
  urgency VARCHAR(20) NOT NULL,
  access_route VARCHAR(20),
  sheath_size_fr SMALLINT,
  door_time TIMESTAMPTZ,
  balloon_time TIMESTAMPTZ,
  d2b_minutes INT,
  d2b_compliant BOOLEAN,
  d2b_exception_reason VARCHAR(100),
  operator_user_id BIGINT NOT NULL,
  assistant_user_id BIGINT,
  scrub_tech_user_id BIGINT,
  circulating_rn_user_id BIGINT,
  anesthesiologist_user_id BIGINT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  findings_encrypted BYTEA,
  complications JSONB,
  cpt_codes JSONB,
  nphies_claim_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cardiac_cath_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiac_cath_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY cardiac_cath_procedures_tenant ON cardiac_cath_procedures
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_cath_proc_tenant_patient ON cardiac_cath_procedures(tenant_id, patient_id) WHERE soft_deleted_at IS NULL;
CREATE INDEX idx_cath_proc_status_time ON cardiac_cath_procedures(tenant_id, status, door_time) WHERE soft_deleted_at IS NULL;
CREATE INDEX idx_cath_proc_operator ON cardiac_cath_procedures(tenant_id, operator_user_id, door_time) WHERE soft_deleted_at IS NULL;

-- =============================================
-- 2. pci_records
-- =============================================
CREATE TABLE pci_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID NOT NULL REFERENCES cardiac_cath_procedures(id),
  lesion_count SMALLINT,
  lesions JSONB,
  syntax_score INT,
  syntax_score_band VARCHAR(20),
  grace_score INT,
  timi_score SMALLINT,
  pre_timi_flow SMALLINT,
  post_timi_flow SMALLINT,
  residual_stenosis_pct NUMERIC(5,2),
  devices JSONB,
  final_pressure_atm NUMERIC(5,2),
  dapt_score SMALLINT,
  bleeding_risk_score NUMERIC(5,2),
  operator_cosign_user_id BIGINT,
  assistant_cosign_user_id BIGINT,
  dapt_2md_cosign JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE pci_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pci_records FORCE ROW LEVEL SECURITY;
CREATE POLICY pci_records_tenant ON pci_records
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_pci_tenant_proc ON pci_records(tenant_id, procedure_id) WHERE soft_deleted_at IS NULL;

-- =============================================
-- 3. stent_registry (SFDA, lifetime retention)
-- =============================================
CREATE TABLE stent_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID NOT NULL REFERENCES cardiac_cath_procedures(id),
  pci_record_id UUID REFERENCES pci_records(id),
  patient_id BIGINT NOT NULL,
  udi VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  size_diameter_mm NUMERIC(4,2),
  length_mm SMALLINT,
  batch_lot VARCHAR(50) NOT NULL,
  expiration_date DATE,
  vessel VARCHAR(20),
  segment VARCHAR(50),
  deployment_pressure_atm NUMERIC(5,2),
  post_dilation BOOLEAN,
  sfda_reported_at TIMESTAMPTZ,
  sfda_report_id VARCHAR(100),
  implanted_at TIMESTAMPTZ NOT NULL,
  operator_user_id BIGINT,
  assistant_user_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE stent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE stent_registry FORCE ROW LEVEL SECURITY;
CREATE POLICY stent_registry_tenant ON stent_registry
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_stent_tenant_patient ON stent_registry(tenant_id, patient_id);

-- =============================================
-- 4. structural_heart_mdt
-- =============================================
CREATE TABLE structural_heart_mdt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  referral_id UUID,
  mdt_date TIMESTAMPTZ,
  indication VARCHAR(50),
  members_present JSONB,
  sts_score NUMERIC(5,2),
  frailty_score NUMERIC(5,2),
  euroscore_ii NUMERIC(5,2),
  recommendation TEXT,
  recommendation_alternatives JSONB,
  patient_consent_summary TEXT,
  decided_by JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  nphies_preauth_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE structural_heart_mdt ENABLE ROW LEVEL SECURITY;
ALTER TABLE structural_heart_mdt FORCE ROW LEVEL SECURITY;
CREATE POLICY structural_heart_mdt_tenant ON structural_heart_mdt
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 5. tavr_workup
-- =============================================
CREATE TABLE tavr_workup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  mdt_id UUID REFERENCES structural_heart_mdt(id),
  ct_annular_area_mm2 NUMERIC(7,2),
  ct_annular_perimeter_mm NUMERIC(7,2),
  valve_calcification_score NUMERIC(5,2),
  access_route_planned VARCHAR(10),
  valve_size_predicted VARCHAR(20),
  valve_type_planned VARCHAR(50),
  coronary_height_mm NUMERIC(6,2),
  aortic_root_dims JSONB,
  frailty_assessment JSONB,
  dental_clearance BOOLEAN,
  pulm_clearance BOOLEAN,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE tavr_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavr_workup FORCE ROW LEVEL SECURITY;
CREATE POLICY tavr_workup_tenant ON tavr_workup
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 6. cath_lab_scheduling
-- =============================================
CREATE TABLE cath_lab_scheduling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  facility_id UUID,
  room_id VARCHAR(20),
  scheduled_date DATE,
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ,
  procedure_type VARCHAR(50),
  operator_user_id BIGINT,
  estimated_duration_min INT,
  equipment_ids JSONB,
  status VARCHAR(20) DEFAULT 'scheduled',
  conflict_check BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_scheduling ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_scheduling FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_scheduling_tenant ON cath_lab_scheduling
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 7. contrast_tracking
-- =============================================
CREATE TABLE contrast_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  contrast_agent VARCHAR(50),
  contrast_volume_ml INT,
  cumulative_30day_ml INT,
  baseline_egfr NUMERIC(6,2),
  post_egfr_48h NUMERIC(6,2),
  cin_event BOOLEAN,
  hydration_protocol VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE contrast_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrast_tracking FORCE ROW LEVEL SECURITY;
CREATE POLICY contrast_tracking_tenant ON contrast_tracking
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 8. radiation_dose_log
-- =============================================
CREATE TABLE radiation_dose_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  staff_id BIGINT,
  role VARCHAR(20),
  role_dose_mgy NUMERIC(8,2),
  role_dap_gy_cm2 NUMERIC(8,2),
  lead_apron_used BOOLEAN,
  thyroid_shield_used BOOLEAN,
  dosimeter_reading_monthly_mgy NUMERIC(8,2),
  cumulative_ytd_mgy NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE radiation_dose_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiation_dose_log FORCE ROW LEVEL SECURITY;
CREATE POLICY radiation_dose_log_tenant ON radiation_dose_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 9. cath_lab_equipment
-- =============================================
CREATE TABLE cath_lab_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  facility_id UUID,
  equipment_type VARCHAR(50),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  serial VARCHAR(100),
  install_date DATE,
  last_pm_date DATE,
  next_pm_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  sfda_registration VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_equipment FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_equipment_tenant ON cath_lab_equipment
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 10. cath_lab_red_flags
-- =============================================
CREATE TABLE cath_lab_red_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  flag_type VARCHAR(50),
  detected_at TIMESTAMPTZ,
  detected_by VARCHAR(20),
  response_action TEXT,
  response_time_seconds INT,
  resolved_at TIMESTAMPTZ,
  audit_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_red_flags FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_red_flags_tenant ON cath_lab_red_flags
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 11. cath_audit_log
-- =============================================
CREATE TABLE cath_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  user_id BIGINT,
  action VARCHAR(100),
  input_hash VARCHAR(64),
  output_hash VARCHAR(64),
  prev_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cath_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_audit_log FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_audit_log_tenant ON cath_audit_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_cath_audit_tenant_proc ON cath_audit_log(tenant_id, procedure_id);

-- =============================================
-- 12. cath_consent
-- =============================================
CREATE TABLE cath_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  consent_type VARCHAR(50),
  consent_text_ar TEXT,
  consent_text_en TEXT,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT,
  witness_id BIGINT,
  interpreter_used BOOLEAN,
  ai_assisted_care_consent BOOLEAN,
  withdrawal_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_consent FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_consent_tenant ON cath_consent
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;

-- Force RLS count: was 150, now 162 (CARD-002 adds 12)
"@
Write-File "$root\CARD-002\01_migration_up.sql" $content

Write-Host "✅ CARD-002: 6 files written (skipped 3 already-done, 6 more to go)"

# =============================================================
# ============= الملفات الـ 29 المتبقية لـ CARD-002 ============
# (سأدمجها في script واحد ضخم)
# =============================================================

# File 7: 01_rag_chains.md
$content = @"
$banner
# CARD-002 — LangChain / LangGraph Chains (8 chains)

## 1. pci_risk_stratifier
**Input:** age, vessel tree, syntax score, GRACE vars, TIMI vars
**Output:** {syntax_band, grace_risk, timi_30d_mortality, recommendation}
**Tools:** syntax_scorer, grace_calculator, timi_stemi
**Critical:** YES (drives PCI decision)

## 2. structural_heart_mdt_summarizer
**Input:** patient demographics, echo, CT, STS, frailty, comorbidities
**Output:** MDT summary letter (EN + AR), recommendation, alternatives
**Tools:** fhir_patient_lookup, echo_ct_extract, sts_score, frailty_score
**Critical:** YES (gates TAVR/MitraClip scheduling)

## 3. cin_risk_predictor
**Input:** eGFR, age, diabetes, contrast_volume_ml, hydration_protocol
**Output:** {risk_band: low|moderate|high, recommendation, post_egfr_48h_warning}
**Tools:** egfr_calc, mehta_risk_score, contrast_history_lookup
**Critical:** YES (CIN is leading cause of AKI post-cath)

## 4. dapt_decision_support
**Input:** PCI indication, bleeding risk (PRECISE-DAPT, CRUSADE), ischemic risk (DAPT)
**Output:** {duration_months, p2y12_recommendation, monitoring_plan}
**Tools:** dapt_score, precise_dapt_score, bleeding_risk, ischemic_risk
**Critical:** YES (wrong DAPT = stent thrombosis or bleed)

## 5. radial_vs_femoral_access_advisor
**Input:** Allen test, BMI, prior CABG, vessel tortuosity, operator skill
**Output:** {recommended_access, rationale, fallback}
**Tools:** access_optimizer
**Critical:** NO (operator decision)

## 6. stemi_activation_triage
**Input:** ECG (12-lead), symptoms, vitals
**Output:** {stemi_confirmed, activation_tier, lab_to_activate, eta}
**Tools:** ecg_stemi_detector (vision model), red_flag_classifier
**Critical:** YES — must fire <60s (drives D2B)

## 7. cath_report_generator
**Input:** procedure event log, devices, complications, findings
**Output:** Structured cath report (EN), AR translation
**Tools:** procedure_event_log, cath_report_template, lesion_classifier
**Critical:** NO (LLM-assisted; MD must review+sign)

## 8. discharge_summary
**Input:** procedure summary, DAPT plan, follow-up, education
**Output:** Patient-friendly discharge summary (AR 5th-grade reading level)
**Tools:** consent_template, reading_level_5_rewriter, i18n_translator
**Critical:** NO (LLM-assisted; RN must review)

## Implementation
LangGraph supervisor pattern; 6-stage RAG pipeline (query rewrite → hybrid retrieval → rerank → context → LLM → validation). PII redacted BEFORE external LLM. MedEmbed 768d primary; gpt-4o + claude-3.5 secondary; med-llama-70b offline fallback. All LLM calls traced to LangSmith + Helicone.

---
*Section 07 of CARD-002. AIE voice. L1 DRAFT.*
"@
Write-File "$root\CARD-002\01_rag_chains.md" $content

Write-Host "✅ CARD-002: 7 files written. Continue..."


Write-Host "✅ PART 1 DONE - 7 files written for CARD-002"
