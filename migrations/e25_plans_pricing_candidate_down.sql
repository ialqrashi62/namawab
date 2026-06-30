-- e25_plans_pricing_candidate_down.sql
-- Rollback for e25 — ONLY for an isolated test DB where e25_up was applied. These tables are NEW and
-- additive (Batch 3 created them); dropping them removes no pre-existing data. NEVER run on production
-- without explicit owner approval. Reverse dependency order.
BEGIN;
DROP TABLE IF EXISTS tenant_plan_assignments;
DROP TABLE IF EXISTS plan_entitlements;
DROP TABLE IF EXISTS plans;
COMMIT;
