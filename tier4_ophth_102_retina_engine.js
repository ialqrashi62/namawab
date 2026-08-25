'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aaoo: 'AAO Preferred Practice Pattern Diabetic Retinopathy 2019', aao_amd: 'AAO Age-related Macular Degeneration 2015' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function diabeticRetinopathy(input) {
  ensureObj(input, 'input');
  const hba1c = ensureNumber(input.hba1c, 'hba1c');
  const sd_oct_thickness = ensureNumber(input.sd_oct_thickness, 'sd_oct_thickness');
  const csme = !!input.csme;
  const ischemia = !!input.ischemia;
  const nephropathy = !!input.nephropathy;
  const grade = ensureEnum(input.grade, ['normal','mild_npd','moderate_npd','severe_npd','pdr'], 'grade');
  let therapy;
  if (grade === 'pdr' || csme || ischemia) { therapy = 'anti_vegf_or_prp_urgent_referral'; }
  else if (grade === 'severe_npd') { therapy = 'close_followup_anti_vegf'; }
  else if (grade === 'moderate_npd') { therapy = 'every_6_12mo'; }
  else { therapy = 'annual_screening'; }
  return { hba1c, sd_oct_thickness, csme, ischemia, nephropathy, grade, therapy, citations:['aaoo'] };
}

function amdAssessment(input) {
  ensureObj(input, 'input');
  const wet = !!input.wet;
  const central_metamorphopsia = !!input.central_metamorphopsia;
  const acuity = ensureNumber(input.acuity, 'acuity');
  let recommendation;
  if (wet) { recommendation = 'urgent_anti_vegf_within_1wk'; }
  else if (central_metamorphopsia) { recommendation = 'urgent_oct_refer_amd'; }
  else if (acuity < 20) { recommendation = 'oct_dry_amd'; }
  else { recommendation = 'areds2_supplements_monitoring'; }
  return { wet, central_metamorphopsia, acuity, recommendation, citations:['aao_amd'] };
}

module.exports = { diabeticRetinopathy, amdAssessment, CITATIONS, ValidationError };
