// filepath: tier7_pop_health_ext_102_screening_engine.js
// TIER7_POP_HEALTH_EXT-102: Population screening programs (cancer + chronic disease)
'use strict';

const CITATIONS = ['USPSTF_2024','ACS_SCREENING_2023','CDC_CANCER_SCREEN_2023'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function screening_mammogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureEnum(req.family_history, 'family_history', ['none','one_relative','two_relatives','brca_positive']);
  ensureNumber(req.last_mammo_years_ago, 'last_mammo_years_ago');
  ensureBool(req.previous_abnormal, 'previous_abnormal');
  ensureEnum(req.breast_density, 'breast_density', ['a','b','c','d']);

  let recommendation;
  if (req.age_years < 40 && req.family_history === 'none') recommendation = 'below_screening_age_no_action';
  else if (req.family_history === 'brca_positive') recommendation = 'annual_mammo_plus_mri_starting_at_30';
  else if (req.previous_abnormal && req.breast_density === 'd') recommendation = 'annual_mammo_with_concurrent_mri';
  else if (req.age_years >= 50) recommendation = 'annual_or_biennial_mammo_standard';
  else if (req.age_years >= 40) recommendation = 'annual_or_biennial_mammo_individualized';
  else recommendation = 'risk_based_consider_earlier_screening';

  return { recommendation, age: req.age_years, density: req.breast_density };
}

function screening_colorectal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureEnum(req.family_history_crc, 'family_history_crc', ['none','one_first_degree','two_first_degree','lynch_syndrome','fap']);
  ensureNumber(req.last_colonoscopy_years_ago, 'last_colonoscopy_years_ago');
  ensureEnum(req.last_method, 'last_method', ['none','colonoscopy','fit','cologuard','sigmoidoscopy','ct_colonography']);
  ensureBool(req.symptoms_present, 'symptoms_present');

  let recommendation;
  if (req.symptoms_present) recommendation = 'diagnostic_evaluation_refer_to_gastroenterology';
  else if (req.family_history_crc === 'lynch_syndrome' || req.family_history_crc === 'fap') recommendation = 'colonoscopy_every_1_2_years_starting_age_20_25';
  else if (req.family_history_crc === 'two_first_degree') recommendation = 'colonoscopy_age_40_or_10_years_before_youngest_case';
  else if (req.age_years < 45) recommendation = 'below_screening_age_no_action_unless_family_history';
  else if (req.age_years >= 45 && req.last_colonoscopy_years_ago >= 10) recommendation = 'colonoscopy_due_now';
  else if (req.age_years >= 45 && req.last_method === 'fit' && req.last_colonoscopy_years_ago >= 1) recommendation = 'annual_fit_recheck';
  else recommendation = 'continuing_current_screening_schedule';

  return { recommendation, age: req.age_years };
}

function screening_cervical(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureEnum(req.last_pap_result, 'last_pap_result', ['normal','ascus','lsil','hsil','asc_h','agc','unsatisfactory']);
  ensureNumber(req.years_since_last_pap, 'years_since_last_pap');
  ensureEnum(req.hpv_status, 'hpv_status', ['negative','positive_16_18','positive_other','unknown','not_tested']);
  ensureBool(req.hysterectomy_with_cervix_removal, 'hysterectomy_with_cervix_removal');

  let recommendation;
  if (req.hysterectomy_with_cervix_removal) recommendation = 'no_cervix_no_screening_needed';
  else if (req.age_years < 21) recommendation = 'below_screening_age';
  else if (req.age_years >= 65 && req.last_pap_result === 'normal' && req.hpv_status === 'negative') recommendation = 'discontinue_screening_appropriate';
  else if (req.hpv_status === 'positive_16_18') recommendation = 'colposcopy_referral';
  else if (req.last_pap_result === 'hsil' || req.last_pap_result === 'asc_h') recommendation = 'colposcopy_referral';
  else if (req.years_since_last_pap >= 3) recommendation = 'pap_plus_hpv_due';
  else recommendation = 'continue_routine_3_year_interval';

  return { recommendation, age: req.age_years, hpv: req.hpv_status };
}

function screening_lung(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.pack_years_smoking, 'pack_years_smoking');
  ensureNumber(req.years_since_quit, 'years_since_quit');
  ensureEnum(req.smoking_status, 'smoking_status', ['current','former_15y','former_15y_plus','never']);
  ensureBool(req.prior_lung_cancer, 'prior_lung_cancer');

  let recommendation;
  if (req.smoking_status === 'never') recommendation = 'no_lung_cancer_screening_needed';
  else if (req.prior_lung_cancer) recommendation = 'surveillance_protocol_already_in_place';
  else if (req.age_years >= 50 && req.age_years <= 80 && req.pack_years_smoking >= 20 && (req.smoking_status === 'current' || req.years_since_quit < 15)) recommendation = 'annual_ldct_eligible';
  else if (req.age_years >= 50 && req.pack_years_smoking >= 20 && req.years_since_quit >= 15) recommendation = 'continue_routine_care';
  else recommendation = 'below_threshold_discuss_smoking_cessation';

  return { recommendation, pack_years: req.pack_years_smoking };
}

function screening_overdue(req) {
  ensureStr(req.population_id, 'population_id');
  ensureEnum(req.screening_type, 'screening_type', ['mammogram','colonoscopy','pap_hpv','lung_ldct','aaa','bone_density','lipid','diabetic_eye','diabetic_foot']);
  ensureNumber(req.eligible_count, 'eligible_count');
  ensureNumber(req.overdue_count, 'overdue_count');
  ensureNumber(req.days_overdue_threshold, 'days_overdue_threshold');

  const overdue_pct = req.eligible_count > 0 ? req.overdue_count / req.eligible_count : 0;
  let action;
  if (overdue_pct >= 0.4) action = 'high_overdue_mass_outreach_campaign';
  else if (overdue_pct >= 0.25) action = 'moderate_outreach_with_patient_navigation';
  else if (overdue_pct >= 0.1) action = 'mild_outreach_reminder_calls';
  else action = 'within_acceptable_range_continue_routine';

  return { overdue_pct: Math.round(overdue_pct * 1000) / 10, action };
}

function funcs() { return { screening_mammogram, screening_colorectal, screening_cervical, screening_lung, screening_overdue }; }
module.exports = { funcs, CITATIONS, ValidationError };