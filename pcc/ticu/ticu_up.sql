-- pcc/ticu/ticu_up.sql
-- 4 tables, RLS + FORCE RLS. Sandbox only.

BEGIN;

CREATE TABLE IF NOT EXISTS ticu_admission (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    admission_type  VARCHAR(40) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN ('admitted','in_icu','transferred','discharged','deceased')),
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharged_at   TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticu_admission_tenant ON ticu_admission(tenant_id);
ALTER TABLE ticu_admission ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticu_admission FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ticu_admission_tenant ON ticu_admission;
CREATE POLICY ticu_admission_tenant ON ticu_admission
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ticu_vital_sign (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ticu_admission(id) ON DELETE CASCADE,
    measured_at     TIMESTAMPTZ NOT NULL,
    heart_rate      SMALLINT, sbp_mmhg SMALLINT, dbp_mmhg SMALLINT, spo2_pct SMALLINT,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticu_vital_tenant ON ticu_vital_sign(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ticu_vital_adm ON ticu_vital_sign(admission_id);
ALTER TABLE ticu_vital_sign ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticu_vital_sign FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ticu_vital_tenant ON ticu_vital_sign;
CREATE POLICY ticu_vital_tenant ON ticu_vital_sign
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ticu_red_flag (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ticu_admission(id) ON DELETE CASCADE,
    flag_type       VARCHAR(40) NOT NULL,
    severity        VARCHAR(10) NOT NULL CHECK (severity IN ('low','moderate','high','critical')),
    description     TEXT, response TEXT,
    acknowledged_by BIGINT, acknowledged_at TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticu_red_flag_tenant ON ticu_red_flag(tenant_id);
ALTER TABLE ticu_red_flag ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticu_red_flag FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ticu_red_flag_tenant ON ticu_red_flag;
CREATE POLICY ticu_red_flag_tenant ON ticu_red_flag
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ticu_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    admission_id    UUID REFERENCES ticu_admission(id) ON DELETE SET NULL,
    actor_id        BIGINT, action VARCHAR(40) NOT NULL, entity_type VARCHAR(40) NOT NULL,
    entity_id       UUID, payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash VARCHAR(64), entry_hash VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticu_audit_tenant ON ticu_audit_log(tenant_id);
ALTER TABLE ticu_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticu_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ticu_audit_tenant ON ticu_audit_log;
CREATE POLICY ticu_audit_tenant ON ticu_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;