-- migrations/e999-g113_rheumatology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS rheumatoid_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE rheumatoid_records ENABLE ROW LEVEL SECURITY; ALTER TABLE rheumatoid_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rheumatoid_records_t ON rheumatoid_records; CREATE POLICY rheumatoid_records_t ON rheumatoid_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS spondyloarthropathy_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE spondyloarthropathy_records ENABLE ROW LEVEL SECURITY; ALTER TABLE spondyloarthropathy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS spondyloarthropathy_records_t ON spondyloarthropathy_records; CREATE POLICY spondyloarthropathy_records_t ON spondyloarthropathy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS crystal_arthritis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE crystal_arthritis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE crystal_arthritis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS crystal_arthritis_records_t ON crystal_arthritis_records; CREATE POLICY crystal_arthritis_records_t ON crystal_arthritis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS connective_tissue_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE connective_tissue_records ENABLE ROW LEVEL SECURITY; ALTER TABLE connective_tissue_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS connective_tissue_records_t ON connective_tissue_records; CREATE POLICY connective_tissue_records_t ON connective_tissue_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS rheumatology_vasculitis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE rheumatology_vasculitis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE rheumatology_vasculitis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rheumatology_vasculitis_records_t ON rheumatology_vasculitis_records; CREATE POLICY rheumatology_vasculitis_records_t ON rheumatology_vasculitis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
