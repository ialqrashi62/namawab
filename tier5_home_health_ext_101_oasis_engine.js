// filepath: tier5_home_health_ext_101_oasis_engine.js
// TIER5_HOME_HEALTH_EXT-101: Home health OASIS-like assessment + start of care planning
'use strict';

const CITATIONS = [
  'CMS_OASIS_E_2019',
  'Medicare_Home_Health_Conditions_2020',
  'Wound_Ostomy_Nursing_2019',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function oasis_assess(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.lives_alone, 'lives_alone');
  ensureBool(req.functional_score_poor, 'functional_score_poor');
  ensureBool(req.moderate_severe_pain, 'moderate_severe_pain');
  ensureBool(req.dyspnea_with_adl, 'dyspnea_with_adl');
  ensureBool(req.skin_breakdown_pressure_injury, 'skin_breakdown_pressure_injury');
  ensureBool(req.behavioral_problems, 'behavioral_problems');
  ensureBool(req.falls_within_30_days, 'falls_within_30_days');
  ensureNumber(req.caregiver_status, 'caregiver_status'); // 0 none, 1 struggling, 2 adequate

  let triage;
  if (req.falls_within_30_days && req.behavioral_problems && req.lives_alone) triage = 'immediate_risk_consider_residential_or_short_term_inpatient';
  else if (req.skin_breakdown_pressure_injury || req.moderate_severe_pain || req.dyspnea_with_adl) triage = 'high_complexity_require_multidisciplinary_team';
  else if (req.functional_score_poor) triage = 'moderate_complexity_focused_skilled_nursing_with_aide';
  else if (req.lives_alone && req.caregiver_status < 2) triage = 'consider_caregiver_support_telephony_safety_measures';
  else triage = 'low_complexity_referred_to_hha';

  return {
    age: req.age,
    lives_alone: req.lives_alone,
    risk_stratification: triage,
  };
}

function plan_of_care(req) {
  ensureStr(req.primary_diagnosis, 'primary_diagnosis');
  ensureNumber(req.skilled_nursing_frequency_per_week, 'skilled_nursing_frequency_per_week');
  ensureNumber(req.therapy_frequency_per_week, 'therapy_frequency_per_week');
  ensureNumber(req.hha_aide_frequency_per_week, 'hha_aide_frequency_per_week');
  ensureNumber(req.total_goal_weeks, 'total_goal_weeks');

  let order_items;
  if (req.primary_diagnosis.includes('diabetic_foot') || req.primary_diagnosis.includes('wound')) order_items = 'wound_care_wound_meas_q_visit_then_orthogonal_then_neg_pressure_wound_therapy';
  else if (req.primary_diagnosis.includes('post_joint')) order_items = 'sn_with_pt_ot_with_gait_training_home_safety';
  else if (req.primary_diagnosis.includes('heart_failure')) order_items = 'sn_for_lasix_dripping_then_recheck_bnp_with_cardio_for_30_day_readmission_prevention';
  else if (req.primary_diagnosis.includes('copd')) order_items = 'sn_for_pulse_ox_with_pulmonary_rehab_education';
  else order_items = 'sn_for_observation_or_dressing_with_aide_for_bathing_grooming';

  return {
    primary_diagnosis: req.primary_diagnosis,
    plan: order_items,
    goal_weeks: req.total_goal_weeks,
    sn_per_week: req.skilled_nursing_frequency_per_week,
    therapy_per_week: req.therapy_frequency_per_week,
    hha_aide_per_week: req.hha_aide_frequency_per_week,
  };
}

function medication_reconciliation(req) {
  ensureNumber(req.pre_med_count, 'pre_med_count');
  ensureNumber(req.discrepancies_found, 'discrepancies_found');
  ensureBool(req.harmful_meds_present, 'harmful_meds_present');
  ensureBool(req.taking_medication_as_ordered, 'taking_medication_as_ordered');
  ensureNumber(req.cognitive_skills, 'cognitive_skills');

  let signal;
  if (req.harmful_meds_present) signal = 'call_prescriber_immediately_review_duplications_and_inappropriate_for_age';
  else if (req.discrepancies_found >= 2) signal = 'call_prescribers_to_reconcile_within_24h';
  else if (req.taking_medication_as_ordered === false) signal = 'home_visit_to_assess_capabilities_then_education_with_pills_per_day_box';
  else if (req.cognitive_skills <= 2 && req.pre_med_count >= 5) signal = 'consider_pharmacy_review_for_simplification_with_pillbox_organization';
  else signal = 'documentation_review_then_recheck_after_discharge_with_aide_for_setup';

  return { signal };
}

function fall_risk_home(req) {
  ensureBool(req.history_falls_past_year, 'history_falls_past_year');
  ensureBool(req.am_grade_for_balance_score_lt_5, 'am_grade_for_balance_score_lt_5');
  ensureBool(req.uneven_flooring, 'uneven_flooring');
  ensureBool(req.bathroom_no_rails, 'bathroom_no_rails');
  ensureBool(req.dizziness_chronic, 'dizziness_chronic');
  ensureBool(req.polypharmacy, 'polypharmacy');
  ensureBool(req.visual_or_cognitive_impaired, 'visual_or_cognitive_impaired');
  ensureBool(req.footwear_inappropriate, 'footwear_inappropriate');

  const positives = [req.history_falls_past_year, req.am_grade_for_balance_score_lt_5, req.uneven_flooring, req.bathroom_no_rails, req.dizziness_chronic, req.polypharmacy, req.visual_or_cognitive_impaired, req.footwear_inappropriate].filter(Boolean).length;
  let action;
  if (positives >= 5) action = 'multidisciplinary_falls_review_with_OT_home_modifications_tram_pad';
  else if (positives >= 3) action = 'OT_referral_with_focused_home_modifications_education';
  else if (positives >= 1) action = 'single_factor_remediation_then_revisit';
  else action = 'continue_maintenance_with_education';

  return { positives, action };
}

function caregiver_assessment_hh(req) {
  ensureNumber(req.hours_available_per_day, 'hours_available_per_day');
  ensureBool(req.backup_caregiver_present, 'backup_caregiver_present');
  ensureStr(req.relationship, 'relationship');
  ensureEnum(req.relationship, 'relationship', ['spouse','adult_child','parent','sibling','professional','paid_aide','grandparent','friend','neighbor','self_managed_residential_or_alone']);
  ensureBool(req.safety_concern_caregiver_capacity, 'safety_concern_caregiver_capacity');
  ensureNumber(req.daily_care_burden_hours, 'daily_care_burden_hours');

  let capacity;
  if (req.relationship === 'self_managed_residential_or_alone' || !req.backup_caregiver_present || req.hours_available_per_day < 16) capacity = 'limited';
  else if (req.hours_available_per_day >= 20 && req.backup_caregiver_present && !req.safety_concern_caregiver_capacity) capacity = 'adequate';
  else capacity = 'moderate_with_hra_review';

  if (req.daily_care_burden_hours >= 20) capacity = 'inadequate_' + capacity;

  return { capacity };
}

function funcs() { return { oasis_assess, plan_of_care, medication_reconciliation, fall_risk_home, caregiver_assessment_hh }; }
module.exports = { funcs, CITATIONS, ValidationError };
