'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  asnr: 'American Society of Neuroradiology. Stroke Imaging Guidelines 2020',
  nice: 'National Institute for Health and Care Excellence. Stroke and TIA 2019'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function strokeImaging(input) {
  ensureObj(input, 'input');
  const nihss = ensureNumber(input.nihss, 'nihss');
  const last_known_well_hr = ensureNumber(input.last_known_well_hr, 'last_known_well_hr');
  const ct_hyperdense = !!input.ct_hyperdense;
  const perfusion_mismatch = !!input.perfusion_mismatch;
  const hemorrhage = !!input.hemorrhage;
  let therapy;
  if (hemorrhage) { therapy = 'reverse_anticoagulation BP_control'; }
  else if (last_known_well_hr <= 4.5 && nihss >= 6) { therapy = 'IV_tPA_alteplase'; }
  else if (last_known_well_hr <= 6 && perfusion_mismatch) { therapy = 'mechanical_thrombectomy'; }
  else if (last_known_well_hr <= 24) { therapy = 'consider_thrombectomy_lvo'; }
  else { therapy = 'standard_secondary_prevention'; }
  const severity = nihss >= 16 ? 'major' : nihss >= 6 ? 'moderate' : 'minor';
  return { nihss, last_known_well_hr, ct_hyperdense, perfusion_mismatch, hemorrhage, severity, therapy, citations:['asnr'] };
}

function headTrauma(input) {
  ensureObj(input, 'input');
  const gcs = ensureNumber(input.gcs, 'gcs');
  const loss_of_consciousness = !!input.loss_of_consciousness;
  const vomiting = !!input.vomiting;
  const anticoagulation = !!input.anticoagulation;
  const age = ensureNumber(input.age, 'age');
  let rule_out;
  if (gcs < 15 && age >= 65) { rule_out = 'CT_head_required'; }
  else if (loss_of_consciousness && anticoagulation) { rule_out = 'CT_head_required'; }
  else if (gcs < 15 || vomiting || loss_of_consciousness || anticoagulation) { rule_out = 'consider_CT_head'; }
  else { rule_out = 'no_imaging_required'; }
  return { gcs, loss_of_consciousness, vomiting, anticoagulation, age, rule_out };
}

module.exports = { strokeImaging, headTrauma, CITATIONS, ValidationError };
