CREATE TABLE IF NOT EXISTS community_nursing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  visit_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cn_t ON community_nursing(tenant_id, focus_area);
ALTER TABLE community_nursing ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_nursing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cn_t ON community_nursing;
CREATE POLICY p_cn_t ON community_nursing USING (tenant_id = current_setting('app.tenant_id', true));
