'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  image_gently: 'Image Gently Alliance Pediatric Imaging Guidelines 2018',
  alara: 'International Commission on Radiological Protection. ALARA principles'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function pediatricDose(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const modality = ensureEnum(input.modality, ['ct_head','ct_chest','ct_abdomen','xray_chest','xray_abdomen'], 'modality');
  const base_dose = { ct_head: 30, ct_chest: 25, ct_abdomen: 30, xray_chest: 0.1, xray_abdomen: 0.5 }[modality];
  const pediatric_factor = age < 2 ? 0.5 : age < 6 ? 0.65 : age < 12 ? 0.8 : 1.0;
  const weight_factor = weight_kg < 15 ? 0.5 : weight_kg < 30 ? 0.75 : weight_kg < 50 ? 0.9 : 1.0;
  const adjusted = Math.round(base_dose * pediatric_factor * weight_factor * 10) / 10;
  return { age, weight_kg, modality, base_dose, pediatric_factor, weight_factor, adjusted_dose_mgy: adjusted, citations:['image_gently'] };
}

function pediatricAppendicitis(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const ultrasound_first = age < 14 ? 'ultrasound_first' : 'ct_or_ultrasound';
  const white_blood = ensureNumber(input.wbc, 'wbc');
  const alvarado = ensureNumber(input.alvarado || 0, 'alvarado');
  let imaging;
  if (alvarado >= 7) { imaging = ultrasound_first === 'ultrasound_first' ? 'US_then_MRI_if_equivocal' : 'CT_consider'; }
  else if (alvarado >= 4) { imaging = 'US_first'; }
  else { imaging = 'no_imaging_observation'; }
  return { age, ultrasound_first, wbc: white_blood, alvarado, imaging };
}

module.exports = { pediatricDose, pediatricAppendicitis, CITATIONS, ValidationError };
