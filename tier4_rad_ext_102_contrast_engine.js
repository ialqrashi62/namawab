'use strict';
// TIER4_RAD_EXT-102 Contrast
const CITATIONS = ['ACR_Contrast_Medium','KDIGO_CIN'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function contrastNephropathyRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const egfr = ensureNumber(input.egfr, 'egfr');
  const diabetes = !!input.diabetes;
  const dehydration = !!input.dehydration;
  const nephrotoxic_drugs = !!input.nephrotoxic_drugs;
  let risk = 'low';
  if (egfr < 30) risk = 'high';
  else if (egfr < 60 || (diabetes && dehydration)) risk = 'moderate';
  const prophylaxis = (egfr < 30 || (diabetes && egfr < 60)) ? 'iv_hydration_pre_and_post_contrast_hold_nephrotoxic_drugs' : 'ensure_adequate_hydration';
  return { egfr, diabetes, dehydration, nephrotoxic_drugs, risk, prophylaxis, citations: CITATIONS };
}

function contrastReactionManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const reaction_type = ensureEnum(input.reaction_type || 'mild', ['mild','moderate','severe','anaphylactoid'], 'reaction_type');
  const prior_reaction = !!input.prior_reaction;
  let treatment = 'observation_only';
  if (reaction_type === 'mild') treatment = 'diphenhydramine_observation';
  if (reaction_type === 'moderate') treatment = 'diphenhydramine_iv_steroids_admit_if_dyspnea';
  if (reaction_type === 'severe') treatment = 'epinephrine_im_fluids_oxygen_intubation_if_needed';
  if (reaction_type === 'anaphylactoid') treatment = 'epinephrine_im_iv_steroids_observation_min_4_6h';
  const premedication = prior_reaction ? 'prednisone_50mg_q6h_3_doses_plus_diphenhydramine' : 'none';
  return { reaction_type, prior_reaction, treatment, premedication, citations: CITATIONS };
}

module.exports = { contrastNephropathyRisk, contrastReactionManagement, CITATIONS, ValidationError };