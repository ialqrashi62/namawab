'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { cci: 'Charlson Comorbidity Index 1987', elixhauser: 'Elixhauser Comorbidity 1998' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function charlson(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const mi = !!input.mi;
  const chf = !!input.chf;
  const cva = !!input.cva;
  const dm_uncomplicated = !!input.dm_uncomplicated;
  const dm_endorgan = !!input.dm_endorgan;
  const copd = !!input.copd;
  const ckd = !!input.ckd;
  const liver_mild = !!input.liver_mild;
  const liver_severe = !!input.liver_severe;
  const peptic_ulcer = !!input.peptic_ulcer;
  const cancer_local = !!input.cancer_local;
  const cancer_metastatic = !!input.cancer_metastatic;
  const hiv = !!input.hiv;
  let score = 0;
  if (mi) { score += 1; }
  if (chf) { score += 1; }
  if (cva) { score += 1; }
  if (dm_uncomplicated) { score += 1; }
  if (dm_endorgan) { score += 2; }
  if (copd) { score += 1; }
  if (ckd) { score += 2; }
  if (liver_mild) { score += 1; }
  if (liver_severe) { score += 3; }
  if (peptic_ulcer) { score += 1; }
  if (cancer_local) { score += 2; }
  if (cancer_metastatic) { score += 6; }
  if (hiv) { score += 6; }
  if (age >= 50) { score += Math.floor((age - 50) / 10) + 1; }
  let mortality;
  if (score >= 8) { mortality = 'high_estimated_77_95_per_year'; }
  else if (score >= 5) { mortality = 'moderate_estimated_26_52_per_year'; }
  else if (score >= 3) { mortality = 'low_estimated_8_12_per_year'; }
  else { mortality = 'minimal_estimated_1_2_per_year'; }
  return { age, mi, chf, cva, dm_uncomplicated, dm_endorgan, copd, ckd, liver_mild, liver_severe, peptic_ulcer, cancer_local, cancer_metastatic, hiv, score, mortality, citations:['cci'] };
}

function polypharmacy(input) {
  ensureObj(input, 'input');
  const medication_count = ensureNumber(input.medication_count, 'medication_count');
  const high_risk_meds = ensureNumber(input.high_risk_meds, 'high_risk_meds');
  const anticholinergic_count = ensureNumber(input.anticholinergic_count, 'anticholinergic_count');
  let risk;
  if (medication_count >= 10 || high_risk_meds >= 3) { risk = 'high_polypharmacy_med_review'; }
  else if (medication_count >= 5 || anticholinergic_count >= 2) { risk = 'moderate_review'; }
  else { risk = 'minimal'; }
  return { medication_count, high_risk_meds, anticholinergic_count, risk };
}

module.exports = { charlson, polypharmacy, CITATIONS, ValidationError };
