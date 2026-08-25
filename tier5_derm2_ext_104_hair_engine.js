// filepath: tier5_derm2_ext_104_hair_engine.js
// TIER5_DERM2_EXT-104: Hair loss (androgenic, areata, telogen, minox, transplant)
'use strict';

const CITATIONS = [
  'AAD_Androgenic_Alopecia_2018',
  'Alopecia_Aretata_Registry_Findings',
  'AAD_Telogen_2019',
  'Bansal_Hair_Transplant_Standards_2022',
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

function androgenic_alopecia(req) {
  ensureStr(req.biological_sex, 'biological_sex');
  ensureEnum(req.biological_sex, 'biological_sex', ['male','female']);
  ensureNumber(req.norwood, 'norwood'); // 1..7
  ensureBool(req.family_history, 'family_history');
  ensureNumber(req.ferritin, 'ferritin');
  ensureNumber(req.tsh, 'tsh');

  let severity;
  if (req.biological_sex === 'male' && req.norwood <= 2) severity = 'mild_to_moderate';
  else if (req.biological_sex === 'male' && req.norwood <= 4) severity = 'moderate';
  else if (req.biological_sex === 'male') severity = 'severe';
  else if (req.biological_sex === 'female' && req.norwood <= 2) severity = 'mild_diffuse_thinning';
  else severity = 'moderate_consider_antiandrogen';

  let therapy;
  if (req.biological_sex === 'male') therapy = 'minoxidil_5pct_twice_daily_plus_finasteride_1mg_daily_assess_12m';
  else therapy = 'minoxidil_2pct_twice_daily_plus_spironolactone_100mg_to_200mg_or_bicalutamide_morning_with_contraception';

  if (req.ferritin < 50 || req.tsh > 4) therapy += '_resolve_iron_or_thyroid_first';

  return {
    biological_sex: req.biological_sex,
    norwood: req.norwood,
    severity,
    therapy,
    citations: CITATIONS,
  };
}

function alopecia_areata(req) {
  ensureNumber(req.alopecia_severity_score_salt, 'alopecia_severity_score_salt');
  ensureNumber(req.alopecia_severity_score_salt, 'alopecia_severity_score_salt');
  ensureBool(req.patchy_or_totalis, 'patchy_or_totalis');
  ensureNumber(req.weeks_since_onset, 'weeks_since_onset');
  ensureBool(req.family_history, 'family_history');
  ensureBool(req.jak_history, 'jak_history');

  if (req.weeks_since_onset < 12 && req.alopecia_severity_score_salt <= 1) return { therapy: 'observation_or_local_steroid_injection_for_patchy_alopecia_salt_1_2', recommendation: 'topical_intralesional_or_observation' };

  if (req.alopecia_severity_score_salt <= 25) {
    return {
      therapy: 'topical_steroid_with_optional_topical_jak_tofacitinib_for_short_course',
      recommendation: 'topical_intralesional_steroid_for_3_weeks_then_review',
      citation: CITATIONS[1],
    };
  }
  if (req.alopecia_severity_score_salt <= 50) {
    return { therapy: 'oral_jak_tofacitinib_or_topical_jak_with_systemic_steroid', recommendation: 'systemic_therapy_for_extensive_patches', citation: CITATIONS[1] };
  }
  if (req.jak_history) return { therapy: 'consider_topical_then_diptheria_or_switch_to_alk_apremilast' };
  return { therapy: 'systemic_oral_jak_inhibitor_tofacitinib_with_thrombotic_workup', recommendation: 'urgent_advanced_therapy_referral' };
}

function telogen_effluvium(req) {
  ensureNumber(req.shedding_score, 'shedding_score');
  ensureNumber(req.hct, 'hct');
  ensureNumber(req.ferritin, 'ferritin');
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.stressful_event_weeks_ago, 'stressful_event_weeks_ago');
  ensureNumber(req.major_diet_change, 'major_diet_change');

  let cause;
  if (req.ferritin < 50) cause = 'iron_deficiency_treat_for_3_months';
  else if (req.tsh > 4) cause = 'thyroid_check_then_treat_thyroid';
  else if (req.stressful_event_weeks_ago >= 6 && req.stressful_event_weeks_ago <= 16) cause = 'telogen_effluvium_reassure_3_to_6_months_full_growth';
  else if (req.major_diet_change >= 1) cause = 'dietary_consider_supplements_protein_intake_then_review';
  else cause = 'consider_chronic_tea_care_reassess_3_to_6_months_or_pursue_traction_alopecia_differential';

  if (req.hct < 36) cause += '_target_hct_above_38';

  return { cause, hct: req.hct, ferritin: req.ferritin, tsh: req.tsh, citation: CITATIONS[2] };
}

function minoxidil_protocol(req) {
  ensureNumber(req.biological_sex, 'biological_sex');
  ensureStr(req.biological_sex_str, 'biological_sex_str');
  ensureEnum(req.biological_sex_str, 'biological_sex_str', ['male','female']);
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.pregnant_or_lactating, 'pregnant_or_lactating');
  ensureBool(req.medications_causing_hair_loss, 'medications_causing_hair_loss');

  let protocol;
  if (req.pregnant_or_lactating) protocol = 'do_not_use';
  else if (req.biological_sex_str === 'male') protocol = 'topical_minoxidil_5pct_1ml_twice_daily_expect_4_to_6_months_to_see_response_then_continuous_use';
  else protocol = 'topical_minoxidil_2pct_1ml_twice_daily_expect_4_to_6_months_then_consider_5pct_alternative';

  if (req.hypotension) protocol += '_monitor_bp';
  if (req.medications_causing_hair_loss) protocol += '_review_med_list_thyroid_drugs_etc';

  return { biological_sex: req.biological_sex_str, protocol, note: req.biological_sex >= 60 ? 'oral_minoxidil_at_low_dose_then_adverse_event_monitoring' : '' };
}

function hair_transplant(req) {
  ensureNumber(req.donor_density_follicles_per_cm2, 'donor_density_follicles_per_cm2');
  ensureNumber(req.alopecia_extent_pct, 'alopecia_extent_pct');
  ensureNumber(req.age, 'age');
  ensureBool(req.realistic_expectations, 'realistic_expectations');
  ensureBool(req.not_on_anticoagulants, 'not_on_anticoagulants');

  let verdict;
  if (req.donor_density_follicles_per_cm2 < 60 || req.alopecia_extent_pct > 60 || req.age < 22) verdict = 'not_an_ideal_candidate_or_proceed_with_realistic_goals';
  else if (req.realistic_expectations && req.not_on_anticoagulants) verdict = 'good_candidate_and_hair_transplant_FUE_strip_is_offered';
  else verdict = 'best_candidate_unmet_pre_visit_education_about_realistic_outcomes_then_reassess';
  return {
    verdict,
    donor_density: req.donor_density_follicles_per_cm2,
    age: req.age,
    citation: CITATIONS[3],
  };
}

function funcs() {
  return { androgenic_alopecia, alopecia_areata, telogen_effluvium, minoxidil_protocol, hair_transplant };
}

module.exports = { funcs, CITATIONS, ValidationError };
