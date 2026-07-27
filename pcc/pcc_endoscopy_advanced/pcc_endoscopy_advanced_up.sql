-- P3-DO module schema for pcc_endoscopy_advanced v3.79.0
CREATE TABLE IF NOT EXISTS p3do_pcc_endoscopy_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3do_pcc_endoscopy_advanced_tenant ON p3do_pcc_endoscopy_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3do_pcc_endoscopy_advanced_encounter ON p3do_pcc_endoscopy_advanced(encounter_id);
