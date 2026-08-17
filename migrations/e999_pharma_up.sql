-- filepath: migrations/e999_pharma_up.sql
-- TIER14_PHARMA_EXT 101-106 pharmacy tables

CREATE TABLE IF NOT EXISTS tier14_pharma_rx_order (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  order_id TEXT,
  patient_id TEXT,
  provider_id TEXT,
  drug_name TEXT,
  rxnorm_code TEXT,
  dose_value DOUBLE PRECISION,
  dose_unit TEXT,
  route TEXT,
  frequency TEXT,
  duration_days INTEGER,
  indication TEXT,
  status TEXT,
  allergy_checked BOOLEAN,
  ddi_checked BOOLEAN,
  renal_adjustment BOOLEAN,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  signature_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharma_rx_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_rx_order FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_rx_order_tenant ON tier14_pharma_rx_order;
CREATE POLICY tier14_pharma_rx_order_tenant ON tier14_pharma_rx_order USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_rx_order_tenant_idx ON tier14_pharma_rx_order (tenant_id, patient_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharma_rx_dispense (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  dispense_id TEXT,
  order_id TEXT,
  patient_id TEXT,
  ndc_code TEXT,
  lot_number TEXT,
  expiration_date DATE,
  quantity DOUBLE PRECISION,
  form TEXT,
  dispensed_by TEXT,
  dispensed_at TIMESTAMPTZ,
  barcode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharma_rx_dispense ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_rx_dispense FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_rx_dispense_tenant ON tier14_pharma_rx_dispense;
CREATE POLICY tier14_pharma_rx_dispense_tenant ON tier14_pharma_rx_dispense USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_rx_dispense_tenant_idx ON tier14_pharma_rx_dispense (tenant_id, ndc_code, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharma_iv_admixture (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  admixture_id TEXT,
  order_id TEXT,
  patient_id TEXT,
  base_solution TEXT,
  base_volume_ml DOUBLE PRECISION,
  additives JSONB,
  final_concentration TEXT,
  final_volume_ml DOUBLE PRECISION,
  usp_class TEXT,
  bsc_used BOOLEAN,
  prepared_by TEXT,
  verified_by TEXT,
  prepared_at TIMESTAMPTZ,
  beyond_use_date TIMESTAMPTZ,
  compatibility_checked BOOLEAN,
  y_site_checked BOOLEAN,
  label_printed BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharma_iv_admixture ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_iv_admixture FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_iv_admixture_tenant ON tier14_pharma_iv_admixture;
CREATE POLICY tier14_pharma_iv_admixture_tenant ON tier14_pharma_iv_admixture USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_iv_admixture_tenant_idx ON tier14_pharma_iv_admixture (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharma_med_reconciliation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  reconciliation_id TEXT,
  patient_id TEXT,
  trigger_type TEXT,
  trigger_encounter_id TEXT,
  pre_med_count INTEGER,
  post_med_count INTEGER,
  discontinued_count INTEGER,
  added_count INTEGER,
  interactions_found INTEGER,
  discrepancies_resolved BOOLEAN,
  pharmacist_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharma_med_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_med_reconciliation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_med_reconciliation_tenant ON tier14_pharma_med_reconciliation;
CREATE POLICY tier14_pharma_med_reconciliation_tenant ON tier14_pharma_med_reconciliation USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_med_reconciliation_tenant_idx ON tier14_pharma_med_reconciliation (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharma_ddi_event (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  event_id TEXT,
  patient_id TEXT,
  drug_a TEXT,
  drug_b TEXT,
  interaction_severity TEXT,
  clinical_significance TEXT,
  recommended_action TEXT,
  overridden BOOLEAN,
  override_reason TEXT,
  overridden_by TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharma_ddi_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_ddi_event FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_ddi_event_tenant ON tier14_pharma_ddi_event;
CREATE POLICY tier14_pharma_ddi_event_tenant ON tier14_pharma_ddi_event USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_ddi_event_tenant_idx ON tier14_pharma_ddi_event (tenant_id, severity, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharma_controlled_substance_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  log_id TEXT,
  cs_id TEXT,
  drug_name TEXT,
  schedule TEXT,
  action TEXT,
  quantity DOUBLE PRECISION,
  unit TEXT,
  patient_id TEXT,
  witness_1_id TEXT,
  witness_2_id TEXT,
  tamper_seal TEXT,
  wastage_reason TEXT,
  logged_by TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hash_chain_prev TEXT,
  hash_chain_curr TEXT
);
ALTER TABLE tier14_pharma_controlled_substance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharma_controlled_substance_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharma_controlled_substance_log_tenant ON tier14_pharma_controlled_substance_log;
CREATE POLICY tier14_pharma_controlled_substance_log_tenant ON tier14_pharma_controlled_substance_log USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharma_controlled_substance_log_tenant_idx ON tier14_pharma_controlled_substance_log (tenant_id, schedule, created_at DESC);