<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- NEPH-002 Migration DOWN
BEGIN;
DROP TABLE IF EXISTS paired_exchange_pool CASCADE;
DROP TABLE IF EXISTS long_term_followup CASCADE;
DROP TABLE IF EXISTS post_transplant_infections CASCADE;
DROP TABLE IF EXISTS graft_surveillance CASCADE;
DROP TABLE IF EXISTS protocol_biopsies CASCADE;
DROP TABLE IF EXISTS rejection_episodes CASCADE;
DROP TABLE IF EXISTS immunosuppression_log CASCADE;
DROP TABLE IF EXISTS transplant_procedure CASCADE;
DROP TABLE IF EXISTS crossmatch_results CASCADE;
DROP TABLE IF EXISTS hla_typing CASCADE;
DROP TABLE IF EXISTS recipient_evaluation CASCADE;
DROP TABLE IF EXISTS donor_registry CASCADE;
DROP TABLE IF EXISTS transplant_waitlist CASCADE;
COMMIT;