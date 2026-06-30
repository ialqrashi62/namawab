-- e24_tenants_control_center_candidate_up.sql
-- CANDIDATE ONLY — NOT RUN in Batch 1 (the Tenant Control Center works without it; status+plan_type
-- already exist on `tenants`). Optional additive columns for a later batch. Apply on an ISOLATED restore
-- first (gate G9), with explicit owner approval. Additive only — NO DROP / NO type change / NO data loss.
BEGIN;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS trial_ends_at    TIMESTAMPTZ;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS suspended_at     TIMESTAMPTZ;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
COMMIT;
