// filepath: tier5_psych_ext_102_depression_engine.js
// TIER5_PSYCH_EXT-102: Depression pathway (start point, aug, TCA, peripartum, monitoring)
'use strict';

const CITATIONS = [
  'APA_MDD_Treatment_Practice_2019',
  'Maudsley_Prescribing_2018',
  'ACOG_Antenatal_Depression_2019',
  'NICE_Depression_Adult_CG90',
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

function start_point(req) {
  ensureNumber(req.phq9, 'phq9');
  ensureBool(req.history_of_prior_episode, 'history_of_prior_episode');
  ensureBool(req.cbt_available, 'cbt_available');
  ensureBool(req.severe_functional_impairment, 'severe_functional_impairment');
  ensureBool(req.pregnancy, 'pregnancy');
  ensureBool(req.drug_interaction_concern, 'drug_interaction_concern');

  let plan;
  if (req.phq9 >= 20 || req.severe_functional_impairment) plan = 'start_ssri_plus_cbt_first_line_add_sertraline_citalopram_escitalopram';
  else if (req.phq9 >= 15) plan = 'start_ssri_or_snri_with_cbt';
  else if (req.phq9 >= 10) plan = 'cbt_first_add_ssri_if_no_response_in_4_8_weeks';
  else if (req.phq9 >= 5) plan = 'watchful_waiting_repeat_phq_in_2_4_weeks';

  if (req.pregnancy) plan = 'cbt_firstline_for_pregnant_patients_sertraline_is_preferred_if_medication_needed';

  return { phq9: req.phq9, recommended_plan: plan, citations: CITATIONS };
}

function augmentation(req) {
  ensureStr(req.augment_strategy, 'augment_strategy');
  ensureEnum(req.augment_strategy, 'augment_strategy', ['lithium','atypical_antipsychotic','t3_thyroid','buspirone','second_ssri','switch_to_snri']);
  ensureNumber(req.week_on_first_ssri, 'week_on_first_ssri');
  ensureNumber(req.adherence_pct, 'adherence_pct');

  if (req.adherence_pct < 80) return { strategy: req.augment_strategy, verdict: 'verify_adherence_before_augmenting', recommended: false, citation: CITATIONS[0] };

  if (req.week_on_first_ssri < 6) return { strategy: req.augment_strategy, verdict: 'first_ssri_not_yet_at_optimal_dose_or_duration', recommended: false, citation: CITATIONS[0] };

  return { strategy: req.augment_strategy, verdict: 'augmentation_appropriate', recommended: true, citations: CITATIONS };
}

function tca_level(req) {
  ensureNumber(req.dose_mg_kg, 'dose_mg_kg');
  ensureNumber(req.drawn_plasma_level_ng_ml, 'drawn_plasma_level_ng_ml');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['amitriptyline','nortriptyline','imipramine','desipramine']);

  const target = { amitriptyline: { lo: 50, hi: 150 }, nortriptyline: { lo: 50, hi: 150 }, imipramine: { lo: 200, hi: 250 }, desipramine: { lo: 75, hi: 250 } }[req.drug];
  let verdict;
  if (req.drawn_plasma_level_ng_ml < target.lo) verdict = 'below_therapeutic_window_consider_dose_increase';
  else if (req.drawn_plasma_level_ng_ml > target.hi) verdict = 'above_therapeutic_window_risk_toxicity_consider_dose_reduction';
  else verdict = 'in_therapeutic_window';
  return { drug: req.drug, dose_mg_kg: req.dose_mg_kg, drawn: req.drawn_plasma_level_ng_ml, target_window_ng_ml: target, verdict, citation: CITATIONS[1] };
}

function peripartum(req) {
  ensureStr(req.trimester, 'trimester');
  ensureEnum(req.trimester, 'trimester', ['preconception','first','second','third','postpartum']);
  ensureNumber(req.epds_score, 'epds_score');
  ensureBool(req.breastfeeding, 'breastfeeding');
  if (req.epds_score > 30 || req.epds_score < 0) throw new ValidationError('epds_score 0..30', 'epds_score');
  let severity;
  if (req.epds_score <= 9) severity = 'unlikely_postpartum_depression';
  else if (req.epds_score <= 12) severity = 'mild_postpartum_depression_monitor';
  else if (req.epds_score <= 19) severity = 'moderate_refer_for_psych_eval_and_consider_sertraline_if_breastfeeding';
  else severity = 'severe_psychiatry_urgent_sertraline_first_line';

  if (req.trimester === 'preconception') severity = 'preconception_review_medication_planning_with_psychiatry';

  return { trimester: req.trimester, epds_score: req.epds_score, severity, breastfeeding: req.breastfeeding, citation: CITATIONS[2] };
}

function monitoring(req) {
  ensureNumber(req.week, 'week');
  ensureNumber(req.phq9, 'phq9');
  ensureNumber(req.sssr_sponsors_tolerability_score, 'sssr_sponsors_tolerability_score');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['sertraline','escitalopram','citalopram','fluoxetine','venlafaxine','duloxetine','desvenlafaxine','mirtazapine','bupropion','agomelatine']);
  ensureBool(req.side_effect_intolerable, 'side_effect_intolerable');

  let recommendation;
  if (req.phq9 <= 9 && !req.side_effect_intolerable) recommendation = 'continuation_beneficial_for_6_to_12_months_after_remission';
  else if (req.side_effect_intolerable) recommendation = 'dose_reduce_or_switch_candidate';
  else if (req.week < 8 && req.phq9 > 9) recommendation = 'optimize_dose_or_wait_until_week_8_then_re_evaluate';
  else recommendation = 'consider_augmentation_or_switch';
  return { week: req.week, drug: req.drug, recommendation, citation: CITATIONS[3] };
}

function funcs() {
  return { start_point, augmentation, tca_level, peripartum, monitoring };
}

module.exports = { funcs, CITATIONS, ValidationError };
