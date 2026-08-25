'use strict';
// TIER4_OB_DELIVERY-103 Labor Analgesia
const CITATIONS = ['ACOG_Labor_Analgesia','SOAP_Obstetric_Anesthesia'];
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

function epiduralEligibility(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const plat = ensureNumber(input.plat || 0, 'plat');
  const coagulopathy = !!input.coagulopathy;
  const infection_skin = !!input.infection_skin;
  const patient_consent = !!input.patient_consent;
  const severe_preeclampsia = !!input.severe_preeclampsia;
  let eligible = plat >= 80000 && !coagulopathy && !infection_skin && patient_consent;
  let warnings = [];
  if (severe_preeclampsia) warnings.push('epidural_helps_blood_pressure_control');
  if (plat < 100000) warnings.push('low_platelets_consult_anesthesia');
  return { plat, coagulopathy, infection_skin, patient_consent, severe_preeclampsia, eligible, warnings, citations: CITATIONS };
}

function nlbVsEpidural(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const stage = ensureEnum(input.stage || 'early', ['early','active','transition','second'], 'stage');
  const preference_no_pharmacologic = !!input.preference_no_pharmacologic;
  let recommendation = 'nlb_intravenous_opioid_or_nitrous';
  if (stage === 'active' && !preference_no_pharmacologic) recommendation = 'epidural_neuraxial_recommended';
  if (stage === 'transition') recommendation = 'epidural_with_breakthrough_plan';
  if (stage === 'second') recommendation = 'continue_or_top_up_epidural';
  return { stage, preference_no_pharmacologic, recommendation, citations: CITATIONS };
}

module.exports = { epiduralEligibility, nlbVsEpidural, CITATIONS, ValidationError };