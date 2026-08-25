'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asa: 'ASA Physical Status Classification 2014' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function asaClass(input) {
  ensureObj(input, 'input');
  const dm = !!input.dm;
  const smoker = !!input.smoker;
  const bmi = ensureNumber(input.bmi, 'bmi');
  const mi_history = !!input.mi_history;
  const chronic_renal = !!input.chronic_renal;
  const morbid_obesity = !!input.morbid_obesity;
  const severe_sepsis = !!input.severe_sepsis;
  const moribund = !!input.moribund;
  const brain_dead = !!input.brain_dead;
  let asa;
  if (brain_dead) { asa = 'vi_brain_dead_organ_donor'; }
  else if (moribund) { asa = 'v_moribund'; }
  else if (severe_sepsis) { asa = 'iv_severe_systemic_disease'; }
  else if (mi_history || chronic_renal || morbid_obesity) { asa = 'iii_severe_systemic'; }
  else if (smoker || bmi >= 30 || dm) { asa = 'ii_mild_systemic'; }
  else { asa = 'i_normal_healthy'; }
  return { dm, smoker, bmi, mi_history, chronic_renal, morbid_obesity, severe_sepsis, moribund, brain_dead, asa, citations:['asa'] };
}

function preoperativeOptimization(input) {
  ensureObj(input, 'input');
  const asa = ensureEnum(input.asa, ['i','ii','iii','iv','v'], 'asa');
  const surgery_type = ensureEnum(input.surgery_type, ['minor','intermediate','major','emergency'], 'surgery_type');
  let fasting_clear;
  if (surgery_type === 'emergency') { fasting_clear = 'rsi_no_fasting_wait'; }
  else { fasting_clear = 'standard_2_4_6_rule'; }
  const lab_minimal = (asa === 'i' || asa === 'ii') && surgery_type === 'minor' ? 'no_routine_labs' : 'cbc_bmp_coags_consider_type_cross';
  return { asa, surgery_type, fasting_clear, lab_minimal };
}

module.exports = { asaClass, preoperativeOptimization, CITATIONS, ValidationError };
