-- Migration DOWN: TIER3_CARD-305_PE_DVT

DROP POLICY IF EXISTS pe_fup_tenant_isolation ON pe_dvt_followups;
ALTER TABLE pe_dvt_followups NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_followups DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pe_dvt_followups CASCADE;

DROP POLICY IF EXISTS pe_tx_tenant_isolation ON pe_dvt_treatments;
ALTER TABLE pe_dvt_treatments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_treatments DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pe_dvt_treatments CASCADE;

DROP POLICY IF EXISTS pe_cases_tenant_isolation ON pe_dvt_cases;
ALTER TABLE pe_dvt_cases NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_cases DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pe_dvt_cases CASCADE;
