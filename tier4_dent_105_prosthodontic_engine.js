'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ada_pros: 'Glossary of Dental Terms 2020 - Prosthodontics' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function crown(input) {
  ensureObj(input, 'input');
  const tooth_type = ensureEnum(input.tooth_type, ['incisor','canine','premolar','molar'], 'tooth_type');
  const extent = ensureEnum(input.extent, ['inlay','onlay','three_quarter','full'], 'extent');
  const material = ensureEnum(input.material, ['gold','porcelain_fused_metal','all_ceramic','zirconia','composite'], 'material');
  const occlusion = ensureEnum(input.occlusion, ['normal','bruxism','heavy'], 'occlusion');
  let recommendation;
  if (occlusion === 'bruxism' || occlusion === 'heavy') { recommendation = 'gold_or_zirconia_high_strength'; }
  else if (tooth_type === 'incisor' || tooth_type === 'canine') { recommendation = 'all_ceramic_or_zirconia_aesthetic'; }
  else if (extent === 'inlay' || extent === 'onlay') { recommendation = 'composite_or_ceramic'; }
  else { recommendation = 'porcelain_fused_metal_or_zirconia'; }
  return { tooth_type, extent, material, occlusion, recommendation };
}

function edentulousSpace(input) {
  ensureObj(input, 'input');
  const edentulous_length = ensureNumber(input.edentulous_length, 'edentulous_length');
  const location = ensureEnum(input.location, ['anterior_max','anterior_mand','posterior_max','posterior_mand','cross_arch'], 'location');
  const adjacent_teeth_health = ensureEnum(input.adjacent_teeth_health, ['sound','restored','compromised','missing'], 'adjacent_teeth_health');
  const bone_quality = ensureEnum(input.bone_quality, ['adequate','compromised','insufficient'], 'bone_quality');
  let option;
  if (edentulous_length > 2 || bone_quality !== 'adequate') { option = 'implant_fixed_or_removable'; }
  else if (adjacent_teeth_health === 'missing') { option = 'removable_partial_denture'; }
  else { option = 'fixed_partial_denture'; }
  return { edentulous_length, location, adjacent_teeth_health, bone_quality, option };
}

module.exports = { crown, edentulousSpace, CITATIONS, ValidationError };
