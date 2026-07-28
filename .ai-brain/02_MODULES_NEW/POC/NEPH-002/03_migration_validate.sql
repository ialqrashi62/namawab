<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- NEPH-002 Migration Validation
SELECT tablename, rowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname='public' AND tablename LIKE 'transplant%' OR tablename IN ('donor_registry','recipient_evaluation','hla_typing','crossmatch_results','immunosuppression_log','rejection_episodes','protocol_biopsies','graft_surveillance','post_transplant_infections','long_term_followup','paired_exchange_pool')
ORDER BY tablename;
-- Expected: 13 tables with rls=TRUE