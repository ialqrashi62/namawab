'use strict';
// TIER4_PALL_EXT-105 Symptom Burden
const CITATIONS = ['ESAS_Symptom_Burden','NCCN_Symptom_Management'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function esasScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const pain = ensureNumber(input.pain || 0, 'pain');
  const tiredness = ensureNumber(input.tiredness || 0, 'tiredness');
  const nausea = ensureNumber(input.nausea || 0, 'nausea');
  const depression = ensureNumber(input.depression || 0, 'depression');
  const anxiety = ensureNumber(input.anxiety || 0, 'anxiety');
  const drowsiness = ensureNumber(input.drowsiness || 0, 'drowsiness');
  const appetite = ensureNumber(input.appetite || 0, 'appetite');
  const wellbeing = ensureNumber(input.wellbeing || 0, 'wellbeing');
  const shortness_of_breath = ensureNumber(input.shortness_of_breath || 0, 'shortness_of_breath');
  const sleep = ensureNumber(input.sleep || 0, 'sleep');
  const items = { pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, wellbeing, shortness_of_breath, sleep };
  const total = pain + tiredness + nausea + depression + anxiety + drowsiness + appetite + wellbeing + shortness_of_breath + sleep;
  const severe_items = Object.keys(items).filter(k => items[k] >= 7);
  let burden = 'mild';
  if (total >= 70 || severe_items.length >= 3) burden = 'severe';
  else if (total >= 40 || severe_items.length >= 1) burden = 'moderate';
  return { items, total, severe_items, burden, citations: CITATIONS };
}

module.exports = { esasScore, CITATIONS, ValidationError };