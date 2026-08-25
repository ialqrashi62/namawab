'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { cdc_opioid: 'CDC Guideline for Prescribing Opioids 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function postopPain(input) {
  ensureObj(input, 'input');
  const pain_nrs = ensureNumber(input.pain_nrs, 'pain_nrs');
  const surgery_type = ensureEnum(input.surgery_type, ['minor','major','thoracic','abdominal','orthopedic','neuro'], 'surgery_type');
  const opioid_naive = !!input.opioid_naive;
  const renal_failure = !!input.renal_failure;
  let recommendation;
  if (pain_nrs >= 7) { recommendation = 'multimodal_strong_opioid'; }
  else if (pain_nrs >= 4) { recommendation = 'multimodal_mild_opioid'; }
  else { recommendation = 'multimodal_non_opioid'; }
  const opioid_choice = renal_failure ? 'fentanyl_or_hydromorphone' : 'morphine_or_oxycodone';
  return { pain_nrs, surgery_type, opioid_naive, renal_failure, recommendation, opioid_choice };
}

function chronicOpioid(input) {
  ensureObj(input, 'input');
  const daily_mme = ensureNumber(input.daily_mme, 'daily_mme');
  const benzos_concurrent = !!input.benzos_concurrent;
  const naloxone_prescribed = !!input.naloxone_prescribed;
  const pdmp_checked = !!input.pdmp_checked;
  const plan = { naloxone: naloxone_prescribed ? 'continue' : 'consider_prescribing', pdmp: pdmp_checked ? 'yes' : 'no_consider_check', benzo: benzos_concurrent ? 'avoid_concurrent' : 'safe' };
  let risk_score = 0;
  if (daily_mme >= 50) { risk_score += 2; }
  if (benzos_concurrent) { risk_score += 2; }
  if (!pdmp_checked) { risk_score += 1; }
  if (!naloxone_prescribed) { risk_score += 1; }
  const risk = risk_score >= 4 ? 'high' : risk_score >= 2 ? 'moderate' : 'low';
  return { daily_mme, benzos_concurrent, naloxone_prescribed, pdmp_checked, plan, risk_score, risk, citations:['cdc_opioid'] };
}

module.exports = { postopPain, chronicOpioid, CITATIONS, ValidationError };
