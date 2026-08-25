'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aaortho: 'American Association of Orthodontists 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function malocclusion(input) {
  ensureObj(input, 'input');
  const angle_class = ensureEnum(input.angle_class, ['class_i_normal','class_ii_div_1','class_ii_div_2','class_iii'], 'angle_class');
  const overjet_mm = ensureNumber(input.overjet_mm, 'overjet_mm');
  const overbite_mm = ensureNumber(input.overbite_mm, 'overbite_mm');
  const crossbite = !!input.crossbite;
  const crowding_mm = ensureNumber(input.crowding_mm, 'crowding_mm');
  let complexity;
  if (angle_class === 'class_iii' || overjet_mm > 8 || overbite_mm > 7) { complexity = 'severe_surgical_ortho'; }
  else if (angle_class === 'class_ii_div_1' || crossbite || crowding_mm > 6) { complexity = 'moderate_comprehensive_ortho'; }
  else if (angle_class === 'class_ii_div_2' || crowding_mm > 3) { complexity = 'moderate_limited_ortho'; }
  else { complexity = 'mild_or_routine'; }
  return { angle_class, overjet_mm, overbite_mm, crossbite, crowding_mm, complexity, citations:['aaortho'] };
}

function growthGuidance(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const cvms = ensureEnum(input.cvms, ['i','ii','iii','iv','v','vi'], 'cvms');
  const skeletal_class = ensureEnum(input.skeletal_class, ['i','ii','iii'], 'skeletal_class');
  let intervention;
  if (age > 14 && skeletal_class === 'ii') { intervention = 'camouflage_or_surgery'; }
  else if (age >= 10 && skeletal_class === 'ii' && (cvms === 'ii' || cvms === 'iii')) { intervention = 'functional_appliance_headgear'; }
  else if (age < 10 && skeletal_class === 'iii') { intervention = 'face_mask_or_chincup'; }
  else if (age >= 10 && skeletal_class === 'iii' && cvms === 'iv') { intervention = 'orthognathic_surgery_after_growth'; }
  else { intervention = 'observation_or_routine_ortho'; }
  return { age, cvms, skeletal_class, intervention };
}

module.exports = { malocclusion, growthGuidance, CITATIONS, ValidationError };
