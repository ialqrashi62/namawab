'use strict';
// TIER5_NUTRITION_EXT-105: Renal diet (CKD stages)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_Nutrition_2024', 'NKF_KDOQI_2020'];

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

function plan(req) {
  ensureStr(req.ckd_stage, 'ckd_stage'); // 1 | 2 | 3a | 3b | 4 | 5_dialysis | 5_no_dialysis
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.hyperkalemia, 'hyperkalemia');
  ensureBool(req.hyperphosphatemia, 'hyperphosphatemia');
  ensureBool(req.metabolic_acidosis, 'metabolic_acidosis');
  ensureBool(req.dialysis, 'dialysis');

  const protein_g_per_kg = req.ckd_stage === '5_dialysis' ? 1.2 :
    req.ckd_stage === '5_no_dialysis' ? 0.6 :
      req.ckd_stage === '4' ? 0.7 :
        req.ckd_stage === '3b' ? 0.8 : 1.0;
  const sodium_mg = req.dialysis ? 2000 : 1500;
  const potassium_mg = req.hyperkalemia ? 1500 : req.dialysis ? 2500 : 2000;
  const phosphorus_mg = req.hyperphosphatemia ? 800 : req.dialysis ? 1200 : 1000;
  const fluid_ml = req.dialysis ? 1000 : 1500;
  return {
    ckd_stage: req.ckd_stage,
    protein_g_per_day: Math.round(req.weight_kg * protein_g_per_kg),
    sodium_mg_per_day: sodium_mg,
    potassium_mg_per_day: potassium_mg,
    phosphorus_mg_per_day: phosphorus_mg,
    fluid_ml_per_day: fluid_ml,
    notes: [
      req.metabolic_acidosis ? 'address_acidosis_with_bicarbonate_or_citrate' : 'no_acidosis_adjustment',
      req.dialysis ? 'increase_protein_to_replace_dialysis_losses' : 'restrict_protein_only_if_not_dialysis',
    ],
    citations: CITATIONS,
  };
}

module.exports = { plan, CITATIONS, ValidationError };