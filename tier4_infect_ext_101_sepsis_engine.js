'use strict';
// TIER4_INFECT_EXT-101: Sepsis screening and bundle
// qSOFA + SIRS + SSC 1-hour bundle
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

const CITATIONS = ['SCCM_SSC_2021', 'Sepsis_3_2016'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureEnum(v, allowed, field) {
  if (!allowed.includes(v)) throw new ValidationError(`${field} must be one of ${allowed.join('|')}`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function qsofa(req) {
  ensureNumber(req.resp_rate, 'resp_rate');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.mental_status, 'mental_status'); // GCS-like 0-15
  const altered = req.mental_status < 15;
  const score = (req.resp_rate >= 22 ? 1 : 0) + (req.sbp <= 100 ? 1 : 0) + (altered ? 1 : 0);
  const high = score >= 2;
  return {
    resp_rate: req.resp_rate,
    sbp: req.sbp,
    altered_mental: altered,
    qsofa_score: score,
    high_risk: high,
    action: high ? 'initiate_sepsis_bundle_within_1_hour' : 'continue_monitoring_reassess',
    citations: CITATIONS,
  };
}

function bundle(req) {
  ensureNumber(req.lactate, 'lactate');
  ensureNumber(req.map, 'map');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.bilirubin, 'bilirubin');
  ensureNumber(req.platelets, 'platelets');
  ensureNumber(req.inr, 'inr');
  ensureEnum(req.suspected_source, ['pulmonary', 'abdominal', 'urinary', 'skin_soft_tissue', 'cns', 'line_associated', 'unknown'], 'suspected_source');
  ensureEnum(req.resistance_risk, ['none', 'mrsa', 'vre', 'esbl', 'pseudomonas', 'multi_drug_resistant'], 'resistance_risk');

  const lactate_high = req.lactate >= 2;
  const map_low = req.map < 65;
  const organ_dysfunction = map_low || req.creatinine > 2 || req.bilirubin > 2 || req.platelets < 100 || req.inr > 1.5;

  const abx_choice = req.resistance_risk === 'none' ? 'narrow_spectrum_per_source' :
    req.resistance_risk === 'mrsa' ? 'vancomycin_or_linezolid' :
    req.resistance_risk === 'esbl' ? 'carbapenem' :
    req.resistance_risk === 'pseudomonas' ? 'anti_pseudomonal_beta_lactam' :
    'broad_spectrum_with_id_consult';

  return {
    lactate: req.lactate,
    lactate_high,
    map: req.map,
    map_low,
    organ_dysfunction,
    suspected_source: req.suspected_source,
    resistance_risk: req.resistance_risk,
    bundle_1h: [
      'measure_lactate',
      'obtain_blood_cultures_before_abx',
      'administer_broad_spectrum_abx',
      'begin_iv_fluids_30mL_per_kg_if_hypotensive_or_lactate_4',
      'vasopressors_if_hypotensive_during_or_after_fluid_resuscitation',
    ],
    antibiotic_choice: abx_choice,
    citations: CITATIONS,
  };
}

module.exports = { qsofa, bundle, CITATIONS, ValidationError };