'use strict';
// TIER4_RHEUM_EXT-102 SLE
const CITATIONS = ['ACR_SLICC_SLE_2012','EULAR_ACR_SLE_2019'];
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

function slaccEularCriteria(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const clinical_items = ensureNumber(input.clinical_items || 0, 'clinical_items');
  const immunologic_items = ensureNumber(input.immunologic_items || 0, 'immunologic_items');
  const ana_positive = !!input.ana_positive;
  let total = clinical_items + immunologic_items;
  let classified = false;
  if (ana_positive) {
    if (total >= 10) classified = true;
    else if (clinical_items >= 7 && immunologic_items >= 2) classified = true;
    else classified = false;
  }
  return { clinical_items, immunologic_items, ana_positive, total, classified, citations: CITATIONS };
}

function sledaiScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const seizure = !!input.seizure;
  const psychosis = !!input.psychosis;
  const organic_brain = !!input.organic_brain;
  const visual = !!input.visual;
  const cranial_nerve = !!input.cranial_nerve;
  const lupus_headache = !!input.lupus_headache;
  const cva = !!input.cva;
  const vasculitis = !!input.vasculitis;
  const arthritis = !!input.arthritis;
  const myositis = !!input.myositis;
  const urinary_casts = !!input.urinary_casts;
  const hematuria = !!input.hematuria;
  const proteinuria = !!input.proteinuria;
  const pyuria = !!input.pyuria;
  const rash = !!input.rash;
  const alopecia = !!input.alopecia;
  const mucosal = !!input.mucosal;
  const pleuritis = !!input.pleuritis;
  const pericarditis = !!input.pericarditis;
  const complement_low = !!input.complement_low;
  const dsdna_elevated = !!input.dsdna_elevated;
  const fever = !!input.fever;
  const platelets_low = !!input.platelets_low;
  const leukopenia = !!input.leukopenia;
  let score = 0;
  if (seizure) score += 8;
  if (psychosis) score += 8;
  if (organic_brain) score += 8;
  if (visual) score += 8;
  if (cranial_nerve) score += 8;
  if (lupus_headache) score += 8;
  if (cva) score += 8;
  if (vasculitis) score += 8;
  if (arthritis) score += 4;
  if (myositis) score += 4;
  if (urinary_casts) score += 4;
  if (hematuria) score += 4;
  if (proteinuria) score += 4;
  if (pyuria) score += 4;
  if (rash) score += 2;
  if (alopecia) score += 2;
  if (mucosal) score += 2;
  if (pleuritis) score += 2;
  if (pericarditis) score += 2;
  if (complement_low) score += 2;
  if (dsdna_elevated) score += 2;
  if (fever) score += 1;
  if (platelets_low) score += 1;
  if (leukopenia) score += 1;
  let activity = 'mild';
  if (score >= 12) activity = 'high_flare';
  else if (score >= 6) activity = 'moderate';
  return { score, activity, citations: CITATIONS };
}

module.exports = { slaccEularCriteria, sledaiScore, CITATIONS, ValidationError };