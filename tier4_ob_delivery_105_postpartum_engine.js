'use strict';
// TIER4_OB_DELIVERY-105 Postpartum Hemorrhage
const CITATIONS = ['ACOG_PPH_Practice_Bulletin','WHO_PPH_2012'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function postpartumHemorrhageSeverity(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const blood_loss_ml = ensureNumber(input.blood_loss_ml, 'blood_loss_ml');
  const uterine_atony = !!input.uterine_atony;
  const trauma = !!input.trauma;
  let severity = 'mild';
  if (blood_loss_ml >= 1500 || (uterine_atony && blood_loss_ml >= 1000)) severity = 'severe';
  else if (blood_loss_ml >= 1000) severity = 'moderate';
  const cause = uterine_atony ? 'atony' : trauma ? 'trauma' : 'other';
  return { blood_loss_ml, uterine_atony, trauma, cause, severity, citations: CITATIONS };
}

function pphManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const severity = input.severity || 'mild';
  let interventions = ['uterine_massage','iv_access_2_large_bore','fluid_resuscitation'];
  if (severity !== 'mild') interventions.push('uterotonic_oxytocin_40iu_in_1l_ns','methylergometrine_or_carbetocin','tranexamic_acid_1g_iv_within_3h');
  if (severity === 'severe') {
    interventions.push('bimanual_compression','intrauterine_balloon_tamponade','prepare_or');
    if (interventions.indexOf('prepare_or') >= 0) interventions.push('b_lynch_suture_or_hysterectomy_if_refractory');
  }
  return { severity, interventions, citations: CITATIONS };
}

module.exports = { postpartumHemorrhageSeverity, pphManagement, CITATIONS, ValidationError };