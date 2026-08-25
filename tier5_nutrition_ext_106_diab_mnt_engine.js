'use strict';
// TIER5_NUTRITION_EXT-106: Diabetes MNT (medical nutrition therapy)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ADA_Nutrition_2024', 'DASH_2019', 'Mediterranean_Diet_2018'];

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
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.height_cm, 'height_cm');
  ensureNumber(req.age, 'age');
  ensureStr(req.sex, 'sex'); // male | female
  ensureBool(req.htn, 'htn');
  ensureBool(req.dyslipidemia, 'dyslipidemia');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.ckd, 'ckd');

  const bmi = req.weight_kg / Math.pow(req.height_cm / 100, 2);
  const target_weight_kg = bmi > 25 ? 22 * Math.pow(req.height_cm / 100, 2) : req.weight_kg;
  const kcal_per_day = req.pregnant ? req.weight_kg * 35 :
    req.sex === 'male' ? req.weight_kg * 30 :
      req.weight_kg * 25;
  const carbohydrate_pct = req.dyslipidemia ? 0.4 : 0.45;
  const protein_pct = req.ckd ? 0.15 : 0.2;
  const fat_pct = req.dyslipidemia ? 0.3 : 0.35;
  const saturated_fat_pct = 0.07;
  const fiber_g = req.sex === 'male' ? 38 : 25;
  return {
    bmi: Math.round(bmi * 10) / 10,
    target_weight_kg: Math.round(target_weight_kg * 10) / 10,
    kcal_per_day: Math.round(kcal_per_day),
    carbohydrate_g: Math.round(kcal_per_day * carbohydrate_pct / 4),
    protein_g: Math.round(kcal_per_day * protein_pct / 4),
    fat_g: Math.round(kcal_per_day * fat_pct / 9),
    saturated_fat_g: Math.round(kcal_per_day * saturated_fat_pct / 9),
    fiber_g_per_day: fiber_g,
    pattern: req.htn ? 'dash' : 'mediterranean',
    notes: [
      req.ckd ? 'limit_protein_per_kidney_diet' : 'standard_protein',
      req.htn ? 'limit_sodium_2_grams_per_day' : 'no_sodium_limit',
      req.dyslipidemia ? 'limit_saturated_fat_under_7_percent_calories' : 'standard_fat',
    ],
    citations: CITATIONS,
  };
}

module.exports = { plan, CITATIONS, ValidationError };