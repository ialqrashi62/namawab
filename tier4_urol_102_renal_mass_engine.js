'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aua_renal: 'American Urological Association Renal Mass 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function renalMass(input) {
  ensureObj(input, 'input');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const enhancement = ensureEnum(input.enhancement, ['none','mild_10_20_hu','moderate_20_40_hu','marked_gt_40_hu'], 'enhancement');
  const solid = !!input.solid;
  let nephrometry;
  if (size_cm < 4) { nephrometry = 'T1a_consider_partial_nephrectomy_active_surveillance'; }
  else if (size_cm < 7) { nephrometry = 'T1b_partial_or_radical_nephrectomy'; }
  else if (size_cm < 10) { nephrometry = 'T2a_radical_nephrectomy'; }
  else { nephrometry = 'T2b_radical_nephrectomy'; }
  const action = solid && enhancement === 'none' ? 'active_surveillance_biopsy' : solid ? 'tumor_board_multidisciplinary' : 'imaging_followup_cyst_bosniak';
  return { size_cm, enhancement, solid, nephrometry, action, citations:['aua_renal'] };
}

function hematuria(input) {
  ensureObj(input, 'input');
  const gross = !!input.gross;
  const microscopic = !!input.microscopic;
  const age = ensureNumber(input.age, 'age');
  const smoker = !!input.smoker;
  const irritative = !!input.irritative;
  const pain = !!input.pain;
  let workup;
  if (gross) { workup = 'cystoscopy_ct_urogram_urine_cytology'; }
  else if (microscopic && age >= 35 && (smoker || male)) { workup = 'cystoscopy_ct_urogram'; }
  else if (microscopic && age >= 35) { workup = 'shared_decision_imaging_renal_bladder'; }
  else if (microscopic && pain) { workup = 'stone_workup_ct_non_contrast'; }
  else if (microscopic && irritative) { workup = 'consider_uti_repeat_urinalysis'; }
  else { workup = 'repeat_urinalysis_risk_assessment'; }
  return { gross, microscopic, age, smoker, irritative, pain, workup };
}

module.exports = { renalMass, hematuria, CITATIONS, ValidationError };
