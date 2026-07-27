-- P3-EV module schema for pcc_neuro_ext13 v3.112.0
CREATE TABLE IF NOT EXISTS p3ev_pcc_neuro_ext13 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ev_pcc_neuro_ext13_tenant ON p3ev_pcc_neuro_ext13(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ev_pcc_neuro_ext13_encounter ON p3ev_pcc_neuro_ext13(encounter_id);
