'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { who_icf: 'WHO International Classification of Functioning 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function chronicDiseaseSeverity(input) {
  ensureObj(input, 'input');
  const diagnosis = ensureEnum(input.diagnosis, ['diabetes','chf','copd','asthma','ckd','cirrhosis','cad','cancer'], 'diagnosis');
  const hba1c = ensureNumber(input.hba1c || 0, 'hba1c');
  const fev1 = ensureNumber(input.fev1 || 100, 'fev1');
  const ef = ensureNumber(input.ef || 60, 'ef');
  const gfr = ensureNumber(input.gfr || 100, 'gfr');
  const child = ensureNumber(input.child || 5, 'child');
  let severity;
  if (diagnosis === 'diabetes') { severity = hba1c >= 9 ? 'severe' : hba1c >= 7 ? 'moderate' : 'mild'; }
  else if (diagnosis === 'copd') { severity = fev1 < 50 ? 'severe' : fev1 < 80 ? 'moderate' : 'mild'; }
  else if (diagnosis === 'chf') { severity = ef < 35 ? 'severe' : ef < 50 ? 'moderate' : 'mild'; }
  else if (diagnosis === 'ckd') { severity = gfr < 30 ? 'severe' : gfr < 60 ? 'moderate' : 'mild'; }
  else if (diagnosis === 'cirrhosis') { severity = child >= 10 ? 'decompensated' : child >= 7 ? 'significant' : 'compensated'; }
  else if (diagnosis === 'cancer') { severity = 'stage_dependent'; }
  else { severity = 'stable'; }
  return { diagnosis, hba1c, fev1, ef, gfr, child, severity, citations:['who_icf'] };
}

function adlFunction(input) {
  ensureObj(input, 'input');
  const bathing = ensureNumber(input.bathing, 'bathing');
  const dressing = ensureNumber(input.dressing, 'dressing');
  const toileting = ensureNumber(input.toileting, 'toileting');
  const transferring = ensureNumber(input.transferring, 'transferring');
  const continence = ensureNumber(input.continence, 'continence');
  const feeding = ensureNumber(input.feeding, 'feeding');
  const total = bathing + dressing + toileting + transferring + continence + feeding;
  let dependency;
  if (total >= 18) { dependency = 'independent'; }
  else if (total >= 12) { dependency = 'mild_assistance'; }
  else if (total >= 6) { dependency = 'moderate_dependency'; }
  else { dependency = 'severe_dependency'; }
  return { bathing, dressing, toileting, transferring, continence, feeding, total, dependency };
}

module.exports = { chronicDiseaseSeverity, adlFunction, CITATIONS, ValidationError };
