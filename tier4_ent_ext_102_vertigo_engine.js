'use strict';
// TIER4_ENT_EXT-102 Vertigo
const CITATIONS = ['AAO_HNS_Vertigo','Bárány_Society_Classification'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function vertigoPeripheralVsCentral(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const hINTS_negative = !!input.hINTS_negative;
  const episodic = !!input.episodic;
  const nystagmus_unidirectional = !!input.nystagmus_unidirectional;
  const hearing_loss = !!input.hearing_loss;
  const recent_stroke_signs = !!input.recent_stroke_signs;
  let diagnosis = 'peripheral_likely_bppv_or_vestibular_neuritis';
  if (recent_stroke_signs || !nystagmus_unidirectional) diagnosis = 'central_neurology_workup_imaging';
  if (hINTS_negative) diagnosis = 'central_immediate_imaging';
  return { hINTS_negative, episodic, nystagmus_unidirectional, hearing_loss, recent_stroke_signs, diagnosis, citations: CITATIONS };
}

function bppvRepositioningManeuver(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const side = ensureEnum(input.side || 'right', ['right','left','bilateral'], 'side');
  let maneuver = 'Epley_maneuver_right_side';
  if (side === 'left') maneuver = 'Epley_maneuver_left_side';
  if (side === 'bilateral') maneuver = 'Epley_both_sides_reassess_after_each';
  return { side, maneuver, instructions: 'hold_each_position_30_seconds', follow_up: 'reassess_48_to_72_hours', citations: CITATIONS };
}

module.exports = { vertigoPeripheralVsCentral, bppvRepositioningManeuver, CITATIONS, ValidationError };