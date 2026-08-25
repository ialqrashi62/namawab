'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aua_bph: 'American Urological Association Benign Prostatic Hyperplasia 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function ipss(input) {
  ensureObj(input, 'input');
  const urgency = ensureNumber(input.urgency, 'urgency');
  const frequency = ensureNumber(input.frequency, 'frequency');
  const hesitancy = ensureNumber(input.hesitancy, 'hesitancy');
  const incomplete_emptying = ensureNumber(input.incomplete_emptying, 'incomplete_emptying');
  const nocturia = ensureNumber(input.nocturia, 'nocturia');
  const weak_stream = ensureNumber(input.weak_stream, 'weak_stream');
  const straining = ensureNumber(input.straining, 'straining');
  const intermittency = ensureNumber(input.intermittency, 'intermittency');
  const total = urgency + frequency + hesitancy + incomplete_emptying + nocturia + weak_stream + straining + intermittency;
  let severity;
  if (total <= 7) { severity = 'mild'; }
  else if (total <= 19) { severity = 'moderate'; }
  else { severity = 'severe'; }
  const therapy = severity === 'mild' ? 'watchful_waiting_behavioral' : severity === 'moderate' ? 'alpha_blocker_5_ari' : 'alpha_blocker_5_ari_surgery_consider';
  return { urgency, frequency, hesitancy, incomplete_emptying, nocturia, weak_stream, straining, intermittency, total, severity, therapy, citations:['aua_bph'] };
}

function psa(input) {
  ensureObj(input, 'input');
  const psa_value = ensureNumber(input.psa_value, 'psa_value');
  const age = ensureNumber(input.age, 'age');
  const previous_psa = ensureNumber(input.previous_psa || psa_value, 'previous_psa');
  const finasteride = !!input.finasteride;
  const velocity = psa_value - previous_psa;
  let action;
  if (age >= 70 && psa_value < 6) { action = 'surveillance_only'; }
  else if (psa_value >= 10) { action = 'referral_biopsy'; }
  else if (psa_value >= 4) { action = 'shared_decision_repeat_4wk'; }
  else if (velocity >= 0.35) { action = 'shared_decision_repeat_4wk'; }
  else { action = 'annual_screening'; }
  const adjusted = finasteride ? psa_value * 2 : psa_value;
  return { psa_value, age, previous_psa, velocity, finasteride, adjusted_psa: adjusted, action };
}

module.exports = { ipss, psa, CITATIONS, ValidationError };
