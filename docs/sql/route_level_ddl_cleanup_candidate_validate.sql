-- route_level_ddl_cleanup_candidate_validate.sql
-- Checks which route-level tables exist. VERIFIED 2026-06-21: in production MOST are false (13 missing;
-- only insurance_policies + pharmacy_prescriptions_queue exist). After running _up.sql they become true. Read-only.
SELECT
  to_regclass('public.obgyn_pregnancies')         IS NOT NULL AS obgyn_pregnancies,
  to_regclass('public.obgyn_deliveries')          IS NOT NULL AS obgyn_deliveries,
  to_regclass('public.referrals')                 IS NOT NULL AS referrals,
  to_regclass('public.medical_reports')           IS NOT NULL AS medical_reports,
  to_regclass('public.cash_drawer')               IS NOT NULL AS cash_drawer,
  to_regclass('public.visit_lifecycle')           IS NOT NULL AS visit_lifecycle,
  to_regclass('public.pathology_specimens')       IS NOT NULL AS pathology_specimens,
  to_regclass('public.cssd_batches')              IS NOT NULL AS cssd_batches,
  to_regclass('public.cme_events')                IS NOT NULL AS cme_events,
  to_regclass('public.infection_control_reports') IS NOT NULL AS infection_control_reports,
  to_regclass('public.maintenance_orders')        IS NOT NULL AS maintenance_orders,
  to_regclass('public.insurance_policies')        IS NOT NULL AS insurance_policies,
  to_regclass('public.inventory')                 IS NOT NULL AS inventory,
  to_regclass('public.pharmacy_prescriptions')    IS NOT NULL AS pharmacy_prescriptions,
  to_regclass('public.pharmacy_prescriptions_queue') IS NOT NULL AS pharmacy_prescriptions_queue;
-- PASS criterion: all 15 = true. If any is false in a target env, run _up.sql there (as superuser) first.
