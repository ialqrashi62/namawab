-- pcc/migrations/cath_lab_up.sql
-- CARD-007 Cath Lab Specialized — 4 tables, RLS + FORCE RLS, non-destructive
-- Sandbox only. Never run on production.

BEGIN;

-- ============================================================
-- Table 1: cath_lab_procedure
-- Master record for every cath lab case
-- ============================================================
CREATE TABLE IF NOT EXISTS cath_lab_procedure (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    procedure_type  VARCHAR(40) NOT NULL CHECK (procedure_type IN
                        ('diagnostic', 'pci_simple', 'pci_complex',
                         'cto_pci', 'bifurcation', 'left_main',
                         'vein_graft', 'rotational_atherectomy',
                         'orbital_atherectomy', 'ivl', 'ivus', 'oct', 'ffs_ifr')),
    status          VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN
                        ('scheduled', 'in_progress', 'completed', 'cancelled', 'aborted')),
    scheduled_at    TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    ended_at        TIMESTAMPTZ,
    primary_operator_id BIGINT,
    findings_encrypted BYTEA,   -- PHI: encrypted
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    j_cto_score     SMALLINT CHECK (j_cto_score >= 0 AND j_cto_score <= 5),
    syntax_score    SMALLINT,
    contrast_volume_ml SMALLINT,
    radiation_dose_mgy NUMERIC(10, 2),
    complications   JSONB NOT NULL DEFAULT '[]'::jsonb,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cath_lab_procedure_tenant ON cath_lab_procedure(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_procedure_patient ON cath_lab_procedure(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_procedure_status ON cath_lab_procedure(tenant_id, status);
ALTER TABLE cath_lab_procedure ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_procedure FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cath_lab_procedure_tenant ON cath_lab_procedure;
CREATE POLICY cath_lab_procedure_tenant ON cath_lab_procedure
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

-- ============================================================
-- Table 2: cath_lab_vessel_intervention
-- Per-vessel intervention detail
-- ============================================================
CREATE TABLE IF NOT EXISTS cath_lab_vessel_intervention (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    procedure_id    UUID NOT NULL REFERENCES cath_lab_procedure(id) ON DELETE CASCADE,
    vessel_name     VARCHAR(20) NOT NULL CHECK (vessel_name IN
                        ('LAD', 'LCx', 'RCA', 'LM', 'Diag', 'OM', 'PDA', 'PLB', 'SVG', 'LIMA', 'RIMA')),
    segment         VARCHAR(10),
    intervention_type VARCHAR(40) NOT NULL CHECK (intervention_type IN
                        ('stent', 'balloon', 'rotablation', 'orbital_atherectomy',
                         'ivl', 'thrombus_aspiration', 'ivus', 'oct', 'ffs', 'ifr')),
    stent_size_mm   NUMERIC(4, 2),
    stent_length_mm SMALLINT,
    pre_stenosis_pct SMALLINT CHECK (pre_stenosis_pct >= 0 AND pre_stenosis_pct <= 100),
    post_stenosis_pct SMALLINT CHECK (post_stenosis_pct >= 0 AND post_stenosis_pct <= 100),
    dissections     JSONB NOT NULL DEFAULT '[]'::jsonb,
    perforations    JSONB NOT NULL DEFAULT '[]'::jsonb,
    no_reflow       BOOLEAN NOT NULL DEFAULT false,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cath_lab_vessel_tenant ON cath_lab_vessel_intervention(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_vessel_proc ON cath_lab_vessel_intervention(procedure_id);
ALTER TABLE cath_lab_vessel_intervention ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_vessel_intervention FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cath_lab_vessel_tenant ON cath_lab_vessel_intervention;
CREATE POLICY cath_lab_vessel_tenant ON cath_lab_vessel_intervention
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

-- ============================================================
-- Table 3: cath_lab_red_flag
-- Red flag log: ACT <250, hypotension, arrhythmia, contrast
-- reaction, dissection, perforation, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS cath_lab_red_flag (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    procedure_id    UUID NOT NULL REFERENCES cath_lab_procedure(id) ON DELETE CASCADE,
    flag_type       VARCHAR(40) NOT NULL CHECK (flag_type IN
                        ('act_low', 'act_high', 'hypotension', 'hypertension',
                         'bradycardia', 'tachycardia', 'st_elevation',
                         'dissection', 'perforation', 'no_reflow',
                         'contrast_reaction', 'chest_pain', 'arrhythmia_vt',
                         'arrhythmia_vf', 'cardiac_arrest', 'other')),
    severity        VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    description     TEXT,
    response        TEXT,
    acknowledged_by BIGINT,
    acknowledged_at TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cath_lab_red_flag_tenant ON cath_lab_red_flag(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_red_flag_proc ON cath_lab_red_flag(procedure_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_red_flag_severity ON cath_lab_red_flag(tenant_id, severity);
ALTER TABLE cath_lab_red_flag ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_red_flag FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cath_lab_red_flag_tenant ON cath_lab_red_flag;
CREATE POLICY cath_lab_red_flag_tenant ON cath_lab_red_flag
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

-- ============================================================
-- Table 4: cath_lab_audit_log (hash-chained, immutable)
-- ============================================================
CREATE TABLE IF NOT EXISTS cath_lab_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    procedure_id    UUID REFERENCES cath_lab_procedure(id) ON DELETE SET NULL,
    actor_id        BIGINT,
    action          VARCHAR(40) NOT NULL,
    entity_type     VARCHAR(40) NOT NULL,
    entity_id       UUID,
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash       VARCHAR(64),
    entry_hash      VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cath_lab_audit_tenant ON cath_lab_audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_audit_proc ON cath_lab_audit_log(procedure_id);
CREATE INDEX IF NOT EXISTS idx_cath_lab_audit_actor ON cath_lab_audit_log(actor_id);
ALTER TABLE cath_lab_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cath_lab_audit_tenant ON cath_lab_audit_log;
CREATE POLICY cath_lab_audit_tenant ON cath_lab_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;
