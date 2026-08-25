'use strict';
// TIER4_PALL_EXT-106 Terminal Care
const CITATIONS = ['NCCN_Imminent_Death','NICE_Care_Of_Dying'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function imminentDeathSigns(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const agonal_breathing = !!input.agonal_breathing;
  const mottling = !!input.mottling;
  const decreased_consciousness = !!input.decreased_consciousness;
  const apneic_pauses = !!input.apneic_pauses;
  const family_at_bedside = !!input.family_at_bedside;
  const signs = [];
  if (agonal_breathing) signs.push('agonal_breathing');
  if (mottling) signs.push('mottling_skin_circulatory_shutdown');
  if (decreased_consciousness) signs.push('decreased_consciousness');
  if (apneic_pauses) signs.push('apneic_pauses');
  let imminent = false;
  if (signs.length >= 2) imminent = true;
  return { signs, imminent, hours_estimate: imminent ? 'within_hours_to_a_few_days' : 'days_or_more', family_communication_required: family_at_bedside, citations: CITATIONS };
}

function terminalSedation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const refractory_symptom = !!input.refractory_symptom;
  const prognosis_hours = ensureNumber(input.prognosis_hours, 'prognosis_hours');
  const ethics_consult = !!input.ethics_consult;
  const family_consent = !!input.family_consent;
  const eligible = refractory_symptom && prognosis_hours <= 48 && ethics_consult && family_consent;
  return { refractory_symptom, prognosis_hours, ethics_consult, family_consent, eligible, medication: eligible ? 'midazolam_or_levomepromazine_per_protocol' : 'not_eligible', citations: CITATIONS };
}

module.exports = { imminentDeathSigns, terminalSedation, CITATIONS, ValidationError };