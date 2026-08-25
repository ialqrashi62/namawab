// filepath: tier5_pharmacy_ext_103_safety_engine.js
// TIER5_PHARMACY_EXT-103: Medication safety (reconciliation, mechanism, monitoring, near-miss)
'use strict';

const CITATIONS = [
  'WHO_Patient_Safety_2020',
  'Joint_Commission_MedRec_2023',
  'ASHP_Pharmacovigilance_2019',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function med_rec(req) {
  ensureNumber(req.med_count_total, 'med_count_total');
  ensureNumber(req.discrepancies_count, 'discrepancies_count');
  ensureNumber(req.high_risk_med_count, 'high_risk_med_count');
  ensureNumber(req.allergy_confirmed_count, 'allergy_confirmed_count');
  ensureBool(req.documented_ownership, 'documented_ownership');
  if (req.med_count_total <= 0) throw new ValidationError('med_count_total>0');
  const disc_rate = req.discrepancies_count / req.med_count_total;
  let band;
  if (req.discrepancies_count === 0) band = 'no_discrepancies';
  else if (disc_rate < 0.05) band = 'low_discrepancy';
  else if (disc_rate < 0.15) band = 'moderate';
  else if (disc_rate < 0.3) band = 'high';
  else band = 'critical_review_required_immediately';

  return { discrepancy_band: band };
}

function reconcile(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.dose_at_home, 'dose_at_home');
  ensureNumber(req.dose_at_admission, 'dose_at_admission');
  ensureBool(req.physician_cognizant, 'physician_cognizant');
  ensureBool(req.pharmacist_reconciled, 'pharmacist_reconciled');
  ensureBool(req.nurse_administered_through_electronic_system, 'nurse_administered_through_electronic_system');

  if (req.dose_at_home === req.dose_at_admission) return { status: 'no_discrepancy' };
  if (req.physician_cognizant && req.pharmacist_reconciled && req.nurse_administered_through_electronic_system) return { status: 'discrepancy_resolved_continue_with_admission_dose' };
  if (!req.pharmacist_reconciled) return { status: 'request_pharmacist_review_to_reconcile_difference' };
  if (!req.physician_cognizant) return { status: 'review_by_physician_then_reschedule_with_patient' };
  if (!req.nurse_administered_through_electronic_system) return { status: 'implement_barcode_or_ehr_at_admin_time' };
  return { status: 're_review_difference' };
}

function mechanism_assess(req) {
  ensureStr(req.adverse_event, 'adverse_event');
  ensureEnum(req.adverse_event, 'adverse_event', ['hypersensitivity_rash','anaphylaxis','bleeding_or_clot','electrolyte_or_renal','liver_injury','cardiac_qt_prolongation','overdose','teratogenicity','neuroleptic_malignant_syndrome','serotonin_syndrome','severe_neutropenia']);
  ensureStr(req.drug, 'drug');
  ensureNumber(req.time_since_first_dose_days, 'time_since_first_dose_days');

  let approach;
  if (req.adverse_event === 'hypersensitivity_rash' && req.time_since_first_dose_days < 7) approach = 'review_drug_reaction_with_lymphocyte_transformation_test_then_desensitization_considerations';
  else if (req.adverse_event === 'anaphylaxis') approach = 'stop_drug_immediately_then_provide_epinephrine_and_long_term_desensitization_options';
  else if (req.adverse_event === 'serotonin_syndrome') approach = 'review_drug_combination_then_provide_supportive_care_with_cyproheptadine';
  else if (req.adverse_event === 'liver_injury') approach = 'stop_drug_with_thorough_liver_review_then_refer_gastroenterology';
  else if (req.adverse_event === 'cardiac_qt_prolongation') approach = 'stop_drug_immediately_then_qtc_monitor_until_below_470ms';
  else if (req.adverse_event === 'neuroleptic_malignant_syndrome') approach = 'stop_drug_then_dantrolene_or_bromocriptine_then_continue_supportive_care';
  else approach = 'consider_drug_discontinuation_or_alternative_then_decision_to_support_continuation';

  return { approach };
}

function monitoring(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.last_dose_days_ago, 'last_dose_days_ago');
  ensureBool(req.patient_presenting_with_symptoms, 'patient_presenting_with_symptoms');
  ensureNumber(req.days_on_drug, 'days_on_drug');
  ensureNumber(req.last_lab_value, 'last_lab_value');

  let monitoring_rule;
  if (req.drug.includes('warfarin') && req.last_lab_value > 3.5) monitoring_rule = 'continue_inr_then_re_check_with_3_days_lab_restraint';
  else if (req.drug.includes('amiodarone') && req.last_dose_days_ago <= 60) monitoring_rule = 'tsh_lfts_cxr_then_dose_review_with_cardiologist';
  else if (req.drug.includes('methotrexate') && req.days_on_drug > 7) monitoring_rule = 'cbc_renal_liver_then_dose_verify_per_lab_then_letter';
  else if (req.drug.includes('gentamicin') && req.days_on_drug > 3) monitoring_rule = 'trough_level_then_dose_review_with_pharmacy';
  else monitoring_rule = 'continue_per_protocol_then_routine_screenings';

  if (req.patient_presenting_with_symptoms) monitoring_rule += '_consider_urgent_review_by_pharmacist';

  return { monitoring_rule };
}

function recurring_qa(req) {
  ensureBool(req.near_miss_reviewed, 'near_miss_reviewed');
  ensureNumber(req.near_miss_count, 'near_miss_count');
  ensureNumber(req.medication_error_caused_harm_count, 'medication_error_caused_harm_count');
  ensureBool(req.system_failure_root_cause_reviewed, 'system_failure_root_cause_reviewed');

  let action;
  if (req.near_miss_reviewed && req.system_failure_root_cause_reviewed && req.medication_error_caused_harm_count === 0) action = 'program_continue_with_ongoing_qa_then_report_to_oversight';
  else if (req.near_miss_count >= 3) action = 'consider_process_audit_and_response_with_knowledge_in_systems_simulations';
  else if (req.medication_error_caused_harm_count >= 1) action = 'urgent_root_cause_analysis_then_redesign';
  else if (!req.near_miss_reviewed) action = 'near_miss_inventory_required_each_quarter_with_action_plan';
  else action = 'continue_with_normal_qa';
  return { action };
}

function funcs() { return { med_rec, reconcile, mechanism_assess, monitoring, recurring_qa }; }
module.exports = { funcs, CITATIONS, ValidationError };
