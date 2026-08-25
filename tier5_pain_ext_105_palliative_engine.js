// filepath: tier5_pain_ext_105_palliative_engine.js
// TIER5_PAIN_EXT-105: Palliative essentials (prognosis, goals of care, dyspnea, delirium, hospice)
'use strict';

const CITATIONS = [
  'IOM_Dying_in_America_2015',
  'NCCN_Palliative_2023',
  'Lancet_Palliative_2018',
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

function prognosis(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureNumber(req.congestive_heart_failure_ef_pct, 'congestive_heart_failure_ef_pct');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.hospitalizations_last_year, 'hospitalizations_last_year');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  ensureNumber(req.ambulatory, 'ambulatory'); // 0 bedbound, 1 chair, 2 limited, 3 community

  let score = 0;
  if (req.weight_loss) score += 1;
  if (req.congestive_heart_failure_ef_pct > 30) score += 1;
  else if (req.congestive_heart_failure_ef_pct <= 30) score += 2;
  if (req.systolic_bp <= 110) score += 1;
  if (req.hospitalizations_last_year >= 1) score += 1;
  if (req.albumin_g_dl < 3.5) score += 1;
  if (req.ambulatory === 0) score += 2;
  else if (req.ambulatory === 1) score += 1;

  let expected_survival;
  if (score >= 7) expected_survival = 'weeks_to_3_months';
  else if (score >= 5) expected_survival = '3_to_6_months';
  else if (score >= 3) expected_survival = '6_to_12_months';
  else if (score >= 1) expected_survival = '12_to_24_months';
  else expected_survival = 'longer_than_2_years';

  return { score, expected_survival_band: expected_survival, citation: CITATIONS[2] };
}

function goals_discussion(req) {
  ensureStr(req.clinical_status, 'clinical_status');
  ensureEnum(req.clinical_status, 'clinical_status', ['stable','slowly_decline','rapidly_decline','end_of_life_imminent','terminally_discharged']);
  ensureBool(req.patient_able_to_discuss, 'patient_able_to_discuss');
  ensureBool(req.family_wants_full_care, 'family_wants_full_care');
  ensureBool(req.outlined_goals_in_prior_discharge, 'outlined_goals_in_prior_discharge');

  let conflict;
  if (req.patient_able_to_discuss && !req.outlined_goals_in_prior_discharge) conflict = 'high_default_seek_rapid_goals_discussion_or_active_hospice';
  else if (req.family_wants_full_care && req.clinical_status === 'terminally_discharged') conflict = 'consider_family_meeting_with_palliative_care';
  else if (req.clinical_status === 'rapidly_decline') conflict = 'urgent_goals_discussion_and_documented_advanced_directives';
  else conflict = 'revisit_goals_twice_weekly';

  return { clinical_status: req.clinical_status, conflict_band: conflict };
}

function dyspnea(req) {
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.oxygen_saturation, 'oxygen_saturation');
  ensureBool(req.acute_distress, 'acute_distress');
  ensureBool(req.terminal_cheyne_stokes_breathing, 'terminal_cheyne_stokes_breathing');
  ensureBool(req.opioid_tolerance_present, 'opioid_tolerance_present');

  let action;
  if (req.terminal_cheyne_stokes_breathing) action = 'family_education_then_opioid_low_dose_2mg_morphine_eq_q15min_then_low_dose_sc_syringe_until_settled';
  else if (req.acute_distress && req.oxygen_saturation < 90) action = 'oxygen_4_lpm_with_face_mask_then_opioid_q10min_then_reassess';
  else if (req.opioid_tolerance_present) action = 'consider_repeat_doses_morphine_to_doses_2pt5_to_5mg_then_smooth';
  else if (req.respiratory_rate >= 30) action = 'palliative_low_dose_morphine_then_reassess_30_min';
  else action = 'fan_then_distraction_then_cognitive_intervention';

  return { respiratory_rate: req.respiratory_rate, sat: req.oxygen_saturation, action };
}

function delirium(req) {
  ensureBool(req.hyperactive, 'hyperactive');
  ensureBool(req.hypoactive, 'hypoactive');
  ensureBool(req.terminal_or_imminent, 'terminal_or_imminent');
  ensureBool(req.likely_reversible_cause_found, 'likely_reversible_cause_found');
  ensureNumber(req.dies_score, 'dies_score'); // 4 to 19
  if (req.dies_score < 4 || req.dies_score > 19) throw new ValidationError('dies_score 4..19', 'dies_score');

  let management;
  if (req.likely_reversible_cause_found) management = 'address_reversible_causes_then_daily_review_with_palliative_team';
  else if (req.dies_score >= 8 && req.terminal_or_imminent) management = 'low_dose_haldol_or_levomepromazine_then_quiet_environment_with_family';
  else if (req.hyperactive) management = 'low_dose_haldol_or_levomepromazine_with_caregiver_reassurance_then_review';
  else if (req.hypoactive) management = 'monitor_then_consider_short_haldol_for_agitation_episodes_only';
  else management = 'provide_psychosocial_support_then_review_daily';

  return { dies_score: req.dies_score, management, citation: CITATIONS[1] };
}

function hospice_status(req) {
  ensureNumber(req.pps_score, 'pps_score');
  ensureNumber(req.karnofsky_score, 'karnofsky_score');
  ensureBool(req.decline_despite_max_treatment, 'decline_despite_max_treatment');
  ensureBool(req.home_caregiver_present, 'home_caregiver_present');
  ensureBool(req.medicare_or_international_hospice_eligibility, 'medicare_or_international_hospice_eligibility');

  let eligibility;
  if (req.pps_score <= 60 || req.karnofsky_score <= 70) eligibility = 'open_hospice_consultation';
  else if (req.pps_score <= 30 && req.karnofsky_score <= 40) eligibility = 'open_hospice_evaluation';
  else if (req.pps_score <= 20 || req.karnofsky_score <= 30) eligibility = 'ready_for_active_dying_protocol_and_family_counselling';
  else eligibility = 'palliative_care_active_or_hospice_to_be_evaluated_separately';

  if (req.decline_despite_max_treatment) eligibility += '_patient_has_chosen_hospice_path';
  if (req.home_caregiver_present && req.medicare_or_international_hospice_eligibility) eligibility += '_and_can_be_supported_at_home';

  return { pps: req.pps_score, karnofsky: req.karnofsky_score, eligibility };
}

function funcs() {
  return { prognosis, goals_discussion, dyspnea, delirium, hospice_status };
}

module.exports = { funcs, CITATIONS, ValidationError };
