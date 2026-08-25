'use strict';
// TIER4_ENDO_EXT-103: Thyroid - thyroid nodule workup + cancer risk
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ATA_Thyroid_2016', 'ATA_Thyroid_2015', 'ACR_TIRADS_2017'];

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

function workup(req) {
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.nodule_size_mm, 'nodule_size_mm');
  ensureBool(req.radiation_history, 'radiation_history');
  ensureBool(req.family_history, 'family_history');
  ensureStr(req.tirads, 'tirads'); // tr1 | tr2 | tr3 | tr4 | tr5

  const high_risk = req.radiation_history || req.family_history;
  const fnab_indicated = req.tirads === 'tr4' && req.nodule_size_mm >= 15 ||
    req.tirads === 'tr5' && req.nodule_size_mm >= 10 ||
    req.tirads === 'tr3' && req.nodule_size_mm >= 25 ||
    high_risk && req.nodule_size_mm >= 10;
  return {
    tsh: req.tsh,
    nodule_size_mm: req.nodule_size_mm,
    tirads: req.tirads,
    high_risk,
    fnab_indicated,
    followup: !req.fnab_indicated ? req.tirads === 'tr2' ? 'ultrasound_q3_5_years' : req.tirads === 'tr3' ? 'ultrasound_q1_3_years' : 'ultrasound_q12_months' : 'fnab_then_management',
    citations: CITATIONS,
  };
}

function cancer(req) {
  ensureStr(req.stage, 'stage'); // localized | regional | distant
  ensureNumber(req.age, 'age');
  ensureNumber(req.tumor_size_mm, 'tumor_size_mm');
  ensureBool(req.extrathyroidal_extension, 'extrathyroidal_extension');
  ensureBool(req.lymph_node_involvement, 'lymph_node_involvement');

  const ajcc_stage = req.stage === 'distant' ? 'IV' :
    req.stage === 'regional' && req.age >= 55 ? 'III' :
      req.stage === 'regional' ? 'II' :
        req.tumor_size_mm <= 10 ? 'I' : req.tumor_size_mm <= 20 ? 'II' : 'III';
  const surgery = req.tumor_size_mm >= 10 || req.extrathyroidal_extension ? 'total_thyroidectomy_with_possible_central_lymph_node_dissection' : 'lobectomy_acceptable';
  const radioiodine = req.tumor_size_mm >= 40 || req.extrathyroidal_extension || req.lymph_node_involvement ? 'consider_radioiodine_ablation' : 'no_routine';
  return {
    age: req.age,
    tumor_size_mm: req.tumor_size_mm,
    ajcc_stage,
    surgery,
    radioiodine,
    tsh_suppression: 'levothyroxine_suppressive_to_tsh_below_normal_5_to_10_years',
    citations: CITATIONS,
  };
}

module.exports = { workup, cancer, CITATIONS, ValidationError };