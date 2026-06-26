#!/usr/bin/env bash
# =============================================================================
# NamaMedical — one-shot DDL deploy for integration/all-epics (E-X + E0..E18)
# RUN AS A DB ROLE WITH DDL PRIVILEGE (owner-run; the app role cannot do this).
# Run from a checkout of the integration/all-epics branch (has all migration files).
#
# Usage:
#   export PGHOST=localhost PGDATABASE=nama_medical_web PGUSER=<priv_role>
#   export PGPASSWORD=<...>                 # privileged/migration role
#   bash DEPLOY_RUN.sh                      # runs all migrations + validators, stops on first error
#
# SAFETY (read before running):
#  - TAKE A BACKUP FIRST:  pg_dump -Fc nama_medical_web > pre_deploy_$(date +%F).dump
#  - Several migrations contain `UPDATE ... SET tenant_id=1 WHERE tenant_id IS NULL`
#    (single-tenant dev backfill). If PRODUCTION IS MULTI-TENANT with live rows,
#    REVIEW/EDIT those backfills to the correct tenant mapping BEFORE running.
#  - FORCE RLS is enabled on existing tables; the app must run as the non-superuser
#    app role with per-request app.tenant_id binding (already the case) so rows stay visible.
#  - Each _up is followed by its _validate (a clean validate prints 0 problem rows /
#    expected counts). If a validate fails, STOP and inspect before continuing.
# =============================================================================
set -euo pipefail
PSQL="psql -v ON_ERROR_STOP=1 -X -q"
run() { echo ">>> $1"; $PSQL -f "$1"; }
val() { echo "--- validate: $1"; $PSQL -f "$1"; }

echo "=== E-X foundational ==="
run migrations/ex_01_orders_up.sql;            val migrations/ex_01_orders_validate.sql
run migrations/ex_02_rbac_up.sql;              val migrations/ex_02_rbac_validate.sql
run migrations/ex_03_tenant_id_indexes_up.sql; val migrations/ex_03_tenant_id_indexes_validate.sql

echo "=== E1 doctor station ==="
run migrations/e1_01_problems_up.sql;          val migrations/e1_01_problems_validate.sql
run migrations/e1_02_clinical_notes_up.sql;    val migrations/e1_02_clinical_notes_validate.sql

echo "=== E2 HIM ==="
run migrations/e2_01_coding_up.sql;            val migrations/e2_01_coding_validate.sql
run migrations/e2_02_roi_up.sql;               val migrations/e2_02_roi_validate.sql
run migrations/e2_03_record_access_up.sql;     val migrations/e2_03_record_access_validate.sql

echo "=== E3 laboratory ==="
run migrations/e3_01_lab_samples_up.sql;       val migrations/e3_01_lab_samples_validate.sql
run migrations/e3_02_lab_results_up.sql;       val migrations/e3_02_lab_results_validate.sql
run migrations/e3_03_lab_qc_up.sql;            val migrations/e3_03_lab_qc_validate.sql

echo "=== E4 radiology: no new DDL (route guards + existing tables) ==="

echo "=== E5 pharmacy ==="
run migrations/e5_01_drug_batches_up.sql;      val migrations/e5_01_drug_batches_validate.sql
run migrations/e5_02_pharmacy_dispense_up.sql; val migrations/e5_02_pharmacy_dispense_validate.sql
run migrations/e5_03_controlled_log_up.sql;    val migrations/e5_03_controlled_log_validate.sql

echo "=== E6 nursing/MAR ==="
run migrations/e6_01_mar_administrations_up.sql; val migrations/e6_01_mar_administrations_validate.sql
run migrations/e6_02_nursing_io_records_up.sql;  val migrations/e6_02_nursing_io_records_validate.sql
run migrations/e6_03_nursing_scores_up.sql;      val migrations/e6_03_nursing_scores_validate.sql

echo "=== E7 emergency/ED ==="
run migrations/e7_01_emergency_ed_workflow_up.sql; val migrations/e7_01_emergency_ed_workflow_validate.sql
run migrations/e7_02_emergency_rls_up.sql;         val migrations/e7_02_emergency_rls_validate.sql

echo "=== E8 inpatient/ADT ==="
run migrations/e8_01_inpatient_adt_rls_up.sql;  val migrations/e8_01_inpatient_adt_rls_validate.sql
run migrations/e8_02_bed_status_history_up.sql; val migrations/e8_02_bed_status_history_validate.sql

echo "=== E9 ICU ==="
run migrations/e9_01_icu_rls_up.sql;       val migrations/e9_01_icu_rls_validate.sql
run migrations/e9_02_icu_infusions_up.sql; val migrations/e9_02_icu_infusions_validate.sql

echo "=== E10 finance/GL/ZATCA ==="
run migrations/e10_01_gl_structure_up.sql;    val migrations/e10_01_gl_structure_validate.sql
run migrations/e10_02_cost_centers_up.sql;    val migrations/e10_02_cost_centers_validate.sql
run migrations/e10_03_zatca_invoices_up.sql;  val migrations/e10_03_zatca_invoices_validate.sql
run migrations/e10_04_invoice_gl_link_up.sql; val migrations/e10_04_invoice_gl_link_validate.sql
run migrations/e10_05_daily_close_rls_up.sql; val migrations/e10_05_daily_close_rls_validate.sql

echo "=== E11 insurance/NPHIES ==="
run migrations/e11_01_claims_lifecycle_up.sql;        val migrations/e11_01_claims_lifecycle_validate.sql
run migrations/e11_02_companies_policies_up.sql;      val migrations/e11_02_companies_policies_validate.sql
run migrations/e11_03_nphies_lifecycle_tables_up.sql; val migrations/e11_03_nphies_lifecycle_tables_validate.sql

echo "=== E12 surgery/OR ==="
run migrations/e12_001_surgery_or_up.sql; val migrations/e12_001_surgery_or_validate.sql
run docs/sql/surgery_or_rls_up.sql

echo "=== E13 blood bank ==="
run docs/migrations/blood_bank/01_blood_bank_e13_up.sql; val docs/migrations/blood_bank/01_blood_bank_e13_validate.sql

echo "=== E14 OB/maternity ==="
run migrations/e14_ob_maternity_up.sql; val migrations/e14_ob_maternity_validate.sql

echo "=== E15 pathology ==="
run migrations/e15_pathology_01_specimens_blocks_slides_reports_up.sql; val migrations/e15_pathology_01_specimens_blocks_slides_reports_validate.sql

echo "=== E16 inventory/CSSD ==="
run migrations/e16_01_inventory_cssd_rls_up.sql; val migrations/e16_01_inventory_cssd_rls_validate.sql
run migrations/e16_02_supply_chain_up.sql;       val migrations/e16_02_supply_chain_validate.sql
run migrations/e16_03_cssd_trays_up.sql;         val migrations/e16_03_cssd_trays_validate.sql

echo "=== E17 quality/infection ==="
run migrations/e17_001_quality_capa_up.sql; val migrations/e17_001_quality_capa_validate.sql
run migrations/e17_002_infection_up.sql;    val migrations/e17_002_infection_validate.sql

echo "=== E18 HR/workforce ==="
run migrations/e18_01_hr_workforce_up.sql; val migrations/e18_01_hr_workforce_validate.sql

echo "=== E0 onboarding ==="
run migrations/e0_01_tenants_archetype_up.sql;        val migrations/e0_01_tenants_archetype_validate.sql
run migrations/e0_02_facilities_extend_up.sql;        val migrations/e0_02_facilities_extend_validate.sql
run migrations/e0_03_facility_modules_up.sql;         val migrations/e0_03_facility_modules_validate.sql
run migrations/e0_04_integration_settings_rls_up.sql; val migrations/e0_04_integration_settings_rls_validate.sql

echo ""
echo "=== ALL MIGRATIONS APPLIED + VALIDATED ==="
echo "Next (operator): deploy the integration code + restart, then smoke:"
echo "  pm2 restart nama-app && sleep 3 && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/health"
echo "Gated flags stay OFF unless real keys exist: ACCOUNTING_POSTING_ENABLED, ZATCA_ENABLED, NPHIES_ENABLED, HR_PAYROLL_POSTING_ENABLED."
