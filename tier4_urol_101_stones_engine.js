'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { eau: 'European Association of Urology Guidelines Urolithiasis 2020', aua: 'American Urological Association Surgical Management of Stones 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function kidneyStoneSize(input) {
  ensureObj(input, 'input');
  const size_mm = ensureNumber(input.size_mm, 'size_mm');
  const location = ensureEnum(input.location, ['renal_calyx','renal_pelvis','proximal_ureter','mid_ureter','distal_ureter','bladder'], 'location');
  const hounsfield = ensureNumber(input.hounsfield, 'hounsfield');
  const composition_guess = hounsfield >= 1000 ? 'calcium_oxalate' : hounsfield >= 600 ? 'calcium_phosphate' : hounsfield >= 200 ? 'struvite' : 'uric_acid';
  let intervention;
  if (location === 'renal_calyx' || location === 'renal_pelvis') {
    if (size_mm < 5) { intervention = 'observation'; }
    else if (size_mm < 20) { intervention = 'eswl'; }
    else { intervention = 'pcnl'; }
  } else if (location === 'distal_ureter') {
    if (size_mm < 5) { intervention = 'observation_medical_expulsion'; }
    else if (size_mm < 10) { intervention = 'medical_expulsion_alphablocker'; }
    else { intervention = 'ureteroscopy'; }
  } else {
    if (size_mm < 5) { intervention = 'observation'; }
    else if (size_mm < 15) { intervention = 'eswl_or_ureteroscopy'; }
    else { intervention = 'ureteroscopy_or_pcnl'; }
  }
  return { size_mm, location, hounsfield, composition_guess, intervention, citations:['eau','aua'] };
}

function uti(input) {
  ensureObj(input, 'input');
  const dysuria = !!input.dysuria;
  const frequency = !!input.frequency;
  const flank_pain = !!input.flank_pain;
  const fever = !!input.fever;
  const pregnancy = !!input.pregnancy;
  const catheter = !!input.catheter;
  let diagnosis;
  if (fever && flank_pain) { diagnosis = 'pyelonephritis'; }
  else if (dysuria && frequency && !flank_pain && !fever) { diagnosis = 'cystitis'; }
  else if (dysuria && pregnancy) { diagnosis = 'asymptomatic_bacteriuria_pregnancy'; }
  else if (catheter && (fever || dysuria)) { diagnosis = 'catheter_associated_uti'; }
  else { diagnosis = 'uncomplicated_uti_or_other'; }
  const therapy = diagnosis === 'pyelonephritis' ? 'ciprofloxacin_or_ceftriaxone_iv_to_oral' : 'nitrofurantoin_or_trimethoprim';
  return { dysuria, frequency, flank_pain, fever, pregnancy, catheter, diagnosis, therapy };
}

module.exports = { kidneyStoneSize, uti, CITATIONS, ValidationError };
