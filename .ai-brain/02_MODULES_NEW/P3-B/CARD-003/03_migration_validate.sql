<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->

-- CARD-003 Validation
SELECT tablename FROM pg_tables WHERE tablename LIKE 'ep%' OR tablename LIKE 'device%';
-- 8 tables
