-- e25_plans_pricing_candidate_validate.sql
-- Read-only validation for an ISOLATED test DB after e25_up. Returns all_ok = true iff the three tables,
-- key constraints, and indexes exist as designed. No writes.
SELECT
    (SELECT count(*) FROM information_schema.tables
       WHERE table_name IN ('plans','plan_entitlements','tenant_plan_assignments')) = 3                      AS tables_present,
    (SELECT count(*) FROM information_schema.columns
       WHERE table_name = 'plans'
         AND column_name IN ('plan_key','currency','monthly_price','yearly_price','active','sort_order')) = 6 AS plans_cols_present,
    EXISTS (SELECT 1 FROM information_schema.table_constraints
              WHERE table_name='plans' AND constraint_name='plans_plan_key_fmt')                              AS plan_key_check_present,
    EXISTS (SELECT 1 FROM information_schema.table_constraints
              WHERE table_name='tenant_plan_assignments' AND constraint_name='tpa_source_chk')               AS source_check_present,
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_plans_active')                                      AS plans_index_present,
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_tpa_tenant_current')                                AS tpa_index_present,
    (
        (SELECT count(*) FROM information_schema.tables
           WHERE table_name IN ('plans','plan_entitlements','tenant_plan_assignments')) = 3
        AND EXISTS (SELECT 1 FROM information_schema.table_constraints
              WHERE table_name='plans' AND constraint_name='plans_plan_key_fmt')
        AND EXISTS (SELECT 1 FROM information_schema.table_constraints
              WHERE table_name='tenant_plan_assignments' AND constraint_name='tpa_source_chk')
    ) AS all_ok;
