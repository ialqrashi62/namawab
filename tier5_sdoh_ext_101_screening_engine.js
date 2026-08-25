// filepath: tier5_sdoh_ext_101_screening_engine.js
// TIER5_SDOH_EXT-101: Social determinants screening (housing, food, transport, safety, employment)
'use strict';

const CITATIONS = [
  'WHO_SDOH_2010',
  'AHA_PRAPARE_2019',
  'CDC_PRAPARE_2020',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function housing_insecurity(req) {
  ensureStr(req.living_situation, 'living_situation');
  ensureEnum(req.living_situation, 'living_situation', ['owned_paid_off','owned_with_mortgage','rented','subsidized_housing','shared_living','homeless_shelter','street','doubled_up']);
  ensureNumber(req.utility_shutoff_in_past_yr, 'utility_shutoff_in_past_yr');
  ensureNumber(req.unable_to_pay_mortgage_rent_mos, 'unable_to_pay_mortgage_rent_mos');
  ensureBool(req.unsafety_documented, 'unsafety_documented');

  let risk;
  if (req.living_situation === 'street' || req.living_situation === 'homeless_shelter') risk = 'homeless_urgent_social_work_referral';
  else if (['doubled_up', 'shared_living'].includes(req.living_situation)) risk = 'doubtful_legal_status_refer_to_mhcp_or_social_work';
  else if (req.utility_shutoff_in_past_yr >= 2) risk = 'high_refer_to_utility_assistance_and_homelessness_prevention_resources';
  else if (req.utility_shutoff_in_past_yr === 1) risk = 'moderate_safety_due_to_circuit_overload_or_other_financial_stress';
  else if (req.unable_to_pay_mortgage_rent_mos >= 1) risk = 'moderate_refer_to_rent_assistance_program';
  else if (req.unsafety_documented) risk = 'unsafe_refer_to_domestic_violence_and_social_work';
  else risk = 'housing_stable';
  return { risk_band: risk, documented_unsafety: req.unsafety_documented, recommendation: 'coordinate_with_social_services_and_identify_resources' };
}

function food_insecurity(req) {
  ensureNumber(req.days_without_food_past_30d, 'days_without_food_past_30d');
  ensureBool(req.afford_food_yes_no, 'afford_food_yes_no');
  ensureBool(req.used_food_stamps_or_pantry_past_30d, 'used_food_stamps_or_pantry_past_30d');
  ensureNumber(req.fruits_vegetables_daily_per_day, 'fruits_vegetables_daily_per_day');

  let risk;
  if (req.days_without_food_past_30d >= 7 || !req.afford_food_yes_no) risk = 'high_food_insecurity_urgent_wic_snap_pantry_referral';
  else if (req.days_without_food_past_30d >= 2) risk = 'moderate_refer_to_wic_pantry_and_consider_medicarre_food_box';
  else if (!req.afford_food_yes_no) risk = 'mild_consider_snap_eligibility';
  else if (req.used_food_stamps_or_pantry_past_30d) risk = 'tracked_resources_already_assist_low_risk_of_severe_insecurity';
  else risk = 'food_secure_greens_servings_promote_5_per_day';

  if (req.fruits_vegetables_daily_per_day < 5) risk += '_consider_nutrition_education_too';

  return { risk_band: risk };
}

function transport(req) {
  ensureStr(req.mode, 'mode');
  ensureEnum(req.mode, 'mode', ['own_car','taxi_or_uber','public_transit','family_or_friend','walk_or_bicycle','non_emergency_medical_transport','no_reliable_transport']);
  ensureNumber(req.missed_appts_past_3m, 'missed_appts_past_3m');
  ensureNumber(req.distance_to_facility_km, 'distance_to_facility_km');
  ensureBool(req.physical_disability_limit, 'physical_disability_limit');

  let risk;
  if (req.mode === 'no_reliable_transport' || req.missed_appts_past_3m >= 2) risk = 'high_refer_to_non_emergency_medical_transport';
  else if (req.distance_to_facility_km >= 50 && req.mode === 'public_transit') risk = 'moderate_provide_telehealth_options';
  else if (req.physical_disability_limit && ['walk_or_bicycle','public_transit'].includes(req.mode)) risk = 'moderate_refer_to_paratransport';
  else risk = 'low_review_only';
  return { risk_band: risk };
}

function safety_concerns(req) {
  ensureBool(req.verbal_or_psychological_abuse_past_yr, 'verbal_or_psychological_abuse_past_yr');
  ensureBool(req.physical_or_sexual_abuse_past_yr, 'physical_or_sexual_abuse_past_yr');
  ensureBool(req.weapon_kept_in_house, 'weapon_kept_in_house');
  ensureBool(req.felt_unsafe_in_your_home, 'felt_unsafe_in_your_home');
  ensureStr(req.prior_ipv_or_sexual_violence_history, 'prior_ipv_or_sexual_violence_history');
  ensureEnum(req.prior_ipv_or_sexual_violence_history, 'prior_ipv_or_sexual_violence_history', ['no','unknown','yes_prior','active_now']);

  let action;
  if (req.physical_or_sexual_abuse_past_yr || req.prior_ipv_or_sexual_violence_history === 'active_now') action = 'urgent_refer_to_domestic_violence_advocate_and_safety_counseling';
  else if (req.felt_unsafe_in_your_home) action = 'concerning_referral_to_dv_or_safety_planning_and_screening';
  else if (req.verbal_or_psychological_abuse_past_yr) action = 'moderately_concerning_pursue_private_screen_or_safety_plan';
  else if (req.weapon_kept_in_house && action === undefined) action = 'safe_storage_screening_for_firearm_education_with_storage_kit';

  action = action || 'no_safety_concerns_followup_annually_with_routine_screening';
  return { action };
}

function employment_econ(req) {
  ensureStr(req.employment, 'employment');
  ensureEnum(req.employment, 'employment', ['full_time','part_time','self_employed','student','homemaker','unemployed_seeking','unemployed_not_seeking','retired','disabled_not_working']);
  ensureNumber(req.unable_to_pay_basics_in_past_3m, 'unable_to_pay_basics_in_past_3m');
  ensureBool(req.days_worked_in_past_yr, 'days_worked_in_past_yr');

  let risk;
  if (['unemployed_seeking', 'unemployed_not_seeking'].includes(req.employment) && req.unable_to_pay_basics_in_past_3m >= 2) risk = 'high_refer_to_workforce_services_snap_and_health_risk_assessment';
  else if (req.employment === 'disabled_not_working') risk = 'disabilities_refer_to_employment_vocational_rehabilitation';
  else if (req.unable_to_pay_basics_in_past_3m >= 1) risk = 'moderate_refer_to_temp_agencies_supplementary_security_income';
  else if (['homemaker'].includes(req.employment)) risk = 'consider_caregiver_burden_screening_with_zabora';
  else if (req.days_worked_in_past_yr <= 90) risk = 'low_review_employment_satisfaction_in_annually';
  else risk = 'stable_no_action';
  return { risk_band: risk, employment: req.employment };
}

function funcs() {
  return { housing_insecurity, food_insecurity, transport, safety_concerns, employment_econ };
}

module.exports = { funcs, CITATIONS, ValidationError };
