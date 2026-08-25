'use strict';
// TIER4_OB_DELIVERY-101 Intrapartum / Labor
const CITATIONS = ['ACOG_Intrapartum_Management','WHO_Partogram'];
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

function partogramCheck(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const cervical_dilation_cm = ensureNumber(input.cervical_dilation_cm, 'cervical_dilation_cm');
  const hours_since_active = ensureNumber(input.hours_since_active, 'hours_since_active');
  const descent = input.descent || 'station_minus_1';
  let progress_normal = true;
  if (cervical_dilation_cm >= 5 && hours_since_active >= 6) progress_normal = false;
  const alert_line = cervical_dilation_cm + 1;
  const action_line = cervical_dilation_cm;
  return { cervical_dilation_cm, hours_since_active, descent, progress_normal, alert_line_target: alert_line, action_line_target: action_line, intervention: progress_normal ? 'continue_expectant' : 'augment_with_oxytocin_or_consider_cs', citations: CITATIONS };
}

function stageOfLabor(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const dilation_cm = ensureNumber(input.dilation_cm, 'dilation_cm');
  const fully_dilated = !!input.fully_dilated;
  const fetal_descent = ensureEnum(input.fetal_descent || 'engaged', ['high','engaged','station_plus_1','station_plus_2','crowning'], 'fetal_descent');
  let stage = 1;
  if (fully_dilated) stage = 2;
  const phase = fully_dilated ? 'second_stage' : (dilation_cm < 6 ? 'latent_phase' : 'active_phase');
  return { dilation_cm, fully_dilated, fetal_descent, stage, phase, citations: CITATIONS };
}

module.exports = { partogramCheck, stageOfLabor, CITATIONS, ValidationError };