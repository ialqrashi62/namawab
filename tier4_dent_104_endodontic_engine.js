'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aae: 'American Association of Endodontists Guidelines 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function rootCanalComplexity(input) {
  ensureObj(input, 'input');
  const tooth_type = ensureEnum(input.tooth_type, ['incisor','canine','premolar','molar','second_molar','third_molar'], 'tooth_type');
  const curvature = ensureNumber(input.curvature, 'curvature');
  const calcification = ensureEnum(input.calcification, ['none','mild','moderate','severe'], 'calcification');
  const previous_treatment = !!input.previous_treatment;
  let complexity;
  if (tooth_type === 'third_molar' || curvature > 25 || calcification === 'severe') { complexity = 'high_complexity_specialist'; }
  else if (previous_treatment || calcification === 'moderate' || curvature > 15) { complexity = 'moderate_complexity'; }
  else { complexity = 'low_complexity'; }
  return { tooth_type, curvature, calcification, previous_treatment, complexity, citations:['aae'] };
}

function periapicalDiagnosis(input) {
  ensureObj(input, 'input');
  const pain = ensureEnum(input.pain, ['none','spontaneous','mastication','heat','cold'], 'pain');
  const radiolucency = !!input.radiolucency;
  const size_mm = ensureNumber(input.size_mm, 'size_mm');
  const swelling = !!input.swelling;
  let diagnosis;
  if (swelling && pain === 'mastication') { diagnosis = 'acute_apical_abscess'; }
  else if (radiolucency && size_mm > 5) { diagnosis = 'chronic_apical_periodontitis'; }
  else if (pain === 'spontaneous') { diagnosis = 'acute_apical_periodontitis'; }
  else if (radiolucency) { diagnosis = 'asymptomatic_apical_periodontitis'; }
  else { diagnosis = 'normal_periapex'; }
  return { pain, radiolucency, size_mm, swelling, diagnosis };
}

module.exports = { rootCanalComplexity, periapicalDiagnosis, CITATIONS, ValidationError };
