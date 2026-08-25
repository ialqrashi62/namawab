'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aua_uro: 'AUA Stress Urinary Incontinence 2017', aua_ics: 'AUA Interstitial Cystitis 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function stressIncontinence(input) {
  ensureObj(input, 'input');
  const leakage_with_cough = !!input.leakage_with_cough;
  const leakage_with_urgency = !!input.leakage_with_urgency;
  const leakage_constantly = !!input.leakage_constantly;
  const prior_hysterectomy = !!input.prior_hysterectomy;
  const pregnancy = !!input.pregnancy;
  if (leakage_with_cough && !leakage_with_urgency && !leakage_constantly) { return { leakage_with_cough, leakage_with_urgency, leakage_constantly, prior_hysterectomy, pregnancy, type: 'stress_dominant', therapy: 'pelvic_floor_physio_pessary_mid_urethral_sling', citations:['aua_uro'] }; }
  if (leakage_with_urgency && !leakage_with_cough) { return { leakage_with_cough, leakage_with_urgency, leakage_constantly, prior_hysterectomy, pregnancy, type: 'urgency_dominant', therapy: 'behavioral_antimuscarinic_beta3_agonist' }; }
  if (leakage_constantly) { return { leakage_with_cough, leakage_with_urgency, leakage_constantly, prior_hysterectomy, pregnancy, type: 'overflow_or_fistula', therapy: 'workup_post_void_residual_urodynamics' }; }
  return { leakage_with_cough, leakage_with_urgency, leakage_constantly, prior_hysterectomy, pregnancy, type: 'mixed', therapy: 'pelvic_floor_physio_dual_therapy' };
}

function interstitialCystitis(input) {
  ensureObj(input, 'input');
  const pelvic_pain = !!input.pelvic_pain;
  const bladder_urgency = !!input.bladder_urgency;
  const frequency = ensureNumber(input.frequency, 'frequency');
  const nocturia = ensureNumber(input.nocturia, 'nocturia');
  const hunner_ulcer = !!input.hunner_ulcer;
  const chronic = !!input.chronic;
  if (chronic && pelvic_pain && (frequency > 8 || nocturia > 2)) { return { pelvic_pain, bladder_urgency, frequency, nocturia, hunner_ulcer, chronic, diagnosis: 'likely_interstitial_cystitis', therapy: 'behavioral_pentosan_elmiron_dietary', citations:['aua_ics'] }; }
  return { pelvic_pain, bladder_urgency, frequency, nocturia, hunner_ulcer, chronic, diagnosis: 'unclear_consider_other_pelvic_pain', therapy: 'workup_other_etiologies' };
}

module.exports = { stressIncontinence, interstitialCystitis, CITATIONS, ValidationError };
