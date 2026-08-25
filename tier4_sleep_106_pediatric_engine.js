'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm_ped: 'AASM Pediatric Sleep 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function pediatricSleepNeeds(input) {
  ensureObj(input, 'input');
  const age_years = ensureNumber(input.age_years, 'age_years');
  let recommended;
  if (age_years < 1) { recommended = 16; }
  else if (age_years < 3) { recommended = 12; }
  else if (age_years < 6) { recommended = 11; }
  else if (age_years < 11) { recommended = 10; }
  else if (age_years < 14) { recommended = 9; }
  else { recommended = 8; }
  return { age_years, recommended_hours: recommended };
}

function pediatricObstructive(input) {
  ensureObj(input, 'input');
  const age_years = ensureNumber(input.age_years, 'age_years');
  const snoring = !!input.snoring;
  const adenoid_facies = !!input.adenoid_facies;
  const obesity = !!input.obesity;
  const nocturnal_enuresis = !!input.nocturnal_enuresis;
  let therapy;
  if (snoring && adenoid_facies && (age_years >= 1 && age_years <= 12)) { therapy = 'adenotonsillectomy_consider'; }
  else if (obesity) { therapy = 'weight_loss_monitor'; }
  else if (snoring) { therapy = 'sleep_study_cpap_if_ahi_elevated'; }
  else { therapy = 'sleep_study_consider'; }
  return { age_years, snoring, adenoid_facies, obesity, nocturnal_enuresis, therapy, citations:['aasm_ped'] };
}

module.exports = { pediatricSleepNeeds, pediatricObstructive, CITATIONS, ValidationError };
