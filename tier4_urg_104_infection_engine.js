'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { idsa: 'Infectious Diseases Society of America 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function sepsisScreen(input) {
  ensureObj(input, 'input');
  const temperature = ensureNumber(input.temperature, 'temperature');
  const hr = ensureNumber(input.hr, 'hr');
  const rr = ensureNumber(input.rr, 'rr');
  const sbp = ensureNumber(input.sbp, 'sbp');
  const lactate = ensureNumber(input.lactate, 'lactate');
  const mental_status = ensureEnum(input.mental_status, ['alert','confused','lethargic','unresponsive'], 'mental_status');
  const sirs = (temperature > 38 || temperature < 36 ? 1 : 0) + (hr > 90 ? 1 : 0) + (rr > 20 ? 1 : 0);
  const qsofa = (sbp <= 100 ? 1 : 0) + (rr >= 22 ? 1 : 0) + (mental_status !== 'alert' ? 1 : 0);
  let risk;
  if (lactate >= 4 || qsofa >= 2 || mental_status === 'unresponsive') { risk = 'septic_shock_emergent'; }
  else if (qsofa >= 2 || sirs >= 2) { risk = 'likely_sepsis'; }
  else if (sirs >= 2) { risk = 'possible_sepsis'; }
  else { risk = 'low_risk_sepsis'; }
  return { temperature, hr, rr, sbp, lactate, mental_status, sirs, qsofa, risk, citations:['idsa'] };
}

function cellulitis(input) {
  ensureObj(input, 'input');
  const size_area_cm = ensureNumber(input.size_area_cm, 'size_area_cm');
  const systemic_signs = !!input.systemic_signs;
  const diabetic = !!input.diabetic;
  const purulence = !!input.purulence;
  const bsa_pct = ensureNumber(input.bsa_pct, 'bsa_pct');
  let therapy;
  if (systemic_signs || bsa_pct >= 5) { therapy = 'iv_antibiotics_hospitalization'; }
  else if (diabetic || purulence) { therapy = 'oral_antibiotics_culture_wound_care'; }
  else if (size_area_cm >= 5) { therapy = 'oral_antibiotics_observation'; }
  else { therapy = 'topical_antibiotics_wound_care'; }
  return { size_area_cm, systemic_signs, diabetic, purulence, bsa_pct, therapy };
}

module.exports = { sepsisScreen, cellulitis, CITATIONS, ValidationError };
