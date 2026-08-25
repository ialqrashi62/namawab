'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm_icd: 'ICSD-3 2014' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function remSleepBehavior(input) {
  ensureObj(input, 'input');
  const rem_acting_out = !!input.rem_acting_out;
  const dream_enacting = !!input.dream_enacting;
  const age = ensureNumber(input.age, 'age');
  const male = !!input.male;
  const neurodegenerative = !!input.neurodegenerative;
  let diagnosis;
  if (rem_acting_out && dream_enacting) { diagnosis = 'rbd_likely'; }
  else if (rem_acting_out) { diagnosis = 'rbd_possible'; }
  else { diagnosis = 'rbd_unlikely'; }
  const therapy = neurodegenerative ? 'neurology_referral_clonazepam' : 'sleep_study_and_clonazepam';
  return { rem_acting_out, dream_enacting, age, male, neurodegenerative, diagnosis, therapy, citations:['aasm_icd'] };
}

function restlessLegs(input) {
  ensureObj(input, 'input');
  const urge_to_move_legs = !!input.urge_to_move_legs;
  const worse_at_rest = !!input.worse_at_rest;
  const relieved_by_movement = !!input.relieved_by_movement;
  const evening_worse = !!input.evening_worse;
  const score = (urge_to_move_legs?1:0) + (worse_at_rest?1:0) + (relieved_by_movement?1:0) + (evening_worse?1:0);
  let diagnosis;
  if (score >= 4) { diagnosis = 'rls_definite'; }
  else if (score >= 3) { diagnosis = 'rls_possible'; }
  else { diagnosis = 'rls_unlikely'; }
  const therapy = score >= 4 ? 'check_iron_studies_dopamine_agonist' : 'lifestyle_reassess';
  return { urge_to_move_legs, worse_at_rest, relieved_by_movement, evening_worse, score, diagnosis, therapy };
}

module.exports = { remSleepBehavior, restlessLegs, CITATIONS, ValidationError };
