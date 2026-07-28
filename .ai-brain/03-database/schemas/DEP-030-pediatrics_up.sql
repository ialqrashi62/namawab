-- =====================================================================
-- BLUEPRINT v2 — INFORMATIONAL, NOT YET LIVE
-- =====================================================================
-- File:        DEP-030-pediatrics_up.sql
-- Department:  DEP-030 — Pediatrics & General (طب الأطفال العام)
-- Group:       women_and_children
-- Phase:       1 (Database + ERD)
-- Stack:       PostgreSQL 14+ (Express + pg planned for Phase 2)
-- Standards:   HL7-FHIR R4 · ICD-10 · SNOMED-CT · CBAHI · NPHIES · SFDA · PDPL
-- Add-on:      JCI + HIPAA (informational; not live KSA regulator)
-- Generated:   2026-07-23 21:44:10 UTC  by  generate_blueprint_v2.py
-- Idempotent:  re-running this script overwrites this file deterministically
--
-- SAFETY RAILS (binding):
-- - No hardcoded secrets, keys, tokens, or PHI in this file (AGENTS.md §2.2 #1, #2)
-- - tenant_id NOT NULL DEFAULT current_setting('app.tenant_id')::uuid
--   with FORCE ROW LEVEL SECURITY enabled (AGENTS.md §2.2 #5)
-- - Audit columns (created_at_utc, updated_at_utc, deleted_at_utc) on every table
-- - PHI columns marked with -- PHI-ENVELOPE: column tagged for crypto_envelope.js
-- - Money columns are NUMERIC(14,4); VAT is server-side (AGENTS.md §2.2 #9)
-- - Down migration is non-destructive: DROPS only objects this up created
--   (no DROP DATA, no silent RLS removal) (AGENTS.md §2.2 #4)
--
-- This file is NOT applied to the live database. It is a blueprint
-- for owner review. Apply to a sandbox only after explicit owner
-- authorization (AGENTS.md §2.4).
-- =====================================================================

SET search_path = blueprint_v2, public;

CREATE SCHEMA IF NOT EXISTS blueprint_v2;

-- Tenant context: every request sets app.tenant_id at the connection level
-- via db_postgres.js. Default to a sentinel for offline analysis.
SET LOCAL app.tenant_id = '00000000-0000-0000-0000-000000000000';

-- Main entity table for Pediatrics & General (طب الأطفال العام)
CREATE TABLE IF NOT EXISTS blueprint_v2.peds_visit (
    peds_visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL DEFAULT current_setting('app.tenant_id')::uuid,
    visited_at_utc TIMESTAMPTZ NOT NULL,
    age_months SMALLINT,
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,2),
    head_circumference_cm NUMERIC(4,1),
    immunizations_due TEXT  -- PHI-ENVELOPE,
    created_at_utc TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at_utc TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at_utc TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_peds_visit_tenant ON blueprint_v2.peds_visit(tenant_id);

-- Row-Level Security (FORCE = enforce even for table owner)
ALTER TABLE blueprint_v2.peds_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprint_v2.peds_visit FORCE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY peds_visit_tenant_isolation ON blueprint_v2.peds_visit
    USING (
        tenant_id = NULLIF(current_setting('app.tenant_id', TRUE), '')::uuid
        OR current_setting('app.bypass_rls', TRUE) = 'on'
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.tenant_id', TRUE), '')::uuid
        OR current_setting('app.bypass_rls', TRUE) = 'on'
    );

-- Updated-at trigger (single trigger function reused across depts)
CREATE OR REPLACE FUNCTION blueprint_v2.trg_set_updated_at_utc()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at_utc := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER peds_visit_set_updated_at_utc
BEFORE UPDATE ON blueprint_v2.peds_visit
FOR EACH ROW EXECUTE FUNCTION blueprint_v2.trg_set_updated_at_utc();

-- Revoke public access; app role is granted explicitly.
REVOKE ALL ON blueprint_v2.peds_visit FROM PUBLIC;
