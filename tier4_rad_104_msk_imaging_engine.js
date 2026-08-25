'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  acr_msk: 'American College of Radiology. ACR Appropriateness Criteria MSK 2019',
  ottawa: 'Stiell IG, Wells GA. Ottawa Ankle Rules 1993'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function ottpawa(input) {
  ensureObj(input, 'input');
  const location = ensureEnum(input.location, ['ankle','foot','knee'], 'location');
  const bone_tenderness_posterior_medial = !!input.bone_tenderness_posterior_medial;
  const bone_tenderness_posterior_lateral = !!input.bone_tenderness_posterior_lateral;
  const bone_tenderness_base_5th_metatarsal = !!input.bone_tenderness_base_5th_metatarsal;
  const bone_tenderness_navicular = !!input.bone_tenderness_navicular;
  const unable_to_bear_weight = !!input.unable_to_bear_weight;
  let imaging;
  if (location === 'ankle') {
    if (bone_tenderness_posterior_medial || bone_tenderness_posterior_lateral || unable_to_bear_weight) { imaging = 'xray_required'; }
    else { imaging = 'no_xray'; }
  } else if (location === 'foot') {
    if (bone_tenderness_base_5th_metatarsal || bone_tenderness_navicular || unable_to_bear_weight) { imaging = 'xray_required'; }
    else { imaging = 'no_xray'; }
  } else {
    imaging = 'knee_not_ottawa_use_pittsburgh';
  }
  return { location, imaging, citations:['ottawa'] };
}

function rotatorCuff(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const trauma = !!input.trauma;
  const painful_arc = !!input.painful_arc;
  const drop_arm = !!input.drop_arm;
  const weakness_external_rotation = !!input.weakness_external_rotation;
  let us_mri;
  if (trauma && age >= 60) { us_mri = 'MRI_recommended'; }
  else if (drop_arm || weakness_external_rotation) { us_mri = 'MRI_recommended'; }
  else if (painful_arc && age >= 60) { us_mri = 'US_first_line'; }
  else { us_mri = 'no_imaging_consider_physio'; }
  return { age, trauma, painful_arc, drop_arm, weakness_external_rotation, us_mri };
}

module.exports = { ottpawa, rotatorCuff, CITATIONS, ValidationError };
