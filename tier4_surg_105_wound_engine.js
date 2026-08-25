'use strict';
// TIER4_SURG-105 Wound Care
const CITATIONS = ['Wound_Source_NPWT','CDC_SSI'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function woundAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const depth_cm = ensureNumber(input.depth_cm || 0, 'depth_cm');
  const exudate = input.exudate || 'serous';
  const infection_signs = !!input.infection_signs;
  const tunneling = !!input.tunneling;
  let category = 'granulating';
  if (depth_cm > 1) category = 'stage_iii_iv';
  if (infection_signs) category = 'infected';
  if (tunneling) category = 'complex_wound';
  return { size_cm, depth_cm, exudate, infection_signs, tunneling, category, citations: CITATIONS };
}

function npwtIndication(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const chronic = !!input.chronic;
  const exposed_bone = !!input.exposed_bone;
  const dehisced = !!input.dehisced;
  const indicated = size_cm >= 5 || chronic || exposed_bone || dehisced;
  return { size_cm, chronic, exposed_bone, dehisced, indicated, citations: CITATIONS };
}

module.exports = { woundAssessment, npwtIndication, CITATIONS, ValidationError };