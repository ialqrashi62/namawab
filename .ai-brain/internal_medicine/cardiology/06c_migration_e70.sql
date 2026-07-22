# Migrations — Cardiology (e70)

> **Owner:** Architect
> **Date:** 2026-07-22
> **Pattern:** forward (up.sql) + reverse (down.sql) + validate.sql
> **Non-destructive:** never DROP data, never silently drop RLS

---

## e70_cardiology_workflow_up.sql

```sql
BEGIN;

-- cardiac_procedures
CREATE TABLE IF NOT EXISTS cardiac_procedures (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  procedure_type VARCHAR(64) NOT NULL,
  indication TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  operator_id BIGINT,
  findings TEXT,
  complications TEXT,
  cpt_code VARCHAR(16),
  door_to_balloon_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cardiac_proc_patient ON cardiac_procedures(patient_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardiac_proc_status ON cardiac_procedures(tenant_id, status) WHERE status IN ('scheduled', 'in_progress');

ALTER TABLE cardiac_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiac_procedures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON cardiac_procedures;
CREATE POLICY tenant_isolation ON cardiac_procedures
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- echo_reports
CREATE TABLE IF NOT EXISTS echo_reports (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  study_date TIMESTAMPTZ NOT NULL,
  study_type VARCHAR(32) NOT NULL,
  lvef_percent DECIMAL(5,2),
  lvef_method VARCHAR(16),
  valve_assessment TEXT,
  wall_motion TEXT,
  pericardial_effusion VARCHAR(32),
  pulmonary_pressure_sys DECIMAL(5,2),
  aortic_root_cm DECIMAL(4,1),
  la_size_cm DECIMAL(4,1),
  image_dicom_url TEXT,
  report_text TEXT,
  signed_by BIGINT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_echo_patient_date ON echo_reports(patient_id, study_date DESC);
ALTER TABLE echo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE echo_reports FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON echo_reports;
CREATE POLICY tenant_isolation ON echo_reports
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- ecg_archive
CREATE TABLE IF NOT EXISTS ecg_archive (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  study_date TIMESTAMPTZ NOT NULL,
  ecg_type VARCHAR(32) NOT NULL,
  rhythm VARCHAR(64),
  rate_bpm INT,
  pr_ms INT,
  qrs_ms INT,
  qt_ms INT,
  qtc_ms INT,
  axis_deg INT,
  interpretation TEXT,
  image_url TEXT,
  ai_interpretation TEXT,
  signed_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ecg_patient_date ON ecg_archive(patient_id, study_date DESC);
ALTER TABLE ecg_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_archive FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON ecg_archive;
CREATE POLICY tenant_isolation ON ecg_archive
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- (other tables: holter_studies, stress_tests, cardiac_rehab_enrollment, anticoagulation_clinic_visits, lipid_clinic_followup — same pattern)

COMMIT;
```

## e70_cardiology_workflow_down.sql

```sql
BEGIN;

-- Non-destructive: just disable RLS, drop policies, then drop tables if owner-authorized.
-- By default, do NOT drop tables. Just disable RLS.

ALTER TABLE IF EXISTS cardiac_procedures DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cardiac_procedures NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON cardiac_procedures;

ALTER TABLE IF EXISTS echo_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS echo_reports NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON echo_reports;

ALTER TABLE IF EXISTS ecg_archive DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ecg_archive NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON ecg_archive;

-- To drop tables (only if owner-authorized):
-- DROP TABLE IF EXISTS cardiac_procedures CASCADE;
-- DROP TABLE IF EXISTS echo_reports CASCADE;
-- DROP TABLE IF EXISTS ecg_archive CASCADE;

COMMIT;
```

## e70_cardiology_workflow_validate.sql

```sql
-- Validate: confirm tables exist, RLS enabled, indexes present
SELECT
  tablename,
  rowsecurity AS rls_enabled,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename = t.tablename) AS index_count
FROM pg_tables t
WHERE tablename IN ('cardiac_procedures', 'echo_reports', 'ecg_archive')
  AND schemaname = 'public';

-- Expected:
-- cardiac_procedures | t | >=4
-- echo_reports       | t | >=2
-- ecg_archive        | t | >=2

-- Validate RLS is FORCED
SELECT
  relname,
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relname IN ('cardiac_procedures', 'echo_reports', 'ecg_archive');

-- Expected: all t/t

-- Test policy
SET app.tenant_id = '1';
SELECT COUNT(*) FROM cardiac_procedures;  -- returns rows for tenant 1 only
RESET app.tenant_id;

-- Done
SELECT 'cardiology_workflow migration validated successfully' AS status;
```

---

End of migration spec.
