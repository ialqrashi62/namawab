CREATE TABLE IF NOT EXISTS forensic_documentation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  evidence_count INT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fd_t ON forensic_documentation(tenant_id, case_id);
ALTER TABLE forensic_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE forensic_documentation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_fd_t ON forensic_documentation;
CREATE POLICY p_fd_t ON forensic_documentation USING (tenant_id = current_setting('app.tenant_id', true));
