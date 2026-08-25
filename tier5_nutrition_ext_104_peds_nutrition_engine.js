'use strict';
// TIER5_NUTRITION_EXT-104: Pediatric nutrition - WHO Z-scores + DRI
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['WHO_Growth_2006', 'DRI_IOM_2011', 'AAP_Pediatrics_Nutrition'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function intake_target(req) {
  ensureNumber(req.age_months, 'age_months');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.sex, 'sex'); // 1 = male, 0 = female
  ensureStr(req.feeding, 'feeding'); // breastfed | formula | mixed | solid

  let kcal_per_day, protein_g_per_day, fluid_ml_per_day;
  if (req.age_months < 6) {
    kcal_per_day = req.weight_kg * (req.feeding === 'breastfed' ? 110 : 100);
    protein_g_per_day = req.weight_kg * (req.feeding === 'breastfed' ? 1.5 : 2.0);
    fluid_ml_per_day = req.weight_kg * (req.feeding === 'breastfed' ? 150 : 130);
  } else if (req.age_months < 12) {
    kcal_per_day = req.weight_kg * 95;
    protein_g_per_day = req.weight_kg * 1.5;
    fluid_ml_per_day = req.weight_kg * 130;
  } else if (req.age_months < 36) {
    kcal_per_day = req.weight_kg * 85;
    protein_g_per_day = req.weight_kg * 1.1;
    fluid_ml_per_day = req.weight_kg * 100;
  } else {
    kcal_per_day = req.weight_kg * 70;
    protein_g_per_day = req.weight_kg * 1.0;
    fluid_ml_per_day = req.weight_kg * 60;
  }
  return {
    age_months: req.age_months,
    weight_kg: req.weight_kg,
    kcal_per_day: Math.round(kcal_per_day),
    protein_g_per_day: Math.round(protein_g_per_day * 10) / 10,
    fluid_ml_per_day: Math.round(fluid_ml_per_day),
    feeding: req.feeding,
    citations: CITATIONS,
  };
}

function growth_z_score(req) {
  ensureNumber(req.age_months, 'age_months');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.height_cm, 'height_cm');
  ensureStr(req.sex, 'sex'); // male | female

  // Simplified: median weight-for-age
  const median_weight = req.age_months < 12 ? 3 + req.age_months * 0.5 :
    req.age_months < 24 ? 9 + (req.age_months - 12) * 0.25 :
      req.age_months < 60 ? 12 + (req.age_months - 24) * 0.3 :
        18 + (req.age_months - 60) * 0.2;
  const z_weight = (req.weight_kg - median_weight) / median_weight * 5;
  const median_height = req.age_months < 12 ? 50 + req.age_months * 2 :
    req.age_months < 24 ? 75 + (req.age_months - 12) * 1 :
      req.age_months < 60 ? 90 + (req.age_months - 24) * 1 :
        110 + (req.age_months - 60) * 0.5;
  const z_height = (req.height_cm - median_height) / median_height * 5;
  const wfa_z = z_weight;
  const hfa_z = z_height;
  let interpretation;
  if (wfa_z < -2) interpretation = 'underweight';
  else if (wfa_z > 2) interpretation = 'overweight';
  else if (hfa_z < -2) interpretation = 'stunted';
  else interpretation = 'normal_growth';
  return {
    weight_for_age_z: Math.round(wfa_z * 100) / 100,
    height_for_age_z: Math.round(hfa_z * 100) / 100,
    interpretation,
    citations: CITATIONS,
  };
}

module.exports = { intake_target, growth_z_score, CITATIONS, ValidationError };