'use strict';
// TIER4_HEMONC_EXT-102: Leukemia risk + initial workup
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ELN_AML_2022', 'NCCN_AML_2024', 'WHO_Leukemia_2016'];

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

function classify(req) {
  ensureStr(req.type, 'type'); // aml | all | cll | cml
  ensureNumber(req.wbc, 'wbc');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.platelet, 'platelet');
  ensureBool(req.blasts_peripheral, 'blasts_peripheral');
  ensureNumber(req.cyto_abnormalities, 'cyto_abnormalities');

  let severity = 'unknown';
  if (req.type === 'aml') severity = req.cyto_abnormalities === 3 ? 'favorable' : req.cyto_abnormalities === 2 ? 'intermediate' : req.cyto_abnormalities === 1 ? 'adverse' : 'standard';
  else if (req.type === 'all') severity = req.age >= 35 ? 'standard_or_high_risk' : 'standard';
  else if (req.type === 'cll') severity = req.wbc > 100 ? 'high_count' : 'standard';
  else if (req.type === 'cml') severity = req.cyto_abnormalities === 0 ? 'chronic' : req.cyto_abnormalities === 1 ? 'accelerated' : 'blast';
  return {
    type: req.type,
    severity,
    wbc: req.wbc,
    hgb: req.hgb,
    platelet: req.platelet,
    blasts_peripheral: req.blasts_peripheral,
    next: 'bone_marrow_biopsy_with_cytogenetics_molecular',
    citations: CITATIONS,
  };
}

function risk(req) {
  ensureStr(req.type, 'type');
  ensureNumber(req.age, 'age');
  ensureBool(req.blast_crisis, 'blast_crisis');
  ensureBool(req.secondary_aml, 'secondary_aml');
  ensureNumber(req.performance_status, 'performance_status');
  ensureBool(req.tumor_lysis_high_risk, 'tumor_lysis_high_risk');

  const fit_for_intensive_chemo = req.age < 70 && req.performance_status <= 2 && !req.blast_crisis;
  const induction = fit_for_intensive_chemo ? 'seven_plus_three_cytarabine_and_daunorubicin' : 'azacitidine_or_venetoclax_with_hypomethylating';
  const transplant_candidate = fit_for_intensive_chemo && req.type === 'aml';
  const tumor_lysis_prophylaxis = req.tumor_lysis_high_risk ? 'aggressive_iv_fluids_allopurinol_or_rasburicase' : 'standard_allopurinol';
  return {
    age: req.age,
    fit_for_intensive_chemo,
    induction,
    transplant_candidate,
    tumor_lysis_prophylaxis,
    citations: CITATIONS,
  };
}

module.exports = { classify, risk, CITATIONS, ValidationError };