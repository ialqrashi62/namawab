-- e414 TIER4_PSYCH-106 Addiction
CREATE TABLE IF NOT EXISTS tier4_psych_106_addiction_withdrawal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ciwa_ar_score INT,
  seizure_history BOOLEAN,
  delirium_tremens_history BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_106_addiction_withdrawal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_106_addiction_withdrawal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_106_addiction_withdrawal_t ON tier4_psych_106_addiction_withdrawal;
CREATE POLICY tier4_psych_106_addiction_withdrawal_t ON tier4_psych_106_addiction_withdrawal
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_106_addiction_oud (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  severity TEXT,
  motivation TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_106_addiction_oud ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_106_addiction_oud FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_106_addiction_oud_t ON tier4_psych_106_addiction_oud;
CREATE POLICY tier4_psych_106_addiction_oud_t ON tier4_psych_106_addiction_oud
  USING (tenant_id = current_setting('app.tenant_id', true));