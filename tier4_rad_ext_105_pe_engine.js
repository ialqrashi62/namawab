'use strict';
// TIER4_RAD_EXT-105 PE Workup
const CITATIONS = ['ESC_PE_2019','PIOPED'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function wellsScorePE(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const clinical_signs_dvt = !!input.clinical_signs_dvt;
  const pe_likely = !!input.pe_likely;
  const hr_over_100 = !!input.hr_over_100;
  const immobilization_3days = !!input.immobilization_3days;
  const previous_pe_dvt = !!input.previous_pe_dvt;
  const hemoptysis = !!input.hemoptysis;
  const malignancy = !!input.malignancy;
  let score = 0;
  if (clinical_signs_dvt) score += 3;
  if (pe_likely) score += 3;
  if (hr_over_100) score += 1.5;
  if (immobilization_3days) score += 1.5;
  if (previous_pe_dvt) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;
  let category = 'low';
  if (score > 6) category = 'high';
  else if (score >= 2) category = 'moderate';
  return { score, category, citations: CITATIONS };
}

function peImagingStrategy(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const wells_category = input.wells_category || 'low';
  const ddimer = input.ddimer || 0;
  const pregnancy = !!input.pregnancy;
  const contrast_allergy = !!input.contrast_allergy;
  let strategy = 'no_imaging_unlikely_PE';
  if (wells_category === 'high') strategy = 'ctpa_directly';
  else if (wells_category === 'moderate' && ddimer < 500) strategy = 'no_imaging';
  else if (wells_category === 'moderate' && ddimer >= 500) strategy = 'ctpa';
  if (pregnancy) strategy = 'v_q_scan_if_xray_normal_or_ctpa_with_reduced_dose';
  if (contrast_allergy) strategy = 'v_q_scan';
  return { wells_category, ddimer, pregnancy, contrast_allergy, strategy, citations: CITATIONS };
}

module.exports = { wellsScorePE, peImagingStrategy, CITATIONS, ValidationError };