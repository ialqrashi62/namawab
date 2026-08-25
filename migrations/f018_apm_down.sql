-- f018_apm_down.sql — rollback f018_apm_up
DROP POLICY IF EXISTS p_apm_tenant ON apm_metrics;
DROP TABLE IF EXISTS apm_metrics;
