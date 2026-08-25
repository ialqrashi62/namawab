-- filepath: namaweb/migrations/e54_53dept_assessments_up.sql
-- e54: 53 dept assessment tables (one per dept)
-- Pattern: each dept gets a {_assessments} table with tenant_id, RLS, indexes
BEGIN;

-- allergy assessments
CREATE TABLE IF NOT EXISTS allergy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_allergy_tenant_created ON allergy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_allergy_patient ON allergy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_allergy_engine ON allergy_assessments(engine_name);
ALTER TABLE allergy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allergy_tenant_isolation ON allergy_assessments;
CREATE POLICY allergy_tenant_isolation ON allergy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER allergy_set_updated_at
    BEFORE UPDATE ON allergy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- anesthesia assessments
CREATE TABLE IF NOT EXISTS anesthesia_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_anesthesia_tenant_created ON anesthesia_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anesthesia_patient ON anesthesia_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_anesthesia_engine ON anesthesia_assessments(engine_name);
ALTER TABLE anesthesia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE anesthesia_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anesthesia_tenant_isolation ON anesthesia_assessments;
CREATE POLICY anesthesia_tenant_isolation ON anesthesia_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER anesthesia_set_updated_at
    BEFORE UPDATE ON anesthesia_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- audiology assessments
CREATE TABLE IF NOT EXISTS audiology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audiology_tenant_created ON audiology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audiology_patient ON audiology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audiology_engine ON audiology_assessments(engine_name);
ALTER TABLE audiology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audiology_tenant_isolation ON audiology_assessments;
CREATE POLICY audiology_tenant_isolation ON audiology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER audiology_set_updated_at
    BEFORE UPDATE ON audiology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- burn_unit assessments
CREATE TABLE IF NOT EXISTS burn_unit_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_burn_unit_tenant_created ON burn_unit_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_burn_unit_patient ON burn_unit_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_burn_unit_engine ON burn_unit_assessments(engine_name);
ALTER TABLE burn_unit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_unit_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS burn_unit_tenant_isolation ON burn_unit_assessments;
CREATE POLICY burn_unit_tenant_isolation ON burn_unit_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER burn_unit_set_updated_at
    BEFORE UPDATE ON burn_unit_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- cardiac_rehab assessments
CREATE TABLE IF NOT EXISTS cardiac_rehab_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_tenant_created ON cardiac_rehab_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_patient ON cardiac_rehab_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_engine ON cardiac_rehab_assessments(engine_name);
ALTER TABLE cardiac_rehab_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiac_rehab_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardiac_rehab_tenant_isolation ON cardiac_rehab_assessments;
CREATE POLICY cardiac_rehab_tenant_isolation ON cardiac_rehab_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER cardiac_rehab_set_updated_at
    BEFORE UPDATE ON cardiac_rehab_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- ccu assessments
CREATE TABLE IF NOT EXISTS ccu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_tenant_created ON ccu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ccu_patient ON ccu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ccu_engine ON ccu_assessments(engine_name);
ALTER TABLE ccu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ccu_tenant_isolation ON ccu_assessments;
CREATE POLICY ccu_tenant_isolation ON ccu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER ccu_set_updated_at
    BEFORE UPDATE ON ccu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- chaplaincy assessments
CREATE TABLE IF NOT EXISTS chaplaincy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chaplaincy_tenant_created ON chaplaincy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chaplaincy_patient ON chaplaincy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chaplaincy_engine ON chaplaincy_assessments(engine_name);
ALTER TABLE chaplaincy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chaplaincy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chaplaincy_tenant_isolation ON chaplaincy_assessments;
CREATE POLICY chaplaincy_tenant_isolation ON chaplaincy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER chaplaincy_set_updated_at
    BEFORE UPDATE ON chaplaincy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- cicu assessments
CREATE TABLE IF NOT EXISTS cicu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cicu_tenant_created ON cicu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cicu_patient ON cicu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cicu_engine ON cicu_assessments(engine_name);
ALTER TABLE cicu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cicu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cicu_tenant_isolation ON cicu_assessments;
CREATE POLICY cicu_tenant_isolation ON cicu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER cicu_set_updated_at
    BEFORE UPDATE ON cicu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- ctu assessments
CREATE TABLE IF NOT EXISTS ctu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ctu_tenant_created ON ctu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ctu_patient ON ctu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ctu_engine ON ctu_assessments(engine_name);
ALTER TABLE ctu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ctu_tenant_isolation ON ctu_assessments;
CREATE POLICY ctu_tenant_isolation ON ctu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER ctu_set_updated_at
    BEFORE UPDATE ON ctu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- dermatology assessments
CREATE TABLE IF NOT EXISTS dermatology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dermatology_tenant_created ON dermatology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dermatology_patient ON dermatology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dermatology_engine ON dermatology_assessments(engine_name);
ALTER TABLE dermatology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dermatology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dermatology_tenant_isolation ON dermatology_assessments;
CREATE POLICY dermatology_tenant_isolation ON dermatology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER dermatology_set_updated_at
    BEFORE UPDATE ON dermatology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- dialysis assessments
CREATE TABLE IF NOT EXISTS dialysis_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dialysis_tenant_created ON dialysis_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dialysis_patient ON dialysis_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dialysis_engine ON dialysis_assessments(engine_name);
ALTER TABLE dialysis_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialysis_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dialysis_tenant_isolation ON dialysis_assessments;
CREATE POLICY dialysis_tenant_isolation ON dialysis_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER dialysis_set_updated_at
    BEFORE UPDATE ON dialysis_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- epilepsy assessments
CREATE TABLE IF NOT EXISTS epilepsy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_epilepsy_tenant_created ON epilepsy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_epilepsy_patient ON epilepsy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_epilepsy_engine ON epilepsy_assessments(engine_name);
ALTER TABLE epilepsy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE epilepsy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS epilepsy_tenant_isolation ON epilepsy_assessments;
CREATE POLICY epilepsy_tenant_isolation ON epilepsy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER epilepsy_set_updated_at
    BEFORE UPDATE ON epilepsy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- fetal_medicine assessments
CREATE TABLE IF NOT EXISTS fetal_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_tenant_created ON fetal_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_patient ON fetal_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_engine ON fetal_medicine_assessments(engine_name);
ALTER TABLE fetal_medicine_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fetal_medicine_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fetal_medicine_tenant_isolation ON fetal_medicine_assessments;
CREATE POLICY fetal_medicine_tenant_isolation ON fetal_medicine_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER fetal_medicine_set_updated_at
    BEFORE UPDATE ON fetal_medicine_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- genetics assessments
CREATE TABLE IF NOT EXISTS genetics_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_genetics_tenant_created ON genetics_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_genetics_patient ON genetics_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_genetics_engine ON genetics_assessments(engine_name);
ALTER TABLE genetics_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetics_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_tenant_isolation ON genetics_assessments;
CREATE POLICY genetics_tenant_isolation ON genetics_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER genetics_set_updated_at
    BEFORE UPDATE ON genetics_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- headache assessments
CREATE TABLE IF NOT EXISTS headache_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_headache_tenant_created ON headache_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_headache_patient ON headache_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_headache_engine ON headache_assessments(engine_name);
ALTER TABLE headache_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE headache_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS headache_tenant_isolation ON headache_assessments;
CREATE POLICY headache_tenant_isolation ON headache_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER headache_set_updated_at
    BEFORE UPDATE ON headache_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- hematology assessments
CREATE TABLE IF NOT EXISTS hematology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hematology_tenant_created ON hematology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hematology_patient ON hematology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hematology_engine ON hematology_assessments(engine_name);
ALTER TABLE hematology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hematology_tenant_isolation ON hematology_assessments;
CREATE POLICY hematology_tenant_isolation ON hematology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER hematology_set_updated_at
    BEFORE UPDATE ON hematology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- icu assessments
CREATE TABLE IF NOT EXISTS icu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_icu_tenant_created ON icu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_icu_patient ON icu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_icu_engine ON icu_assessments(engine_name);
ALTER TABLE icu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_tenant_isolation ON icu_assessments;
CREATE POLICY icu_tenant_isolation ON icu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER icu_set_updated_at
    BEFORE UPDATE ON icu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- immunology assessments
CREATE TABLE IF NOT EXISTS immunology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_immunology_tenant_created ON immunology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_immunology_patient ON immunology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_immunology_engine ON immunology_assessments(engine_name);
ALTER TABLE immunology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS immunology_tenant_isolation ON immunology_assessments;
CREATE POLICY immunology_tenant_isolation ON immunology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER immunology_set_updated_at
    BEFORE UPDATE ON immunology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- infection_control assessments
CREATE TABLE IF NOT EXISTS infection_control_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_infection_control_tenant_created ON infection_control_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_infection_control_patient ON infection_control_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_infection_control_engine ON infection_control_assessments(engine_name);
ALTER TABLE infection_control_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE infection_control_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS infection_control_tenant_isolation ON infection_control_assessments;
CREATE POLICY infection_control_tenant_isolation ON infection_control_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER infection_control_set_updated_at
    BEFORE UPDATE ON infection_control_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- infectious_disease assessments
CREATE TABLE IF NOT EXISTS infectious_disease_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_infectious_disease_tenant_created ON infectious_disease_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_infectious_disease_patient ON infectious_disease_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_infectious_disease_engine ON infectious_disease_assessments(engine_name);
ALTER TABLE infectious_disease_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE infectious_disease_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS infectious_disease_tenant_isolation ON infectious_disease_assessments;
CREATE POLICY infectious_disease_tenant_isolation ON infectious_disease_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER infectious_disease_set_updated_at
    BEFORE UPDATE ON infectious_disease_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- ivf assessments
CREATE TABLE IF NOT EXISTS ivf_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ivf_tenant_created ON ivf_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ivf_patient ON ivf_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ivf_engine ON ivf_assessments(engine_name);
ALTER TABLE ivf_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivf_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ivf_tenant_isolation ON ivf_assessments;
CREATE POLICY ivf_tenant_isolation ON ivf_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER ivf_set_updated_at
    BEFORE UPDATE ON ivf_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- maternal_fetal assessments
CREATE TABLE IF NOT EXISTS maternal_fetal_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_tenant_created ON maternal_fetal_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_patient ON maternal_fetal_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_engine ON maternal_fetal_assessments(engine_name);
ALTER TABLE maternal_fetal_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maternal_fetal_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS maternal_fetal_tenant_isolation ON maternal_fetal_assessments;
CREATE POLICY maternal_fetal_tenant_isolation ON maternal_fetal_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER maternal_fetal_set_updated_at
    BEFORE UPDATE ON maternal_fetal_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- memory_clinic assessments
CREATE TABLE IF NOT EXISTS memory_clinic_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_memory_clinic_tenant_created ON memory_clinic_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_clinic_patient ON memory_clinic_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memory_clinic_engine ON memory_clinic_assessments(engine_name);
ALTER TABLE memory_clinic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_clinic_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS memory_clinic_tenant_isolation ON memory_clinic_assessments;
CREATE POLICY memory_clinic_tenant_isolation ON memory_clinic_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER memory_clinic_set_updated_at
    BEFORE UPDATE ON memory_clinic_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- movement_disorders assessments
CREATE TABLE IF NOT EXISTS movement_disorders_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_movement_disorders_tenant_created ON movement_disorders_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_disorders_patient ON movement_disorders_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movement_disorders_engine ON movement_disorders_assessments(engine_name);
ALTER TABLE movement_disorders_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_disorders_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS movement_disorders_tenant_isolation ON movement_disorders_assessments;
CREATE POLICY movement_disorders_tenant_isolation ON movement_disorders_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER movement_disorders_set_updated_at
    BEFORE UPDATE ON movement_disorders_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- movement assessments
CREATE TABLE IF NOT EXISTS movement_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_movement_tenant_created ON movement_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_patient ON movement_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movement_engine ON movement_assessments(engine_name);
ALTER TABLE movement_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS movement_tenant_isolation ON movement_assessments;
CREATE POLICY movement_tenant_isolation ON movement_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER movement_set_updated_at
    BEFORE UPDATE ON movement_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- multiple_sclerosis assessments
CREATE TABLE IF NOT EXISTS multiple_sclerosis_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_tenant_created ON multiple_sclerosis_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_patient ON multiple_sclerosis_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_engine ON multiple_sclerosis_assessments(engine_name);
ALTER TABLE multiple_sclerosis_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiple_sclerosis_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS multiple_sclerosis_tenant_isolation ON multiple_sclerosis_assessments;
CREATE POLICY multiple_sclerosis_tenant_isolation ON multiple_sclerosis_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER multiple_sclerosis_set_updated_at
    BEFORE UPDATE ON multiple_sclerosis_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- neonatology assessments
CREATE TABLE IF NOT EXISTS neonatology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_neonatology_tenant_created ON neonatology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neonatology_patient ON neonatology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neonatology_engine ON neonatology_assessments(engine_name);
ALTER TABLE neonatology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neonatology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neonatology_tenant_isolation ON neonatology_assessments;
CREATE POLICY neonatology_tenant_isolation ON neonatology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER neonatology_set_updated_at
    BEFORE UPDATE ON neonatology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- neurosurgery assessments
CREATE TABLE IF NOT EXISTS neurosurgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_neurosurgery_tenant_created ON neurosurgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neurosurgery_patient ON neurosurgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neurosurgery_engine ON neurosurgery_assessments(engine_name);
ALTER TABLE neurosurgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neurosurgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neurosurgery_tenant_isolation ON neurosurgery_assessments;
CREATE POLICY neurosurgery_tenant_isolation ON neurosurgery_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER neurosurgery_set_updated_at
    BEFORE UPDATE ON neurosurgery_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- neuro_oncology assessments
CREATE TABLE IF NOT EXISTS neuro_oncology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_tenant_created ON neuro_oncology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_patient ON neuro_oncology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_engine ON neuro_oncology_assessments(engine_name);
ALTER TABLE neuro_oncology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_oncology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_oncology_tenant_isolation ON neuro_oncology_assessments;
CREATE POLICY neuro_oncology_tenant_isolation ON neuro_oncology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER neuro_oncology_set_updated_at
    BEFORE UPDATE ON neuro_oncology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- nicu assessments
CREATE TABLE IF NOT EXISTS nicu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nicu_tenant_created ON nicu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nicu_patient ON nicu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nicu_engine ON nicu_assessments(engine_name);
ALTER TABLE nicu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nicu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nicu_tenant_isolation ON nicu_assessments;
CREATE POLICY nicu_tenant_isolation ON nicu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER nicu_set_updated_at
    BEFORE UPDATE ON nicu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- nuclear_medicine assessments
CREATE TABLE IF NOT EXISTS nuclear_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_tenant_created ON nuclear_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_patient ON nuclear_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_engine ON nuclear_medicine_assessments(engine_name);
ALTER TABLE nuclear_medicine_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_medicine_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nuclear_medicine_tenant_isolation ON nuclear_medicine_assessments;
CREATE POLICY nuclear_medicine_tenant_isolation ON nuclear_medicine_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER nuclear_medicine_set_updated_at
    BEFORE UPDATE ON nuclear_medicine_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- nutrition assessments
CREATE TABLE IF NOT EXISTS nutrition_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nutrition_tenant_created ON nutrition_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_patient ON nutrition_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nutrition_engine ON nutrition_assessments(engine_name);
ALTER TABLE nutrition_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nutrition_tenant_isolation ON nutrition_assessments;
CREATE POLICY nutrition_tenant_isolation ON nutrition_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER nutrition_set_updated_at
    BEFORE UPDATE ON nutrition_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- occupational_therapy assessments
CREATE TABLE IF NOT EXISTS occupational_therapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_tenant_created ON occupational_therapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_patient ON occupational_therapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_engine ON occupational_therapy_assessments(engine_name);
ALTER TABLE occupational_therapy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupational_therapy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS occupational_therapy_tenant_isolation ON occupational_therapy_assessments;
CREATE POLICY occupational_therapy_tenant_isolation ON occupational_therapy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER occupational_therapy_set_updated_at
    BEFORE UPDATE ON occupational_therapy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- pain_management assessments
CREATE TABLE IF NOT EXISTS pain_management_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pain_management_tenant_created ON pain_management_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pain_management_patient ON pain_management_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pain_management_engine ON pain_management_assessments(engine_name);
ALTER TABLE pain_management_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_management_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_management_tenant_isolation ON pain_management_assessments;
CREATE POLICY pain_management_tenant_isolation ON pain_management_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER pain_management_set_updated_at
    BEFORE UPDATE ON pain_management_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- palliative_care assessments
CREATE TABLE IF NOT EXISTS palliative_care_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_palliative_care_tenant_created ON palliative_care_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palliative_care_patient ON palliative_care_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_palliative_care_engine ON palliative_care_assessments(engine_name);
ALTER TABLE palliative_care_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE palliative_care_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS palliative_care_tenant_isolation ON palliative_care_assessments;
CREATE POLICY palliative_care_tenant_isolation ON palliative_care_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER palliative_care_set_updated_at
    BEFORE UPDATE ON palliative_care_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- pathology assessments
CREATE TABLE IF NOT EXISTS pathology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pathology_tenant_created ON pathology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pathology_patient ON pathology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pathology_engine ON pathology_assessments(engine_name);
ALTER TABLE pathology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pathology_tenant_isolation ON pathology_assessments;
CREATE POLICY pathology_tenant_isolation ON pathology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER pathology_set_updated_at
    BEFORE UPDATE ON pathology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- physiotherapy assessments
CREATE TABLE IF NOT EXISTS physiotherapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_physiotherapy_tenant_created ON physiotherapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_physiotherapy_patient ON physiotherapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_physiotherapy_engine ON physiotherapy_assessments(engine_name);
ALTER TABLE physiotherapy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE physiotherapy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS physiotherapy_tenant_isolation ON physiotherapy_assessments;
CREATE POLICY physiotherapy_tenant_isolation ON physiotherapy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER physiotherapy_set_updated_at
    BEFORE UPDATE ON physiotherapy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- picu assessments
CREATE TABLE IF NOT EXISTS picu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_picu_tenant_created ON picu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_picu_patient ON picu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_picu_engine ON picu_assessments(engine_name);
ALTER TABLE picu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE picu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS picu_tenant_isolation ON picu_assessments;
CREATE POLICY picu_tenant_isolation ON picu_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER picu_set_updated_at
    BEFORE UPDATE ON picu_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- plastic_surgery assessments
CREATE TABLE IF NOT EXISTS plastic_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_tenant_created ON plastic_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_patient ON plastic_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_engine ON plastic_surgery_assessments(engine_name);
ALTER TABLE plastic_surgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_surgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plastic_surgery_tenant_isolation ON plastic_surgery_assessments;
CREATE POLICY plastic_surgery_tenant_isolation ON plastic_surgery_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER plastic_surgery_set_updated_at
    BEFORE UPDATE ON plastic_surgery_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- psychiatry assessments
CREATE TABLE IF NOT EXISTS psychiatry_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_psychiatry_tenant_created ON psychiatry_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_psychiatry_patient ON psychiatry_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_psychiatry_engine ON psychiatry_assessments(engine_name);
ALTER TABLE psychiatry_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychiatry_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psychiatry_tenant_isolation ON psychiatry_assessments;
CREATE POLICY psychiatry_tenant_isolation ON psychiatry_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER psychiatry_set_updated_at
    BEFORE UPDATE ON psychiatry_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- pulmonary_rehab assessments
CREATE TABLE IF NOT EXISTS pulmonary_rehab_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_tenant_created ON pulmonary_rehab_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_patient ON pulmonary_rehab_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_engine ON pulmonary_rehab_assessments(engine_name);
ALTER TABLE pulmonary_rehab_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_rehab_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulmonary_rehab_tenant_isolation ON pulmonary_rehab_assessments;
CREATE POLICY pulmonary_rehab_tenant_isolation ON pulmonary_rehab_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER pulmonary_rehab_set_updated_at
    BEFORE UPDATE ON pulmonary_rehab_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- radiology assessments
CREATE TABLE IF NOT EXISTS radiology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_radiology_tenant_created ON radiology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_radiology_patient ON radiology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_radiology_engine ON radiology_assessments(engine_name);
ALTER TABLE radiology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS radiology_tenant_isolation ON radiology_assessments;
CREATE POLICY radiology_tenant_isolation ON radiology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER radiology_set_updated_at
    BEFORE UPDATE ON radiology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- rehabilitation assessments
CREATE TABLE IF NOT EXISTS rehabilitation_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rehabilitation_tenant_created ON rehabilitation_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rehabilitation_patient ON rehabilitation_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rehabilitation_engine ON rehabilitation_assessments(engine_name);
ALTER TABLE rehabilitation_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehabilitation_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehabilitation_tenant_isolation ON rehabilitation_assessments;
CREATE POLICY rehabilitation_tenant_isolation ON rehabilitation_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER rehabilitation_set_updated_at
    BEFORE UPDATE ON rehabilitation_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- sleep_medicine assessments
CREATE TABLE IF NOT EXISTS sleep_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_tenant_created ON sleep_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_patient ON sleep_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_engine ON sleep_medicine_assessments(engine_name);
ALTER TABLE sleep_medicine_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_medicine_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sleep_medicine_tenant_isolation ON sleep_medicine_assessments;
CREATE POLICY sleep_medicine_tenant_isolation ON sleep_medicine_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER sleep_medicine_set_updated_at
    BEFORE UPDATE ON sleep_medicine_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- social_work assessments
CREATE TABLE IF NOT EXISTS social_work_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_social_work_tenant_created ON social_work_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_work_patient ON social_work_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_social_work_engine ON social_work_assessments(engine_name);
ALTER TABLE social_work_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_work_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS social_work_tenant_isolation ON social_work_assessments;
CREATE POLICY social_work_tenant_isolation ON social_work_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER social_work_set_updated_at
    BEFORE UPDATE ON social_work_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- speech_therapy assessments
CREATE TABLE IF NOT EXISTS speech_therapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_speech_therapy_tenant_created ON speech_therapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speech_therapy_patient ON speech_therapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_speech_therapy_engine ON speech_therapy_assessments(engine_name);
ALTER TABLE speech_therapy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_therapy_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS speech_therapy_tenant_isolation ON speech_therapy_assessments;
CREATE POLICY speech_therapy_tenant_isolation ON speech_therapy_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER speech_therapy_set_updated_at
    BEFORE UPDATE ON speech_therapy_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- stroke_unit assessments
CREATE TABLE IF NOT EXISTS stroke_unit_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_unit_tenant_created ON stroke_unit_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stroke_unit_patient ON stroke_unit_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stroke_unit_engine ON stroke_unit_assessments(engine_name);
ALTER TABLE stroke_unit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_unit_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_unit_tenant_isolation ON stroke_unit_assessments;
CREATE POLICY stroke_unit_tenant_isolation ON stroke_unit_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER stroke_unit_set_updated_at
    BEFORE UPDATE ON stroke_unit_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- thoracic_surgery assessments
CREATE TABLE IF NOT EXISTS thoracic_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_tenant_created ON thoracic_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_patient ON thoracic_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_engine ON thoracic_surgery_assessments(engine_name);
ALTER TABLE thoracic_surgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoracic_surgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS thoracic_surgery_tenant_isolation ON thoracic_surgery_assessments;
CREATE POLICY thoracic_surgery_tenant_isolation ON thoracic_surgery_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER thoracic_surgery_set_updated_at
    BEFORE UPDATE ON thoracic_surgery_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- transplant assessments
CREATE TABLE IF NOT EXISTS transplant_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transplant_tenant_created ON transplant_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transplant_patient ON transplant_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transplant_engine ON transplant_assessments(engine_name);
ALTER TABLE transplant_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS transplant_tenant_isolation ON transplant_assessments;
CREATE POLICY transplant_tenant_isolation ON transplant_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER transplant_set_updated_at
    BEFORE UPDATE ON transplant_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- trauma_surgery assessments
CREATE TABLE IF NOT EXISTS trauma_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_tenant_created ON trauma_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_patient ON trauma_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_engine ON trauma_surgery_assessments(engine_name);
ALTER TABLE trauma_surgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_surgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trauma_surgery_tenant_isolation ON trauma_surgery_assessments;
CREATE POLICY trauma_surgery_tenant_isolation ON trauma_surgery_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER trauma_surgery_set_updated_at
    BEFORE UPDATE ON trauma_surgery_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- urology assessments
CREATE TABLE IF NOT EXISTS urology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_urology_tenant_created ON urology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_urology_patient ON urology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_urology_engine ON urology_assessments(engine_name);
ALTER TABLE urology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE urology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS urology_tenant_isolation ON urology_assessments;
CREATE POLICY urology_tenant_isolation ON urology_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER urology_set_updated_at
    BEFORE UPDATE ON urology_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- vascular_surgery assessments
CREATE TABLE IF NOT EXISTS vascular_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_tenant_created ON vascular_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_patient ON vascular_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_engine ON vascular_surgery_assessments(engine_name);
ALTER TABLE vascular_surgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vascular_surgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vascular_surgery_tenant_isolation ON vascular_surgery_assessments;
CREATE POLICY vascular_surgery_tenant_isolation ON vascular_surgery_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER vascular_surgery_set_updated_at
    BEFORE UPDATE ON vascular_surgery_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();


-- wound_care assessments
CREATE TABLE IF NOT EXISTS wound_care_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wound_care_tenant_created ON wound_care_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wound_care_patient ON wound_care_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wound_care_engine ON wound_care_assessments(engine_name);
ALTER TABLE wound_care_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wound_care_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wound_care_tenant_isolation ON wound_care_assessments;
CREATE POLICY wound_care_tenant_isolation ON wound_care_assessments
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER wound_care_set_updated_at
    BEFORE UPDATE ON wound_care_assessments
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

COMMIT;
