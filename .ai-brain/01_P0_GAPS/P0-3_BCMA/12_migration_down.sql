-- Migration DOWN: P0-3_BCMA

DROP POLICY IF EXISTS bcma_drug_tenant_isolation ON bcma_drug_scans;
ALTER TABLE bcma_drug_scans NO FORCE ROW LEVEL SECURITY;
ALTER TABLE bcma_drug_scans DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS bcma_drug_scans CASCADE;

DROP POLICY IF EXISTS bcma_scan_tenant_isolation ON bcma_patient_scans;
ALTER TABLE bcma_patient_scans NO FORCE ROW LEVEL SECURITY;
ALTER TABLE bcma_patient_scans DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS bcma_patient_scans CASCADE;

DROP POLICY IF EXISTS bcma_dsp_tenant_isolation ON bcma_disposals;
ALTER TABLE bcma_disposals NO FORCE ROW LEVEL SECURITY;
ALTER TABLE bcma_disposals DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS bcma_disposals CASCADE;

DROP POLICY IF EXISTS bcma_ovr_tenant_isolation ON bcma_overrides;
ALTER TABLE bcma_overrides NO FORCE ROW LEVEL SECURITY;
ALTER TABLE bcma_overrides DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS bcma_overrides CASCADE;

DROP POLICY IF EXISTS bcma_mar_tenant_isolation ON bcma_mar_entries;
ALTER TABLE bcma_mar_entries NO FORCE ROW LEVEL SECURITY;
ALTER TABLE bcma_mar_entries DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS bcma_mar_entries CASCADE;
