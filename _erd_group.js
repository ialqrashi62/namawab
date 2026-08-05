// Compact DB schema summary for ERD diagram
const fs = require('fs');
const raw = `admin_resource_logs|8|t|t
admission_daily_rounds|16|t|t
admissions|29|t|t
ai_cds_log|16|t|t
ai_voice_sessions|17|t|t
ams_flags|15|t|t
appointments|12|t|t
approvals|8|t|t
audiogram_records|39|t|t
audiometry_metrics|9|t|t
audit_trail|16|t|t
bed_status_history|11|t|t
bed_transfers|12|t|t
beds|12|t|t
biopsy_samples|10|t|t
blood_bank_crossmatch|14|t|t
blood_bank_donors|17|t|t
blood_bank_transfusion_reactions|14|t|t
blood_bank_transfusions|22|t|t
blood_bank_units|17|t|t
branches|5|f|f
burn_assessments|21|t|t
burn_resuscitation_logs|9|t|t
cardiac_medications|10|t|t
cardio_thoracic_metrics|9|t|t
cardiology_cath_reports|9|t|t
cardiology_procedures|9|t|t
cardiology_visits|11|t|t
clinical_departments|7|t|t
clinical_incidents|11|t|t
clinical_knowledge_vectors|7|t|t
clinical_notes|17|t|t
clinical_pharmacy_reviews|14|t|t
clinical_photos_meta|10|t|t
clinical_records|12|t|t
clinical_smart_templates|6|t|t
clinical_templates|9|t|t
cme_activities|12|f|f
cme_registrations|8|f|f
cochlear_implant_registry|9|t|t
coding|10|t|t
company_settings|3|t|t
consent_forms|19|t|t
controlled_drug_log|17|t|t
cosmetic_cases|23|t|t
cosmetic_consents|24|t|t
cosmetic_followups|18|t|t
cosmetic_photos|12|t|t
cosmetic_procedures|11|f|f
cpb_logs|12|t|t
crit_care_hemodynamics|10|t|t
crit_care_ventilation_logs|10|t|t
cssd_instrument_sets|13|t|t
cssd_load_items|12|t|t
cssd_sterilization_cycles|20|t|t
cssd_trays|15|t|t
daily_close|15|t|t
dental_images|8|t|t
dental_periodontal_exams|9|t|t
dental_records|9|t|t
departments|6|f|f
dermatology_lesions|14|t|t
device_calibrations|11|t|t
diabetes_glucose_logs|9|t|t
diag_molecular_logs|9|t|t
dialysis_sessions|19|t|t
diet_meals|13|t|t
diet_orders|19|t|t
discount_rules|10|f|f
doctor_inventory_request_items|7|t|t
doctor_inventory_requests|10|t|t
drug_batches|13|t|t
drug_interactions|7|f|f
ecg_records|9|t|t
ecg_reports|11|t|t
emar_administrations|15|t|t
emar_orders|16|t|t
emergency_beds|10|t|t
emergency_trauma_assessments|18|t|t
emergency_visits|32|t|t
employee_exposures|14|t|t
employees|12|f|f
endoscopy_reports|11|t|t
ent_surgical_logs|11|t|t
ep_ablation_logs|9|t|t
exam_rooms|8|t|t
eye_exams|25|t|t
facilities|10|t|t
facility_modules|5|t|t
fhir_resources|12|t|t
finance_accounts_payable|25|t|t
finance_accounts_receivable|28|t|t
finance_chart_of_accounts|11|t|t
finance_cost_centers|8|t|t
finance_doctor_commissions|9|t|t
finance_fiscal_years|6|f|f
finance_journal_entries|19|t|t
finance_journal_lines|11|t|t
finance_report_snapshots|18|t|t
finance_tax_declarations|10|t|t
finance_vouchers|14|t|t
financial_integrity_logs|8|t|t
flap_monitoring_metrics|10|t|t
form_templates|7|f|f
fracture_management_logs|9|t|t
gastro_encounters|14|t|t
gastro_endoscopy_reports|12|t|t
gastro_hepatic_markers|11|t|t
glaucoma_metrics|9|t|t
goods_receipt_items|11|t|t
goods_receipts|8|t|t
gyn_oncology_registry|9|t|t
hai_isolation|17|t|t
hand_hygiene_audits|10|t|t
hcm_credentialing_logs|7|t|t
hl7_messages|19|t|t
hr_advances|9|t|t
hr_attendance|10|t|t
hr_competencies|13|t|t
hr_credentialing|14|t|t
hr_employee_custody|8|t|t
hr_employee_documents|9|t|t
hr_employees|18|t|t
hr_gosi_records|15|t|t
hr_leave_requests|15|t|t
hr_leaves|10|t|t
hr_licenses|14|t|t
hr_nitaqat_records|15|t|t
hr_payroll_slips|21|t|t
hr_salaries|11|t|t
hr_shifts|14|t|t
hr_wps_files|13|t|t
icd10_codes|3|f|f
icu_assessments|30|t|t
icu_daily_goals|35|t|t
icu_fluid_balance|22|t|t
icu_infusions|17|t|t
icu_monitoring|20|t|t
icu_prevention_bundles|11|t|t
icu_scores|16|t|t
icu_ventilator|21|t|t
idempotency_keys|9|t|t
incident_reports|17|t|t
infection_outbreaks|13|t|t
infection_surveillance|19|t|t
insulin_regimens|9|t|t
insurance_claim_denials|9|t|t
insurance_claim_lines|10|t|t
insurance_claims|28|t|t
insurance_companies|7|t|t
insurance_contracts|9|t|t
insurance_eligibility_checks|11|t|t
insurance_payer_pricing|9|t|t
insurance_policies|10|t|t
insurance_pre_authorizations|15|t|t
integration_settings|10|t|t
internal_messages|9|t|t
intracranial_pressure_logs|11|t|t
inventory|13|t|t
inventory_batches|12|t|t
inventory_dept_request_items|7|t|t
inventory_dept_requests|9|t|t
inventory_issue_items|7|t|t
inventory_issue_to_dept|9|t|t
inventory_items|16|t|t
inventory_movements|13|t|t
inventory_opening_balances|8|t|t
inventory_purchase_items|8|t|t
inventory_purchases|9|t|t
inventory_stock_count|9|t|t
inventory_stock_counts|12|t|t
invoices|25|t|t
iol_registry|11|t|t
joint_assessments|12|t|t
joint_replacement_registry|12|t|t
joint_rom_assessments|12|t|t
lab_critical_callbacks|11|t|t
lab_loinc_codes|19|t|t
lab_microbiology|27|t|t
lab_qc|16|t|t
lab_radiology_orders|19|t|t
lab_results|26|t|t
lab_samples|16|t|t
lab_tests_catalog|5|f|f
maintenance_equipment|19|t|t
maintenance_pm_schedules|11|t|t
maintenance_work_orders|19|t|t
mar_administrations|19|t|t
maternal_fetal_metrics|12|t|t
medical_certificates|14|t|t
medical_records|10|t|t
medical_records_coding|12|t|t
medical_records_files|11|t|t
medical_records_requests|12|t|t
medical_services|7|f|f
medical_waste_logs|10|t|t
medication_reconciliations|20|t|t
medications|5|f|f
mortuary_cases|20|t|t
neonatal_apgar_scores|12|t|t
neonatal_transition_logs|11|t|t
neuro_surgical_logs|14|t|t
neurology_assessments|14|t|t
nicu_ventilation_logs|12|t|t
notifications|14|t|t
nphies_claim_status_inquiry|10|t|t
nphies_remittance_advice|13|t|t
nuclear_med_logs|8|t|t
nursing_assessments|14|t|t
nursing_care_plans|15|t|t
nursing_handover|11|t|t
nursing_io|11|t|t
nursing_io_records|13|t|t
nursing_pain_assessments|22|t|t
nursing_risk_assessments|11|t|t
nursing_scores|13|t|t
nursing_vitals|18|t|t
nutrition_assessments|17|t|t
obgyn_anc_tracking|11|t|t
obgyn_antenatal_visits|27|t|t
obgyn_deliveries|15|t|t
obgyn_delivery_logs|12|t|t
obgyn_delivery_records|11|t|t
obgyn_encounters|18|t|t
obgyn_ivf_lab_logs|12|t|t
obgyn_lab_panels|7|t|t
obgyn_neonatal|28|t|t
obgyn_nst|15|t|t
obgyn_partogram|25|t|t
obgyn_pregnancies|36|t|t
obgyn_ultrasounds|26|t|t
oncology_patient_regimens|9|t|t
online_bookings|13|t|t
operating_rooms|9|t|t
operative_notes|13|t|t
ophthalmic_surgical_logs|11|t|t
or_consumption|8|t|t
or_slots|12|t|t
order_items|7|t|t
order_sets|5|t|t
orders|10|t|t
ortho_surgical_logs|13|t|t
orthopedic_implants|14|t|t
package_sessions|9|t|t
packages|8|f|f
pacu_records|17|t|t
pain_assessments|12|t|t
path_blocks|7|t|t
path_reports|19|t|t
path_slides|8|t|t
path_specimens|16|t|t
pathology_cases|19|t|t
pathology_digital_logs|9|t|t
pathology_specimens|9|f|f
patient_clinical_records|10|t|t
patient_drug_education|10|t|t
patient_problem_list|22|t|t
patient_referrals|14|t|t
patients|31|t|t
pci_hemodynamics|8|t|t
pci_sessions|10|t|t
pediatric_growth_records|12|t|t
pediatric_immunizations|15|t|t
peds_cardio_logs|10|t|t
peds_growth_logs|12|t|t
peds_milestone_tracking|9|t|t
peds_nephro_logs|9|t|t
peds_neuro_logs|9|t|t
permissions|4|f|f
pharmacy_controlled_substances|21|t|t
pharmacy_cs_transactions|21|t|t
pharmacy_dispense|15|t|t
pharmacy_drug_catalog|16|t|t
pharmacy_opening_balances|9|t|t
pharmacy_prescriptions_queue|21|t|t
pharmacy_purchase_items|10|t|t
pharmacy_purchase_orders|11|t|t
pharmacy_sale_items|9|t|t
pharmacy_sales|13|t|t
pharmacy_suppliers|9|t|t
plan_entitlements|8|f|f
plans|14|f|f
plastic_burns_surgical_logs|12|t|t
portal_appointments|11|t|t
portal_messages|14|t|t
portal_users|10|t|t
prescriptions|10|t|t
problems|12|t|t
psychiatric_evaluations|19|t|t
psychosocial_support_logs|9|t|t
pulmonary_function_tests|13|t|t
pulmonology_bronchoscopy|9|t|t
pulmonology_encounters|15|t|t
pulmonology_pft_results|14|t|t
pulmonology_sleep_studies|10|t|t
purchase_order_items|8|t|t
purchase_orders|13|t|t
quality_capa|17|t|t
quality_incidents|27|t|t
quality_kpis|13|t|t
quality_patient_satisfaction|16|t|t
quality_risk_register|19|t|t
queue_advertisements|8|t|t
radiology_advanced_metrics|9|t|t
radiology_catalog|5|f|f
record_access_log|8|t|t
rehab_assessments|12|t|t
rehab_goals|8|t|t
rehab_occupational_logs|8|t|t
rehab_patients|13|t|t
rehab_physical_logs|10|t|t
rehab_sessions|15|t|t
rehab_speech_logs|8|t|t
result_acknowledgements|11|t|t
roi_requests|11|t|t
role_permissions|5|t|t
saas_billing_audit_events|9|t|t
saas_billing_checkout_sessions|13|t|t
saas_billing_customers|9|t|t
saas_billing_payment_transactions|13|t|t
saas_billing_provider_accounts|8|f|f
saas_billing_subscriptions|14|t|t
saas_billing_webhook_events|11|f|f
sepsis_bundle_tracking|10|t|t
shock_titration_logs|9|t|t
social_work_cases|16|t|t
spine_stability_metrics|12|t|t
stent_registry|10|t|t
supply_chain_metrics|8|t|t
surgeries|24|t|t
surgery_anesthesia_records|22|t|t
surgery_count_sheets|15|t|t
surgery_encounters|16|t|t
surgery_implants|9|t|t
surgery_preop_assessments|28|t|t
surgery_preop_tests|13|t|t
surgery_wound_logs|9|t|t
surgical_checklists|12|t|t
surgical_intra_op_logs|9|t|t
surgical_robotic_logs|7|t|t
surgical_time_logs|11|t|t
system_users|14|f|f
telemedicine_sessions|17|t|t
tenant_lab_test_overrides|7|t|t
tenant_plan_assignments|8|t|t
tenant_radiology_overrides|8|t|t
tenant_service_overrides|7|t|t
tenant_settings|4|t|t
tenants|14|f|f
transport_requests|17|t|t
urodynamic_studies|12|t|t
urology_oncology_metrics|9|t|t
urology_stone_registry|9|t|t
urology_surgical_logs|12|t|t
user_facilities|6|f|f
user_mfa|5|f|f
user_mfa_recovery_codes|5|f|f
user_permissions|8|f|f
user_tenants|5|t|t
vascular_graft_registry|9|t|t
vendors|30|t|t
visit_lifecycle|15|t|t
waiting_queue|13|t|t
wards|11|t|t
who_surgical_checklist|16|t|t
zatca_credit_notes|22|t|t
zatca_invoices|24|t|t`;

const tables = raw.trim().split('\n').map(line => {
  const [name, cols, rls, force] = line.split('|');
  return { name, cols: parseInt(cols, 10), rls: rls === 't', force_rls: force === 't' };
});

const rules = [
  { key: 'core_tenant', label: 'Core / Tenant', desc: 'Tenants, users, facilities, RBAC, settings, departments, templates', patterns: [/^tenants$/, /^tenant_/, /^facilities$/, /^facility_/, /^branches$/, /^departments$/, /^clinical_departments$/, /^system_users$/, /^user_/, /^employees$/, /^permissions$/, /^role_permissions$/, /^company_settings$/, /^user_mfa/, /^form_templates$/, /^approvals$/, /^clinical_smart_templates$/, /^clinical_templates$/] },
  { key: 'saas_billing', label: 'SaaS / Billing', desc: 'Subscriptions, plans, payment provider events', patterns: [/^saas_billing_/, /^plans$/, /^plan_entitlements$/, /^tenant_plan_assignments$/, /^tenant_service_overrides$/] },
  { key: 'patient_clinical', label: 'Patient / Clinical Core', desc: 'Patient master, encounters, EMR, notes, problems, referrals, consent, portal, appointments', patterns: [/^patients$/, /^patient_/, /^admissions$/, /^admission_/, /^visit_lifecycle$/, /^clinical_notes$/, /^clinical_records$/, /^clinical_photos_meta$/, /^clinical_incidents$/, /^problems$/, /^patient_problem_list$/, /^coding$/, /^medical_records$/, /^medical_certificates$/, /^patient_referrals$/, /^patient_drug_education$/, /^patient_clinical_records$/, /^consent_forms$/, /^record_access_log$/, /^roi_requests$/, /^result_acknowledgements$/, /^appointments$/, /^waiting_queue$/, /^queue_advertisements$/, /^online_bookings$/, /^exam_rooms$/, /^admin_resource_logs$/, /^notifications$/, /^internal_messages$/, /^portal_/] },
  { key: 'orders_meds', label: 'Orders & Medications', desc: 'Orders, prescriptions, MAR/eMAR, pharmacy, drug safety, clinical pharmacy, pain', patterns: [/^orders$/, /^order_/, /^prescriptions$/, /^mar_/, /^emar_/, /^medication_reconciliations$/, /^pharmacy_/, /^drug_batches$/, /^drug_interactions$/, /^medications$/, /^controlled_drug_log$/, /^idempotency_keys$/, /^clinical_pharmacy_reviews$/, /^pain_assessments$/] },
  { key: 'lab_pathology', label: 'Lab & Pathology', desc: 'Specimens, results, QC, microbiology, biopsies, path reports, molecular', patterns: [/^lab_/, /^path_/, /^pathology_/, /^biopsy_samples$/, /^lab_tests_catalog$/, /^icd10_codes$/, /^diag_molecular_logs$/] },
  { key: 'radiology_imaging', label: 'Radiology & Imaging', desc: 'Radiology orders, advanced metrics, nuclear med, overrides, AI vectors', patterns: [/^radiology_/, /^lab_radiology_orders$/, /^nuclear_med_logs$/, /^tenant_radiology_overrides$/, /^clinical_knowledge_vectors$/] },
  { key: 'specialty_clinical', label: 'Specialty Clinical', desc: 'Surgery, ICU, OB/GYN, ED, Cardiology, Dental, Derm, Eye, ENT, Burn, Ortho, Neuro, Gyn Onc, GI, Pulm, Psych, Renal, Endo, Cosmetics, Rehab, Social work, Blood bank, CME', patterns: [/^surgeries$/, /^surgery_/, /^surgical_/, /^who_surgical_checklist$/, /^icu_/, /^crit_care_/, /^pacu_records$/, /^operative_notes$/, /^or_/, /^operating_rooms$/, /^emergency_/, /^emergency_beds$/, /^cardiology_/, /^cardio_thoracic_metrics$/, /^cardiac_medications$/, /^pci_/, /^ep_ablation_logs$/, /^cpb_logs$/, /^obgyn_/, /^maternal_fetal_metrics$/, /^neonatal_/, /^nicu_/, /^pediatric_/, /^peds_/, /^dental_/, /^dermatology_/, /^eye_exams$/, /^glaucoma_metrics$/, /^iol_registry$/, /^ophthalmic_surgical_logs$/, /^cochlear_implant_registry$/, /^audiogram_records$/, /^audiometry_metrics$/, /^ent_surgical_logs$/, /^burn_/, /^plastic_burns_surgical_logs$/, /^ortho_/, /^orthopedic_/, /^fracture_management_logs$/, /^spine_stability_metrics$/, /^joint_/, /^flap_monitoring_metrics$/, /^neuro_surgical_logs$/, /^intracranial_pressure_logs$/, /^neurology_/, /^gyn_oncology_registry$/, /^oncology_patient_regimens$/, /^urology_/, /^urodynamic_studies$/, /^vascular_graft_registry$/, /^stent_registry$/, /^gastro_/, /^endoscopy_reports$/, /^pulmonology_/, /^pulmonary_function_tests$/, /^psychiatric_/, /^psychosocial_support_logs$/, /^sepsis_bundle_tracking$/, /^ams_flags$/, /^shock_titration_logs$/, /^dialysis_sessions$/, /^diabetes_glucose_logs$/, /^insulin_regimens$/, /^mortuary_cases$/, /^cosmetic_/, /^social_work_cases$/, /^rehab_/, /^blood_bank_/, /^cme_/] },
  { key: 'nursing_obs', label: 'Nursing & Observations', desc: 'Vitals, nursing scores, IO, handover, care plans, ECG, nutrition, diet', patterns: [/^nursing_/, /^nursing_vitals$/, /^ecg_/, /^nutrition_assessments$/, /^diet_/] },
  { key: 'beds_wards_ops', label: 'Beds, Wards & Facility Ops', desc: 'Beds, wards, transfers, maintenance, CSSD, biomedical, supply chain, transport, waste, vendors, legacy inventory', patterns: [/^beds$/, /^bed_/, /^wards$/, /^maintenance_/, /^cssd_/, /^device_calibrations$/, /^supply_chain_metrics$/, /^transport_requests$/, /^medical_waste_logs$/, /^employee_exposures$/, /^vendors$/, /^inventory$/, /^doctor_inventory_request/] },
  { key: 'finance_insurance', label: 'Finance & Insurance', desc: 'GL, AR/AP, invoices, ZATCA, NPHIES, insurance, claims, packages, billing integrity', patterns: [/^finance_/, /^financial_/, /^invoices$/, /^daily_close$/, /^zatca_/, /^nphies_/, /^insurance_/, /^discount_rules$/, /^medical_services$/, /^packages$/, /^package_sessions$/] },
  { key: 'inventory_procurement', label: 'Inventory & Procurement', desc: 'Items, batches, stock, purchases, goods receipts, dept requests', patterns: [/^inventory_/, /^goods_receipt/, /^purchase_/] },
  { key: 'hr_workforce', label: 'HR & Workforce', desc: 'Employees, attendance, leaves, payroll, GOSI, Nitaqat, credentials, HCM', patterns: [/^hr_/, /^hcm_/] },
  { key: 'quality_safety', label: 'Quality, Safety & Compliance', desc: 'Incidents, KPIs, CAPA, infection, hand hygiene', patterns: [/^quality_/, /^incident_reports$/, /^infection_/, /^hai_/, /^hand_hygiene_/] },
  { key: 'integrations_ai', label: 'Integrations & AI', desc: 'HL7, FHIR, AI CDS, voice, integration settings, telemedicine, audit trail', patterns: [/^hl7_/, /^fhir_/, /^ai_/, /^integration_settings$/, /^telemedicine_sessions$/, /^audit_trail$/] }
];

const domains = {};
for (const r of rules) {
  domains[r.key] = { key: r.key, label: r.label, description: r.desc, table_count: 0, rls_count: 0, force_rls_count: 0, total_columns: 0, sample_tables: [] };
}
const unmatched = { key: 'unmatched', label: 'Unmatched', description: 'Not classified', table_count: 0, rls_count: 0, force_rls_count: 0, total_columns: 0, sample_tables: [] };

for (const t of tables) {
  let bucket = null;
  for (const r of rules) {
    if (r.patterns.some(p => p.test(t.name))) { bucket = domains[r.key]; break; }
  }
  if (!bucket) bucket = unmatched;
  bucket.table_count++;
  if (t.rls) bucket.rls_count++;
  if (t.force_rls) bucket.force_rls_count++;
  bucket.total_columns += t.cols;
  if (bucket.sample_tables.length < 8) bucket.sample_tables.push(t.name);
}

const ordered = rules.map(r => domains[r.key]).filter(d => d.table_count > 0);
if (unmatched.table_count > 0) ordered.push(unmatched);

const summary = {
  generated_at: '2026-08-04',
  database: 'nama_medical_web',
  schema: 'public',
  total_tables: tables.length,
  tenant_aware_tables_rls_enabled: tables.filter(t => t.rls).length,
  force_rls_tables: tables.filter(t => t.force_rls).length,
  total_columns: tables.reduce((a, t) => a + t.cols, 0),
  domain_count: ordered.length,
  domains: ordered
};

console.log(JSON.stringify(summary, null, 2));
