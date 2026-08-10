-- e25_plans_pricing_candidate_up.sql
-- CANDIDATE ONLY — NOT RUN on production in Batch 3. Apply on an ISOLATED restore first (gate G9),
-- with explicit owner approval. ADDITIVE ONLY — NO DROP / NO type change / NO data rewrite / NO data loss.
-- Foundation for Jumanasoft SaaS plans/pricing/entitlements. Does NOT touch the existing `tenants` table
-- (tenants.plan_type / tenants.status remain as-is for backward compatibility).
BEGIN;

-- 1) Plan catalog (identity + pricing). Soft-disable via `active` (never hard-deleted).
CREATE TABLE IF NOT EXISTS plans (
    id             SERIAL PRIMARY KEY,
    plan_key       VARCHAR(50)  NOT NULL UNIQUE,
    name_ar        VARCHAR(120) NOT NULL,
    name_en        VARCHAR(120) NOT NULL,
    description_ar TEXT         NOT NULL DEFAULT '',
    description_en TEXT         NOT NULL DEFAULT '',
    currency       CHAR(3)      NOT NULL,
    monthly_price  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (monthly_price >= 0),
    yearly_price   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (yearly_price  >= 0),
    trial_days     INTEGER      NOT NULL DEFAULT 0 CHECK (trial_days >= 0 AND trial_days <= 365),
    active         BOOLEAN      NOT NULL DEFAULT true,
    sort_order     INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT plans_plan_key_fmt CHECK (plan_key ~ '^[a-z0-9_]{2,40}$')
);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans (active, sort_order);

-- 2) Entitlements / feature limits (1:1 with a plan). NULL limit = unlimited.
CREATE TABLE IF NOT EXISTS plan_entitlements (
    plan_id                INTEGER PRIMARY KEY REFERENCES plans(id) ON DELETE CASCADE,
    max_users              INTEGER CHECK (max_users IS NULL OR max_users >= 0),
    max_branches           INTEGER CHECK (max_branches IS NULL OR max_branches >= 0),
    max_invoices_per_month INTEGER CHECK (max_invoices_per_month IS NULL OR max_invoices_per_month >= 0),
    modules_enabled        TEXT        NOT NULL DEFAULT '',
    support_level          VARCHAR(20) NOT NULL DEFAULT 'standard',
    api_access             BOOLEAN     NOT NULL DEFAULT false,
    custom_domain          BOOLEAN     NOT NULL DEFAULT false
);

-- 3) Tenant -> plan assignment (historical; current = latest with effective_to IS NULL). No in-place mutate.
CREATE TABLE IF NOT EXISTS tenant_plan_assignments (
    id                SERIAL PRIMARY KEY,
    tenant_id         INTEGER     NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan_key          VARCHAR(50) NOT NULL REFERENCES plans(plan_key),
    assignment_source VARCHAR(20) NOT NULL DEFAULT 'manual',
    assigned_by       INTEGER,
    assigned_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    effective_from    TIMESTAMPTZ NOT NULL DEFAULT now(),
    effective_to      TIMESTAMPTZ,
    CONSTRAINT tpa_source_chk CHECK (assignment_source IN ('manual','trial','migration'))
);
CREATE INDEX IF NOT EXISTS idx_tpa_tenant_current ON tenant_plan_assignments (tenant_id, effective_to, assigned_at DESC);

COMMIT;
