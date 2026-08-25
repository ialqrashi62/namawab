-- filepath: migrations/f017_helpdesk_down.sql
DROP POLICY IF EXISTS p_ht_tenant ON helpdesk_tickets;
DROP TABLE IF EXISTS helpdesk_tickets;
