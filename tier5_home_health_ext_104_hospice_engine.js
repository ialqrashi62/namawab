// filepath: tier5_home_health_ext_104_hospice_engine.js
// TIER5_HOME_HEALTH_EXT-104: Hospice in home (eligibility, comfort kit, respite, vigil)
'use strict';

const CITATIONS = [
  'Medicare_Hospice_Eligibility_2020',
  'NHPCO_Standards_2018',
  'Polst_2019_Form_Best_Practice',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hospice_eligibility_home(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.disease_trajectory, 'disease_trajectory');
  ensureEnum(req.disease_trajectory, 'disease_trajectory', ['cancer','dementia_advanced','cardiac_rhythm','cancer_solid','pulm_advanced','liver_failure','renal_failure','stroke_debility','frailty']);
  ensureNumber(req.karnofsky_pps_score, 'karnofsky_pps_score');
  ensureBool(req.recurrent_hospitalizations, 'recurrent_hospitalizations');
  ensureNumber(req.weight_loss_pct_6mo, 'weight_loss_pct_6mo');

  if (req.karnofsky_pps_score >= 70 || req.karnofsky_pps_score <= 0) throw new ValidationError('kps 1..70', 'karnofsky_pps_score');

  let eligible;
  if (req.karnofsky_pps_score <= 70 && (req.weight_loss_pct_6mo >= 10 || req.recurrent_hospitalizations)) eligible = 'hospice_eligible_evaluate_for_election';
  else if (req.karnofsky_pps_score <= 60) eligible = 'open_hospice_evaluation_with_consult_then_election';
  else if (req.karnofsky_pps_score <= 50) eligible = 'highly_eligible_for_hospice_per_pcp_judgment';
  else if (req.karnofsky_pps_score <= 30) eligible = 'consider_actively_dying_peritoneal_membrane_then_set_go_for_hospice';
  else eligible = 'palliative_care_not_hospice';

  return { eligible, kps: req.karnofsky_pps_score, weight_loss_pct_6mo: req.weight_loss_pct_6mo };
}

function comfort_kit(req) {
  ensureBool(req.comfort_kit_delivered, 'comfort_kit_delivered');
  ensureNumber(req.caregiver_knowledge_score, 'caregiver_knowledge_score');
  ensureBool(req.written_instructions_present, 'written_instructions_present');
  ensureBool(req.family_witness_to_route_administration, 'family_witness_to_route_administration');
  ensureStr(req.comfort_kit_drugs, 'comfort_kit_drugs');
  ensureEnum(req.comfort_kit_drugs, 'comfort_kit_drugs', ['haldol_levomepromazine_etc_lorazepam_atropine_morphine_hydromorphone']);

  let verdict;
  if (!req.comfort_kit_delivered || !req.family_witness_to_route_administration) verdict = 'educate_family_immediately_then_give_back_doses_demo';
  else if (!req.written_instructions_present || req.caregiver_knowledge_score <= 5) verdict = 'reinforce_documents_and_education_with_nurse_follow_up_call_today';
  else verdict = 'optimal_comfort_kit_placement_continue_with_family_education';

  return { verdict, family_witness_to_route_administration: req.family_witness_to_route_administration };
}

function respite_care_hh(req) {
  ensureNumber(req.hours_of_respite_per_week, 'hours_of_respite_per_week');
  ensureNumber(req.caregiver_appraisal_score, 'caregiver_appraisal_score');
  ensureBool(req.scheduled_or_emergency, 'scheduled_or_emergency');
  ensureBool(req.training_required_for_substitute, 'training_required_for_substitute');
  ensureNumber(req.substitute_provider_rate_competency, 'substitute_provider_rate_competency');

  let plan;
  if (req.hours_of_respite_per_week >= 30) plan = 'continue_respite_progressive_with_aide';
  else if (req.caregiver_appraisal_score >= 5) plan = 'encourage_respite_with_residential_facility_5day_stay_then_review';
  else if (req.training_required_for_substitute && req.substitute_provider_rate_competency < 4) plan = 'plan_residential_respite_then_re_evaluate_with_specialists';
  else if (req.scheduled_or_emergency) plan = 'apply_for_inpatient_respite_level_of_care_5day_per_month_per_cms_guidelines';
  else plan = 'continue_outpatient_home_hospice';

  return { plan };
}

function vigil_care(req) {
  ensureNumber(req.pre_active_dying_score, 'pre_active_dying_score');
  ensureNumber(req.family_continuous_presence_required, 'family_continuous_presence_required');
  ensureBool(req.bereavement_risk_high, 'bereavement_risk_high');
  ensureNumber(req.family_adjusted_to_dying_today, 'family_adjusted_to_dying_today');

  let verdict;
  if (req.pre_active_dying_score >= 8) verdict = 'begin_continuous_vigil_care_with_staff_support';
  else if (req.bereavement_risk_high && req.family_adjusted_to_dying_today <= 3) verdict = 'preparatory_grief_and_active_vigil_work_with_chaplain_psychology';
  else if (req.family_continuous_presence_required === 0) verdict = 'plan_short_intermittent_visits_with_nurse_continuity';
  else verdict = 'continue_with_normal_visits_then_continue_routine';

  return { verdict };
}

function bereavement_home(req) {
  ensureNumber(req.days_since_death, 'days_since_death');
  ensureNumber(req.daily_functioning, 'daily_functioning');
  ensureNumber(req.grief_score_inventory, 'grief_score_inventory');
  ensureBool(req.widow_or_widower, 'widow_or_widower');
  ensureNumber(req.support_available_other_close_family, 'support_available_other_close_family');

  let plan;
  if (req.days_since_death < 30) plan = 'first_correspondence_call_with_resources_q_visit_at_30_days';
  else if (req.days_since_death < 180 && req.daily_functioning <= 3 && req.grief_score_inventory >= 35) plan = 'psychological_referral_with_repeated_specialty_call';
  else if (req.days_since_death < 365 && req.widow_or_widower) plan = 'monthly_correspondence_with_visit_then_specific_resources_for_bereaved_family';
  else if (req.support_available_other_close_family <= 2) plan = 'enroll_in_widow_groups_or_long_term_community_support';
  else plan = 'provide_resources_then_check_in_next_quarter';

  return { plan };
}

function funcs() { return { hospice_eligibility_home, comfort_kit, respite_care_hh, vigil_care, bereavement_home }; }
module.exports = { funcs, CITATIONS, ValidationError };
