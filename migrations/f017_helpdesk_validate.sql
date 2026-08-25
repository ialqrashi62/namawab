-- filepath: migrations/f017_helpdesk_validate.sql
SELECT count(*) AS row_count FROM helpdesk_tickets;
SELECT count(*) AS policy_count FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'helpdesk_tickets' AND policyname = 'p_ht_tenant';
SELECT c.relrowsecurity AS rls_enabled FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'helpdesk_tickets' AND n.nspname = current_schema();
