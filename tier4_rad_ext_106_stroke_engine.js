'use strict';
// TIER4_RAD_EXT-106 Stroke Imaging
const CITATIONS = ['AHA_Stroke_2021','ESO_Stroke'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function nihssScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const consciousness = ensureNumber(input.consciousness || 0, 'consciousness');
  const gaze = ensureNumber(input.gaze || 0, 'gaze');
  const visual_fields = ensureNumber(input.visual_fields || 0, 'visual_fields');
  const facial_palsy = ensureNumber(input.facial_palsy || 0, 'facial_palsy');
  const motor_arm = ensureNumber(input.motor_arm || 0, 'motor_arm');
  const motor_leg = ensureNumber(input.motor_leg || 0, 'motor_leg');
  const ataxia = ensureNumber(input.ataxia || 0, 'ataxia');
  const sensory = ensureNumber(input.sensory || 0, 'sensory');
  const language = ensureNumber(input.language || 0, 'language');
  const dysarthria = ensureNumber(input.dysarthria || 0, 'dysarthria');
  const extinction = ensureNumber(input.extinction || 0, 'extinction');
  const total = consciousness + gaze + visual_fields + facial_palsy + motor_arm + motor_leg + ataxia + sensory + language + dysarthria + extinction;
  let severity = 'no_stroke';
  if (total >= 21) severity = 'severe_stroke';
  else if (total >= 16) severity = 'moderate_severe';
  else if (total >= 5) severity = 'moderate';
  else if (total >= 1) severity = 'minor';
  return { total, severity, citations: CITATIONS };
}

function strokeImagingStrategy(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const hours_since_onset = ensureNumber(input.hours_since_onset, 'hours_since_onset');
  const nihss = input.nihss || 0;
  const hemorrhage_suspected = !!input.hemorrhage_suspected;
  let strategy = 'mri_brain_dwi_or_ct_head_non_contrast';
  if (hours_since_onset <= 4.5 && nihss >= 6) strategy = 'ct_head_to_exclude_bleed_then_iv_tPA_then_mri_for_thrombectomy_candidate';
  if (hours_since_onset <= 24 && nihss >= 6) strategy = 'ct_angiography_or_mr_angiography_for_thrombectomy';
  if (hemorrhage_suspected) strategy = 'ct_head_non_contrast_immediate_to_exclude_bleed';
  return { hours_since_onset, nihss, hemorrhage_suspected, strategy, citations: CITATIONS };
}

module.exports = { nihssScore, strokeImagingStrategy, CITATIONS, ValidationError };