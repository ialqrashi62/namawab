// filepath: tier5_psych_ext_103_anxiety_engine.js
// TIER5_PSYCH_EXT-103: Anxiety disorders (CBAT timeline, panic, social anxiety, school avoidance, OCD)
'use strict';

const CITATIONS = [
  'APA_Anxiety_Practice_Guideline_2020',
  'Borkovec_CBAT_2017',
  'Stech_OCD_Exposure_2019',
  'Clark_Panic_2017',
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

function cbat_timeline(req) {
  ensureNumber(req.gad7, 'gad7');
  ensureBool(req.prefer_medication_first, 'prefer_medication_first');
  ensureBool(req.availability_of_psychologist, 'availability_of_psychologist');
  ensureNumber(req.week_now, 'week_now');

  let plan = [];
  if (req.gad7 >= 15) {
    plan = ['week_0_cbt_psych_consultation_education_then_ssri', 'week_2_ssri_optimization', 'week_4_re_evaluate_exposure_diary', 'week_8_full_response_assessment', 'continuation_6_months_min'];
  } else if (req.gad7 >= 10) {
    plan = ['cbt_first_then_medication', 'week_2_relaxation_training', 'week_4_exposure_ladder', 'week_8_re_rate_gad7'];
  } else if (req.gad7 >= 5) {
    if (req.availability_of_psychologist) plan = ['cbat_low_intensity_psychoeducation_digital_self_help'];
    else plan = ['self_help_books_digital_modules_2_4_weeks_then_re_screen'];
  } else {
    plan = ['reassure_no_intervention_recheck_at_3_months'];
  }
  return { gad7: req.gad7, plan, current_week: req.week_now, citations: CITATIONS };
}

function panic_assess(req) {
  ensureNumber(req.dsp_attacks_4weeks, 'dsp_attacks_4weeks');
  ensureBool(req.panic_agoraphobic_avoidance, 'panic_agoraphobic_avoidance');
  ensureBool(req.contra_health_concern, 'contra_health_concern');
  ensureNumber(req.life_attacks_past_4w, 'life_attacks_past_4w');
  ensureStr(req.frequency_per_week, 'frequency_per_week');
  ensureEnum(req.frequency_per_week, 'frequency_per_week', ['zero','once_a_week','2_to_4_per_week','daily','daily_several']);

  let severity;
  if (req.dsp_attacks_4weeks >= 6 || req.frequency_per_week === 'daily_several') severity = 'severe_daily_functional_disruption';
  else if (req.dsp_attacks_4weeks >= 2) severity = 'moderate_active_panic_disorder';
  else if (req.dsp_attacks_4weeks >= 1) severity = 'mild';
  else severity = 'sub_threshold';

  let plan;
  if (req.contra_health_concern) plan = 'COGNITIVE_RECONCEPTUALIZATION_BREATHING_REATTRIBUTION_CBT_RECOMMENDED';
  else if (severity === 'severe_daily_functional_disruption') plan = 'CBT_PANIC_PROTOCOL_plus_SSRI';
  else plan = 'CBT_PANIC_PROTOCOL_only';

  return { severity, plan, agoraphobic_avoidance: req.panic_agoraphobic_avoidance, citations: CITATIONS };
}

function social_anxiety(req) {
  ensureNumber(req.liebowitz_score, 'liebowitz_score');
  ensureBool(req.can_perform_in_social_at_all, 'can_perform_in_social_at_all');
  ensureNumber(req.behavioral_test_pct, 'behavioral_test_pct');
  if (req.liebowitz_score > 144) throw new ValidationError('liebowitz 0..144', 'liebowitz_score');

  let severity;
  if (req.behavioral_test_pct >= 80) severity = 'mild_clinical_dialogue_workshop';
  else if (req.behavioral_test_pct >= 50) severity = 'moderate_cbt_individual_ssri';
  else severity = 'severe_intensive_CBT_with_practice_ssri_simulated_exposure';

  return { liebowitz_score: req.liebowitz_score, severity, behavioral_test_pct: req.behavioral_test_pct, citation: CITATIONS[1] };
}

function school_avoidance(req) {
  ensureNumber(req.weeks_absent, 'weeks_absent');
  ensureBool(req.parental_accommodation, 'parental_accommodation');
  ensureBool(req.bullying_history, 'bullying_history');
  ensureStr(req.grade, 'grade');
  ensureEnum(req.grade, 'grade', ['elementary','middle','high','college']);

  let tier;
  if (req.weeks_absent < 1) tier = 'typical_separation_anxiety';
  else if (req.weeks_absent < 4) tier = 'mild_school_refusal';
  else if (req.weeks_absent < 12) tier = 'moderate_active_intervention';
  else tier = 'severe_chronic_school_refusal_consider_compact_return_plan';

  return {
    weeks_absent: req.weeks_absent,
    grade: req.grade,
    tier,
    notes: req.parental_accommodation ? 'CFT_WITH_PARENT_components_offered_to_address_accidental_reinforcement' : 'standard_CFT',
    citations: CITATIONS,
  };
}

function ocd_exposure(req) {
  ensureNumber(req.ybocs_total, 'ybocs_total');
  ensureNumber(req.erp_hours_per_week, 'erp_hours_per_week');
  ensureBool(req.family_accommodation_present, 'family_accommodation_present');
  ensureBool(req.comorbid_ocd_neuropsych, 'comorbid_ocd_neuropsych');

  if (req.ybocs_total < 0 || req.ybocs_total > 40) throw new ValidationError('ybocs 0..40', 'ybocs_total');

  let tier;
  if (req.ybocs_total <= 15 && req.erp_hours_per_week >= 8) tier = 'mild_active_ERP';
  else if (req.ybocs_total >= 20 && req.erp_hours_per_week >= 12) tier = 'moderate_ERP_plus_SSRI_higher_dose';
  else if (req.ybocs_total >= 30) tier = 'severe_intensive_ERP_clozapine_protocol_or_neuromodulation';
  else tier = 'low_threshold_active_ERP';

  return {
    ybocs_total: req.ybocs_total,
    erp_hours_per_week: req.erp_hours_per_week,
    tier,
    family_accommodation: req.family_accommodation_present,
    citation: CITATIONS[2],
  };
}

function funcs() {
  return { cbat_timeline, panic_assess, social_anxiety, school_avoidance, ocd_exposure };
}

module.exports = { funcs, CITATIONS, ValidationError };
