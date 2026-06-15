-- ============================================================================
-- NAMA MEDICAL SYSTEM - TENANT ISOLATION MIGRATION DDL DRAFT (PLANNING ONLY)
-- File: docs/sql/medical_tenant_columns_backfill_plan.sql
-- Description: Draft SQL migration script to add nullable tenant isolation fields
--              to clinical, financial, operational, and inventory tables.
-- NOT FOR PRODUCTION RUN - FOR REVIEW AND LOCAL DRY RUN ONLY
-- ============================================================================

-- 1. CLINICAL & MEDICAL TABLES (Requires: tenant_id, facility_id)
-- ----------------------------------------------------------------------------
-- medical_records
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_medical_records_tenant_facility ON medical_records (tenant_id, facility_id, patient_id);

-- prescriptions
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_prescriptions_tenant_facility ON prescriptions (tenant_id, facility_id, patient_id);

-- dental_records
ALTER TABLE dental_records ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE dental_records ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_dental_records_tenant_facility ON dental_records (tenant_id, facility_id, patient_id);

-- lab_radiology_orders
ALTER TABLE lab_radiology_orders ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE lab_radiology_orders ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_lab_rad_orders_tenant_facility ON lab_radiology_orders (tenant_id, facility_id, patient_id);

-- lab_results
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_lab_results_tenant_facility ON lab_results (tenant_id, facility_id);

-- nursing_vitals
ALTER TABLE nursing_vitals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE nursing_vitals ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_nursing_vitals_tenant_facility ON nursing_vitals (tenant_id, facility_id, patient_id);

-- medical_certificates
ALTER TABLE medical_certificates ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE medical_certificates ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_med_certificates_tenant_facility ON medical_certificates (tenant_id, facility_id);

-- patient_referrals
ALTER TABLE patient_referrals ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE patient_referrals ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_patient_referrals_tenant_facility ON patient_referrals (tenant_id, facility_id);

-- surgeries & assessments
ALTER TABLE surgeries ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE surgeries ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_surgeries_tenant_facility ON surgeries (tenant_id, facility_id);

ALTER TABLE surgery_preop_assessments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE surgery_preop_assessments ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE surgery_preop_tests ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE surgery_preop_tests ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE surgery_anesthesia_records ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE surgery_anesthesia_records ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- consent_forms
ALTER TABLE consent_forms ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE consent_forms ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_consent_forms_tenant_facility ON consent_forms (tenant_id, facility_id);

-- emergency_visits & assessments
ALTER TABLE emergency_visits ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE emergency_visits ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_er_visits_tenant_facility ON emergency_visits (tenant_id, facility_id);

ALTER TABLE emergency_trauma_assessments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE emergency_trauma_assessments ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- admissions & ward lifecycle
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS facility_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_admissions_tenant_facility ON admissions (tenant_id, facility_id);

ALTER TABLE admission_daily_rounds ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE admission_daily_rounds ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE icu_monitoring ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE icu_monitoring ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE icu_ventilator ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE icu_ventilator ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE icu_scores ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE icu_scores ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE icu_fluid_balance ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE icu_fluid_balance ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE emar_orders ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE emar_orders ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE emar_administrations ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE emar_administrations ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE nursing_care_plans ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE nursing_care_plans ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- clinical specialized modules
ALTER TABLE telemedicine_sessions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE telemedicine_sessions ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE pathology_cases ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pathology_cases ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE social_work_cases ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE social_work_cases ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE mortuary_cases ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE mortuary_cases ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE cosmetic_cases ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE cosmetic_cases ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE cosmetic_consents ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE cosmetic_consents ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE cosmetic_photos ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE cosmetic_photos ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE cosmetic_followups ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE cosmetic_followups ADD COLUMN IF NOT EXISTS facility_id INTEGER;


-- 2. FINANCIAL TABLES (Requires: tenant_id, facility_id, branch_id)
-- ----------------------------------------------------------------------------
-- insurance_claims
ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_ins_claims_tenant_fac_branch ON insurance_claims (tenant_id, facility_id, branch_id);

-- finance journals & transactions
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_journal_entries_tenant_fac_branch ON finance_journal_entries (tenant_id, facility_id, branch_id);

ALTER TABLE finance_journal_lines ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE finance_journal_lines ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE finance_journal_lines ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE finance_tax_declarations ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE finance_tax_declarations ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE finance_tax_declarations ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE finance_doctor_commissions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE finance_doctor_commissions ADD COLUMN IF NOT EXISTS facility_id INTEGER;

ALTER TABLE finance_vouchers ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE finance_vouchers ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE finance_vouchers ADD COLUMN IF NOT EXISTS branch_id INTEGER;

-- zatca_invoices
ALTER TABLE zatca_invoices ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE zatca_invoices ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE zatca_invoices ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_zatca_invoices_tenant_fac_branch ON zatca_invoices (tenant_id, facility_id, branch_id);


-- 3. OPERATIONAL & FLOW TABLES (Requires: tenant_id, branch_id, facility_id)
-- ----------------------------------------------------------------------------
-- appointments & queues
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_appts_tenant_branch ON appointments (tenant_id, branch_id, appt_date);

ALTER TABLE waiting_queue ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE waiting_queue ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_waiting_tenant_branch ON waiting_queue (tenant_id, branch_id);

-- online bookings
ALTER TABLE online_bookings ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE portal_appointments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

-- ward & bed assignments
ALTER TABLE operating_rooms ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE operating_rooms ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE emergency_beds ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE emergency_beds ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE wards ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE wards ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE beds ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE beds ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS branch_id INTEGER;

-- maintenance & transport
ALTER TABLE maintenance_work_orders ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE maintenance_work_orders ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE transport_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE transport_requests ADD COLUMN IF NOT EXISTS branch_id INTEGER;


-- 4. HUMAN RESOURCES TABLES (Requires: tenant_id, optional facility_id, branch_id)
-- ----------------------------------------------------------------------------
ALTER TABLE hr_employees ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_employees ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE hr_employees ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_hr_employees_tenant ON hr_employees (tenant_id);

ALTER TABLE hr_salaries ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_leaves ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_advances ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_employee_documents ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_attendance ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hr_attendance ADD COLUMN IF NOT EXISTS branch_id INTEGER;
ALTER TABLE hr_employee_custody ADD COLUMN IF NOT EXISTS tenant_id INTEGER;


-- 5. INVENTORY & PHARMACY TABLES (Requires: tenant_id, branch_id)
-- ----------------------------------------------------------------------------
-- general inventory
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_opening_balances ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_opening_balances ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_purchases ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_purchases ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_purchase_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_purchase_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_issue_to_dept ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_issue_to_dept ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_issue_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_issue_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_dept_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_dept_requests ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_dept_request_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_dept_request_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE inventory_stock_count ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE inventory_stock_count ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE doctor_inventory_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE doctor_inventory_requests ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE doctor_inventory_request_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

-- pharmacy & drugs catalog
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS branch_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_ph_rx_queue_tenant ON pharmacy_prescriptions_queue (tenant_id, branch_id);

ALTER TABLE pharmacy_drug_catalog ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_drug_catalog ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE pharmacy_suppliers ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE pharmacy_sales ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_sales ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE pharmacy_sale_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS branch_id INTEGER;

ALTER TABLE pharmacy_purchase_items ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE pharmacy_opening_balances ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE pharmacy_opening_balances ADD COLUMN IF NOT EXISTS branch_id INTEGER;


-- 6. SYSTEM LOGS & SETTINGS TABLES (Requires: tenant_id)
-- ----------------------------------------------------------------------------
ALTER TABLE audit_trail ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_audit_trail_tenant ON audit_trail (tenant_id);

ALTER TABLE quality_incidents ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE quality_patient_satisfaction ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE quality_kpis ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE infection_surveillance ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE infection_outbreaks ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE employee_exposures ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE hand_hygiene_audits ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE integration_settings ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE queue_advertisements ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE maintenance_pm_schedules ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE maintenance_equipment ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
