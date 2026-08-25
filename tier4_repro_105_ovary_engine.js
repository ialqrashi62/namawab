'use strict';
// TIER4_REPRO-105 Ovarian Reserve / IVF
const CITATIONS = ['ASRM_Ovarian_Reserve','ACOG_ART'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function ovarianReserve(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const amh = ensureNumber(input.amh, 'amh');
  const afc = ensureNumber(input.afc, 'afc');
  const day_3_fsh = ensureNumber(input.day_3_fsh || 0, 'day_3_fsh');
  let reserve = 'normal';
  if (amh < 1 || afc < 5 || day_3_fsh > 12) reserve = 'low_ovarian_reserve';
  else if (amh >= 3.5) reserve = 'high_ovarian_reserve_pcos_consider';
  return { amh, afc, day_3_fsh, reserve, citations: CITATIONS };
}

function ivfStimulationProtocol(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const reserve = input.reserve || 'normal';
  const age = ensureNumber(input.age, 'age');
  let protocol = 'antagonist_protocol_with_rec_FSH_and_trigger';
  if (reserve === 'low_ovarian_reserve') protocol = 'mini_IVF_or_high_dose_FSH_with_DHEA_pretreatment';
  if (reserve === 'high_ovarian_reserve_pcos_consider') protocol = 'low_dose_FSH_with_trigger_avoidance_ohss_prevention';
  if (age >= 38) protocol = 'consider_mild_stimulation_or_egg_bank_counseling';
  return { reserve, age, protocol, citations: CITATIONS };
}

module.exports = { ovarianReserve, ivfStimulationProtocol, CITATIONS, ValidationError };