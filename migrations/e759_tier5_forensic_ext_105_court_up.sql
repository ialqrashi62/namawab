CREATE TABLE IF NOT EXISTS court_release (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  release_basis TEXT NOT NULL,
  released_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cr_t ON court_release(tenant_id, case_id);
ALTER TABLE court_release ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_release FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cr_t ON court_release;
CREATE POLICY p_cr_t ON court_release USING (tenant_id = current_setting('app.tenant_id', true));
