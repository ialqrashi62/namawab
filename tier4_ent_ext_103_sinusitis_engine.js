'use strict';
// TIER4_ENT_EXT-103 Sinusitis
const CITATIONS = ['IDSA_Sinusitis','AAAAI_Sinusitis'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function sinusitisAcute(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const duration_days = ensureNumber(input.duration_days, 'duration_days');
  const purulent_discharge = !!input.purulent_discharge;
  const facial_pain = !!input.facial_pain;
  const fever_over_38 = !!input.fever_over_38;
  const antibiotic_appropriate = duration_days >= 10 || (duration_days >= 5 && purulent_discharge && facial_pain && fever_over_38);
  return { duration_days, purulent_discharge, facial_pain, fever_over_38, antibiotic_appropriate, first_line: 'amoxicillin_clavulanate_or_amoxicillin', citations: CITATIONS };
}

function sinusitisChronic(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const duration_weeks = ensureNumber(input.duration_weeks, 'duration_weeks');
  const nasal_polyps_present = !!input.nasal_polyps_present;
  const prior_surgery = !!input.prior_surgery;
  const ct_fluid = !!input.ct_fluid;
  let management = 'saline_irrigation_intranasal_corticosteroid';
  if (ct_fluid) management = 'prolonged_antibiotics_3_weeks_plus_intranasal_corticosteroid';
  if (nasal_polyps_present) management = 'biologics_dupilumab_or_polypectomy_evaluation';
  if (prior_surgery) management = 'revision_sinus_surgery_evaluation';
  return { duration_weeks, nasal_polyps_present, prior_surgery, ct_fluid, management, citations: CITATIONS };
}

module.exports = { sinusitisAcute, sinusitisChronic, CITATIONS, ValidationError };