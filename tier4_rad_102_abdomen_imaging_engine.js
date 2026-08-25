'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  acr: 'American College of Radiology Appropriateness Criteria 2020',
  li_rads: 'LI-RADS v2017 CT/MRI Diagnostic Algorithm'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function liverLesion(input) {
  ensureObj(input, 'input');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const cirrhotic = !!input.cirrhotic;
  const arterial_enhance = !!input.arterial_enhance;
  const washout = !!input.washout;
  const threshold_growth = !!input.threshold_growth;
  let li_rads;
  if (!cirrhotic) { li_rads = 'not_applicable'; }
  else if (size_cm < 1) { li_rads = 'LR_3'; }
  else if (arterial_enhance && washout && threshold_growth) { li_rads = 'LR_5_definite_HCC'; }
  else if (arterial_enhance && washout) { li_rads = 'LR_4_probable_HCC'; }
  else if (size_cm >= 2 && arterial_enhance) { li_rads = 'LR_4'; }
  else { li_rads = 'LR_3'; }
  const recommend = li_rads === 'LR_5_definite_HCC' ? 'multidisciplinary_tumor_board' : li_rads === 'LR_4_probable_HCC' ? 'biopsy_or_imaging_short_interval' : 'imaging_surveillance_3_6mo';
  return { size_cm, cirrhotic, arterial_enhance, washout, threshold_growth, li_rads, recommend, citations:['li_rads'] };
}

function pancreaticCyst(input) {
  ensureObj(input, 'input');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const main_duct_mm = ensureNumber(input.main_duct_mm, 'main_duct_mm');
  const mural_nodule = !!input.mural_nodule;
  const high_risk_stigmata = !!input.high_risk_stigmata;
  let worrisome;
  if (main_duct_mm >= 10 || high_risk_stigmata) { worrisome = 'high_risk_stigmata_EUS_surgery'; }
  else if (main_duct_mm >= 5 || size_cm >= 3 || mural_nodule) { worrisome = 'worrisome_EUS'; }
  else if (size_cm < 1) { worrisome = 'no_surveillance'; }
  else { worrisome = 'surveillance_2yr'; }
  return { size_cm, main_duct_mm, mural_nodule, high_risk_stigmata, worrisome };
}

module.exports = { liverLesion, pancreaticCyst, CITATIONS, ValidationError };
