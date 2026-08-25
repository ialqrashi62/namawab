-- e442 TIER4_HEM-104 Anticoag
CREATE TABLE IF NOT EXISTS tier4_hem_104_anticoag_doac (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  indication TEXT NOT NULL,
  egfr NUMERIC NOT NULL,
  prior_bleeding BOOLEAN,
  agent TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_104_anticoag_doac ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_104_anticoag_doac FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_104_anticoag_doac_t ON tier4_hem_104_anticoag_doac;
CREATE POLICY tier4_hem_104_anticoag_doac_t ON tier4_hem_104_anticoag_doac
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_hem_104_anticoag_reversal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  agent TEXT NOT NULL,
  bleed_severity TEXT NOT NULL,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_104_anticoag_reversal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_104_anticoag_reversal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_104_anticoag_reversal_t ON tier4_hem_104_anticoag_reversal;
CREATE POLICY tier4_hem_104_anticoag_reversal_t ON tier4_hem_104_anticoag_reversal
  USING (tenant_id = current_setting('app.tenant_id', true));