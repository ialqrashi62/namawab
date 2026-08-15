-- Migration DOWN: TIER3_CARD-303_ONCO

DROP POLICY IF EXISTS coo_vte_tenant_isolation ON vte_cancer;
ALTER TABLE vte_cancer NO FORCE ROW LEVEL SECURITY;
ALTER TABLE vte_cancer DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS vte_cancer CASCADE;

DROP POLICY IF EXISTS coo_ici_tenant_isolation ON ici_myocarditis;
ALTER TABLE ici_myocarditis NO FORCE ROW LEVEL SECURITY;
ALTER TABLE ici_myocarditis DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ici_myocarditis CASCADE;

DROP POLICY IF EXISTS coo_events_tenant_isolation ON cardiotoxicity_events;
ALTER TABLE cardiotoxicity_events NO FORCE ROW LEVEL SECURITY;
ALTER TABLE cardiotoxicity_events DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardiotoxicity_events CASCADE;

DROP POLICY IF EXISTS coo_cases_tenant_isolation ON cardio_onc_cases;
ALTER TABLE cardio_onc_cases NO FORCE ROW LEVEL SECURITY;
ALTER TABLE cardio_onc_cases DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardio_onc_cases CASCADE;

-- Restore from backup if needed: ops/live_deploy/pgdump-YYYYMMDD.sql
