<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- ER-002 Migration DOWN
BEGIN;
DROP TABLE IF EXISTS trauma_prevention_programs CASCADE;
DROP TABLE IF EXISTS trauma_research_projects CASCADE;
DROP TABLE IF EXISTS trauma_outreach_events CASCADE;
DROP TABLE IF EXISTS trauma_pi_cases CASCADE;
DROP TABLE IF EXISTS trauma_registry_export CASCADE;
DROP TABLE IF EXISTS trauma_transfers_out CASCADE;
DROP TABLE IF EXISTS trauma_transfers_in CASCADE;
DROP TABLE IF EXISTS trauma_operative_log CASCADE;
DROP TABLE IF EXISTS trauma_mtp_activations CASCADE;
DROP TABLE IF EXISTS trauma_iss_score CASCADE;
DROP TABLE IF EXISTS trauma_injuries_ais CASCADE;
DROP TABLE IF EXISTS trauma_secondary_survey CASCADE;
DROP TABLE IF EXISTS trauma_primary_survey CASCADE;
DROP TABLE IF EXISTS trauma_activations CASCADE;
COMMIT;