'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aapos: 'American Association for Pediatric Ophthalmology and Strabismus 2017', aao_amblyopia: 'AAO Preferred Practice Pattern Amblyopia 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function amblyopia(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const amblyogenic_factor = ensureEnum(input.amblyogenic_factor, ['none','anisometropia','strabismus','visual_deprivation','mixed'], 'amblyogenic_factor');
  const visual_acuity_severity = ensureEnum(input.visual_acuity_severity, ['mild','moderate','severe'], 'visual_acuity_severity');
  let therapy;
  if (amblyogenic_factor === 'none') { therapy = 'no_treatment'; }
  else if (age <= 7) { therapy = 'patching_2_6hr_per_day'; }
  else if (age <= 12) { therapy = 'patching_2hr_per_day'; }
  else { therapy = 'limited_patch_good_prognosis_low'; }
  return { age, amblyogenic_factor, visual_acuity_severity, therapy, citations:['aao_amblyopia'] };
}

function redReflex(input) {
  ensureObj(input, 'input');
  const red_reflex_present = !!input.red_reflex_present;
  const leukocoria = !!input.leukocoria;
  const blurry_corneal_reflex = !!input.blurry_corneal_reflex;
  if (leukocoria || !red_reflex_present) { return { red_reflex_present, leukocoria, blurry_corneal_reflex, action: 'urgent_ophthalmology_referral_r/o_retinoblastoma' }; }
  if (blurry_corneal_reflex) { return { red_reflex_present, leukocoria, blurry_corneal_reflex, action: 'referral_cataract' }; }
  return { red_reflex_present, leukocoria, blurry_corneal_reflex, action: 'normal_continue_routine_screening' };
}

module.exports = { amblyopia, redReflex, CITATIONS, ValidationError };
