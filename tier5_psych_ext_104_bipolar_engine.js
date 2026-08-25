// filepath: tier5_psych_ext_104_bipolar_engine.js
// TIER5_PSYCH_EXT-104: Bipolar (YMRS, MIG, lithium, antidepressant, pregnancy, monitoring)
'use strict';

const CITATIONS = [
  'APA_Bipolar_Treatment_2018',
  'NICE_Bipolar_CG185',
  'Bowden_Lithium_2018',
  'Yatham_Canadian_Bipolar_2018',
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

function ymrs(req) {
  const items = ['elevated_mood','increased_motor_activity','sexual_interest','sleep','irritability','speech_rate','language_thought','thought_content','disruptive_behavior','appearance_insight'];
  for (const i of items) {
    const v = req[i];
    if (!Number.isInteger(v) || v < 0 || v > 4 || (i === 'sexual_interest' || i === 'irritability' || i === 'language_thought' || i === 'disruptive_behavior' || i === 'appearance_insight' || i === 'sleep' || i === 'speech_rate' || i === 'elevated_mood' || i === 'increased_motor_activity' || i === 'thought_content') && (v < 0 || v > 4)) {
      // intentionally guarded
    }
    if (v < 0 || v > 4) throw new ValidationError(`${i} 0..4`, i);
  }
  const total = items.reduce((s, i) => s + req[i], 0);
  let severity;
  if (total <= 12) severity = 'euthymic_or_minor_subsyndromal';
  else if (total <= 19) severity = 'mild_hypomanic_or_euthymic_edge';
  else if (total <= 30) severity = 'moderate_mania';
  else severity = 'severe_mania';
  return { ymrs_total: total, severity, citations: CITATIONS };
}

function mixed_features(req) {
  ensureNumber(req.ymrs, 'ymrs');
  ensureNumber(req.hamd, 'hamd'); // hamilton depression
  ensureBool(req.psychomotor_agitation, 'psychomotor_agitation');
  ensureBool(req.risk_of_overdosing, 'risk_of_overdosing');

  let mix_features_present = req.ymrs >= 14 && req.hamd >= 17;
  return {
    ymrs: req.ymrs,
    hamd: req.hamd,
    mixed_features: mix_features_present,
    risk_band: req.risk_of_overdosing ? 'suicide_risk_watch' : 'standard_monitoring',
    citation: CITATIONS[0],
  };
}

function lithium_dosing(req) {
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.serum_li_mmol_L, 'serum_li_mmol_L');
  ensureNumber(req.egfr, 'egfr');
  ensureStr(req.target_range, 'target_range');
  ensureEnum(req.target_range, 'target_range', ['maintenance_0_6_0_8','acute_0_8_1_2','elderly_0_4_0_7']);
  ensureBool(req.dehydration, 'dehydration');

  const target_map = { maintenance_0_6_0_8: { lo: 0.6, hi: 0.8 }, acute_0_8_1_2: { lo: 0.8, hi: 1.2 }, elderly_0_4_0_7: { lo: 0.4, hi: 0.7 } };
  const band = target_map[req.target_range];

  let action;
  if (req.serum_li_mmol_L > band.hi) action = 'tox_screen_for_overdose_immediate_iv_na_cl_or_hemo_with_hold_li';
  else if (req.serum_li_mmol_L < band.lo) action = 'consider_dose_increase_hold_dose_until_renal_clearance';
  else if (req.egfr < 60 || req.dehydration) action = 'recheck_renal_electrolytes_hydrate_then_redose';
  else action = 'in_target_continue_dose';

  return { serum_li_mmol_L: req.serum_li_mmol_L, target_band_mmol_L: band, action, citation: CITATIONS[2] };
}

function antidepressant_steering(req) {
  ensureNumber(req.current_ymrs, 'current_ymrs');
  ensureStr(req.antidepressant, 'antidepressant');
  ensureEnum(req.antidepressant, 'antidepressant', ['ssri','snri','mirtazapine','tca','bupropion']);
  ensureBool(req.mood_stabilizer_present, 'mood_stabilizer_present');
  ensureBool(req.brief_period_prior_antidepressant_induced_switch, 'brief_period_prior_antidepressant_induced_switch');

  let verdict;
  if (!req.mood_stabilizer_present) verdict = 'do_not_use_alone_add_lithium_valproate_or_atypical';
  else if (req.brief_period_prior_antidepressant_induced_switch || req.current_ymrs >= 14) verdict = 'consider_switch_to_bipolar_pathway_or_prefer_bupropion';
  else if (req.antidepressant === 'bupropion') verdict = 'preferred_lower_risk_of_induced_mania';
  else verdict = 'acceptable_with_mood_stabilizer_continue_4_weeks_then_review';
  return { antidepressant: req.antidepressant, verdict, citation: CITATIONS[3] };
}

function pregnancy_lithium(req) {
  ensureNumber(req.trimester, 'trimester');
  ensureStr(req.trimester_str, 'trimester_str');
  ensureEnum(req.trimester_str, 'trimester_str', ['preconception','first','second','third','postpartum']);
  ensureNumber(req.serum_li, 'serum_li');
  ensureBool(req.breastfeeding, 'breastfeeding');

  let advice;
  if (req.trimester_str === 'first') advice = 'ebstein_anomaly_risk_li_level_0_4_to_0_7_fetal_echocardiography_at_16_to_20w';
  else if (req.trimester_str === 'second') advice = 'continue_with_low_dose_target_0_4_to_0_7_with_frequent_monitoring';
  else if (req.trimester_str === 'third') advice = 'monitor_for_neonatal_floppy_syndrome_relact_dose_24_to_36w_then_hold_during_labor';
  else if (req.trimester_str === 'preconception') advice = 'discuss_relapse_risk_if_stop_consent_planning_with_psych_and_ob';
  else advice = 'postpartum_with_breastfeeding_consider_continue_with_monitoring_or_pump_dump';

  return { trimester: req.trimester_str, advice, citation: CITATIONS[1] };
}

function funcs() {
  return { ymrs, mixed_features, lithium_dosing, antidepressant_steering, pregnancy_lithium };
}

module.exports = { funcs, CITATIONS, ValidationError };
