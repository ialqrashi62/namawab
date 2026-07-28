-- =====================================================================
-- BLUEPRINT v2 — DOWN MIGRATION (NON-DESTRUCTIVE)
-- =====================================================================
-- File:        DEP-031-reproductive-ivf_down.sql
-- Department:  DEP-031 — Reproductive Medicine & IVF
-- Phase:       1 (Database + ERD)
-- Generated:   2026-07-23 21:44:10 UTC  by  generate_blueprint_v2.py
--
-- This migration REVERSES the matching _up.sql.
-- It DROPs only the objects that the up migration created in schema "blueprint_v2".
-- It does NOT touch:
--   - The shared "nama" schema (patient, encounter, user, tenant, etc.)
--   - Any table the up migration did not create
--   - Any RLS policy outside of objects this dept owns
--   - Any data rows (per AGENTS.md §2.2 #4: no DROP DATA)
--
-- Run only after backing up. Owner authorization required.
-- =====================================================================

SET search_path = blueprint_v2, public;

-- Drop trigger first
DROP TRIGGER IF EXISTS ivf_cycle_set_updated_at_utc ON blueprint_v2.ivf_cycle;

-- Drop policy
DROP POLICY IF EXISTS ivf_cycle_tenant_isolation ON blueprint_v2.ivf_cycle;

-- Drop the table (CASCADE removes its indexes and constraint dependents;
-- per AGENTS.md §2.2 #4, no DROP DATA outside the table itself).
DROP TABLE IF EXISTS blueprint_v2.ivf_cycle CASCADE;

-- Note: we do NOT drop the blueprint_v2 schema here because other depts share it.
-- The shared trigger function (blueprint_v2.trg_set_updated_at_utc) is also
-- reused and is dropped by a separate cross-cutting migration once all
-- dept tables have been removed.
