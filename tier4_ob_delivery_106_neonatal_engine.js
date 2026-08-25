'use strict';
// TIER4_OB_DELIVERY-106 Neonatal Resuscitation
const CITATIONS = ['NRP_2023','IAP_NRP_Guidelines'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function apgarScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const appearance = ensureNumber(input.appearance, 'appearance');
  const pulse = ensureNumber(input.pulse, 'pulse');
  const grimace = ensureNumber(input.grimace, 'grimace');
  const activity = ensureNumber(input.activity, 'activity');
  const respiration = ensureNumber(input.respiration, 'respiration');
  const total = appearance + pulse + grimace + activity + respiration;
  let interpretation = 'normal';
  if (total < 3) interpretation = 'severely_depressed';
  else if (total < 7) interpretation = 'moderately_depressed';
  return { appearance, pulse, grimace, activity, respiration, total, interpretation, citations: CITATIONS };
}

function neonatalResuscitation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const hr_bpm = ensureNumber(input.hr_bpm || 0, 'hr_bpm');
  const breathing = !!input.breathing;
  const tone = !!input.tone;
  const steps = [];
  if (!breathing || !tone) steps.push('warm_position_clear_airway_stimulate');
  if (hr_bpm < 100) steps.push('ppv_with_room_air_or_blended_oxygen');
  if (hr_bpm < 60) steps.push('chest_compressions_coordinate_with_ppv_90_compressions_30_breaths_per_min');
  if (hr_bpm < 60 && steps.includes('chest_compressions')) steps.push('epinephrine_iv_or_uv_0_01_to_0_03_mg_per_kg_1_10_000');
  const preterm_considerations = gestational_weeks < 34;
  return { gestational_weeks, hr_bpm, breathing, tone, steps, preterm_considerations, citation: CITATIONS };
}

module.exports = { apgarScore, neonatalResuscitation, CITATIONS, ValidationError };