-- filepath: namaweb/migrations/e54_53dept_assessments_v5_up.sql
-- e54 v5: 53 dept tables (no FKs, defensive RLS, independent blocks)

-- allergy assessments
CREATE TABLE IF NOT EXISTS allergy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE allergy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_allergy_tenant_created ON allergy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_allergy_patient ON allergy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_allergy_engine ON allergy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE allergy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on allergy_assessments';
    END;
    BEGIN
        ALTER TABLE allergy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on allergy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS allergy_tenant_isolation ON allergy_assessments';
    EXECUTE 'CREATE POLICY allergy_tenant_isolation ON allergy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- anesthesia assessments
CREATE TABLE IF NOT EXISTS anesthesia_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE anesthesia_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_anesthesia_tenant_created ON anesthesia_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anesthesia_patient ON anesthesia_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_anesthesia_engine ON anesthesia_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE anesthesia_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on anesthesia_assessments';
    END;
    BEGIN
        ALTER TABLE anesthesia_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on anesthesia_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS anesthesia_tenant_isolation ON anesthesia_assessments';
    EXECUTE 'CREATE POLICY anesthesia_tenant_isolation ON anesthesia_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- audiology assessments
CREATE TABLE IF NOT EXISTS audiology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE audiology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_audiology_tenant_created ON audiology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audiology_patient ON audiology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audiology_engine ON audiology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE audiology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on audiology_assessments';
    END;
    BEGIN
        ALTER TABLE audiology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on audiology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS audiology_tenant_isolation ON audiology_assessments';
    EXECUTE 'CREATE POLICY audiology_tenant_isolation ON audiology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- burn_unit assessments
CREATE TABLE IF NOT EXISTS burn_unit_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE burn_unit_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_burn_unit_tenant_created ON burn_unit_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_burn_unit_patient ON burn_unit_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_burn_unit_engine ON burn_unit_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE burn_unit_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on burn_unit_assessments';
    END;
    BEGIN
        ALTER TABLE burn_unit_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on burn_unit_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS burn_unit_tenant_isolation ON burn_unit_assessments';
    EXECUTE 'CREATE POLICY burn_unit_tenant_isolation ON burn_unit_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- cardiac_rehab assessments
CREATE TABLE IF NOT EXISTS cardiac_rehab_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE cardiac_rehab_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_tenant_created ON cardiac_rehab_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_patient ON cardiac_rehab_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_engine ON cardiac_rehab_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE cardiac_rehab_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on cardiac_rehab_assessments';
    END;
    BEGIN
        ALTER TABLE cardiac_rehab_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on cardiac_rehab_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS cardiac_rehab_tenant_isolation ON cardiac_rehab_assessments';
    EXECUTE 'CREATE POLICY cardiac_rehab_tenant_isolation ON cardiac_rehab_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- ccu assessments
CREATE TABLE IF NOT EXISTS ccu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE ccu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_ccu_tenant_created ON ccu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ccu_patient ON ccu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ccu_engine ON ccu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE ccu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on ccu_assessments';
    END;
    BEGIN
        ALTER TABLE ccu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on ccu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS ccu_tenant_isolation ON ccu_assessments';
    EXECUTE 'CREATE POLICY ccu_tenant_isolation ON ccu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- chaplaincy assessments
CREATE TABLE IF NOT EXISTS chaplaincy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE chaplaincy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_chaplaincy_tenant_created ON chaplaincy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chaplaincy_patient ON chaplaincy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chaplaincy_engine ON chaplaincy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE chaplaincy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on chaplaincy_assessments';
    END;
    BEGIN
        ALTER TABLE chaplaincy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on chaplaincy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS chaplaincy_tenant_isolation ON chaplaincy_assessments';
    EXECUTE 'CREATE POLICY chaplaincy_tenant_isolation ON chaplaincy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- cicu assessments
CREATE TABLE IF NOT EXISTS cicu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE cicu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_cicu_tenant_created ON cicu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cicu_patient ON cicu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cicu_engine ON cicu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE cicu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on cicu_assessments';
    END;
    BEGIN
        ALTER TABLE cicu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on cicu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS cicu_tenant_isolation ON cicu_assessments';
    EXECUTE 'CREATE POLICY cicu_tenant_isolation ON cicu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- ctu assessments
CREATE TABLE IF NOT EXISTS ctu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE ctu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_ctu_tenant_created ON ctu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ctu_patient ON ctu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ctu_engine ON ctu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE ctu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on ctu_assessments';
    END;
    BEGIN
        ALTER TABLE ctu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on ctu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS ctu_tenant_isolation ON ctu_assessments';
    EXECUTE 'CREATE POLICY ctu_tenant_isolation ON ctu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- dermatology assessments
CREATE TABLE IF NOT EXISTS dermatology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE dermatology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_dermatology_tenant_created ON dermatology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dermatology_patient ON dermatology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dermatology_engine ON dermatology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE dermatology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on dermatology_assessments';
    END;
    BEGIN
        ALTER TABLE dermatology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on dermatology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS dermatology_tenant_isolation ON dermatology_assessments';
    EXECUTE 'CREATE POLICY dermatology_tenant_isolation ON dermatology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- dialysis assessments
CREATE TABLE IF NOT EXISTS dialysis_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE dialysis_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_dialysis_tenant_created ON dialysis_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dialysis_patient ON dialysis_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dialysis_engine ON dialysis_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE dialysis_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on dialysis_assessments';
    END;
    BEGIN
        ALTER TABLE dialysis_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on dialysis_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS dialysis_tenant_isolation ON dialysis_assessments';
    EXECUTE 'CREATE POLICY dialysis_tenant_isolation ON dialysis_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- epilepsy assessments
CREATE TABLE IF NOT EXISTS epilepsy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE epilepsy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_epilepsy_tenant_created ON epilepsy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_epilepsy_patient ON epilepsy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_epilepsy_engine ON epilepsy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE epilepsy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on epilepsy_assessments';
    END;
    BEGIN
        ALTER TABLE epilepsy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on epilepsy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS epilepsy_tenant_isolation ON epilepsy_assessments';
    EXECUTE 'CREATE POLICY epilepsy_tenant_isolation ON epilepsy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- fetal_medicine assessments
CREATE TABLE IF NOT EXISTS fetal_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE fetal_medicine_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_tenant_created ON fetal_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_patient ON fetal_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fetal_medicine_engine ON fetal_medicine_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE fetal_medicine_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on fetal_medicine_assessments';
    END;
    BEGIN
        ALTER TABLE fetal_medicine_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on fetal_medicine_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS fetal_medicine_tenant_isolation ON fetal_medicine_assessments';
    EXECUTE 'CREATE POLICY fetal_medicine_tenant_isolation ON fetal_medicine_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- genetics assessments
CREATE TABLE IF NOT EXISTS genetics_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE genetics_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_genetics_tenant_created ON genetics_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_genetics_patient ON genetics_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_genetics_engine ON genetics_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE genetics_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on genetics_assessments';
    END;
    BEGIN
        ALTER TABLE genetics_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on genetics_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS genetics_tenant_isolation ON genetics_assessments';
    EXECUTE 'CREATE POLICY genetics_tenant_isolation ON genetics_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- headache assessments
CREATE TABLE IF NOT EXISTS headache_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE headache_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_headache_tenant_created ON headache_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_headache_patient ON headache_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_headache_engine ON headache_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE headache_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on headache_assessments';
    END;
    BEGIN
        ALTER TABLE headache_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on headache_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS headache_tenant_isolation ON headache_assessments';
    EXECUTE 'CREATE POLICY headache_tenant_isolation ON headache_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- hematology assessments
CREATE TABLE IF NOT EXISTS hematology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE hematology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_hematology_tenant_created ON hematology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hematology_patient ON hematology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hematology_engine ON hematology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE hematology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on hematology_assessments';
    END;
    BEGIN
        ALTER TABLE hematology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on hematology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS hematology_tenant_isolation ON hematology_assessments';
    EXECUTE 'CREATE POLICY hematology_tenant_isolation ON hematology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- icu assessments
CREATE TABLE IF NOT EXISTS icu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE icu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_icu_tenant_created ON icu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_icu_patient ON icu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_icu_engine ON icu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE icu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on icu_assessments';
    END;
    BEGIN
        ALTER TABLE icu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on icu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS icu_tenant_isolation ON icu_assessments';
    EXECUTE 'CREATE POLICY icu_tenant_isolation ON icu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- immunology assessments
CREATE TABLE IF NOT EXISTS immunology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE immunology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_immunology_tenant_created ON immunology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_immunology_patient ON immunology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_immunology_engine ON immunology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE immunology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on immunology_assessments';
    END;
    BEGIN
        ALTER TABLE immunology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on immunology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS immunology_tenant_isolation ON immunology_assessments';
    EXECUTE 'CREATE POLICY immunology_tenant_isolation ON immunology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- infection_control assessments
CREATE TABLE IF NOT EXISTS infection_control_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE infection_control_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_infection_control_tenant_created ON infection_control_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_infection_control_patient ON infection_control_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_infection_control_engine ON infection_control_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE infection_control_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on infection_control_assessments';
    END;
    BEGIN
        ALTER TABLE infection_control_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on infection_control_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS infection_control_tenant_isolation ON infection_control_assessments';
    EXECUTE 'CREATE POLICY infection_control_tenant_isolation ON infection_control_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- infectious_disease assessments
CREATE TABLE IF NOT EXISTS infectious_disease_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE infectious_disease_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_infectious_disease_tenant_created ON infectious_disease_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_infectious_disease_patient ON infectious_disease_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_infectious_disease_engine ON infectious_disease_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE infectious_disease_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on infectious_disease_assessments';
    END;
    BEGIN
        ALTER TABLE infectious_disease_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on infectious_disease_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS infectious_disease_tenant_isolation ON infectious_disease_assessments';
    EXECUTE 'CREATE POLICY infectious_disease_tenant_isolation ON infectious_disease_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- ivf assessments
CREATE TABLE IF NOT EXISTS ivf_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE ivf_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_ivf_tenant_created ON ivf_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ivf_patient ON ivf_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ivf_engine ON ivf_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE ivf_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on ivf_assessments';
    END;
    BEGIN
        ALTER TABLE ivf_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on ivf_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS ivf_tenant_isolation ON ivf_assessments';
    EXECUTE 'CREATE POLICY ivf_tenant_isolation ON ivf_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- maternal_fetal assessments
CREATE TABLE IF NOT EXISTS maternal_fetal_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE maternal_fetal_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_tenant_created ON maternal_fetal_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_patient ON maternal_fetal_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_maternal_fetal_engine ON maternal_fetal_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE maternal_fetal_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on maternal_fetal_assessments';
    END;
    BEGIN
        ALTER TABLE maternal_fetal_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on maternal_fetal_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS maternal_fetal_tenant_isolation ON maternal_fetal_assessments';
    EXECUTE 'CREATE POLICY maternal_fetal_tenant_isolation ON maternal_fetal_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- memory_clinic assessments
CREATE TABLE IF NOT EXISTS memory_clinic_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE memory_clinic_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_memory_clinic_tenant_created ON memory_clinic_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_clinic_patient ON memory_clinic_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memory_clinic_engine ON memory_clinic_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE memory_clinic_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on memory_clinic_assessments';
    END;
    BEGIN
        ALTER TABLE memory_clinic_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on memory_clinic_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS memory_clinic_tenant_isolation ON memory_clinic_assessments';
    EXECUTE 'CREATE POLICY memory_clinic_tenant_isolation ON memory_clinic_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- movement_disorders assessments
CREATE TABLE IF NOT EXISTS movement_disorders_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE movement_disorders_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_movement_disorders_tenant_created ON movement_disorders_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_disorders_patient ON movement_disorders_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movement_disorders_engine ON movement_disorders_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE movement_disorders_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on movement_disorders_assessments';
    END;
    BEGIN
        ALTER TABLE movement_disorders_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on movement_disorders_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS movement_disorders_tenant_isolation ON movement_disorders_assessments';
    EXECUTE 'CREATE POLICY movement_disorders_tenant_isolation ON movement_disorders_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- movement assessments
CREATE TABLE IF NOT EXISTS movement_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE movement_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_movement_tenant_created ON movement_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_patient ON movement_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movement_engine ON movement_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE movement_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on movement_assessments';
    END;
    BEGIN
        ALTER TABLE movement_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on movement_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS movement_tenant_isolation ON movement_assessments';
    EXECUTE 'CREATE POLICY movement_tenant_isolation ON movement_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- multiple_sclerosis assessments
CREATE TABLE IF NOT EXISTS multiple_sclerosis_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE multiple_sclerosis_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_tenant_created ON multiple_sclerosis_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_patient ON multiple_sclerosis_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_multiple_sclerosis_engine ON multiple_sclerosis_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE multiple_sclerosis_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on multiple_sclerosis_assessments';
    END;
    BEGIN
        ALTER TABLE multiple_sclerosis_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on multiple_sclerosis_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS multiple_sclerosis_tenant_isolation ON multiple_sclerosis_assessments';
    EXECUTE 'CREATE POLICY multiple_sclerosis_tenant_isolation ON multiple_sclerosis_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- neonatology assessments
CREATE TABLE IF NOT EXISTS neonatology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE neonatology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_neonatology_tenant_created ON neonatology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neonatology_patient ON neonatology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neonatology_engine ON neonatology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE neonatology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on neonatology_assessments';
    END;
    BEGIN
        ALTER TABLE neonatology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on neonatology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS neonatology_tenant_isolation ON neonatology_assessments';
    EXECUTE 'CREATE POLICY neonatology_tenant_isolation ON neonatology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- neurosurgery assessments
CREATE TABLE IF NOT EXISTS neurosurgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE neurosurgery_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_neurosurgery_tenant_created ON neurosurgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neurosurgery_patient ON neurosurgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neurosurgery_engine ON neurosurgery_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE neurosurgery_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on neurosurgery_assessments';
    END;
    BEGIN
        ALTER TABLE neurosurgery_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on neurosurgery_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS neurosurgery_tenant_isolation ON neurosurgery_assessments';
    EXECUTE 'CREATE POLICY neurosurgery_tenant_isolation ON neurosurgery_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- neuro_oncology assessments
CREATE TABLE IF NOT EXISTS neuro_oncology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE neuro_oncology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_tenant_created ON neuro_oncology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_patient ON neuro_oncology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neuro_oncology_engine ON neuro_oncology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE neuro_oncology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on neuro_oncology_assessments';
    END;
    BEGIN
        ALTER TABLE neuro_oncology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on neuro_oncology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS neuro_oncology_tenant_isolation ON neuro_oncology_assessments';
    EXECUTE 'CREATE POLICY neuro_oncology_tenant_isolation ON neuro_oncology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- nicu assessments
CREATE TABLE IF NOT EXISTS nicu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE nicu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_nicu_tenant_created ON nicu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nicu_patient ON nicu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nicu_engine ON nicu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE nicu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on nicu_assessments';
    END;
    BEGIN
        ALTER TABLE nicu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on nicu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS nicu_tenant_isolation ON nicu_assessments';
    EXECUTE 'CREATE POLICY nicu_tenant_isolation ON nicu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- nuclear_medicine assessments
CREATE TABLE IF NOT EXISTS nuclear_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE nuclear_medicine_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_tenant_created ON nuclear_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_patient ON nuclear_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nuclear_medicine_engine ON nuclear_medicine_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE nuclear_medicine_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on nuclear_medicine_assessments';
    END;
    BEGIN
        ALTER TABLE nuclear_medicine_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on nuclear_medicine_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS nuclear_medicine_tenant_isolation ON nuclear_medicine_assessments';
    EXECUTE 'CREATE POLICY nuclear_medicine_tenant_isolation ON nuclear_medicine_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- nutrition assessments
CREATE TABLE IF NOT EXISTS nutrition_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE nutrition_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_nutrition_tenant_created ON nutrition_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_patient ON nutrition_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nutrition_engine ON nutrition_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE nutrition_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on nutrition_assessments';
    END;
    BEGIN
        ALTER TABLE nutrition_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on nutrition_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS nutrition_tenant_isolation ON nutrition_assessments';
    EXECUTE 'CREATE POLICY nutrition_tenant_isolation ON nutrition_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- occupational_therapy assessments
CREATE TABLE IF NOT EXISTS occupational_therapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE occupational_therapy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_tenant_created ON occupational_therapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_patient ON occupational_therapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_occupational_therapy_engine ON occupational_therapy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE occupational_therapy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on occupational_therapy_assessments';
    END;
    BEGIN
        ALTER TABLE occupational_therapy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on occupational_therapy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS occupational_therapy_tenant_isolation ON occupational_therapy_assessments';
    EXECUTE 'CREATE POLICY occupational_therapy_tenant_isolation ON occupational_therapy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- pain_management assessments
CREATE TABLE IF NOT EXISTS pain_management_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE pain_management_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_pain_management_tenant_created ON pain_management_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pain_management_patient ON pain_management_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pain_management_engine ON pain_management_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE pain_management_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on pain_management_assessments';
    END;
    BEGIN
        ALTER TABLE pain_management_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on pain_management_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS pain_management_tenant_isolation ON pain_management_assessments';
    EXECUTE 'CREATE POLICY pain_management_tenant_isolation ON pain_management_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- palliative_care assessments
CREATE TABLE IF NOT EXISTS palliative_care_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE palliative_care_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_palliative_care_tenant_created ON palliative_care_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palliative_care_patient ON palliative_care_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_palliative_care_engine ON palliative_care_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE palliative_care_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on palliative_care_assessments';
    END;
    BEGIN
        ALTER TABLE palliative_care_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on palliative_care_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS palliative_care_tenant_isolation ON palliative_care_assessments';
    EXECUTE 'CREATE POLICY palliative_care_tenant_isolation ON palliative_care_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- pathology assessments
CREATE TABLE IF NOT EXISTS pathology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE pathology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_pathology_tenant_created ON pathology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pathology_patient ON pathology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pathology_engine ON pathology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE pathology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on pathology_assessments';
    END;
    BEGIN
        ALTER TABLE pathology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on pathology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS pathology_tenant_isolation ON pathology_assessments';
    EXECUTE 'CREATE POLICY pathology_tenant_isolation ON pathology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- physiotherapy assessments
CREATE TABLE IF NOT EXISTS physiotherapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE physiotherapy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_physiotherapy_tenant_created ON physiotherapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_physiotherapy_patient ON physiotherapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_physiotherapy_engine ON physiotherapy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE physiotherapy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on physiotherapy_assessments';
    END;
    BEGIN
        ALTER TABLE physiotherapy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on physiotherapy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS physiotherapy_tenant_isolation ON physiotherapy_assessments';
    EXECUTE 'CREATE POLICY physiotherapy_tenant_isolation ON physiotherapy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- picu assessments
CREATE TABLE IF NOT EXISTS picu_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE picu_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_picu_tenant_created ON picu_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_picu_patient ON picu_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_picu_engine ON picu_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE picu_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on picu_assessments';
    END;
    BEGIN
        ALTER TABLE picu_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on picu_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS picu_tenant_isolation ON picu_assessments';
    EXECUTE 'CREATE POLICY picu_tenant_isolation ON picu_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- plastic_surgery assessments
CREATE TABLE IF NOT EXISTS plastic_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE plastic_surgery_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_tenant_created ON plastic_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_patient ON plastic_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_plastic_surgery_engine ON plastic_surgery_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE plastic_surgery_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on plastic_surgery_assessments';
    END;
    BEGIN
        ALTER TABLE plastic_surgery_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on plastic_surgery_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS plastic_surgery_tenant_isolation ON plastic_surgery_assessments';
    EXECUTE 'CREATE POLICY plastic_surgery_tenant_isolation ON plastic_surgery_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- psychiatry assessments
CREATE TABLE IF NOT EXISTS psychiatry_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE psychiatry_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_psychiatry_tenant_created ON psychiatry_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_psychiatry_patient ON psychiatry_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_psychiatry_engine ON psychiatry_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE psychiatry_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on psychiatry_assessments';
    END;
    BEGIN
        ALTER TABLE psychiatry_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on psychiatry_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS psychiatry_tenant_isolation ON psychiatry_assessments';
    EXECUTE 'CREATE POLICY psychiatry_tenant_isolation ON psychiatry_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- pulmonary_rehab assessments
CREATE TABLE IF NOT EXISTS pulmonary_rehab_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE pulmonary_rehab_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_tenant_created ON pulmonary_rehab_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_patient ON pulmonary_rehab_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pulmonary_rehab_engine ON pulmonary_rehab_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE pulmonary_rehab_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on pulmonary_rehab_assessments';
    END;
    BEGIN
        ALTER TABLE pulmonary_rehab_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on pulmonary_rehab_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS pulmonary_rehab_tenant_isolation ON pulmonary_rehab_assessments';
    EXECUTE 'CREATE POLICY pulmonary_rehab_tenant_isolation ON pulmonary_rehab_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- radiology assessments
CREATE TABLE IF NOT EXISTS radiology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE radiology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_radiology_tenant_created ON radiology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_radiology_patient ON radiology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_radiology_engine ON radiology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE radiology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on radiology_assessments';
    END;
    BEGIN
        ALTER TABLE radiology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on radiology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS radiology_tenant_isolation ON radiology_assessments';
    EXECUTE 'CREATE POLICY radiology_tenant_isolation ON radiology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- rehabilitation assessments
CREATE TABLE IF NOT EXISTS rehabilitation_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE rehabilitation_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_rehabilitation_tenant_created ON rehabilitation_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rehabilitation_patient ON rehabilitation_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rehabilitation_engine ON rehabilitation_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE rehabilitation_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on rehabilitation_assessments';
    END;
    BEGIN
        ALTER TABLE rehabilitation_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on rehabilitation_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS rehabilitation_tenant_isolation ON rehabilitation_assessments';
    EXECUTE 'CREATE POLICY rehabilitation_tenant_isolation ON rehabilitation_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- sleep_medicine assessments
CREATE TABLE IF NOT EXISTS sleep_medicine_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE sleep_medicine_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_tenant_created ON sleep_medicine_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_patient ON sleep_medicine_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_engine ON sleep_medicine_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE sleep_medicine_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on sleep_medicine_assessments';
    END;
    BEGIN
        ALTER TABLE sleep_medicine_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on sleep_medicine_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS sleep_medicine_tenant_isolation ON sleep_medicine_assessments';
    EXECUTE 'CREATE POLICY sleep_medicine_tenant_isolation ON sleep_medicine_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- social_work assessments
CREATE TABLE IF NOT EXISTS social_work_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE social_work_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_social_work_tenant_created ON social_work_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_work_patient ON social_work_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_social_work_engine ON social_work_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE social_work_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on social_work_assessments';
    END;
    BEGIN
        ALTER TABLE social_work_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on social_work_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS social_work_tenant_isolation ON social_work_assessments';
    EXECUTE 'CREATE POLICY social_work_tenant_isolation ON social_work_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- speech_therapy assessments
CREATE TABLE IF NOT EXISTS speech_therapy_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE speech_therapy_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_speech_therapy_tenant_created ON speech_therapy_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speech_therapy_patient ON speech_therapy_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_speech_therapy_engine ON speech_therapy_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE speech_therapy_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on speech_therapy_assessments';
    END;
    BEGIN
        ALTER TABLE speech_therapy_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on speech_therapy_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS speech_therapy_tenant_isolation ON speech_therapy_assessments';
    EXECUTE 'CREATE POLICY speech_therapy_tenant_isolation ON speech_therapy_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- stroke_unit assessments
CREATE TABLE IF NOT EXISTS stroke_unit_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE stroke_unit_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_stroke_unit_tenant_created ON stroke_unit_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stroke_unit_patient ON stroke_unit_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stroke_unit_engine ON stroke_unit_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE stroke_unit_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on stroke_unit_assessments';
    END;
    BEGIN
        ALTER TABLE stroke_unit_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on stroke_unit_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS stroke_unit_tenant_isolation ON stroke_unit_assessments';
    EXECUTE 'CREATE POLICY stroke_unit_tenant_isolation ON stroke_unit_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- thoracic_surgery assessments
CREATE TABLE IF NOT EXISTS thoracic_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE thoracic_surgery_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_tenant_created ON thoracic_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_patient ON thoracic_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_thoracic_surgery_engine ON thoracic_surgery_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE thoracic_surgery_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on thoracic_surgery_assessments';
    END;
    BEGIN
        ALTER TABLE thoracic_surgery_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on thoracic_surgery_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS thoracic_surgery_tenant_isolation ON thoracic_surgery_assessments';
    EXECUTE 'CREATE POLICY thoracic_surgery_tenant_isolation ON thoracic_surgery_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- transplant assessments
CREATE TABLE IF NOT EXISTS transplant_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE transplant_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_transplant_tenant_created ON transplant_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transplant_patient ON transplant_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transplant_engine ON transplant_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE transplant_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on transplant_assessments';
    END;
    BEGIN
        ALTER TABLE transplant_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on transplant_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS transplant_tenant_isolation ON transplant_assessments';
    EXECUTE 'CREATE POLICY transplant_tenant_isolation ON transplant_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- trauma_surgery assessments
CREATE TABLE IF NOT EXISTS trauma_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE trauma_surgery_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_tenant_created ON trauma_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_patient ON trauma_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trauma_surgery_engine ON trauma_surgery_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE trauma_surgery_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on trauma_surgery_assessments';
    END;
    BEGIN
        ALTER TABLE trauma_surgery_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on trauma_surgery_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS trauma_surgery_tenant_isolation ON trauma_surgery_assessments';
    EXECUTE 'CREATE POLICY trauma_surgery_tenant_isolation ON trauma_surgery_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- urology assessments
CREATE TABLE IF NOT EXISTS urology_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE urology_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_urology_tenant_created ON urology_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_urology_patient ON urology_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_urology_engine ON urology_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE urology_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on urology_assessments';
    END;
    BEGIN
        ALTER TABLE urology_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on urology_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS urology_tenant_isolation ON urology_assessments';
    EXECUTE 'CREATE POLICY urology_tenant_isolation ON urology_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- vascular_surgery assessments
CREATE TABLE IF NOT EXISTS vascular_surgery_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE vascular_surgery_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_tenant_created ON vascular_surgery_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_patient ON vascular_surgery_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vascular_surgery_engine ON vascular_surgery_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE vascular_surgery_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on vascular_surgery_assessments';
    END;
    BEGIN
        ALTER TABLE vascular_surgery_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on vascular_surgery_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS vascular_surgery_tenant_isolation ON vascular_surgery_assessments';
    EXECUTE 'CREATE POLICY vascular_surgery_tenant_isolation ON vascular_surgery_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;


-- wound_care assessments
CREATE TABLE IF NOT EXISTS wound_care_assessments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE wound_care_assessments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_wound_care_tenant_created ON wound_care_assessments(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wound_care_patient ON wound_care_assessments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wound_care_engine ON wound_care_assessments(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE wound_care_assessments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on wound_care_assessments';
    END;
    BEGIN
        ALTER TABLE wound_care_assessments FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on wound_care_assessments';
    END;
    EXECUTE 'DROP POLICY IF EXISTS wound_care_tenant_isolation ON wound_care_assessments';
    EXECUTE 'CREATE POLICY wound_care_tenant_isolation ON wound_care_assessments USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;

