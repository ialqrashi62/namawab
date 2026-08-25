-- e441 TIER4_HEM-103 Thrombosis
CREATE TABLE IF NOT EXISTS tier4_hem_103_thrombosis_dvt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  location TEXT NOT NULL,
  active_cancer BOOLEAN,
  provoked BOOLEAN,
  recent_bleeding BOOLEAN,
  therapy TEXT,
  duration TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_103_thrombosis_dvt ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_103_thrombosis_dvt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_103_thrombosis_dvt_t ON tier4_hem_103_thrombosis_dvt;
CREATE POLICY tier4_hem_103_thrombosis_dvt_t ON tier4_hem_103_thrombosis_dvt
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_hem_103_thrombosis_aps (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  recurrent_vte BOOLEAN,
  aps_lab TEXT,
  family_history_thrombosis BOOLEAN,
  screening TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_103_thrombosis_aps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_103_thrombosis_aps FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_103_thrombosis_aps_t ON tier4_hem_103_thrombosis_aps;
CREATE POLICY tier4_hem_103_thrombosis_aps_t ON tier4_hem_103_thrombosis_aps
  USING (tenant_id = current_setting('app.tenant_id', true));