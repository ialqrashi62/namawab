'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aspEN: 'ASPEN Enteral Nutrition 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function enteralRoute(input) {
  ensureObj(input, 'input');
  const expected_ngt_duration = ensureEnum(input.expected_ngt_duration, ['short','medium','long'], 'expected_ngt_duration');
  const gastric_empty = !!input.gastric_empty;
  const aspiration_history = !!input.aspiration_history;
  const gi_function = ensureEnum(input.gi_function, ['normal','impaired','absent'], 'gi_function');
  let route;
  if (gi_function === 'absent') { route = 'parenteral_nutrition'; }
  else if (aspiration_history || gi_function === 'impaired') { route = 'post_pyloric_jejunal'; }
  else if (expected_ngt_duration === 'short') { route = 'ngt_nasal_gastric'; }
  else if (expected_ngt_duration === 'medium') { route = 'ngt_or_gastrostomy'; }
  else { route = 'peg_gastrostomy'; }
  return { expected_ngt_duration, gastric_empty, aspiration_history, gi_function, route, citations:['aspEN'] };
}

function feedingTolerance(input) {
  ensureObj(input, 'input');
  const gastric_residual_ml = ensureNumber(input.gastric_residual_ml, 'gastric_residual_ml');
  const abdominal_distention = !!input.abdominal_distention;
  const vomiting = !!input.vomiting;
  const diarrhea = !!input.diarrhea;
  let action;
  if (gastric_residual_ml >= 500) { action = 'hold_feeding_consider_prokinetic'; }
  else if (vomiting || abdominal_distention) { action = 'reduce_rate_evaluate'; }
  else if (diarrhea) { action = 'reduce_rate_consider_fiber'; }
  else { action = 'continue_or_advance'; }
  return { gastric_residual_ml, abdominal_distention, vomiting, diarrhea, action };
}

module.exports = { enteralRoute, feedingTolerance, CITATIONS, ValidationError };
