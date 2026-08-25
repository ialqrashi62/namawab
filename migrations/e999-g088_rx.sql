-- migrations/e999-g088_rx.sql
-- TIER68 Pharmacy Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS rx_clinical_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rx_clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_clinical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rx_clinical_records_t ON rx_clinical_records;
CREATE POLICY rx_clinical_records_t ON rx_clinical_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rx_oncology_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  protocol TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rx_oncology_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_oncology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rx_oncology_records_t ON rx_oncology_records;
CREATE POLICY rx_oncology_records_t ON rx_oncology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rx_specialty_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rx_specialty_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_specialty_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rx_specialty_records_t ON rx_specialty_records;
CREATE POLICY rx_specialty_records_t ON rx_specialty_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rx_clinical_pharm_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  drug TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rx_clinical_pharm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_clinical_pharm_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rx_clinical_pharm_records_t ON rx_clinical_pharm_records;
CREATE POLICY rx_clinical_pharm_records_t ON rx_clinical_pharm_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rx_informatics_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rx_informatics_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rx_informatics_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rx_informatics_records_t ON rx_informatics_records;
CREATE POLICY rx_informatics_records_t ON rx_informatics_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
