-- f018_apm_up.sql — apm_metrics table with multi-tenant RLS
CREATE TABLE IF NOT EXISTS apm_metrics (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  kind varchar(16) NOT NULL CHECK (kind IN ('latency','error_rate','uptime','slow_query','llm_trace')),
  route varchar(160),
  value_num numeric NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_apm_tenant ON apm_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_apm_kind_time ON apm_metrics(tenant_id, kind, created_at DESC);
ALTER TABLE apm_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_apm_tenant ON apm_metrics;
CREATE POLICY p_apm_tenant ON apm_metrics
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
