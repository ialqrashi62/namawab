-- P3-DF module schema for pcc_inflammation v3.70.0
CREATE TABLE IF NOT EXISTS p3df_pcc_inflammation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3df_pcc_inflammation_tenant ON p3df_pcc_inflammation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3df_pcc_inflammation_encounter ON p3df_pcc_inflammation(encounter_id);
