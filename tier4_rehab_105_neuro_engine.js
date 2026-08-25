'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aao_neurorehab: 'AAPM&R Brain Injury Medicine 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function ranchoLosAmigos(input) {
  ensureObj(input, 'input');
  const current_level = ensureNumber(input.current_level, 'current_level');
  let description;
  if (current_level === 1) { description = 'no_response'; }
  else if (current_level === 2) { description = 'generalized_response'; }
  else if (current_level === 3) { description = 'localized_response'; }
  else if (current_level === 4) { description = 'confused_agitated'; }
  else if (current_level === 5) { description = 'confused_inappropriate'; }
  else if (current_level === 6) { description = 'confused_appropriate'; }
  else if (current_level === 7) { description = 'automatic_appropriate'; }
  else { description = 'purposeful_appropriate'; }
  const therapy = current_level <= 3 ? 'sensory_stimulation_coma_stimulation' : current_level <= 5 ? 'structured_environment_supervision' : 'community_reintegration';
  return { current_level, description, therapy, citations:['aao_neurorehab'] };
}

function functionalMobility(input) {
  ensureObj(input, 'input');
  const roll = !!input.roll;
  const supine_to_sit = !!input.supine_to_sit;
  const sit_to_stand = !!input.sit_to_stand;
  const transfers = !!input.transfers;
  const ambulation = !!input.ambulation;
  const stairs = !!input.stairs;
  const total = (roll?1:0) + (supine_to_sit?1:0) + (sit_to_stand?1:0) + (transfers?1:0) + (ambulation?1:0) + (stairs?1:0);
  let level;
  if (total === 6) { level = 'independent_community'; }
  else if (total >= 4) { level = 'modified_independent'; }
  else if (total >= 2) { level = 'minimal_assistance'; }
  else { level = 'dependent_max_assist'; }
  return { roll, supine_to_sit, sit_to_stand, transfers, ambulation, stairs, total, level };
}

module.exports = { ranchoLosAmigos, functionalMobility, CITATIONS, ValidationError };
