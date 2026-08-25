'use strict';
// TIER4_PULM_EXT-101: COPD - GOLD stage + exacerbation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['GOLD_2024', 'ATS_COPD_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function gold(req) {
  ensureNumber(req.fev1_pct, 'fev1_pct');
  ensureNumber(req.mmrc, 'mmrc');
  ensureNumber(req.copd_assessment, 'copd_assessment');
  ensureNumber(req.exacerbations_per_year, 'exacerbations_per_year');
  ensureNumber(req.hospitalizations_per_year, 'hospitalizations_per_year');

  let gold_stage = 'GOLD_1';
  if (req.fev1_pct < 30) gold_stage = 'GOLD_4';
  else if (req.fev1_pct < 50) gold_stage = 'GOLD_3';
  else if (req.fev1_pct < 80) gold_stage = 'GOLD_2';

  let group = 'A';
  if (req.exacerbations_per_year >= 2 || req.hospitalizations_per_year >= 1) group = 'E';
  else if (req.mmrc >= 2 || req.copd_assessment >= 10) group = 'B';
  else if (req.mmrc <= 1 && req.copd_assessment < 10) group = 'A';

  const initial = group === 'A' ? 'bronchodilator_short_acting' :
    group === 'B' ? 'long_acting_bronchodilator_laba_or_lama' :
      group === 'E' ? 'laba_lama_inhaled_corticosteroid_consider' : 'laba_lama';

  return {
    fev1_pct: req.fev1_pct,
    gold_stage,
    gold_group: group,
    initial_therapy: initial,
    monitoring: ['pft_q12_months', 'copd_assessment_q6_months'],
    citations: CITATIONS,
  };
}

function exacerbation(req) {
  ensureBool(req.dyspnea_increase, 'dyspnea_increase');
  ensureBool(req.sputum_volume_increase, 'sputum_volume_increase');
  ensureBool(req.sputum_purulence_increase, 'sputum_purulence_increase');
  ensureBool(req.respiratory_failure, 'respiratory_failure');
  ensureBool(req.cardiac_compromise, 'cardiac_compromise');

  const severity = req.respiratory_failure || req.cardiac_compromise ? 'severe_with_acute_respiratory_failure' :
    req.dyspnea_increase && req.sputum_volume_increase && req.sputum_purulence_increase ? 'moderate' :
      'mild';

  const treatment = severity === 'severe_with_acute_respiratory_failure' ? 'icu_niv_or_intubation_iv_steroids_iv_abx' :
    severity === 'moderate' ? 'short_acting_bronchodilators_steroids_oral_or_iv_abx' :
      'short_acting_bronchodilators_consider_oral_steroids_and_antibiotics';
  return {
    severity,
    anthonisen_criteria: {
      dyspnea: req.dyspnea_increase,
      sputum_volume: req.sputum_volume_increase,
      sputum_purulence: req.sputum_purulence_increase,
    },
    treatment,
    follow_up: severity === 'severe_with_acute_respiratory_failure' ? 'within_4_weeks' :
      severity === 'moderate' ? 'within_2_weeks' : 'within_6_weeks',
    citations: CITATIONS,
  };
}

module.exports = { gold, exacerbation, CITATIONS, ValidationError };