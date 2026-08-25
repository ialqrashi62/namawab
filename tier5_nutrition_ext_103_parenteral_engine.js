'use strict';
// TIER5_NUTRITION_EXT-103: Parenteral nutrition (TPN)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ASPEN_Parenteral_2017', 'ESPEN_Parenteral_2020'];

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

function tpn_compound(req) {
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.calorie_target_kcal_kg, 'calorie_target_kcal_kg');
  ensureNumber(req.protein_target_g_kg, 'protein_target_g_kg');
  ensureNumber(req.fluid_target_ml, 'fluid_target_ml');
  ensureBool(req.central_or_peripheral, 'central_or_peripheral');
  ensureBool(req.burn_or_critically_ill, 'burn_or_critically_ill');

  const total_kcal = req.weight_kg * req.calorie_target_kcal_kg;
  const protein_g = req.weight_kg * req.protein_target_g_kg;
  const lipid_pct = req.burn_or_critically_ill ? 0.3 : 0.25;
  const dextrose_pct = 0.6;
  const protein_pct = 0.15;
  const lipid_kcal = total_kcal * lipid_pct;
  const dextrose_kcal = total_kcal * dextrose_pct;
  const protein_kcal = total_kcal * protein_pct;
  const lipid_ml = lipid_kcal / 9 / 0.2; // 20% lipid emulsion
  const dextrose_ml = dextrose_kcal / 3.4 / 0.5; // 50% dextrose
  const protein_ml = protein_g / 0.10; // 10% amino acid
  const total_volume = lipid_ml + dextrose_ml + protein_ml;
  const osmolarity = (dextrose_ml * 2525 + protein_ml * 1000 + lipid_ml * 280) / total_volume;
  const route = osmolarity > 900 ? 'central_line_required' : req.central_or_peripheral ? 'central' : 'peripheral';
  return {
    total_kcal: Math.round(total_kcal),
    protein_g: Math.round(protein_g),
    lipid_ml_20pct: Math.round(lipid_ml),
    dextrose_ml_50pct: Math.round(dextrose_ml),
    amino_acid_ml_10pct: Math.round(protein_ml),
    total_volume_ml: Math.round(total_volume),
    osmolarity_mOsm_per_L: Math.round(osmolarity),
    route,
    monitoring: ['cbg_q6h_then_qd', 'triglycerides_weekly', 'lfts_weekly', 'electrolytes_daily_for_5_days'],
    citations: CITATIONS,
  };
}

module.exports = { tpn_compound, CITATIONS, ValidationError };