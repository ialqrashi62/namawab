-- ============================================================
-- p0_01_deferred_modules_rls_up.sql
-- PHASE-0 REMEDIATION — FORCE RLS on deferred/modern modules:
--   medical_records_files, medical_records_requests, medical_records_coding,
--   clinical_pharmacy_reviews, patient_drug_education,
--   rehab_patients, rehab_sessions, rehab_goals, rehab_assessments,
--   portal_users, portal_appointments,
--   diet_orders, diet_meals, nutrition_assessments,
--   approvals, package_sessions, internal_messages.
-- ============================================================
BEGIN;

-- Helper macro-like structure for each table

-- 1. medical_records_files
ALTER TABLE medical_records_files ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE medical_records_files SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE medical_records_files ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE medical_records_files DROP CONSTRAINT IF EXISTS fk_medical_records_files_tenant;
ALTER TABLE medical_records_files ADD CONSTRAINT fk_medical_records_files_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_medical_records_files_tenant_id ON medical_records_files (tenant_id);
ALTER TABLE medical_records_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records_files FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_medical_records_files_tenant_isolation ON medical_records_files;
CREATE POLICY rls_medical_records_files_tenant_isolation ON medical_records_files
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 2. medical_records_requests
ALTER TABLE medical_records_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE medical_records_requests SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE medical_records_requests ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE medical_records_requests DROP CONSTRAINT IF EXISTS fk_medical_records_requests_tenant;
ALTER TABLE medical_records_requests ADD CONSTRAINT fk_medical_records_requests_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_medical_records_requests_tenant_id ON medical_records_requests (tenant_id);
ALTER TABLE medical_records_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records_requests FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_medical_records_requests_tenant_isolation ON medical_records_requests;
CREATE POLICY rls_medical_records_requests_tenant_isolation ON medical_records_requests
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. medical_records_coding
ALTER TABLE medical_records_coding ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE medical_records_coding SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE medical_records_coding ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE medical_records_coding DROP CONSTRAINT IF EXISTS fk_medical_records_coding_tenant;
ALTER TABLE medical_records_coding ADD CONSTRAINT fk_medical_records_coding_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_medical_records_coding_tenant_id ON medical_records_coding (tenant_id);
ALTER TABLE medical_records_coding ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records_coding FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_medical_records_coding_tenant_isolation ON medical_records_coding;
CREATE POLICY rls_medical_records_coding_tenant_isolation ON medical_records_coding
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. clinical_pharmacy_reviews
ALTER TABLE clinical_pharmacy_reviews ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE clinical_pharmacy_reviews SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE clinical_pharmacy_reviews ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE clinical_pharmacy_reviews DROP CONSTRAINT IF EXISTS fk_clinical_pharmacy_reviews_tenant;
ALTER TABLE clinical_pharmacy_reviews ADD CONSTRAINT fk_clinical_pharmacy_reviews_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_clinical_pharmacy_reviews_tenant_id ON clinical_pharmacy_reviews (tenant_id);
ALTER TABLE clinical_pharmacy_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_pharmacy_reviews FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_clinical_pharmacy_reviews_tenant_isolation ON clinical_pharmacy_reviews;
CREATE POLICY rls_clinical_pharmacy_reviews_tenant_isolation ON clinical_pharmacy_reviews
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 5. patient_drug_education
ALTER TABLE patient_drug_education ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE patient_drug_education SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE patient_drug_education ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE patient_drug_education DROP CONSTRAINT IF EXISTS fk_patient_drug_education_tenant;
ALTER TABLE patient_drug_education ADD CONSTRAINT fk_patient_drug_education_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_patient_drug_education_tenant_id ON patient_drug_education (tenant_id);
ALTER TABLE patient_drug_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_drug_education FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_patient_drug_education_tenant_isolation ON patient_drug_education;
CREATE POLICY rls_patient_drug_education_tenant_isolation ON patient_drug_education
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 6. rehab_patients
ALTER TABLE rehab_patients ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE rehab_patients SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE rehab_patients ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE rehab_patients DROP CONSTRAINT IF EXISTS fk_rehab_patients_tenant;
ALTER TABLE rehab_patients ADD CONSTRAINT fk_rehab_patients_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rehab_patients_tenant_id ON rehab_patients (tenant_id);
ALTER TABLE rehab_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_patients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_rehab_patients_tenant_isolation ON rehab_patients;
CREATE POLICY rls_rehab_patients_tenant_isolation ON rehab_patients
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 7. rehab_sessions
ALTER TABLE rehab_sessions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE rehab_sessions SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE rehab_sessions ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE rehab_sessions DROP CONSTRAINT IF EXISTS fk_rehab_sessions_tenant;
ALTER TABLE rehab_sessions ADD CONSTRAINT fk_rehab_sessions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rehab_sessions_tenant_id ON rehab_sessions (tenant_id);
ALTER TABLE rehab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_rehab_sessions_tenant_isolation ON rehab_sessions;
CREATE POLICY rls_rehab_sessions_tenant_isolation ON rehab_sessions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 8. rehab_goals
ALTER TABLE rehab_goals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE rehab_goals SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE rehab_goals ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE rehab_goals DROP CONSTRAINT IF EXISTS fk_rehab_goals_tenant;
ALTER TABLE rehab_goals ADD CONSTRAINT fk_rehab_goals_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rehab_goals_tenant_id ON rehab_goals (tenant_id);
ALTER TABLE rehab_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_goals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_rehab_goals_tenant_isolation ON rehab_goals;
CREATE POLICY rls_rehab_goals_tenant_isolation ON rehab_goals
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 9. rehab_assessments
ALTER TABLE rehab_assessments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE rehab_assessments SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE rehab_assessments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE rehab_assessments DROP CONSTRAINT IF EXISTS fk_rehab_assessments_tenant;
ALTER TABLE rehab_assessments ADD CONSTRAINT fk_rehab_assessments_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_rehab_assessments_tenant_id ON rehab_assessments (tenant_id);
ALTER TABLE rehab_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_rehab_assessments_tenant_isolation ON rehab_assessments;
CREATE POLICY rls_rehab_assessments_tenant_isolation ON rehab_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 10. portal_users
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE portal_users SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE portal_users ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE portal_users DROP CONSTRAINT IF EXISTS fk_portal_users_tenant;
ALTER TABLE portal_users ADD CONSTRAINT fk_portal_users_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_portal_users_tenant_id ON portal_users (tenant_id);
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_users FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_portal_users_tenant_isolation ON portal_users;
CREATE POLICY rls_portal_users_tenant_isolation ON portal_users
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 11. portal_appointments
ALTER TABLE portal_appointments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE portal_appointments SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE portal_appointments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE portal_appointments DROP CONSTRAINT IF EXISTS fk_portal_appointments_tenant;
ALTER TABLE portal_appointments ADD CONSTRAINT fk_portal_appointments_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_portal_appointments_tenant_id ON portal_appointments (tenant_id);
ALTER TABLE portal_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_portal_appointments_tenant_isolation ON portal_appointments;
CREATE POLICY rls_portal_appointments_tenant_isolation ON portal_appointments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 12. diet_orders
ALTER TABLE diet_orders ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE diet_orders SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE diet_orders ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE diet_orders DROP CONSTRAINT IF EXISTS fk_diet_orders_tenant;
ALTER TABLE diet_orders ADD CONSTRAINT fk_diet_orders_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_diet_orders_tenant_id ON diet_orders (tenant_id);
ALTER TABLE diet_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_orders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_diet_orders_tenant_isolation ON diet_orders;
CREATE POLICY rls_diet_orders_tenant_isolation ON diet_orders
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 13. diet_meals
ALTER TABLE diet_meals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE diet_meals SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE diet_meals ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE diet_meals DROP CONSTRAINT IF EXISTS fk_diet_meals_tenant;
ALTER TABLE diet_meals ADD CONSTRAINT fk_diet_meals_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_diet_meals_tenant_id ON diet_meals (tenant_id);
ALTER TABLE diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_meals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_diet_meals_tenant_isolation ON diet_meals;
CREATE POLICY rls_diet_meals_tenant_isolation ON diet_meals
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 14. nutrition_assessments
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE nutrition_assessments SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE nutrition_assessments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nutrition_assessments DROP CONSTRAINT IF EXISTS fk_nutrition_assessments_tenant;
ALTER TABLE nutrition_assessments ADD CONSTRAINT fk_nutrition_assessments_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_nutrition_assessments_tenant_id ON nutrition_assessments (tenant_id);
ALTER TABLE nutrition_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_nutrition_assessments_tenant_isolation ON nutrition_assessments;
CREATE POLICY rls_nutrition_assessments_tenant_isolation ON nutrition_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 15. approvals
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE approvals SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE approvals ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE approvals DROP CONSTRAINT IF EXISTS fk_approvals_tenant;
ALTER TABLE approvals ADD CONSTRAINT fk_approvals_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_approvals_tenant_id ON approvals (tenant_id);
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_approvals_tenant_isolation ON approvals;
CREATE POLICY rls_approvals_tenant_isolation ON approvals
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 16. package_sessions
ALTER TABLE package_sessions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE package_sessions SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE package_sessions ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE package_sessions DROP CONSTRAINT IF EXISTS fk_package_sessions_tenant;
ALTER TABLE package_sessions ADD CONSTRAINT fk_package_sessions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_package_sessions_tenant_id ON package_sessions (tenant_id);
ALTER TABLE package_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_package_sessions_tenant_isolation ON package_sessions;
CREATE POLICY rls_package_sessions_tenant_isolation ON package_sessions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 17. internal_messages
ALTER TABLE internal_messages ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE internal_messages SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE internal_messages ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE internal_messages DROP CONSTRAINT IF EXISTS fk_internal_messages_tenant;
ALTER TABLE internal_messages ADD CONSTRAINT fk_internal_messages_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_internal_messages_tenant_id ON internal_messages (tenant_id);
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_messages FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_internal_messages_tenant_isolation ON internal_messages;
CREATE POLICY rls_internal_messages_tenant_isolation ON internal_messages
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

COMMIT;
