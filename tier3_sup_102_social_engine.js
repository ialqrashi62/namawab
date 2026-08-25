/**
 * TIER3_SUP-102 Social Work Engine
 * Social work screening + Discharge barriers + Abuse/neglect + Financial assistance + Community resources
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NASW_STANDARDS: 'NASW Standards 2024', CMS_DISCHARGE: 'CMS Discharge Planning 2024' };

function socialWorkScreening(input) {
  const { social_determinants_screen_complete, food_insecurity, housing_insecurity, transportation_barrier, financial_concern, caregiver_availability, social_isolation, mental_health_concern, intimate_partner_violence_suspected, substance_use_concern, advance_directive_present } = input;
  let high_concern = [];
  if (food_insecurity === 'yes') high_concern.push('food_insecurity_with_food_pantry_resources');
  if (housing_insecurity === 'yes') high_concern.push('housing_insecurity_with_social_housing_resources');
  if (transportation_barrier === 'yes') high_concern.push('transportation_barrier_with_ride_share_voucher_options');
  if (financial_concern === 'yes') high_concern.push('financial_concern_with_financial_counseling_payment_plans');
  if (social_isolation === 'yes') high_concern.push('social_isolation_with_community_connections_support_groups');
  if (intimate_partner_violence_suspected === 'yes') high_concern.push('IPV_with_safe_discharge_planning_and_dv_shelter_resources');
  if (substance_use_concern === 'yes') high_concern.push('substance_use_with_treatment_resources_and_overdose_prevention');
  return {
    high_concern,
    domains: ['food_housing_transportation_financial_caregiver_social_isolation_mental_health_IPV_substance_use_advance_directive'],
    framework: 'CMS_Discharge_Planning_Process_within_48h_assessment_of_post_acute_needs_with_social_work_collaboration',
    citation: CITATIONS.CMS_DISCHARGE,
  };
}

function dischargeBarriersAddressal(input) {
  const { barriers_identified, anticipated_discharge, estimated_discharge_date, caregiver_readiness, home_modifications_needed, equipment_arranged, transportation_arranged, follow_up_appointments_made } = input;
  let plan = 'multidisciplinary_discharge_planning_with_daily_review_of_barriers';
  if (barriers_identified === 'yes') plan = 'address_each_barrier_with_social_work_nursing_OT_case_management_collaboration';
  let checklist = ['caregiver_available_and_educated_about_needs', 'home_assessment_for_safety_modifications_or_equipment', 'transportation_to_home_or_post_acute_setting', 'medication_access_at_discharge', 'follow_up_appointments_within_7_to_14d', 'community_resources_engaged_per_needs', 'home_health_services_ordered_if_needed'];
  return {
    plan, checklist,
    criteria: 'safe_discharge_only_when_all_critical_barriers_addressed_with_social_work_documentation',
    escalation: 'discharge_delays_2_days_documented_with_action_plan_Q_day_interdisciplinary_continuing_review',
    citation: CITATIONS.CMS_DISCHARGE,
  };
}

function suspectedAbuseNeglect(input) {
  const { type_suspected, age_patient, mandatory_reporter_status, immediate_safety_concern, evidence_collected, perpetrator_relationship, prior_reports, children_in_household_present } = input;
  let action = 'mandatory_report_to_adult_protective_services_or_child_protective_services_within_24_to_48h_per_law';
  if (immediate_safety_concern === 'yes') action = 'immediate_protective_services_involvement_and_discharge_planning_with_alternative_safe_setting';
  if (age_patient < 18) action = 'child_protective_services_CPS_report_required_within_24h_per_law';
  if (age_patient >= 65 || vulnerable_adult) action = 'adult_protective_services_APS_report_required_within_24h_per_law';
  let documentation = 'objective_observable_findings_with_quotes_patient_state_quotes_no_judgment_medical_findings_consistent_with_history_photographs_per_protocol';
  return {
    action, documentation,
    legal: 'mandatory_reporter_law_for_healthcare_providers_for_suspected_abuse_or_neglect_to_protect_patient',
    team_response: 'social_work_consult_psychology_or_psychiatry_security_for_patient_protection_documented_decision_making',
    citation: CITATIONS.NASW_STANDARDS,
  };
}

function financialAssistanceAndCounseling(input) {
  const { insurance_coverage, copay_difficulty, deductible_high, charity_care_eligible, hosed_government_program_eligible, payment_plan_acceptable, prior_balance_outstanding } = input;
  let plan = 'standard_insurance_billing_with_follow_up_for_outstanding_balance';
  if (copay_difficulty === 'yes' || deductible_high === 'yes') plan = 'financial_counseling_with_payment_plans_assistance_with_government_programs_charity_care_applications';
  if (charity_care_eligible === 'yes') plan = 'charity_care_application_assistance_with_documentation_income_verification_assets_income_less_than_400pct_federal_poverty_level';
  if (hosed_government_program_eligible === 'yes') plan = 'medicaid_or_chip_or_subsidy_application_assistance_with_timely_enrollment_during_hospitalization';
  return {
    plan,
    documents: ['proof_of_income_paystubs_tax_returns', 'proof_of_household_size', 'proof_of_residency', 'proof_of_insurance_or_lack_thereof', 'proof_of_assets', 'medical_bills_evidence'],
    resources: ['local_health_department', 'community_health_centers_federally_qualified_health_centers', 'hospital_charity_care_program', 'religious_organizations_assistance_funds', 'pharmaceutical_patient_assistance_programs_for_medications'],
    citation: CITATIONS.NASW_STANDARDS,
  };
}

function communityResourceConnection(input) {
  const { need_category, language_access_required, location_zip, transportation_required, prior_services_engagement, family_caregiver_support, patient_self_efficacy } = input;
  let connections = [];
  if (need_category === 'mental_health') connections.push('community_mental_health_clinic_substance_abuse_treatment_support_groups');
  if (need_category === 'developmental_disability') connections.push('state_developmental_disability_services_case_management');
  if (need_category === 'aging_seniors') connections.push('area_agency_on_aging_in_home_supportive_services_meals_on_wheels_senior_centers');
  if (need_category === 'homeless_housing') connections.push('continuum_of_care_homeless_services_HUD_housing_voucher_emergency_shelters');
  if (need_category === 'chronic_disease_management') connections.push('chronic_disease_self_management_program_with_red_book_or_NDEP_Diabetes_Self_Management_Education_DSME');
  if (need_category === 'rehab_disability') connections.push('independent_living_centers_vocational_rehab_disability_determination_services');
  return {
    connections,
    warm_handoff: 'connect_patient_with_organization_by_phone_with_patient_consent_for_handoff_per_discharge_planning_standard',
    follow_up: 'social_work_follow_up_phone_call_within_7_days_post_discharge_to_assess_engagement_with_community_resources',
    citation: CITATIONS.NASW_STANDARDS,
  };
}

module.exports = { socialWorkScreening, dischargeBarriersAddressal, suspectedAbuseNeglect, financialAssistanceAndCounseling, communityResourceConnection, CITATIONS, ValidationError };