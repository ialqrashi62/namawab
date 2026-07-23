-- e105_card_module_up.sql
BEGIN;

CREATE TABLE card_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  encounter_id BIGINT,
  encounter_type VARCHAR(30), -- 'CHEST_PAIN', 'HF_EXAC', 'AF', 'POST_PCI'
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  primary_diagnosis TEXT,
  severity_score JSONB, -- TIMI, GRACE, HEART, CHA2DS2-VASc
  disposition VARCHAR(30), -- 'DISCHARGE', 'ADMIT', 'TRANSFER', 'OBSERVATION'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_card_enc_tenant ON card_encounters(tenant_id, started_at);
ALTER TABLE card_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY card_enc_tenant ON card_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_ecgs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES card_encounters(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  rate INT,
  rhythm VARCHAR(50), -- 'SINUS', 'AFIB', 'AFLUT', 'VT', 'SVT', 'PSVT', 'JUNCTIONAL', 'IDIOVENTRICULAR', 'ASYSTOLE'
  pr_interval_ms INT,
  qrs_duration_ms INT,
  qtc_ms INT,
  axis INT,
  st_elevation TEXT, -- JSON: {V1: false, V2: true, ...}
  st_depression TEXT,
  t_wave TEXT,
  q_waves TEXT,
  interpretation TEXT,
  critical_findings BOOLEAN DEFAULT FALSE,
  performed_by_user_id BIGINT,
  CONSTRAINT card_ecg_rhythm_chk
    CHECK (rhythm IN ('SINUS', 'AFIB', 'AFLUT', 'VT', 'SVT', 'PSVT', 'JUNCTIONAL', 'IDIOVENTRICULAR', 'ASYSTOLE', 'OTHER') OR rhythm IS NULL)
);
CREATE INDEX idx_card_ecg_enc ON card_ecgs(encounter_id, recorded_at);
ALTER TABLE card_ecgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_ecgs FORCE ROW LEVEL SECURITY;
CREATE POLICY card_ecg_tenant ON card_ecgs
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_troponins (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES card_encounters(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL,
  troponin_value NUMERIC(8,3),
  troponin_unit VARCHAR(20), -- 'NG_ML', 'NG_L'
  assay_type VARCHAR(20), -- 'HS_TNI', 'TNT', 'TNI'
  url_value INT,
  is_elevated BOOLEAN DEFAULT FALSE,
  delta_change NUMERIC(8,3),
  CONSTRAINT card_trop_unit_chk
    CHECK (troponin_unit IN ('NG_ML', 'NG_L', 'PG_ML') OR troponin_unit IS NULL)
);
CREATE INDEX idx_card_trop_enc ON card_troponins(encounter_id, collected_at);
ALTER TABLE card_troponins ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_troponins FORCE ROW LEVEL SECURITY;
CREATE POLICY card_trop_tenant ON card_troponins
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_echocardiograms (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES card_encounters(id) ON DELETE CASCADE,
  study_date TIMESTAMPTZ,
  ef_percent NUMERIC(4,1), -- ejection fraction
  lv_dimensions JSONB,
  valvular_function JSONB, -- {AS: 'mild', MR: 'moderate', ...}
  wall_motion JSONB,
  pulmonary_pressure_sys INT,
  pericardial_effusion BOOLEAN DEFAULT FALSE,
  performed_by_user_id BIGINT
);
CREATE INDEX idx_card_echo_enc ON card_echocardiograms(encounter_id);
ALTER TABLE card_echocardiograms ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_echocardiograms FORCE ROW LEVEL SECURITY;
CREATE POLICY card_echo_tenant ON card_echocardiograms
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_procedures (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES card_encounters(id) ON DELETE CASCADE,
  procedure_name VARCHAR(100), -- 'PCI', 'CABG', 'ABLATION', 'TEE', 'CARDIOVERSION', 'PACEMAKER', 'ICD', 'TAVR', 'MitraClip'
  procedure_date TIMESTAMPTZ,
  indication TEXT,
  findings TEXT,
  stents_placed INT,
  contrast_volume_ml INT,
  fluoroscopy_time_min NUMERIC(5,1),
  radiation_dose_mgy NUMERIC(7,2),
  complications TEXT,
  performed_by_user_id BIGINT
);
CREATE INDEX idx_card_proc_enc ON card_procedures(encounter_id);
ALTER TABLE card_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY card_proc_tenant ON card_procedures
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_medications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES card_encounters(id) ON DELETE CASCADE,
  medication_name VARCHAR(200), -- 'aspirin', 'clopidogrel', 'apixaban', 'atorvastatin', 'metoprolol', 'lisinopril', 'sacubitril-valsartan', 'spironolactone', 'dapagliflozin', 'furosemide'
  dose VARCHAR(50),
  frequency VARCHAR(50),
  indication TEXT,
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  is_anticoag BOOLEAN DEFAULT FALSE,
  is_antiplatelet BOOLEAN DEFAULT FALSE,
  prescribed_by_user_id BIGINT
);
CREATE INDEX idx_card_meds_enc ON card_medications(encounter_id);
ALTER TABLE card_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_medications FORCE ROW LEVEL SECURITY;
CREATE POLICY card_meds_tenant ON card_medications
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_devices (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  device_type VARCHAR(50), -- 'PACEMAKER', 'ICD', 'CRT', 'LOOP_RECORDER', 'WATCHMAN'
  manufacturer VARCHAR(50),
  model VARCHAR(50),
  serial_number VARCHAR(100),
  implanted_at TIMESTAMPTZ,
  battery_status VARCHAR(20),
  lead_status VARCHAR(20),
  last_check_at TIMESTAMPTZ,
  next_check_at TIMESTAMPTZ,
  notes TEXT
);
CREATE INDEX idx_card_dev_patient ON card_devices(patient_id);
ALTER TABLE card_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_devices FORCE ROW LEVEL SECURITY;
CREATE POLICY card_dev_tenant ON card_devices
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE card_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'CARD-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);
CREATE INDEX idx_card_vector_hnsw ON card_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE card_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY card_vector_tenant ON card_vector_index
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

COMMIT;
