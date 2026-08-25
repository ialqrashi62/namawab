-- filepath: migrations/f001_or_up.sql
-- TIER16_OR_EXT 112-116 OR/PERIOPERATIVE tables

CREATE TABLE IF NOT EXISTS tier16_or_preop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  asa_class TEXT,
  anticoag_status TEXT,
  clearance_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier16_or_preop ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier16_or_preop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier16_or_preop_tenant ON tier16_or_preop;
CREATE POLICY tier16_or_preop_tenant ON tier16_or_preop USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier16_or_preop_tenant_idx ON tier16_or_preop (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier16_or_intraop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  case_id TEXT,
  anesthesia_type TEXT,
  timeout_status TEXT,
  event_type TEXT,
  sponge_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier16_or_intraop ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier16_or_intraop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier16_or_intraop_tenant ON tier16_or_intraop;
CREATE POLICY tier16_or_intraop_tenant ON tier16_or_intraop USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier16_or_intraop_tenant_idx ON tier16_or_intraop (tenant_id, case_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier16_or_postop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  case_id TEXT,
  aldrete_status TEXT,
  pain_severity TEXT,
  ponv_severity TEXT,
  disposition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier16_or_postop ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier16_or_postop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier16_or_postop_tenant ON tier16_or_postop;
CREATE POLICY tier16_or_postop_tenant ON tier16_or_postop USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier16_or_postop_tenant_idx ON tier16_or_postop (tenant_id, case_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier16_or_scheduling (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  room_id TEXT,
  block_type TEXT,
  priority TEXT,
  utilization_pct DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier16_or_scheduling ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier16_or_scheduling FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier16_or_scheduling_tenant ON tier16_or_scheduling;
CREATE POLICY tier16_or_scheduling_tenant ON tier16_or_scheduling USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier16_or_scheduling_tenant_idx ON tier16_or_scheduling (tenant_id, room_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier16_or_surgical (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  case_id TEXT,
  cpt_class TEXT,
  nsqip_status TEXT,
  ssi_status TEXT,
  vte_status TEXT,
  eras_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier16_or_surgical ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier16_or_surgical FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier16_or_surgical_tenant ON tier16_or_surgical;
CREATE POLICY tier16_or_surgical_tenant ON tier16_or_surgical USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier16_or_surgical_tenant_idx ON tier16_or_surgical (tenant_id, case_id, created_at DESC);