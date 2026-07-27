-- pcc/ccu/ccu_up.sql
-- CCU (Coronary Care Unit) — 4 tables, RLS + FORCE RLS
-- Sandbox only. Never run on production.

BEGIN;

CREATE TABLE IF NOT EXISTS ccu_admission (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    admission_type  VARCHAR(40) NOT NULL CHECK (admission_type IN
                        ('post_pci', 'post_arrest', 'stemi', 'nstemi',
                         'cardiogenic_shock', 'arrhythmia', 'decompensated_hf',
                         'observation', 'transfer')),
    grace_score     SMALLINT,
    timi_score      SMALLINT,
    scai_stage      VARCHAR(2) CHECK (scai_stage IN ('A', 'B', 'C', 'D', 'E')),
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    status          VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN
                        ('admitted', 'in_ccu', 'transferred', 'discharged', 'deceased')),
    admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharged_at   TIMESTAMPTZ,
    primary_diagnosis TEXT,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_admission_tenant ON ccu_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ccu_admission_patient ON ccu_admission(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_ccu_admission_status ON ccu_admission(tenant_id, status);
ALTER TABLE ccu_admission ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccu_admission FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ccu_admission_tenant ON ccu_admission;
CREATE POLICY ccu_admission_tenant ON ccu_admission
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ccu_vital_sign (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ccu_admission(id) ON DELETE CASCADE,
    measured_at     TIMESTAMPTZ NOT NULL,
    heart_rate      SMALLINT CHECK (heart_rate >= 0 AND heart_rate <= 300),
    sbp_mmhg        SMALLINT CHECK (sbp_mmhg >= 0 AND sbp_mmhg <= 300),
    dbp_mmhg        SMALLINT CHECK (dbp_mmhg >= 0 AND dbp_mmhg <= 250),
    map_mmhg        SMALLINT,
    spo2_pct        SMALLINT CHECK (spo2_pct >= 0 AND spo2_pct <= 100),
    rhythm          VARCHAR(40),
    lactate_mmol_l  NUMERIC(5, 2),
    cardiac_output  NUMERIC(5, 2),
    on_vasopressor  BOOLEAN NOT NULL DEFAULT false,
    on_mcs          VARCHAR(20),
    arrhythmia_flag VARCHAR(40),
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_vital_tenant ON ccu_vital_sign(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ccu_vital_admission ON ccu_vital_sign(admission_id);
ALTER TABLE ccu_vital_sign ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccu_vital_sign FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ccu_vital_tenant ON ccu_vital_sign;
CREATE POLICY ccu_vital_tenant ON ccu_vital_sign
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ccu_medication_admin (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ccu_admission(id) ON DELETE CASCADE,
    drug_class      VARCHAR(40) NOT NULL CHECK (drug_class IN
                        ('antiplatelet', 'anticoagulant', 'vasopressor', 'inotrope',
                         'antiarrhythmic', 'statin', 'beta_blocker', 'ace_arb_arbn',
                         'mra', 'sglt2i', 'loop_diuretic', 'analgesic', 'sedative')),
    drug_name       VARCHAR(80) NOT NULL,
    dose            VARCHAR(40),
    route           VARCHAR(20) NOT NULL CHECK (route IN ('PO', 'IV', 'IM', 'SC', 'SL', 'IN', 'PR', 'TOPICAL')),
    given_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    given_by        BIGINT,
    hold_reason     TEXT,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_med_tenant ON ccu_medication_admin(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ccu_med_admission ON ccu_medication_admin(admission_id);
ALTER TABLE ccu_medication_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccu_medication_admin FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ccu_med_tenant ON ccu_medication_admin;
CREATE POLICY ccu_med_tenant ON ccu_medication_admin
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ccu_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    admission_id    UUID REFERENCES ccu_admission(id) ON DELETE SET NULL,
    actor_id        BIGINT,
    action          VARCHAR(40) NOT NULL,
    entity_type     VARCHAR(40) NOT NULL,
    entity_id       UUID,
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash       VARCHAR(64),
    entry_hash      VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_audit_tenant ON ccu_audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ccu_audit_admission ON ccu_audit_log(admission_id);
ALTER TABLE ccu_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccu_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ccu_audit_tenant ON ccu_audit_log;
CREATE POLICY ccu_audit_tenant ON ccu_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;
