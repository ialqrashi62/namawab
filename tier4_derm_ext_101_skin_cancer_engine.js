'use strict';
// TIER4_DERM_EXT-101 Skin Cancer
const CITATIONS = ['AAD_Melanoma_Guidelines','NCCN_Skin_Cancer'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function melanomaCheck(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const asymmetry = !!input.asymmetry;
  const border_irregular = !!input.border_irregular;
  const color_variegation = !!input.color_variegation;
  const diameter_mm = input.diameter_mm;
  const evolution = !!input.evolution;
  let score = 0;
  if (asymmetry) score += 1;
  if (border_irregular) score += 1;
  if (color_variegation) score += 1;
  if (typeof diameter_mm === 'number' && diameter_mm >= 6) score += 1;
  if (evolution) score += 1;
  let suspicion = 'low';
  if (score >= 3) suspicion = 'high_suspicion_biopsy_refer';
  else if (score >= 2) suspicion = 'moderate_suspicion_monitor_with_dermatoscopy';
  return { asymmetry, border_irregular, color_variegation, diameter_mm, evolution, abcde_score: score, suspicion, citations: CITATIONS };
}

function nonmelanomaSkinCancerTreatment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const cancer_type = ensureEnum(input.cancer_type || 'bcc', ['bcc','scc','basal','squamous'], 'cancer_type');
  const location = ensureEnum(input.location || 'low_risk', ['low_risk','high_risk','face','acral','hands_feet'], 'location');
  const size_mm = input.size_mm || 0;
  let treatment = 'standard_excision_4mm_margins';
  if (location === 'face' || location === 'high_risk') treatment = 'Mohs_micrographic_surgery';
  if (cancer_type === 'scc' && (location === 'high_risk' || size_mm >= 20)) treatment = 'Mohs_micrographic_surgery';
  return { cancer_type, location, size_mm, treatment, citations: CITATIONS };
}

module.exports = { melanomaCheck, nonmelanomaSkinCancerTreatment, CITATIONS, ValidationError };