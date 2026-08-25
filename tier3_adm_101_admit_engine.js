/**
 * TIER3_ADM-101 Admission / Registration Engine
 * Admission registration + Identity verification + Informed consent + Insurance auth + Pre-admission screening
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHRQ_ADM: 'AHRQ Patient Admission 2024', JOINT_COMM: 'Joint Commission NPSG 2024' };

function admissionRegistration(input) {
  const { admission_type, chief_complaint, source_referral, insurance_status, language_barrier, advance_directive_present, code_status, social_determinants_risk } = input;
  let priority = 'routine_admission';
  if (admission_type === 'emergency') priority = 'emergency_admission_within_2h_bed_assignment';
  else if (admission_type === 'elective_surgical') priority = 'pre_planned_with_pre_op_clinical_review_completed';
  let checklist = ['identity_band_two_identifiers', 'allergy_assessment', 'fall_risk_assessment', 'pressure_injury_risk', 'code_status_documented', 'medication_reconciliation_initial', 'advance_directive_presence_documented'];
  return {
    priority, checklist,
    identity_verification: 'two_identifiers_name_DOB_or_MRN_with_band_applied',
    social_determinants: 'screen_food_insecurity_housing_transportation_health_literacy',
    language_access: 'professional_interpreter_required_not_family_minor_for_consent',
    citation: CITATIONS.AHRQ_ADM,
  };
}

function identityVerification(input) {
  const { primary_id_type, secondary_id_type, photo_on_file, biometrics_used, language_preference, name_aliases, dual_identification_process, mrns_unique } = input;
  let verification_level = 'two_identifier_with_photo_on_file';
  if (biometrics_used === 'yes') verification_level = 'biometric_plus_two_identifier_highest_security';
  if (name_aliases === 'multiple') verification_level = 'name_aliases_indexed_in_EMR_to_prevent_duplicate_records';
  return {
    verification_level,
    duplicate_prevention: 'EMR_duplicate_check_by_name_DOB_and_MRN_at_registration_avoid_duplicate_medical_record',
    language: 'primary_language_recorded_for_professional_interpreter_access',
    citation: CITATIONS.JOINT_COMM,
  };
}

function informedConsentDocumentation(input) {
  const { consent_type, procedure_complexity, language_consent, patient_capacity_assessed, surrogate_decision_maker, witness_present, interpreter_used, time_taken_to_consent_min } = input;
  let consent_required = 'procedure_specific_written_consent_with_risks_benefits_alternatives';
  if (procedure_complexity === 'high_risk_major_surgery') consent_required = 'enhanced_consent_with_2nd_physician_confirmation_of_understanding';
  if (patient_capacity_assessed === 'no') consent_required = 'surrogate_decision_maker_with_legal_authority_healthcare_proxy_or_court_guardianship';
  let time_required = time_taken_to_consent_min >= 15 ? 'adequate' : 'INADEQUATE_provide_more_time_or_re_discuss';
  return {
    consent_required, time_required,
    elements: ['nature_of_procedure', 'risks_specific_to_procedure', 'benefits_expected', 'alternatives_including_no_treatment', 'patient_questions_addressed', 'voluntary_agreement_documented', 'physician_signature_and_patient_signature'],
    interpreter_used, witness_present,
    documentation: 'consent_form_scanned_into_EMR_with_version_and_date_time_physician_name',
    citation: CITATIONS.JOINT_COMM,
  };
}

function insuranceAuthorization(input) {
  const { insurance_type, prior_auth_required, authorization_number, coverage_active, copay_amount, deductible_status, global_period_surgery, denial_appeal_filed } = input;
  let billing = 'standard_insurance_billing';
  if (insurance_type === 'cash_pay_no_insurance') billing = 'cash_pay_self_pay_discount_offered_payment_plan_available';
  if (prior_auth_required === 'yes' && authorization_number === '') billing = 'BLOCK_admission_until_authorization_obtained';
  let financial_counselor_referral = insurance_type === 'medicaid_or_uninsured' || deductible_status === 'high' ? 'financial_counselor_referral_for_payment_options_and_assistance_programs' : 'routine';
  return {
    billing, financial_counselor_referral,
    copay_collection: 'collect_copay_at_admission_or_set_up_payment_arrangement',
    precertification: 'precert_required_for_elective_admission_MRI_CT_surgery_with_insurance_company',
    citation: CITATIONS.AHRQ_ADM,
  };
}

function preAdmissionScreening(input) {
  const { npo_status_hours, pre_op_labs_done, ekg_done, imaging_done, allergies_documented, medications_reviewed, nsaid_antiplatelet_hold_appropriate_days, anesthesia_clinic_clearance, patient_optimized } = input;
  let ready = npo_status_hours >= 6 && pre_op_labs_done === 'yes' && ekg_done === 'yes' && imaging_done === 'yes' && allergies_documented === 'yes' && medications_reviewed === 'yes' && nsaid_antiplatelet_hold_appropriate_days >= 5 && anesthesia_clinic_clearance === 'yes';
  let plan = ready ? 'cleared_for_surgery_proceed_with_admission' : 'DELAY_surgery_rescreen_and_optimize_before_proceeding';
  if (patient_optimized === 'no' && anesthesia_clinic_clearance === 'yes') plan = 'consider_optimization_diabetes_BP_anemia_smoking_cessation_4_to_6_weeks_before_elective_surgery';
  return {
    ready, plan,
    pre_op_optimization: ['diabetes_HbA1c_less_than_8.5', 'BP_below_140_over_90', 'smoking_cessation_4_weeks', 'alcohol_reduction', 'anemia_workup_and_treatment_if_Hgb_below_10', 'nutrition_optimization'],
    citation: CITATIONS.AHRQ_ADM,
  };
}

module.exports = { admissionRegistration, identityVerification, informedConsentDocumentation, insuranceAuthorization, preAdmissionScreening, CITATIONS, ValidationError };