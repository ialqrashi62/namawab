-- migrations/e999-g081_ops_ext.sql
-- TIER61 Operations Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS ops_facility_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  area TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ops_facility_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_facility_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ops_facility_records_t ON ops_facility_records;
CREATE POLICY ops_facility_records_t ON ops_facility_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ops_assets_register (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  asset_tag TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ops_assets_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_assets_register FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ops_assets_register_t ON ops_assets_register;
CREATE POLICY ops_assets_register_t ON ops_assets_register USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ops_vendor_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  vendor_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ops_vendor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_vendor_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ops_vendor_records_t ON ops_vendor_records;
CREATE POLICY ops_vendor_records_t ON ops_vendor_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ops_legal_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ops_legal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_legal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ops_legal_records_t ON ops_legal_records;
CREATE POLICY ops_legal_records_t ON ops_legal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ops_quality_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  metric TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ops_quality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_quality_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ops_quality_records_t ON ops_quality_records;
CREATE POLICY ops_quality_records_t ON ops_quality_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
