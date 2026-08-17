# PHARMACY — Database ERD

## Tables (Tier14)

### pharma_rx_order
```sql
CREATE TABLE pharma_rx_order (
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
  status TEXT,  -- PENDING_VERIFICATION, VERIFIED, DISPENSED, ADMINISTERED, DISCONTINUED, EXPIRED
  allergy_checked BOOLEAN,
  ddi_checked BOOLEAN,
  renal_adjustment BOOLEAN,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  signature_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### pharma_rx_dispense
```sql
CREATE TABLE pharma_rx_dispense (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  dispense_id TEXT,
  order_id TEXT,
  patient_id TEXT,
  ndc_code TEXT,
  lot_number TEXT,
  expiration_date DATE,
  quantity DOUBLE PRECISION,
  form TEXT,  -- tablet, capsule, vial, ampule, bag, syringe
  dispensed_by TEXT,
  dispensed_at TIMESTAMPTZ,
  barcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### pharma_iv_admixture
```sql
CREATE TABLE pharma_iv_admixture (
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
  usp_class TEXT,  -- 797, 800
  bsc_used BOOLEAN,
  prepared_by TEXT,
  verified_by TEXT,
  prepared_at TIMESTAMPTZ,
  beyond_use_date TIMESTAMPTZ,
  compatibility_checked BOOLEAN,
  y_site_checked BOOLEAN,
  label_printed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### pharma_med_reconciliation
```sql
CREATE TABLE pharma_med_reconciliation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  reconciliation_id TEXT,
  patient_id TEXT,
  trigger_type TEXT,  -- admission, transfer, discharge, followup
  trigger_encounter_id TEXT,
  pre_med_count INTEGER,
  post_med_count INTEGER,
  discontinued_count INTEGER,
  added_count INTEGER,
  interactions_found INTEGER,
  discrepancies_resolved BOOLEAN,
  pharmacist_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### pharma_ddi_event
```sql
CREATE TABLE pharma_ddi_event (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  event_id TEXT,
  patient_id TEXT,
  drug_a TEXT,
  drug_b TEXT,
  interaction_severity TEXT,  -- CONTRAINDICATED, MAJOR, MODERATE, MINOR
  clinical_significance TEXT,
  recommended_action TEXT,
  overridden BOOLEAN,
  override_reason TEXT,
  overridden_by TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);
```

### pharma_controlled_substance_log
```sql
CREATE TABLE pharma_controlled_substance_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  log_id TEXT,
  cs_id TEXT,  -- DEA controlled substance ID
  drug_name TEXT,
  schedule TEXT,  -- II, III, IV, V
  action TEXT,  -- DISPENSED, WASTED, COUNTED, RETURNED, DESTROYED
  quantity DOUBLE PRECISION,
  unit TEXT,
  patient_id TEXT,  -- null if inventory
  witness_1_id TEXT,
  witness_2_id TEXT,
  tamper_seal TEXT,
  wastage_reason TEXT,
  logged_by TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  hash_chain_prev TEXT,
  hash_chain_curr TEXT
);
```

## Indexes
- tenant_id + order_id
- tenant_id + patient_id + status
- tenant_id + ndc_code + lot_number
- tenant_id + drug_a + drug_b (for DDI lookup)

## RLS Policy
All tables: USING (tenant_id::text = current_setting('app.tenant_id', true))
FORCE ROW LEVEL SECURITY enabled.

## ERD Diagram
```
pharma_rx_order
  │
  ├──< pharma_rx_dispense
  │
  ├──< pharma_iv_admixture
  │
  ├──< pharma_med_reconciliation
  │
  └──< pharma_ddi_event

pharma_controlled_substance_log (independent)
```
