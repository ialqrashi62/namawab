'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acog_anta: 'ACOG Antenatal Care 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function trimesterCare(input) {
  ensureObj(input, 'input');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const bp_systolic = ensureNumber(input.bp_systolic, 'bp_systolic');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const pre_pregnancy_weight = ensureNumber(input.pre_pregnancy_weight, 'pre_pregnancy_weight');
  const weight_gain = weight_kg - pre_pregnancy_weight;
  const trimester = gestational_weeks < 13 ? 'first' : gestational_weeks < 27 ? 'second' : 'third';
  const recommendation = [];
  if (bp_systolic >= 140) { recommendation.push('gDM_or_preeclampsia_eval'); }
  if (trimester === 'first') { recommendation.push('nt_ultrasound_first_trimester_screen'); }
  if (trimester === 'second') { recommendation.push('anatomy_ultrasound_18_22_wk'); }
  if (trimester === 'third') { recommendation.push('gbs_screen_third_trimester'); }
  if (weight_gain < 5 && trimester === 'third') { recommendation.push('nutrition_eval'); }
  return { gestational_weeks, bp_systolic, weight_kg, pre_pregnancy_weight, weight_gain, trimester, recommendation, citations:['acog_anta'] };
}

function preeclampsiaScreen(input) {
  ensureObj(input, 'input');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const bp_systolic = ensureNumber(input.bp_systolic, 'bp_systolic');
  const bp_diastolic = ensureNumber(input.bp_diastolic, 'bp_diastolic');
  const proteinuria = !!input.proteinuria;
  const severe_features = !!input.severe_features;
  if (bp_systolic >= 160 || bp_diastolic >= 110 || severe_features) { return { gestational_weeks, bp_systolic, bp_diastolic, proteinuria, severe_features, diagnosis: 'severe_preeclampsia_admit', action: 'magnesium_sulfate_antihypertensive_delivery' }; }
  if (bp_systolic >= 140 || bp_diastolic >= 90) { if (proteinuria) { return { gestational_weeks, bp_systolic, bp_diastolic, proteinuria, severe_features, diagnosis: 'preeclampsia', action: 'monitor_admit_consider_delivery' }; } else { return { gestational_weeks, bp_systolic, bp_diastolic, proteinuria, severe_features, diagnosis: 'gestational_hypertension', action: 'monitor_followup_24h' }; } }
  return { gestational_weeks, bp_systolic, bp_diastolic, proteinuria, severe_features, diagnosis: 'normal_bp', action: 'routine_antenatal' };
}

module.exports = { trimesterCare, preeclampsiaScreen, CITATIONS, ValidationError };
