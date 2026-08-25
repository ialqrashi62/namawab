-- filepath: migrations/e989_vc_async_up.sql
-- TIER6_VC_EXT-104 Async care econsult table
CREATE TABLE IF NOT EXISTS tier6_vc_econsult (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  requesting_provider TEXT,
  specialty TEXT,
  question TEXT,
  priority TEXT,
  sla TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_econsult ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_econsult FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_econsult_tenant ON tier6_vc_econsult;
CREATE POLICY tier6_vc_econsult_tenant ON tier6_vc_econsult
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_econsult_tenant_idx ON tier6_vc_econsult (tenant_id, created_at DESC);

-- TIER6_VC_EXT-104 Async store-forward table
CREATE TABLE IF NOT EXISTS tier6_vc_store_forward (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  image_type TEXT,
  image_url TEXT,
  clinical_context TEXT,
  queue TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_store_forward ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_store_forward FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_store_forward_tenant ON tier6_vc_store_forward;
CREATE POLICY tier6_vc_store_forward_tenant ON tier6_vc_store_forward
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_store_forward_tenant_idx ON tier6_vc_store_forward (tenant_id, queue, created_at DESC);