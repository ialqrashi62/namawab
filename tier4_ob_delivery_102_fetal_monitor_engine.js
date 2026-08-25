'use strict';
// TIER4_OB_DELIVERY-102 Fetal Monitoring
const CITATIONS = ['ACOG_Intrapartum_FHR','NICHD_Three_Tier'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function fetalHeartRateCategory(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const baseline_fhr = ensureNumber(input.baseline_fhr, 'baseline_fhr');
  const variability = input.variability || 'moderate';
  const accelerations_present = !!input.accelerations_present;
  const late_or_variable_decelerations = !!input.late_or_variable_decelerations;
  let category = 1;
  if (baseline_fhr < 110 || baseline_fhr > 160) category = 2;
  if (variability === 'absent' || late_or_variable_decelerations) category = 2;
  if (variability === 'absent' && late_or_variable_decelerations) category = 3;
  if (variability === 'sinusoidal') category = 3;
  const reassuring = category === 1 && accelerations_present;
  return { baseline_fhr, variability, accelerations_present, late_or_variable_decelerations, category, reassuring, citations: CITATIONS };
}

function variableVsLateDeceleration(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const shape = input.shape || 'variable';
  const timing = input.timing || 'variable_with_contractions';
  const accel_before_after = !!input.accel_before_after;
  if (shape === 'variable') return { type: 'variable_decelerations', cause: 'cord_compression', management: 'change_position_amniotomy_if_oligohydramnios', citations: CITATIONS };
  if (timing === 'uniform_late') return { type: 'late_decelerations', cause: 'uteroplacental_insufficiency', management: 'iv_fluid_left_lateral_oxygen_decrease_oxytocin', citations: CITATIONS };
  return { type: 'unclear_reassess_in_30_min', accel_before_after, citations: CITATIONS };
}

module.exports = { fetalHeartRateCategory, variableVsLateDeceleration, CITATIONS, ValidationError };