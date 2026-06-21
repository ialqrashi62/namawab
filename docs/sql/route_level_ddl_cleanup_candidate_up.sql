-- route_level_ddl_cleanup_candidate_up.sql
-- CANDIDATE ONLY — NOT executed by this phase. Out-of-band (SUPERUSER) provisioning for the schema
-- that route handlers used to ensure inline via CREATE/ALTER IF NOT EXISTS (now removed from code so
-- the non-superuser app role nama_medical_app no longer hits 42501). Idempotent. No seed, no data, no RLS.
-- VERIFIED 2026-06-21: 13 of these tables do NOT exist in production yet (their routes were never hit,
-- so the inline CREATE never ran) — only insurance_policies + pharmacy_prescriptions_queue exist.
-- Therefore this migration MUST run (as superuser) BEFORE/WITH deploying the route-DDL-removal code patch,
-- otherwise those routes would 500 with 42P01 (missing table) instead of 42501 (CREATE blocked).
BEGIN;

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
ALTER TABLE obgyn_pregnancies ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE obgyn_deliveries  ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name TEXT DEFAULT '', from_doctor TEXT DEFAULT '', from_dept TEXT DEFAULT '',
    to_dept TEXT DEFAULT '', to_doctor TEXT DEFAULT '', reason TEXT DEFAULT '', urgency TEXT DEFAULT 'Routine',
    notes TEXT DEFAULT '', status TEXT DEFAULT 'Pending', response TEXT DEFAULT '', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

CREATE TABLE IF NOT EXISTS medical_reports (
    id SERIAL PRIMARY KEY, report_number VARCHAR(30), patient_id INTEGER, patient_name VARCHAR(200),
    report_type VARCHAR(50), diagnosis TEXT, icd_code VARCHAR(20), start_date DATE, end_date DATE,
    duration_days INTEGER, notes TEXT, fitness_status VARCHAR(50), doctor VARCHAR(200),
    tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE medical_reports ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

CREATE TABLE IF NOT EXISTS cash_drawer (
    id SERIAL PRIMARY KEY, user_id INTEGER, user_name VARCHAR(200),
    opening_balance DECIMAL(12,2) DEFAULT 0, closing_balance DECIMAL(12,2), expected_balance DECIMAL(12,2),
    difference DECIMAL(12,2), status VARCHAR(20) DEFAULT 'open',
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, closed_at TIMESTAMP, notes TEXT
);

CREATE TABLE IF NOT EXISTS visit_lifecycle (
    id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200), appointment_id INTEGER,
    doctor VARCHAR(200), department VARCHAR(100), status VARCHAR(30), arrived_at TIMESTAMP, triage_at TIMESTAMP,
    consult_start TIMESTAMP, consult_end TIMESTAMP, lab_sent_at TIMESTAMP, lab_done_at TIMESTAMP,
    pharmacy_sent_at TIMESTAMP, pharmacy_done_at TIMESTAMP, payment_at TIMESTAMP, completed_at TIMESTAMP,
    wait_time_minutes INTEGER, consult_duration_minutes INTEGER, total_duration_minutes INTEGER,
    triage_level VARCHAR(10), pain_score INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pathology_specimens (id SERIAL PRIMARY KEY, patient_name VARCHAR(200), specimen_type VARCHAR(100), site VARCHAR(200), doctor VARCHAR(200), clinical_details TEXT, priority VARCHAR(30), status VARCHAR(30) DEFAULT 'received', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS cssd_batches (id SERIAL PRIMARY KEY, batch_number VARCHAR(50), items TEXT, department VARCHAR(100), method VARCHAR(50), temperature VARCHAR(20), operator VARCHAR(100), status VARCHAR(30) DEFAULT 'processing', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS cme_events (id SERIAL PRIMARY KEY, title VARCHAR(300), speaker VARCHAR(200), event_date DATE, cme_hours NUMERIC(4,1), category VARCHAR(50), department VARCHAR(100), status VARCHAR(30) DEFAULT 'upcoming', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS infection_control_reports (
    id SERIAL PRIMARY KEY, patient_name VARCHAR(200), infection_type VARCHAR(100), ward VARCHAR(100),
    isolation_type VARCHAR(50), culture_results TEXT, action_taken TEXT, status VARCHAR(30) DEFAULT 'active',
    tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE infection_control_reports ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

CREATE TABLE IF NOT EXISTS maintenance_orders (id SERIAL PRIMARY KEY, equipment VARCHAR(200), location VARCHAR(100), maintenance_type VARCHAR(50), priority VARCHAR(30), description TEXT, requested_by VARCHAR(100), status VARCHAR(30) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS insurance_policies (id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200), company VARCHAR(200), policy_number VARCHAR(100), class VARCHAR(50), coverage_percent NUMERIC(5,2) DEFAULT 80, start_date DATE, end_date DATE, status VARCHAR(30) DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY, name VARCHAR(200), category VARCHAR(100),
    quantity INTEGER DEFAULT 0, unit VARCHAR(50), reorder_level INTEGER DEFAULT 10,
    location VARCHAR(100), supplier VARCHAR(200), cost NUMERIC(10,2),
    expiry_date DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS facility_id INTEGER;

CREATE TABLE IF NOT EXISTS pharmacy_prescriptions (
    id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200),
    medication VARCHAR(200), drug_name VARCHAR(200), dosage VARCHAR(100),
    frequency VARCHAR(100), duration VARCHAR(100), quantity INTEGER,
    doctor VARCHAR(200), status VARCHAR(30) DEFAULT 'pending',
    notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE pharmacy_prescriptions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_prescriptions ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- Batch C columns (were ensured by .catch'd route ALTERs) — included for completeness:
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS medication_name  TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS dosage           TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS quantity_per_day TEXT DEFAULT '1';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS frequency        TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS duration         TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS price            REAL DEFAULT 0;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS payment_method   TEXT DEFAULT '';

COMMIT;
-- Note: tenant isolation (RLS FORCE + tenant_id DEFAULT) for any of these tables that hold PHI is a
-- separate concern managed by the existing RLS DDL — out of scope for this route-DDL cleanup candidate.
