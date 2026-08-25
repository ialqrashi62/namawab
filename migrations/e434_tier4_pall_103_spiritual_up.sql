-- e434 TIER4_PALL-103 Spiritual
CREATE TABLE IF NOT EXISTS tier4_pall_103_spiritual_distress (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  faith_tradition TEXT,
  distress_indicators TEXT,
  social_support TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_103_spiritual_distress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_103_spiritual_distress FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_103_spiritual_distress_t ON tier4_pall_103_spiritual_distress;
CREATE POLICY tier4_pall_103_spiritual_distress_t ON tier4_pall_103_spiritual_distress
  USING (tenant_id = current_setting('app.tenant_id', true));