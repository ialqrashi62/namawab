-- ============================================================
-- NamaMedical — Observability Schema
-- Prometheus-style metrics, audit log, LLM cost tracking
-- ============================================================

CREATE SCHEMA IF NOT EXISTS observability;

-- 1. Audit log (hash-chained, immutable, 7+ year retention)
CREATE TABLE IF NOT EXISTS observability.audit_log (
  id bigserial PRIMARY KEY,
  event_id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid,
  session_id text,
  action text NOT NULL,                         -- 'create', 'read', 'update', 'delete', 'export', 'login', 'logout', 'ai.chat', etc.
  resource_type text NOT NULL,                  -- 'patient', 'encounter', 'order', 'assessment', 'invoice', 'prescription', etc.
  resource_id text,
  http_method text,
  http_path text,
  http_status integer,
  ip_address inet,
  user_agent text,
  request_id text,
  details jsonb NOT NULL DEFAULT '{}',
  -- PHI redaction guarantee: no patient name, no national_id, no MRN, no dob
  prev_hash text NOT NULL,                      -- hash of previous audit row
  row_hash text NOT NULL,                       -- sha256(this row + prev_hash)
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_tenant_time ON observability.audit_log (tenant_id, created_at DESC);
CREATE INDEX idx_audit_user_time ON observability.audit_log (user_id, created_at DESC);
CREATE INDEX idx_audit_action_time ON observability.audit_log (action, created_at DESC);
CREATE INDEX idx_audit_resource ON observability.audit_log (resource_type, resource_id);
CREATE INDEX idx_audit_request ON observability.audit_log (request_id);

-- RLS: users can only see audit log of their own tenant
ALTER TABLE observability.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE observability.audit_log FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_log_tenant_isolation ON observability.audit_log
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 2. Hash-chain function
CREATE OR REPLACE FUNCTION observability.fn_audit_hash() RETURNS trigger AS $$
DECLARE
  v_prev_hash text;
  v_data text;
  v_hash text;
BEGIN
  -- Get the previous hash (last row by id)
  SELECT row_hash INTO v_prev_hash
  FROM observability.audit_log
  ORDER BY id DESC
  LIMIT 1;

  IF v_prev_hash IS NULL THEN
    v_prev_hash := 'GENESIS';
  END IF;

  -- Build the hash input
  v_data := concat_ws(
    '|',
    NEW.event_id,
    NEW.tenant_id,
    NEW.user_id,
    NEW.action,
    NEW.resource_type,
    NEW.resource_id,
    NEW.http_method,
    NEW.http_path,
    NEW.http_status,
    NEW.created_at,
    v_prev_hash
  );

  v_hash := encode(digest(v_data, 'sha256'), 'hex');

  NEW.prev_hash := v_prev_hash;
  NEW.row_hash := v_hash;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_hash ON observability.audit_log;
CREATE TRIGGER trg_audit_hash
  BEFORE INSERT ON observability.audit_log
  FOR EACH ROW EXECUTE FUNCTION observability.fn_audit_hash();

-- Block UPDATE/DELETE (immutable)
CREATE OR REPLACE FUNCTION observability.fn_audit_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is immutable';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_immutable_u ON observability.audit_log;
CREATE TRIGGER trg_audit_immutable_u
  BEFORE UPDATE ON observability.audit_log
  FOR EACH ROW EXECUTE FUNCTION observability.fn_audit_immutable();

DROP TRIGGER IF EXISTS trg_audit_immutable_d ON observability.audit_log;
CREATE TRIGGER trg_audit_immutable_d
  BEFORE DELETE ON observability.audit_log
  FOR EACH ROW EXECUTE FUNCTION observability.fn_audit_immutable();

-- 3. LLM cost events (per-call)
CREATE TABLE IF NOT EXISTS observability.llm_cost_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid,
  dept text,
  model text NOT NULL,
  provider text NOT NULL,
  prompt_tokens integer NOT NULL,
  completion_tokens integer NOT NULL,
  total_tokens integer NOT NULL,
  cost_usd real NOT NULL,
  latency_ms integer NOT NULL,
  success boolean NOT NULL DEFAULT true,
  error text,
  trace_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_llm_cost_tenant_time ON observability.llm_cost_events (tenant_id, created_at DESC);
CREATE INDEX idx_llm_cost_model ON observability.llm_cost_events (model, created_at DESC);
CREATE INDEX idx_llm_cost_dept ON observability.llm_cost_events (dept, created_at DESC);

ALTER TABLE observability.llm_cost_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE observability.llm_cost_events FORCE ROW LEVEL SECURITY;
CREATE POLICY llm_cost_tenant_isolation ON observability.llm_cost_events
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 4. API metrics (per-endpoint, per-tenant, per-user)
CREATE TABLE IF NOT EXISTS observability.api_metrics (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  user_id uuid,
  method text NOT NULL,
  path text NOT NULL,
  status integer NOT NULL,
  duration_ms integer NOT NULL,
  request_size integer,
  response_size integer,
  cache_hit boolean DEFAULT false,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_metrics_tenant_time ON observability.api_metrics (tenant_id, created_at DESC);
CREATE INDEX idx_api_metrics_path ON observability.api_metrics (path, created_at DESC);
CREATE INDEX idx_api_metrics_status ON observability.api_metrics (status, created_at DESC);

-- Partition by month for performance
-- (manually created as separate tables; in production, use pg_partman)

-- 5. Error events
CREATE TABLE IF NOT EXISTS observability.error_events (
  id bigserial PRIMARY KEY,
  tenant_id uuid,
  user_id uuid,
  level text NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
  message text NOT NULL,
  stack text,
  source text,                                  -- file:line
  context jsonb NOT NULL DEFAULT '{}',
  trace_id text,
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_errors_tenant_time ON observability.error_events (tenant_id, created_at DESC);
CREATE INDEX idx_errors_level ON observability.error_events (level, created_at DESC);

-- 6. Aggregated daily stats (for dashboards)
CREATE TABLE IF NOT EXISTS observability.daily_stats (
  tenant_id uuid NOT NULL,
  date date NOT NULL,
  total_api_calls bigint NOT NULL DEFAULT 0,
  total_errors bigint NOT NULL DEFAULT 0,
  p50_latency_ms integer,
  p95_latency_ms integer,
  p99_latency_ms integer,
  total_llm_calls bigint NOT NULL DEFAULT 0,
  total_llm_cost_usd real NOT NULL DEFAULT 0,
  total_llm_tokens bigint NOT NULL DEFAULT 0,
  unique_users integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, date)
);

CREATE INDEX idx_daily_stats_date ON observability.daily_stats (date DESC);

-- 7. Refresh function: aggregate metrics into daily_stats
CREATE OR REPLACE FUNCTION observability.fn_refresh_daily_stats(p_date date DEFAULT CURRENT_DATE) RETURNS void AS $$
BEGIN
  INSERT INTO observability.daily_stats (
    tenant_id, date, total_api_calls, total_errors, p50_latency_ms, p95_latency_ms, p99_latency_ms,
    total_llm_calls, total_llm_cost_usd, total_llm_tokens, unique_users
  )
  SELECT
    am.tenant_id,
    p_date,
    count(*) AS total_api_calls,
    count(*) FILTER (WHERE am.status >= 400) AS total_errors,
    percentile_cont(0.5) WITHIN GROUP (ORDER BY am.duration_ms)::integer AS p50,
    percentile_cont(0.95) WITHIN GROUP (ORDER BY am.duration_ms)::integer AS p95,
    percentile_cont(0.99) WITHIN GROUP (ORDER BY am.duration_ms)::integer AS p99,
    (SELECT count(*) FROM observability.llm_cost_events WHERE tenant_id = am.tenant_id AND created_at::date = p_date),
    (SELECT coalesce(sum(cost_usd), 0) FROM observability.llm_cost_events WHERE tenant_id = am.tenant_id AND created_at::date = p_date),
    (SELECT coalesce(sum(total_tokens), 0) FROM observability.llm_cost_events WHERE tenant_id = am.tenant_id AND created_at::date = p_date),
    count(DISTINCT am.user_id)
  FROM observability.api_metrics am
  WHERE am.created_at::date = p_date
  GROUP BY am.tenant_id
  ON CONFLICT (tenant_id, date) DO UPDATE
  SET total_api_calls = EXCLUDED.total_api_calls,
      total_errors = EXCLUDED.total_errors,
      p50_latency_ms = EXCLUDED.p50_latency_ms,
      p95_latency_ms = EXCLUDED.p95_latency_ms,
      p99_latency_ms = EXCLUDED.p99_latency_ms,
      total_llm_calls = EXCLUDED.total_llm_calls,
      total_llm_cost_usd = EXCLUDED.total_llm_cost_usd,
      total_llm_tokens = EXCLUDED.total_llm_tokens,
      unique_users = EXCLUDED.unique_users;
END;
$$ LANGUAGE plpgsql;

GRANT USAGE ON SCHEMA observability TO nama_app, nama_readonly;
GRANT SELECT, INSERT ON observability.audit_log TO nama_app;
GRANT SELECT, INSERT ON observability.llm_cost_events TO nama_app;
GRANT SELECT, INSERT ON observability.api_metrics TO nama_app;
GRANT SELECT, INSERT ON observability.error_events TO nama_app;
GRANT SELECT, INSERT, UPDATE ON observability.daily_stats TO nama_app;
GRANT SELECT ON observability.audit_log, observability.llm_cost_events, observability.api_metrics,
  observability.error_events, observability.daily_stats TO nama_readonly;
GRANT EXECUTE ON FUNCTION observability.fn_refresh_daily_stats TO nama_app;
