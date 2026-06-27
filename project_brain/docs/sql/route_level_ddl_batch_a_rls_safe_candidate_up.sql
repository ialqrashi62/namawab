-- route_level_ddl_batch_a_rls_safe_candidate_up.sql
-- CANDIDATE ONLY — NOT executed. RLS-SAFE replacement for the Batch A portion of
-- route_level_ddl_cleanup_candidate_up.sql (which failed the Gate 1 tenant-safety check: it created
-- PHI tables with NO RLS). Run by a SUPERUSER, out-of-band, BEFORE deploying namaweb bf5497c.
-- Scope: Batch A ONLY (6 tables). Creates only missing tables; NO seed, NO backfill, NO GRANT,
-- NO role change, NO accounting. PHI tables get FORCE RLS + tenant policy + tenant_id DEFAULT,
-- matching the existing pattern on patients/medical_records:
--   policy: tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer
BEGIN;

-- ---- PHI tenant-scoped tables: CREATE + tenant_id DEFAULT + FORCE RLS + policy ----

CREATE TABLE IF NOT EXISTS obgyn_pregnancies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, patient_name VARCHAR(200), lmp DATE, edd DATE,
    gravida INTEGER, para INTEGER, abortions INTEGER, living_children INTEGER,
    blood_group VARCHAR(20), rh_factor VARCHAR(20), risk_level VARCHAR(50),
    pre_pregnancy_weight REAL, height REAL, allergies TEXT, chronic_conditions TEXT,
    previous_cs INTEGER, previous_complications TEXT, husband_name VARCHAR(200),
    husband_blood_group VARCHAR(20), attending_doctor VARCHAR(200), created_by VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Active', delivery_date DATE, delivery_type VARCHAR(100), outcome VARCHAR(100),
    tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS obgyn_deliveries (
    id SERIAL PRIMARY KEY,
    pregnancy_id INTEGER, patient_id INTEGER, delivery_date DATE,
    gestational_age_at_delivery VARCHAR(50), delivery_type VARCHAR(100), outcome VARCHAR(100),
    birth_weight REAL, apgar_1min INTEGER, apgar_5min INTEGER, complications TEXT,
    gender VARCHAR(20), neonatal_outcome VARCHAR(100), tenant_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name TEXT DEFAULT '', from_doctor TEXT DEFAULT '', from_dept TEXT DEFAULT '',
    to_dept TEXT DEFAULT '', to_doctor TEXT DEFAULT '', reason TEXT DEFAULT '', urgency TEXT DEFAULT 'Routine',
    notes TEXT DEFAULT '', status TEXT DEFAULT 'Pending', response TEXT DEFAULT '', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS medical_reports (
    id SERIAL PRIMARY KEY, report_number VARCHAR(30), patient_id INTEGER, patient_name VARCHAR(200),
    report_type VARCHAR(50), diagnosis TEXT, icd_code VARCHAR(20), start_date DATE, end_date DATE,
    duration_days INTEGER, notes TEXT, fitness_status VARCHAR(50), doctor VARCHAR(200),
    tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- visit_lifecycle: original route def had NO tenant_id (filtered by date/doctor only => cross-tenant
-- visible). This candidate ADDS tenant_id + RLS so it is tenant-isolated via the per-request binding
-- (INSERTs stamp tenant_id via DEFAULT; SELECT/UPDATE filtered by policy). No app code change needed.
CREATE TABLE IF NOT EXISTS visit_lifecycle (
    id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200), appointment_id INTEGER,
    doctor VARCHAR(200), department VARCHAR(100), status VARCHAR(30), arrived_at TIMESTAMP, triage_at TIMESTAMP,
    consult_start TIMESTAMP, consult_end TIMESTAMP, lab_sent_at TIMESTAMP, lab_done_at TIMESTAMP,
    pharmacy_sent_at TIMESTAMP, pharmacy_done_at TIMESTAMP, payment_at TIMESTAMP, completed_at TIMESTAMP,
    wait_time_minutes INTEGER, consult_duration_minutes INTEGER, total_duration_minutes INTEGER,
    triage_level VARCHAR(10), pain_score INTEGER, tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apply tenant_id DEFAULT + FORCE RLS + policy to the 5 PHI/tenant tables (idempotent guards)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['obgyn_pregnancies','obgyn_deliveries','referrals','medical_reports','visit_lifecycle']
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET DEFAULT (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer', t);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = t AND policyname = 'rls_'||t||'_tenant_isolation') THEN
      EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)', 'rls_'||t||'_tenant_isolation', t);
    END IF;
  END LOOP;
END $$;

-- ---- User-scoped table (NOT tenant-scoped): cash_drawer is isolated by user_id (global, unique);
--      its routes filter WHERE user_id=$session_user. No tenant_id/RLS required. Created as-is. ----
CREATE TABLE IF NOT EXISTS cash_drawer (
    id SERIAL PRIMARY KEY, user_id INTEGER, user_name VARCHAR(200),
    opening_balance DECIMAL(12,2) DEFAULT 0, closing_balance DECIMAL(12,2), expected_balance DECIMAL(12,2),
    difference DECIMAL(12,2), status VARCHAR(20) DEFAULT 'open',
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, closed_at TIMESTAMP, notes TEXT
);

COMMIT;
