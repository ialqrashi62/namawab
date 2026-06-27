-- ============================================================================
-- NAMA MEDICAL SYSTEM - TENANT COLUMNS BACKFILL DATA SCRIPT DRAFT (PLANNING)
-- File: docs/sql/medical_tenant_columns_backfill_draft.sql
-- Description: Draft SQL update script to backfill existing records with
--              default tenant_id, facility_id, and branch_id values.
-- NOT FOR PRODUCTION RUN - FOR REVIEW AND LOCAL DRY RUN ONLY
-- ============================================================================

-- NOTE: All updates default to:
--   - Tenant ID = 1 (Nama Medical Default Tenant)
--   - Facility ID = 1 (Default Medical Facility)
--   - Branch ID = 1 (Main Branch)

BEGIN;

-- 1. CLINICAL & MEDICAL TABLES (Defaulting tenant_id = 1, facility_id = 1)
-- ----------------------------------------------------------------------------
UPDATE medical_records SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE prescriptions SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE dental_records SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE lab_radiology_orders SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE lab_results SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE nursing_vitals SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE medical_certificates SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE patient_referrals SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE surgeries SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE surgery_preop_assessments SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE surgery_preop_tests SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE surgery_anesthesia_records SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE consent_forms SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE emergency_visits SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE emergency_trauma_assessments SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE admissions SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE admission_daily_rounds SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE icu_monitoring SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE icu_ventilator SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE icu_scores SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE icu_fluid_balance SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE emar_orders SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE emar_administrations SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE nursing_care_plans SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE telemedicine_sessions SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE pathology_cases SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE social_work_cases SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE mortuary_cases SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE cosmetic_cases SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE cosmetic_consents SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE cosmetic_photos SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE cosmetic_followups SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;


-- 2. FINANCIAL TABLES (Defaulting tenant_id = 1, facility_id = 1, branch_id = 1)
-- ----------------------------------------------------------------------------
UPDATE insurance_claims SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE finance_journal_entries SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE finance_journal_lines SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE finance_tax_declarations SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE finance_doctor_commissions SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
UPDATE finance_vouchers SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE zatca_invoices SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;


-- 3. OPERATIONAL & FLOW TABLES (Defaulting tenant_id = 1, branch_id = 1)
-- ----------------------------------------------------------------------------
UPDATE appointments SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE waiting_queue SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE online_bookings SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE portal_appointments SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE operating_rooms SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE emergency_beds SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE wards SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE beds SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE bed_transfers SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE maintenance_work_orders SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE transport_requests SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;


-- 4. HUMAN RESOURCES TABLES (Defaulting tenant_id = 1, facility_id = 1, branch_id = 1)
-- ----------------------------------------------------------------------------
UPDATE hr_employees SET tenant_id = 1, facility_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_salaries SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_leaves SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_advances SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_employee_documents SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_attendance SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE hr_employee_custody SET tenant_id = 1 WHERE tenant_id IS NULL;


-- 5. INVENTORY & PHARMACY TABLES (Defaulting tenant_id = 1, branch_id = 1)
-- ----------------------------------------------------------------------------
UPDATE inventory_items SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_opening_balances SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_purchases SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_purchase_items SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_issue_to_dept SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_issue_items SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_dept_requests SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_dept_request_items SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE inventory_stock_count SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE doctor_inventory_requests SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE doctor_inventory_request_items SET tenant_id = 1 WHERE tenant_id IS NULL;

UPDATE pharmacy_prescriptions_queue SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_drug_catalog SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_suppliers SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_sales SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_sale_items SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_purchase_orders SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_purchase_items SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE pharmacy_opening_balances SET tenant_id = 1, branch_id = 1 WHERE tenant_id IS NULL;


-- 6. SYSTEM LOGS & SETTINGS TABLES (Defaulting tenant_id = 1)
-- ----------------------------------------------------------------------------
UPDATE audit_trail SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE quality_incidents SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE quality_patient_satisfaction SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE quality_kpis SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE infection_surveillance SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE infection_outbreaks SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE employee_exposures SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE hand_hygiene_audits SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE company_settings SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE integration_settings SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE queue_advertisements SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE maintenance_pm_schedules SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE maintenance_equipment SET tenant_id = 1 WHERE tenant_id IS NULL;

COMMIT;
