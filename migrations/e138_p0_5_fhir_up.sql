-- e138 P0-5 FHIR R4 UP
-- Tables: fhir_resources, fhir_bundles, fhir_subscriptions

CREATE TABLE IF NOT EXISTS fhir_resources (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(64) NOT NULL,
  patient_id INTEGER,
  version_id VARCHAR(20) DEFAULT '1',
  raw_json JSONB NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, resource_type, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_fhir_res_tenant_type ON fhir_resources(tenant_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_fhir_res_patient ON fhir_resources(patient_id);
CREATE INDEX IF NOT EXISTS idx_fhir_res_json ON fhir_resources USING gin(raw_json);
ALTER TABLE fhir_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_resources FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fhir_res_tenant_isolation ON fhir_resources;
CREATE POLICY fhir_res_tenant_isolation ON fhir_resources
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS fhir_bundles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  bundle_id VARCHAR(80) UNIQUE NOT NULL,
  bundle_type VARCHAR(20) NOT NULL,
  total_entries INTEGER,
  raw_json JSONB NOT NULL,
  submitted_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE fhir_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_bundles FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fhir_bundles_tenant_isolation ON fhir_bundles;
CREATE POLICY fhir_bundles_tenant_isolation ON fhir_bundles
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS fhir_subscriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  subscription_id VARCHAR(80) UNIQUE NOT NULL,
  channel_type VARCHAR(20) NOT NULL,
  channel_endpoint VARCHAR(255),
  resource_type VARCHAR(50),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE fhir_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_subscriptions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fhir_sub_tenant_isolation ON fhir_subscriptions;
CREATE POLICY fhir_sub_tenant_isolation ON fhir_subscriptions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));