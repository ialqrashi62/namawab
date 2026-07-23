---
module_id: ER-001
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Migrations

## 1. UP Migration

```sql
-- File: namaweb/migrations/e100_er_module_up.sql
-- ER-001: Emergency Department module
-- Forward migration (idempotent)

BEGIN;

-- ============================================================
-- 1. er_encounters
-- ============================================================
CREATE TABLE IF NOT EXISTS er_encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  facility_id UUID REFERENCES facilities(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  mrn VARCHAR(50) NOT NULL,
  encounter_class VARCHAR(20) NOT NULL DEFAULT 'EMER',
  arrival_time TIMESTAMPTZ NOT NULL,
  triage_time TIMESTAMPTZ,
  provider_first_seen_time TIMESTAMPTZ,
  disposition_time TIMESTAMPTZ,
  discharge_time TIMESTAMPTZ,
  esi_level INT NOT NULL CHECK (esi_level BETWEEN 1 AND 5),
  chief_complaint TEXT NOT NULL,
  hpi TEXT,
  primary_diagnosis_icd10 VARCHAR(10),
  secondary_diagnoses_icd10 TEXT[],
  disposition VARCHAR(30),
  disposition_destination VARCHAR(100),
  primary_provider_id UUID REFERENCES system_users(id),
  attending_md_id UUID REFERENCES system_users(id),
  triage_rn_id UUID REFERENCES system_users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  is_critical SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  soft_deleted SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT chk_er_enc_status CHECK (status IN ('open', 'closed', 'cancelled')),
  CONSTRAINT chk_er_enc_dispo CHECK (disposition IS NULL OR disposition IN ('admit', 'discharge', 'transfer', 'ama', 'deceased', 'obs'))
);

CREATE INDEX IF NOT EXISTS idx_er_encounters_tenant_patient ON er_encounters (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_er_encounters_tenant_arrival ON er_encounters (tenant_id, arrival_time DESC);
CREATE INDEX IF NOT EXISTS idx_er_encounters_esi_status ON er_encounters (tenant_id, esi_level, status) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_er_encounters_critical ON er_encounters (tenant_id, is_critical, arrival_time) WHERE is_critical = 1;
CREATE INDEX IF NOT EXISTS idx_er_encounters_mrn ON er_encounters (tenant_id, mrn);
CREATE INDEX IF NOT EXISTS idx_er_encounters_dispo ON er_encounters (tenant_id, disposition) WHERE disposition IS NOT NULL;

ALTER TABLE er_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_encounters FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_enc_tenant_isolation ON er_encounters;
CREATE POLICY er_enc_tenant_isolation ON er_encounters
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 2. er_vitals
-- ============================================================
CREATE TABLE IF NOT EXISTS er_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  recorded_at TIMESTAMPTZ NOT NULL,
  bp_systolic INT,
  bp_diastolic INT,
  heart_rate INT,
  respiratory_rate INT,
  spo2 INT CHECK (spo2 IS NULL OR (spo2 BETWEEN 0 AND 100)),
  temperature_c DECIMAL(4,1),
  pain_score INT CHECK (pain_score IS NULL OR (pain_score BETWEEN 0 AND 10)),
  gcs_total INT CHECK (gcs_total IS NULL OR (gcs_total BETWEEN 3 AND 15)),
  gcs_components JSONB,
  recorded_by UUID NOT NULL REFERENCES system_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_er_vitals_encounter_time ON er_vitals (tenant_id, encounter_id, recorded_at DESC);

ALTER TABLE er_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_vitals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_vitals_tenant_isolation ON er_vitals;
CREATE POLICY er_vitals_tenant_isolation ON er_vitals
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 3. er_triage_decisions
-- ============================================================
CREATE TABLE IF NOT EXISTS er_triage_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  esi_level INT NOT NULL CHECK (esi_level BETWEEN 1 AND 5),
  decision_source VARCHAR(20) NOT NULL,
  confidence DECIMAL(4,2),
  override_reason TEXT,
  decided_by UUID NOT NULL REFERENCES system_users(id),
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  supervisor_cosign_id UUID REFERENCES system_users(id),
  supervisor_cosign_at TIMESTAMPTZ,
  CONSTRAINT chk_triage_source CHECK (decision_source IN ('ai', 'rn', 'md', 'override'))
);

CREATE INDEX IF NOT EXISTS idx_er_triage_encounter ON er_triage_decisions (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_triage_overrides ON er_triage_decisions (tenant_id, decided_by) WHERE decision_source = 'override';

ALTER TABLE er_triage_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_triage_decisions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_triage_tenant_isolation ON er_triage_decisions;
CREATE POLICY er_triage_tenant_isolation ON er_triage_decisions
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 4. er_red_flags
-- ============================================================
CREATE TABLE IF NOT EXISTS er_red_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  flag_type VARCHAR(50) NOT NULL,
  category INT NOT NULL CHECK (category BETWEEN 1 AND 5),
  severity VARCHAR(20) NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  detected_by VARCHAR(20) NOT NULL,
  detection_method VARCHAR(50),
  response_action VARCHAR(100) NOT NULL,
  response_time_seconds INT,
  acknowledged_by UUID REFERENCES system_users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_er_red_flags_encounter ON er_red_flags (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_red_flags_category_time ON er_red_flags (tenant_id, category, detected_at);
CREATE INDEX IF NOT EXISTS idx_er_red_flags_unack ON er_red_flags (tenant_id, encounter_id) WHERE acknowledged_at IS NULL;

ALTER TABLE er_red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_red_flags FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_red_flags_tenant_isolation ON er_red_flags;
CREATE POLICY er_red_flags_tenant_isolation ON er_red_flags
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 5. er_medications_admin
-- ============================================================
CREATE TABLE IF NOT EXISTS er_medications_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  drug_id UUID REFERENCES drugs(id),
  drug_name VARCHAR(200) NOT NULL,
  rxnorm_code VARCHAR(20),
  dose VARCHAR(50) NOT NULL,
  route VARCHAR(30) NOT NULL,
  frequency VARCHAR(50),
  indication TEXT,
  five_rights_check JSONB,
  allergy_check_passed SMALLINT NOT NULL DEFAULT 0,
  interaction_check_passed SMALLINT NOT NULL DEFAULT 0,
  renal_dose_checked SMALLINT NOT NULL DEFAULT 0,
  pregnancy_checked SMALLINT NOT NULL DEFAULT 0,
  given_by UUID NOT NULL REFERENCES system_users(id),
  given_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  witnessed_by UUID REFERENCES system_users(id)
);

CREATE INDEX IF NOT EXISTS idx_er_meds_encounter_time ON er_medications_admin (tenant_id, encounter_id, given_at DESC);
CREATE INDEX IF NOT EXISTS idx_er_meds_highalert ON er_medications_admin (tenant_id, drug_name) WHERE witnessed_by IS NOT NULL;

ALTER TABLE er_medications_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_medications_admin FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_meds_tenant_isolation ON er_medications_admin;
CREATE POLICY er_meds_tenant_isolation ON er_medications_admin
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 6. er_procedures
-- ============================================================
CREATE TABLE IF NOT EXISTS er_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  procedure_id UUID REFERENCES procedures_catalog(id),
  cpt_code VARCHAR(20),
  snomed_code VARCHAR(30),
  procedure_name VARCHAR(200) NOT NULL,
  performed_at TIMESTAMPTZ NOT NULL,
  performed_by UUID NOT NULL REFERENCES system_users(id),
  assistant_id UUID REFERENCES system_users(id),
  time_to_perform_minutes INT,
  complications TEXT,
  consent_obtained SMALLINT NOT NULL DEFAULT 0,
  consent_witness_id UUID REFERENCES system_users(id)
);

CREATE INDEX IF NOT EXISTS idx_er_procedures_encounter ON er_procedures (tenant_id, encounter_id);

ALTER TABLE er_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_procedures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_proc_tenant_isolation ON er_procedures;
CREATE POLICY er_proc_tenant_isolation ON er_procedures
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 7. er_lab_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS er_lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  test_id UUID REFERENCES lab_tests_catalog(id),
  loinc_code VARCHAR(20),
  test_name VARCHAR(200) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  ordered_by UUID NOT NULL REFERENCES system_users(id),
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  collected_at TIMESTAMPTZ,
  resulted_at TIMESTAMPTZ,
  result_value VARCHAR(100),
  result_unit VARCHAR(30),
  reference_range VARCHAR(50),
  abnormal_flag VARCHAR(20),
  is_critical SMALLINT NOT NULL DEFAULT 0,
  callback_required SMALLINT NOT NULL DEFAULT 0,
  callback_acknowledged_by UUID REFERENCES system_users(id),
  callback_acknowledged_at TIMESTAMPTZ,
  CONSTRAINT chk_er_lab_priority CHECK (priority IN ('stat', 'urgent', 'routine')),
  CONSTRAINT chk_er_lab_abnormal CHECK (abnormal_flag IS NULL OR abnormal_flag IN ('normal', 'low', 'high', 'critical_low', 'critical_high'))
);

CREATE INDEX IF NOT EXISTS idx_er_lab_encounter ON er_lab_orders (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_lab_critical ON er_lab_orders (tenant_id, is_critical, resulted_at) WHERE is_critical = 1;
CREATE INDEX IF NOT EXISTS idx_er_lab_pending_callback ON er_lab_orders (tenant_id, callback_required, resulted_at) WHERE callback_acknowledged_at IS NULL;

ALTER TABLE er_lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_lab_orders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_lab_tenant_isolation ON er_lab_orders;
CREATE POLICY er_lab_tenant_isolation ON er_lab_orders
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 8. er_imaging_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS er_imaging_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  modality VARCHAR(20) NOT NULL,
  body_part VARCHAR(50),
  indication TEXT,
  priority VARCHAR(20) NOT NULL,
  contrast_used SMALLINT NOT NULL DEFAULT 0,
  contrast_type VARCHAR(30),
  pregnancy_check_done SMALLINT NOT NULL DEFAULT 0,
  renal_function_checked SMALLINT NOT NULL DEFAULT 0,
  ordered_by UUID NOT NULL REFERENCES system_users(id),
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  performed_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ,
  radiologist_id UUID REFERENCES system_users(id),
  finding_summary TEXT,
  critical_finding SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_er_imaging_encounter ON er_imaging_orders (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_imaging_critical ON er_imaging_orders (tenant_id, critical_finding, reported_at) WHERE critical_finding = 1;

ALTER TABLE er_imaging_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_imaging_orders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_imaging_tenant_isolation ON er_imaging_orders;
CREATE POLICY er_imaging_tenant_isolation ON er_imaging_orders
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 9. er_consultations
-- ============================================================
CREATE TABLE IF NOT EXISTS er_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  specialty VARCHAR(50) NOT NULL,
  consult_reason TEXT,
  urgent SMALLINT NOT NULL DEFAULT 0,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  requested_by UUID NOT NULL REFERENCES system_users(id),
  responded_at TIMESTAMPTZ,
  consultant_id UUID REFERENCES system_users(id),
  response_notes TEXT,
  recommendation TEXT
);

CREATE INDEX IF NOT EXISTS idx_er_consults_encounter ON er_consultations (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_consults_specialty_time ON er_consultations (tenant_id, specialty, requested_at);

ALTER TABLE er_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_consultations FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_consults_tenant_isolation ON er_consultations;
CREATE POLICY er_consults_tenant_isolation ON er_consultations
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 10. er_notes (encrypted PHI)
-- ============================================================
CREATE TABLE IF NOT EXISTS er_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  note_type VARCHAR(30) NOT NULL,
  author_id UUID NOT NULL REFERENCES system_users(id),
  author_role VARCHAR(30) NOT NULL,
  content TEXT NOT NULL,  -- encrypted via application
  cosigned_by UUID REFERENCES system_users(id),
  cosigned_at TIMESTAMPTZ,
  amend_history JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_er_note_type CHECK (note_type IN ('triage', 'nursing', 'md', 'procedure', 'consult', 'discharge'))
);

CREATE INDEX IF NOT EXISTS idx_er_notes_encounter_type ON er_notes (tenant_id, encounter_id, note_type);

ALTER TABLE er_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_notes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_notes_tenant_isolation ON er_notes;
CREATE POLICY er_notes_tenant_isolation ON er_notes
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 11. er_codes
-- ============================================================
CREATE TABLE IF NOT EXISTS er_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  code_type VARCHAR(30) NOT NULL,
  activated_at TIMESTAMPTZ NOT NULL,
  activated_by UUID NOT NULL REFERENCES system_users(id),
  team_arrival_times JSONB,
  procedure_times JSONB,
  outcomes JSONB,
  completed_at TIMESTAMPTZ,
  documented_by UUID REFERENCES system_users(id),
  CONSTRAINT chk_er_code_type CHECK (code_type IN ('blue', 'stemi', 'stroke', 'trauma', 'sepsis', 'mass_casualty'))
);

CREATE INDEX IF NOT EXISTS idx_er_codes_type_time ON er_codes (tenant_id, code_type, activated_at);
CREATE INDEX IF NOT EXISTS idx_er_codes_active ON er_codes (tenant_id, encounter_id, code_type) WHERE completed_at IS NULL;

ALTER TABLE er_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_codes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_codes_tenant_isolation ON er_codes;
CREATE POLICY er_codes_tenant_isolation ON er_codes
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 12. er_dispositions
-- ============================================================
CREATE TABLE IF NOT EXISTS er_dispositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID NOT NULL REFERENCES er_encounters(id),
  disposition_type VARCHAR(30) NOT NULL,
  destination VARCHAR(100),
  receiving_unit VARCHAR(50),
  receiving_provider_id UUID REFERENCES system_users(id),
  time_ordered TIMESTAMPTZ,
  time_completed TIMESTAMPTZ,
  discharge_instructions TEXT,
  follow_up_arranged SMALLINT,
  follow_up_provider VARCHAR(200),
  follow_up_timeframe VARCHAR(50),
  patient_education TEXT,
  decided_by UUID NOT NULL REFERENCES system_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_er_dispo_type CHECK (disposition_type IN ('admit', 'discharge', 'transfer', 'ama', 'deceased', 'obs'))
);

CREATE INDEX IF NOT EXISTS idx_er_dispo_encounter ON er_dispositions (tenant_id, encounter_id);
CREATE INDEX IF NOT EXISTS idx_er_dispo_type_time ON er_dispositions (tenant_id, disposition_type, created_at);

ALTER TABLE er_dispositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_dispositions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_dispo_tenant_isolation ON er_dispositions;
CREATE POLICY er_dispo_tenant_isolation ON er_dispositions
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 13. er_audit_log (hash-chained, append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS er_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id UUID REFERENCES er_encounters(id),
  user_id UUID REFERENCES system_users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(30),
  resource_id UUID,
  before_state JSONB,
  after_state JSONB,
  input_hash VARCHAR(64),
  output_hash VARCHAR(64),
  prev_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_er_audit_encounter_time ON er_audit_log (tenant_id, encounter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_er_audit_chain ON er_audit_log (tenant_id, prev_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_er_audit_user_action ON er_audit_log (tenant_id, user_id, action, created_at);

ALTER TABLE er_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_audit_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_audit_tenant_isolation ON er_audit_log;
CREATE POLICY er_audit_tenant_isolation ON er_audit_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- 14. er_vector_chunks (PGVector for RAG)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS er_vector_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source TEXT NOT NULL,
  tier INT NOT NULL CHECK (tier BETWEEN 1 AND 5),
  section TEXT,
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(768),
  citation_count INT DEFAULT 0,
  year INT,
  guideline_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_er_vector_embedding ON er_vector_chunks 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_er_vector_tenant ON er_vector_chunks (tenant_id);
CREATE INDEX IF NOT EXISTS idx_er_vector_tier_source ON er_vector_chunks (tier, source);

ALTER TABLE er_vector_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_vector_chunks FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_vector_tenant_isolation ON er_vector_chunks;
CREATE POLICY er_vector_tenant_isolation ON er_vector_chunks
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- ============================================================
-- Updated RLS count
-- ============================================================
-- After this migration, RLS is enabled + forced on 13 new tables
-- Total RLS tables: 150 (pre-migration) + 13 = 163
-- Update FORCE_RLS setting if running on shared instance

-- ============================================================
-- Seed default ER sub-units (per facility)
-- ============================================================
-- Optional: populate facility_er_units table if not exists
-- This is handled in a separate migration to keep this idempotent

COMMIT;
```

## 2. DOWN Migration

```sql
-- File: namaweb/migrations/e100_er_module_down.sql
-- ER-001: Emergency Department module
-- Reverse migration (DESTRUCTIVE — only run in dev/staging)

BEGIN;

-- Drop in reverse order (respect foreign keys)
DROP TABLE IF EXISTS er_vector_chunks CASCADE;
DROP TABLE IF EXISTS er_audit_log CASCADE;
DROP TABLE IF EXISTS er_dispositions CASCADE;
DROP TABLE IF EXISTS er_codes CASCADE;
DROP TABLE IF EXISTS er_notes CASCADE;
DROP TABLE IF EXISTS er_consultations CASCADE;
DROP TABLE IF EXISTS er_imaging_orders CASCADE;
DROP TABLE IF EXISTS er_lab_orders CASCADE;
DROP TABLE IF EXISTS er_procedures CASCADE;
DROP TABLE IF EXISTS er_medications_admin CASCADE;
DROP TABLE IF EXISTS er_red_flags CASCADE;
DROP TABLE IF EXISTS er_triage_decisions CASCADE;
DROP TABLE IF EXISTS er_vitals CASCADE;
DROP TABLE IF EXISTS er_encounters CASCADE;

COMMIT;
```

## 3. Validation Script (post-deploy check)

```sql
-- File: namaweb/migrations/e100_er_module_validate.sql
-- Post-deploy validation

-- Check all tables exist
DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  required_tables TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
  cnt INT;
BEGIN
  FOREACH t IN ARRAY required_tables
  LOOP
    SELECT COUNT(*) INTO cnt FROM information_schema.tables 
    WHERE table_name = t AND table_schema = 'public';
    IF cnt = 0 THEN
      missing_tables := array_append(missing_tables, t);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE EXCEPTION 'Missing tables: %', array_to_string(missing_tables, ', ');
  END IF;
  
  RAISE NOTICE 'ER-001 migration validation PASSED: all 14 tables exist';
END $$;

-- Check RLS enabled on all ER tables
DO $$
DECLARE
  no_rls TEXT[] := ARRAY[]::TEXT[];
  required_tables TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
  rls_enabled BOOLEAN;
  rls_forced BOOLEAN;
BEGIN
  FOREACH t IN ARRAY required_tables
  LOOP
    SELECT relrowsecurity, relforcerowsecurity INTO rls_enabled, rls_forced
    FROM pg_class WHERE relname = t;
    
    IF NOT (rls_enabled AND rls_forced) THEN
      no_rls := array_append(no_rls, t || ' (enabled=' || rls_enabled || ', forced=' || rls_forced || ')');
    END IF;
  END LOOP;
  
  IF array_length(no_rls, 1) > 0 THEN
    RAISE EXCEPTION 'Tables without FORCE RLS: %', array_to_string(no_rls, ', ');
  END IF;
  
  RAISE NOTICE 'ER-001 RLS validation PASSED: all 14 tables have FORCE RLS';
END $$;

-- Check tenant_id NOT NULL on all ER tables
DO $$
DECLARE
  nullable TEXT[] := ARRAY[]::TEXT[];
  required_tables TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
  is_nullable TEXT;
BEGIN
  FOREACH t IN ARRAY required_tables
  LOOP
    SELECT is_nullable INTO is_nullable
    FROM information_schema.columns
    WHERE table_name = t AND column_name = 'tenant_id' AND table_schema = 'public';
    
    IF is_nullable = 'YES' THEN
      nullable := array_append(nullable, t);
    END IF;
  END LOOP;
  
  IF array_length(nullable, 1) > 0 THEN
    RAISE EXCEPTION 'Tables with nullable tenant_id: %', array_to_string(nullable, ', ');
  END IF;
  
  RAISE NOTICE 'ER-001 tenant_id validation PASSED: all 14 tables have NOT NULL tenant_id';
END $$;

-- Smoke test: insert + select as tenant
DO $$
DECLARE
  test_tenant UUID := '00000000-0000-0000-0000-000000000001';
  test_patient UUID;
  test_encounter UUID;
BEGIN
  -- Create test patient
  INSERT INTO patients (tenant_id, mrn, first_name_encrypted, last_name_encrypted, dob, sex)
  VALUES (test_tenant, 'TEST-MRN', 'encrypted_name', 'encrypted_name', '2000-01-01', 'M')
  RETURNING id INTO test_patient;
  
  -- Set tenant context
  PERFORM set_config('app.tenant_id', test_tenant::text, true);
  
  -- Create test encounter
  INSERT INTO er_encounters (tenant_id, patient_id, mrn, arrival_time, esi_level, chief_complaint)
  VALUES (test_tenant, test_patient, 'TEST-MRN', now(), 3, 'test complaint')
  RETURNING id INTO test_encounter;
  
  -- Verify
  PERFORM set_config('app.tenant_id', '00000000-0000-0000-0000-000000000099', true);  -- different tenant
  -- Should not see the encounter
  IF EXISTS (SELECT 1 FROM er_encounters WHERE id = test_encounter) THEN
    RAISE EXCEPTION 'RLS VIOLATION: cross-tenant read succeeded';
  END IF;
  
  -- Cleanup
  PERFORM set_config('app.tenant_id', test_tenant::text, true);
  DELETE FROM er_encounters WHERE id = test_encounter;
  DELETE FROM patients WHERE id = test_patient;
  
  RAISE NOTICE 'ER-001 RLS smoke test PASSED: cross-tenant isolation working';
END $$;
```

---
*Section 04.a of ER-001. Owner: SA + DSL. L4 validated.*
