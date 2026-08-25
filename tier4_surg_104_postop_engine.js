'use strict';
// TIER4_SURG-104 Postop
const CITATIONS = ['ACS_TQIP','NSQIP_Postop'];
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

function postopComplication(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const postop_day = ensureNumber(input.postop_day, 'postop_day');
  const fever = !!input.fever;
  const tachycardia = !!input.tachycardia;
  const wound_redness = !!input.wound_redness;
  const confusion = !!input.confusion;
  let concern = 'routine';
  if (fever && tachycardia && wound_redness && postop_day <= 5) concern = 'surgical_site_infection_evaluation';
  else if (fever && tachycardia && confusion) concern = 'sepsis_workup';
  else if (fever && postop_day >= 5) concern = 'postop_fever_evaluate_dvt_uti_pneumonia_wound';
  return { postop_day, fever, tachycardia, wound_redness, confusion, concern, citations: CITATIONS };
}

function postopIleus(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const postop_day = ensureNumber(input.postop_day, 'postop_day');
  const bowel_sounds = !!input.bowel_sounds;
  const flatus = !!input.flatus;
  const distention = !!input.distention;
  const vomiting = !!input.vomiting;
  let diagnosis = 'normal_postop_ileus_resolving';
  if (postop_day > 5 && !flatus) diagnosis = 'prolonged_ileus_evaluate_mechanical_obstruction_with_imaging';
  return { postop_day, bowel_sounds, flatus, distention, vomiting, diagnosis, citations: CITATIONS };
}

module.exports = { postopComplication, postopIleus, CITATIONS, ValidationError };