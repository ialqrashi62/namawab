-- e436 TIER4_PALL-105 Grief
CREATE TABLE IF NOT EXISTS tier4_pall_105_psych_grief (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  phase TEXT NOT NULL,
  symptom_severity TEXT,
  social_support TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_105_psych_grief ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_105_psych_grief FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_105_psych_grief_t ON tier4_pall_105_psych_grief;
CREATE POLICY tier4_pall_105_psych_grief_t ON tier4_pall_105_psych_grief
  USING (tenant_id = current_setting('app.tenant_id', true));