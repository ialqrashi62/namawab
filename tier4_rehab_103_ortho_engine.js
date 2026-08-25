'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aaos: 'AAOS Rehabilitation Guidelines 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function tkrProtocol(input) {
  ensureObj(input, 'input');
  const days_post_op = ensureNumber(input.days_post_op, 'days_post_op');
  const rom_degrees = ensureNumber(input.rom_degrees, 'rom_degrees');
  const pain_level = ensureNumber(input.pain_level, 'pain_level');
  let phase;
  if (days_post_op < 14) { phase = 'week_1_2_walking_ice_gentle_rom'; }
  else if (days_post_op < 42) { phase = 'week_2_6_stretching_strengthening'; }
  else if (days_post_op < 90) { phase = 'week_6_12_advanced_strength_balance'; }
  else { phase = 'month_3_plus_return_to_sport'; }
  const rom_target = rom_degrees >= 110 ? 'target_met' : rom_degrees >= 90 ? 'nearly_target' : 'below_target_mobilization';
  return { days_post_op, rom_degrees, pain_level, phase, rom_target, citations:['aaos'] };
}

function shoulderRc(input) {
  ensureObj(input, 'input');
  const weeks_since_repair = ensureNumber(input.weeks_since_repair, 'weeks_since_repair');
  const motion = ensureEnum(input.motion, ['passive','active_assisted','active','resisted'], 'motion');
  const pain = ensureNumber(input.pain, 'pain');
  let phase;
  if (weeks_since_repair < 6) { phase = 'phase_1_protected_sling'; }
  else if (weeks_since_repair < 12) { phase = 'phase_2_active_assisted'; }
  else if (weeks_since_repair < 24) { phase = 'phase_3_active_resisted'; }
  else { phase = 'phase_4_return_to_sport'; }
  const precaution = motion !== 'passive' && weeks_since_repair < 6 ? 'use_passive_only' : 'appropriate';
  return { weeks_since_repair, motion, pain, phase, precaution };
}

module.exports = { tkrProtocol, shoulderRc, CITATIONS, ValidationError };
