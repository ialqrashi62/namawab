'use strict';
// TIER4_HEMONC_EXT-103: Lymphoma classification + stage
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['Lugano_2014', 'WHO_Lymphoma_2016', 'NCCN_Lymphoma_2024'];

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
  ensureStr(req.type, 'type'); // hodgkin | diffuse_large_b_cell | follicular | mantle_cell | burkitt | marginal_zone
  ensureBool(req.ebv_positive, 'ebv_positive');
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureBool(req.bone_marrow_involvement, 'bone_marrow_involvement');
  ensureBool(req.bulky_disease, 'bulky_disease');
  ensureNumber(req.ki67, 'ki67');

  const aggressive = req.type === 'diffuse_large_b_cell' || req.type === 'burkitt' || req.type === 'mantle_cell';
  const indolent = req.type === 'follicular' || req.type === 'marginal_zone';
  return {
    type: req.type,
    aggressive,
    indolent,
    ki67: req.ki67,
    ebv_positive: req.ebv_positive,
    hiv_positive: req.hiv_positive,
    next: 'excisional_lymph_node_biopsy_with_immunohistochemistry_fish_flow',
    citations: CITATIONS,
  };
}

function stage(req) {
  ensureStr(req.type, 'type');
  ensureBool(req.single_lymph_node_region, 'single_lymph_node_region');
  ensureBool(req.multiple_lymph_node_same_side, 'multiple_lymph_node_same_side');
  ensureBool(req.both_sides_diaphragm, 'both_sides_diaphragm');
  ensureBool(req.disseminated_extranodal, 'disseminated_extranodal');
  ensureBool(req.b_symptoms, 'b_symptoms');

  let stage = 'I';
  if (req.disseminated_extranodal) stage = 'IV';
  else if (req.both_sides_diaphragm) stage = 'III';
  else if (req.multiple_lymph_node_same_side) stage = 'II';
  else stage = 'I';
  const bulky = req.single_lymph_node_region && false; // depends on size, simplified
  const suffix = req.b_symptoms ? 'B' : 'A';
  const ek_eod = req.disseminated_extranodal ? 'E' : '';
  return {
    type: req.type,
    stage: stage + suffix,
    advanced: stage === 'III' || stage === 'IV',
    bulky: bulky,
    eod: ek_eod,
    prognostic_factor: req.b_symptoms ? 'b_symptoms_adverse_in_hodgkin' : 'no_b_symptoms',
    citations: CITATIONS,
  };
}

module.exports = { classify, stage, CITATIONS, ValidationError };