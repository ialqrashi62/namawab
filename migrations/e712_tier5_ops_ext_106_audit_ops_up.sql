-- filepath: e712_tier5_ops_ext_106_audit_ops_up.sql
-- TIER5_OPS_EXT-106: Operational audit tables
CREATE TABLE IF NOT EXISTS audit_check (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  audit_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  finding TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  owner_role TEXT NOT NULL,
  target_closeout DATE,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_check_t_status ON audit_check(tenant_id, status);

ALTER TABLE audit_check ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_check FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_audit_check_t ON audit_check;
CREATE POLICY p_audit_check_t ON audit_check USING (tenant_id = current_setting('app.tenant_id', true));
