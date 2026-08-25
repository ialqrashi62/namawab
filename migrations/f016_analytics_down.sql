-- f016_analytics_down.sql — rollback f016_analytics_up
DROP POLICY IF EXISTS p_ae_tenant ON analytics_events;
DROP TABLE IF EXISTS analytics_events;
