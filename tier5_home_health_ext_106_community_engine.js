// filepath: tier5_home_health_ext_106_community_engine.js
// TIER5_HOME_HEALTH_EXT-106: Community health nursing (vulnerable populations, school, MCH)
'use strict';

const CITATIONS = [
  'APHA_Standards_2017',
  'CDC_Community_Health_2020',
  'Family_Nursing_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function vulnerable_home(req) {
  ensureStr(req.disadvantaged_group, 'disadvantaged_group');
  ensureEnum(req.disadvantaged_group, 'disadvantaged_group', ['homeless_or_semi_housed','refugee_asylum','trafficking_survivor','women_in_homeless_relation','low_income_immigrant','low_income_native_patient','orphan_or_aging_orphan','prison_re_entry']);
  ensureBool(req.legal_or_advocacy_concern, 'legal_or_advocacy_concern');
  ensureBool(req.opioid_use_disorder, 'opioid_use_disorder');
  ensureNumber(req.safe_house_or_shelter_arranged, 'safe_house_or_shelter_arranged');
  ensureNumber(req.follow_up_3m_adherence_pct, 'follow_up_3m_adherence_pct');

  let action;
  if (req.safe_house_or_shelter_arranged === 0) action = 'urgent_social_work_advocacy_and_safe_house_then_assess_stability';
  else if (req.opioid_use_disorder) action = 'mat_referral_with_nurse_visits_then_community_resources';
  else if (req.legal_or_advocacy_concern) action = 'legal_aid_referral_then_social_work';
  else if (req.follow_up_3m_adherence_pct < 60) action = 'consider_chw_involvement_then_assess_for_community_or_volunteer_supports';
  else action = 'continue_with_home_or_community_visit';

  return { action };
}

function school_visit_nurse(req) {
  ensureStr(req.school_level, 'school_level');
  ensureEnum(req.school_level, 'school_level', ['elementary','middle','high','k12_combined']);
  ensureNumber(req.students_present, 'students_present');
  ensureBool(req.medication_pass_at_school, 'medication_pass_at_school');
  ensureBool(req.chronic_disease_registry, 'chronic_disease_registry');
  ensureBool(req.school_aware_of_anaphylaxis_or_dm, 'school_aware_of_anaphylaxis_or_dm');

  let plan;
  if (req.medication_pass_at_school && req.school_aware_of_anaphylaxis_or_dm) plan = 'school_nurse_with_daily_medication_log_review_anaphylaxis_or_dm_safety_plan';
  else if (req.chronic_disease_registry) plan = 'maintain_chronic_disease_registry_with_iep_or_504_input_from_school_then_quarterly_review';
  else if (req.school_level === 'k12_combined' && req.students_present >= 1000) plan = 'designate_full_time_school_nurse_then_continue_training';
  else if (req.students_present > 200) plan = 'consider_school_nurse_assignment_then_health_promotion_visits';

  return { plan };
}

function mch_visit(req) {
  ensureBool(req.pregnancy, 'pregnancy');
  ensureNumber(req.weeks_gestation, 'weeks_gestation');
  ensureBool(req.high_risk_pregnancy, 'high_risk_pregnancy');
  ensureBool(req.minor_with_pregnancy, 'minor_with_pregnancy');
  ensureBool(req.substance_use_pregnancy, 'substance_use_pregnancy');

  let plan;
  if (req.substance_use_pregnancy) plan = 'mat_referral_with_ccc_pn_then_child_protection_pre_visit_then_harm_reduction';
  else if (req.minor_with_pregnancy) plan = 'social_work_with_adolescent_obstetric_specialty_then_continue_visits';
  else if (req.high_risk_pregnancy && req.weeks_gestation >= 32) plan = 'twice_weekly_visits_with_consult_ob_then_home_daily_lab_observation';
  else if (req.weeks_gestation <= 12) plan = 'intake_douhle_form_then_continue_visits_with_ccc_pn_then_ob_co_visits';
  else plan = 'standard_visit_protocol';

  return { plan };
}

function injury_prevention(req) {
  ensureStr(req.population, 'population');
  ensureEnum(req.population, 'population', ['child','adolescent','adult','elderly','family_of_aging_parent','pregnant_women_family']);
  ensureNumber(req.smoke_detector_present, 'smoke_detector_present');
  ensureBool(req.pool_or_water_hazard_present, 'pool_or_water_hazard_present');
  ensureBool(req.guns_locked_in_household, 'guns_locked_in_household');

  let plan;
  if (req.smoke_detector_present === 0) plan = 'smoke_detector_care_today';
  else if (req.population === 'child' && req.pool_or_water_hazard_present) plan = 'pool_fence_or_safety_education_consult';
  else if (req.population === 'adolescent' && !req.guns_locked_in_household) plan = 'firearm_locks_and_safe_storage_kit';
  else if (req.population === 'elderly') plan = 'remove_throw_rugs_then_install_bathroom_grab_bars_then_recheck';
  else plan = 'continue_with_no_additional_intervention_required';

  return { plan };
}

function communicable_disease(req) {
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['tb','hiv','measles','pertussis','hepatitis_a','hepatitis_b','hepatitis_c','covid','influenza']);
  ensureNumber(req.contact_traced_in_past_24h, 'contact_traced_in_past_24h');
  ensureNumber(req.days_isolation, 'days_isolation');
  ensureNumber(req.number_of_household_close_contacts, 'number_of_household_close_contacts');
  ensureBool(req.prophylaxis_required_for_contacts, 'prophylaxis_required_for_contacts');

  let action;
  if (req.days_isolation < 3) action = 'early_identification_then_isolation_then_start_contact_tracing';
  else if (req.contact_traced_in_past_24h < Math.max(1, req.number_of_household_close_contacts * 0.6)) action = 'urgent_contact_tracing_and_education';
  else if (req.prophylaxis_required_for_contacts) action = 'provide_prophylaxis_then_followup_then_education';
  else if (req.days_isolation >= 5) action = 'reassess_resolution_or_safe_release';

  return { action };
}

function funcs() { return { vulnerable_home, school_visit_nurse, mch_visit, injury_prevention, communicable_disease }; }
module.exports = { funcs, CITATIONS, ValidationError };
