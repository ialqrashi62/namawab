'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  fleischner: 'MacMahon H, et al. Guidelines for Management of Incidental Pulmonary Nodules. Radiology 2017',
  bts: 'British Thoracic Society. Guidelines on the Investigation and Management of Pulmonary Nodules. Thorax 2015'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function pulmonaryNodule(input) {
  ensureObj(input, 'input');
  const size_mm = ensureNumber(input.size_mm, 'size_mm');
  const attenuation = ensureEnum(input.attenuation, ['solid','part_solid','ground_glass'], 'attenuation');
  const age = ensureNumber(input.age, 'age');
  const risk = ensureEnum(input.risk, ['low','intermediate','high'], 'risk');
  const smoker = !!input.smoker;
  let followup;
  if (size_mm < 6) { followup = 'no_routine_followup'; }
  else if (size_mm < 8) { followup = attenuation === 'solid' ? 'optional_12_24mo' : 'ct_3_24mo'; }
  else if (size_mm < 30) { followup = (attenuation==='solid' && risk==='low') ? 'ct_6_12_18_24mo' : 'ct_3_6_12_24mo_pet'; }
  else { followup = 'pet_ct_tissue_biopsy'; }
  const surveillance = age > 75 || (age > 65 && smoker) ? 'consider_3_yr_cap' : 'standard';
  return { size_mm, attenuation, age, risk, smoker, followup, surveillance, citations:['fleischner'] };
}

function pecRule(input) {
  ensureObj(input, 'input');
  const hemodynamically_stable = !!input.hemodynamically_stable;
  const rv_dysfunction = !!input.rv_dysfunction;
  const troponin = !!input.troponin_elevated;
  const bnpep = !!input.bnp_elevated;
  let risk;
  if (!hemodynamically_stable) { risk = 'massive_pe_high_risk'; }
  else if (rv_dysfunction && (troponin || bnpep)) { risk = 'intermediate_high'; }
  else if (rv_dysfunction || troponin || bnpep) { risk = 'intermediate_low'; }
  else { risk = 'low_risk'; }
  const therapy = risk === 'low_risk' ? 'early_discharge_ anticoagulation' : risk === 'intermediate_low' ? 'admit_anticoagulation_close_monitor' : 'consider_thrombolysis_advanced_therapy';
  return { hemodynamically_stable, rv_dysfunction, troponin, bnpep, risk, therapy };
}

module.exports = { pulmonaryNodule, pecRule, CITATIONS, ValidationError };
