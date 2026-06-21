-- route_level_ddl_batch_b_rls_safe_candidate_up.sql
-- CANDIDATE ONLY — NOT executed. RLS-safe out-of-band provisioning for Batch B route tables, to run
-- (SUPERUSER) BEFORE deploying the Batch B code-removal patch. All 8 tables have 0 rows in prod
-- (7 absent, insurance_policies empty) => adding tenant_id + FORCE RLS is clean (no backfill).
-- Tenant-scoped via the patients pattern: policy tenant_id = (NULLIF(current_setting('app.tenant_id',true),''))::integer
-- No seed, no backfill, no GRANT, no role change, no accounting.
BEGIN;

CREATE TABLE IF NOT EXISTS pathology_specimens (id SERIAL PRIMARY KEY, patient_name VARCHAR(200), specimen_type VARCHAR(100), site VARCHAR(200), doctor VARCHAR(200), clinical_details TEXT, priority VARCHAR(30), status VARCHAR(30) DEFAULT 'received', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS cssd_batches (id SERIAL PRIMARY KEY, batch_number VARCHAR(50), items TEXT, department VARCHAR(100), method VARCHAR(50), temperature VARCHAR(20), operator VARCHAR(100), status VARCHAR(30) DEFAULT 'processing', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS cme_events (id SERIAL PRIMARY KEY, title VARCHAR(300), speaker VARCHAR(200), event_date DATE, cme_hours NUMERIC(4,1), category VARCHAR(50), department VARCHAR(100), status VARCHAR(30) DEFAULT 'upcoming', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS infection_control_reports (id SERIAL PRIMARY KEY, patient_name VARCHAR(200), infection_type VARCHAR(100), ward VARCHAR(100), isolation_type VARCHAR(50), culture_results TEXT, action_taken TEXT, status VARCHAR(30) DEFAULT 'active', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS maintenance_orders (id SERIAL PRIMARY KEY, equipment VARCHAR(200), location VARCHAR(100), maintenance_type VARCHAR(50), priority VARCHAR(30), description TEXT, requested_by VARCHAR(100), status VARCHAR(30) DEFAULT 'pending', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS insurance_policies (id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200), company VARCHAR(200), policy_number VARCHAR(100), class VARCHAR(50), coverage_percent NUMERIC(5,2) DEFAULT 80, start_date DATE, end_date DATE, status VARCHAR(30) DEFAULT 'active', tenant_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS inventory (id SERIAL PRIMARY KEY, name VARCHAR(200), category VARCHAR(100), quantity INTEGER DEFAULT 0, unit VARCHAR(50), reorder_level INTEGER DEFAULT 10, location VARCHAR(100), supplier VARCHAR(200), cost NUMERIC(10,2), expiry_date DATE, tenant_id INTEGER, facility_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pharmacy_prescriptions (id SERIAL PRIMARY KEY, patient_id INTEGER, patient_name VARCHAR(200), medication VARCHAR(200), drug_name VARCHAR(200), dosage VARCHAR(100), frequency VARCHAR(100), duration VARCHAR(100), quantity INTEGER, doctor VARCHAR(200), status VARCHAR(30) DEFAULT 'pending', notes TEXT, tenant_id INTEGER, facility_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Apply tenant_id (+facility_id where applicable) + DEFAULT + FORCE RLS + tenant policy to all 8
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['pathology_specimens','cssd_batches','cme_events','infection_control_reports','maintenance_orders','insurance_policies','inventory','pharmacy_prescriptions']
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET DEFAULT (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer', t);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = t AND policyname = 'rls_'||t||'_tenant_isolation') THEN
      EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)', 'rls_'||t||'_tenant_isolation', t);
    END IF;
  END LOOP;
  -- facility_id for inventory + pharmacy_prescriptions (operational scoping; not part of RLS policy)
  ALTER TABLE inventory              ADD COLUMN IF NOT EXISTS facility_id INTEGER;
  ALTER TABLE pharmacy_prescriptions ADD COLUMN IF NOT EXISTS facility_id INTEGER;
END $$;

COMMIT;
