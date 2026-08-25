'use strict';
// TIER4_RAD_EXT-104 Imaging Appropriateness
const CITATIONS = ['ACR_Appropriateness','CHOosing_Wisely'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function imagingForHeadache(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const red_flags = !!input.red_flags;
  const chronic_pattern = !!input.chronic_pattern;
  let recommendation = 'no_imaging_primary_headache';
  if (red_flags) recommendation = 'ct_head_then_mri_for_subarachnoid_thrombosis_or_tumor';
  else if (chronic_pattern) recommendation = 'mri_brain_if_pattern_change_or_daily_per_4_weeks';
  return { red_flags, chronic_pattern, recommendation, citations: CITATIONS };
}

function imagingForLowBackPain(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const red_flags = !!input.red_flags;
  const duration_weeks = input.duration_weeks || 0;
  let recommendation = 'no_imaging_first_6_weeks_unless_red_flags';
  if (red_flags) recommendation = 'mri_lumbar_with_contrast_for_cauda_equina_or_infection_or_fracture';
  else if (duration_weeks >= 12) recommendation = 'mri_lumbar_if_considering_intervention';
  return { red_flags, duration_weeks, recommendation, citations: CITATIONS };
}

module.exports = { imagingForHeadache, imagingForLowBackPain, CITATIONS, ValidationError };