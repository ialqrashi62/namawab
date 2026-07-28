-- 22_migration_up.sql
-- e50_cardio_v1 — Cardiology core tables (CARD-001)
-- Generated: 2026-07-27 by nm-autopilot-dept-generator
-- Snippets: snippet:rls-default, snippet:rls-up-down

BEGIN;

-- ============================================================
-- Required extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()

-- ============================================================
-- Indexes common helper (composite tenant_id + RLS)
-- ============================================================
-- Each table gets:
--   - tenant_id uuid NOT NULL FK to tenants(id)
--   - FORCE ROW LEVEL SECURITY
--   - POLICY <table>_tenant_isolation USING (tenant_id = current_setting('app.tenant_id')::uuid)

-- ============================================================
-- cardio_encounters
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_encounters (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  facility_id        UUID,
  patient_id         UUID NOT NULL,
  doctor_id          UUID NOT NULL,
  type               TEXT NOT NULL CHECK (type IN ('outpatient','inpatient','er','telehealth')),
  status             TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','cancelled')),
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at           TIMESTAMPTZ,
  chief_complaint    TEXT,
  hpi                TEXT,
  pmh                TEXT,
  psh                TEXT,
  fh                 TEXT,
  sh                 TEXT,
  allergies          TEXT,
  medications_current JSONB,
  exam               TEXT,
  diagnosis_primary  TEXT,
  diagnosis_secondary JSONB,
  plan               TEXT,
  disposition        TEXT,
  red_flags          JSONB,
  cds_rules_triggered JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by         UUID,
  updated_by         UUID
);
CREATE INDEX IF NOT EXISTS idx_cardio_enc_patient ON cardio_encounters(tenant_id, patient_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_enc_doctor ON cardio_encounters(tenant_id, doctor_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_enc_facility ON cardio_encounters(tenant_id, facility_id, started_at DESC);
ALTER TABLE cardio_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_encounters FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_encounters_tenant ON cardio_encounters;
CREATE POLICY cardio_encounters_tenant ON cardio_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_ecg
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_ecg (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  interpreted_by     UUID,
  recorded_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_uri           TEXT NOT NULL,
  file_hash          TEXT NOT NULL,
  rate               INT,
  rhythm             TEXT,
  pr_ms              INT,
  qrs_ms             INT,
  qtc_ms             INT,
  axis_deg           INT,
  st_per_lead        JSONB,
  q_per_lead         JSONB,
  t_per_lead         JSONB,
  impression         TEXT,
  urgency            TEXT CHECK (urgency IN ('routine','urgent','emergent','critical')),
  red_flag           BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by          UUID,
  signed_at          TIMESTAMPTZ,
  signoff_note       TEXT
);
CREATE INDEX IF NOT EXISTS idx_cardio_ecg_patient ON cardio_ecg(tenant_id, patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_ecg_redflag_unsigned ON cardio_ecg(tenant_id, red_flag, signed_at) WHERE red_flag = TRUE AND signed_at IS NULL;
ALTER TABLE cardio_ecg ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_ecg FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ecg_tenant ON cardio_ecg;
CREATE POLICY cardio_ecg_tenant ON cardio_ecg
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_echo
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_echo (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  performed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interpreted_by     UUID,
  modality           TEXT CHECK (modality IN ('TTE','TEE','stress_echo')),
  measurements       JSONB,
  findings           TEXT,
  impression         TEXT,
  severity_summary   JSONB,
  file_uri           TEXT,
  red_flag           BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by          UUID,
  signed_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_cardio_echo_patient ON cardio_echo(tenant_id, patient_id, performed_at DESC);
ALTER TABLE cardio_echo ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_echo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_echo_tenant ON cardio_echo;
CREATE POLICY cardio_echo_tenant ON cardio_echo
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_stress
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_stress (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  performed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modality           TEXT CHECK (modality IN ('treadmill','pharmacologic','echo','nuclear')),
  protocol           TEXT,
  duration_min       INT,
  max_hr             INT,
  max_sbp            INT,
  max_dbp            INT,
  mets_achieved      INT,
  symptoms           TEXT,
  ecg_changes        TEXT,
  impression         TEXT CHECK (impression IN ('positive','negative','equivocal','inconclusive')),
  file_uri           TEXT,
  signed_by          UUID,
  signed_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_cardio_stress_patient ON cardio_stress(tenant_id, patient_id, performed_at DESC);
ALTER TABLE cardio_stress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_stress FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_stress_tenant ON cardio_stress;
CREATE POLICY cardio_stress_tenant ON cardio_stress
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_holter
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_holter (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  start_at           TIMESTAMPTZ NOT NULL,
  end_at             TIMESTAMPTZ NOT NULL,
  duration_hours     INT,
  device_serial      TEXT,
  findings           JSONB,
  file_uri           TEXT,
  signed_by          UUID,
  signed_at          TIMESTAMPTZ,
  CHECK (end_at > start_at)
);
CREATE INDEX IF NOT EXISTS idx_cardio_holter_patient ON cardio_holter(tenant_id, patient_id, start_at DESC);
ALTER TABLE cardio_holter ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_holter FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_holter_tenant ON cardio_holter;
CREATE POLICY cardio_holter_tenant ON cardio_holter
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_cath
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_cath (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  performed_by       UUID NOT NULL,
  procedure_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  procedure_type     TEXT NOT NULL,
  access_site        TEXT CHECK (access_site IN ('radial','femoral','brachial')),
  findings           JSONB,
  interventions      JSONB,
  contrast_ml        INT,
  fluoro_minutes     INT,
  radiation_dose_mgy NUMERIC(10,2),
  complications      TEXT,
  conclusion         TEXT,
  icu_admission      BOOLEAN NOT NULL DEFAULT FALSE,
  nphies_bundle      TEXT NOT NULL,
  amount_total       NUMERIC(12,2) NOT NULL,
  amount_currency    TEXT NOT NULL DEFAULT 'SAR',
  status             TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','signed','submitted','paid','denied')),
  signed_by          UUID,
  signed_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_cardio_cath_patient ON cardio_cath(tenant_id, patient_id, procedure_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_cath_enc ON cardio_cath(tenant_id, encounter_id);
ALTER TABLE cardio_cath ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_cath FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_cath_tenant ON cardio_cath;
CREATE POLICY cardio_cath_tenant ON cardio_cath
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_devices
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_devices (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  implanted_by       UUID NOT NULL,
  device_type        TEXT NOT NULL,
  manufacturer       TEXT,
  model              TEXT,
  serial             TEXT,
  implanted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leads              JSONB,
  battery_estimated_years INT,
  icd_class          TEXT CHECK (icd_class IN ('IIa','IIb','III')),
  nphies_bundle      TEXT NOT NULL,
  amount_total       NUMERIC(12,2) NOT NULL,
  amount_currency    TEXT NOT NULL DEFAULT 'SAR',
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','explanted','replaced','lost_to_followup')),
  explanted_at       TIMESTAMPTZ,
  explanted_by       UUID,
  explant_reason     TEXT
);
CREATE INDEX IF NOT EXISTS idx_cardio_dev_patient ON cardio_devices(tenant_id, patient_id, implanted_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_dev_active ON cardio_devices(tenant_id, status, implanted_at DESC);
ALTER TABLE cardio_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_devices FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_devices_tenant ON cardio_devices;
CREATE POLICY cardio_devices_tenant ON cardio_devices
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_rehab
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_rehab (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  indication         TEXT,
  sessions_planned   INT,
  sessions_completed JSONB,
  exercise_modality  TEXT,
  risk_stratification TEXT CHECK (risk_stratification IN ('low','moderate','high')),
  start_date         DATE,
  end_date           DATE,
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','discontinued'))
);
CREATE INDEX IF NOT EXISTS idx_cardio_rehab_patient ON cardio_rehab(tenant_id, patient_id);
ALTER TABLE cardio_rehab ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_rehab FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_rehab_tenant ON cardio_rehab;
CREATE POLICY cardio_rehab_tenant ON cardio_rehab
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_copilot_queries (audit-friendly)
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_copilot_queries (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  user_id            UUID NOT NULL,
  encounter_id       UUID,
  patient_id         UUID,
  question           TEXT NOT NULL,
  intent             TEXT CHECK (intent IN ('clinical_q','rx','red_flag','admin')),
  retrieval_chunks   JSONB,
  answer_ar          TEXT,
  answer_en          TEXT,
  citations          JSONB,
  evidence_level     TEXT CHECK (evidence_level IN ('A','B','C')),
  warnings           JSONB,
  cds_rules          JSONB,
  red_flag           BOOLEAN NOT NULL DEFAULT FALSE,
  trace_id           TEXT,
  input_tokens       INT,
  output_tokens      INT,
  cost_usd           NUMERIC(10,6),
  latency_ms         INT,
  model              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_copilot_enc ON cardio_copilot_queries(tenant_id, encounter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_copilot_user ON cardio_copilot_queries(tenant_id, user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_copilot_redflag ON cardio_copilot_queries(tenant_id, red_flag, created_at DESC) WHERE red_flag = TRUE;
ALTER TABLE cardio_copilot_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_copilot_queries FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_copilot_queries_tenant ON cardio_copilot_queries;
CREATE POLICY cardio_copilot_queries_tenant ON cardio_copilot_queries
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_red_flag_activations
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_red_flag_activations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  activated_by       UUID NOT NULL,
  red_flag_id        TEXT NOT NULL,
  severity           TEXT NOT NULL CHECK (severity IN ('critical','urgent','warning')),
  activated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at          TIMESTAMPTZ,
  sla_target_min     INT,
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','resolved','cancelled')),
  timeline           JSONB,
  notifications      JSONB
);
CREATE INDEX IF NOT EXISTS idx_redflag_active ON cardio_red_flag_activations(tenant_id, status, activated_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_redflag_patient ON cardio_red_flag_activations(tenant_id, patient_id, activated_at DESC);
ALTER TABLE cardio_red_flag_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_red_flag_activations FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_red_flag_activations_tenant ON cardio_red_flag_activations;
CREATE POLICY cardio_red_flag_activations_tenant ON cardio_red_flag_activations
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================
-- cardio_nphies_claims
-- ============================================================
CREATE TABLE IF NOT EXISTS cardio_nphies_claims (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  encounter_id       UUID NOT NULL REFERENCES cardio_encounters(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL,
  nphies_claim_id    TEXT,
  bundle             TEXT NOT NULL,
  amount             NUMERIC(12,2) NOT NULL,
  currency           TEXT NOT NULL DEFAULT 'SAR',
  status             TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','submitted','approved','denied','paid','partial')),
  submitted_at       TIMESTAMPTZ,
  response_at        TIMESTAMPTZ,
  response_code      TEXT,
  response_payload   JSONB,
  retry_count        INT NOT NULL DEFAULT 0,
  next_retry_at      TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cardio_nphies_claim_id ON cardio_nphies_claims(nphies_claim_id) WHERE nphies_claim_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cardio_nphies_status ON cardio_nphies_claims(tenant_id, status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardio_nphies_enc ON cardio_nphies_claims(tenant_id, encounter_id);
ALTER TABLE cardio_nphies_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_nphies_claims FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_nphies_claims_tenant ON cardio_nphies_claims;
CREATE POLICY cardio_nphies_claims_tenant ON cardio_nphies_claims
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

COMMIT;
