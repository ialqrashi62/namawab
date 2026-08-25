'use strict';
// TIER5_NUTRITION_EXT-101: Malnutrition screening (MST + SGA)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ASPEN_2016', 'GLIM_2019', 'AND_ASPEN_2012'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function mst_screen(req) {
  ensureNumber(req.weight_loss_kg, 'weight_loss_kg');
  ensureNumber(req.weight_loss_weeks, 'weight_loss_weeks');
  ensureNumber(req.appetite_decreased, 'appetite_decreased'); // 0=no, 1=yes
  ensureNumber(req.age, 'age');
  ensureNumber(req.bmi, 'bmi');

  const unplanned_loss_score = req.weight_loss_kg >= 10 ? 4 : req.weight_loss_kg >= 5 ? 3 : req.weight_loss_kg >= 3 ? 2 : req.weight_loss_kg >= 1 ? 1 : 0;
  const appetite_score = req.appetite_decreased ? 1 : 0;
  const total = unplanned_loss_score + appetite_score;
  const at_risk = total >= 2 || req.bmi < 18.5 || req.weight_loss_kg >= 5;
  return {
    mst_score: total,
    at_risk_for_malnutrition: at_risk,
    recommendation: at_risk ? 'refer_to_dietitian_for_nutritional_assessment_sga_then_intervention' : 'rescreen_in_7_days',
    next_screening_days: at_risk ? 7 : 7,
    citations: CITATIONS,
  };
}

function sga_assessment(req) {
  ensureNumber(req.weight_loss_pct_6mo, 'weight_loss_pct_6mo');
  ensureNumber(req.dietary_intake_pct, 'dietary_intake_pct'); // 0-100
  ensureNumber(req.gi_symptoms, 'gi_symptoms'); // 0-3
  ensureNumber(req.functional_capacity, 'functional_capacity'); // 0-3
  ensureNumber(req.metabolic_demand, 'metabolic_demand'); // 0-3
  ensureNumber(req.subcutaneous_fat_loss, 'subcutaneous_fat_loss'); // 0-3
  ensureNumber(req.muscle_wasting, 'muscle_wasting'); // 0-3
  ensureNumber(req.edema, 'edema'); // 0-3

  const sga_score = req.subcutaneous_fat_loss + req.muscle_wasting + req.edema;
  const history_score = req.weight_loss_pct_6mo + req.dietary_intake_pct + req.gi_symptoms + req.functional_capacity + req.metabolic_demand;
  let category;
  if (sga_score >= 5 || history_score >= 9) category = 'severely_malnourished_sga_c';
  else if (sga_score >= 3 || history_score >= 6) category = 'moderately_malnourished_sga_b';
  else category = 'well_nourished_sga_a';
  return {
    sga_score,
    history_score,
    category,
    recommendation: category === 'severely_malnourished_sga_c' ? 'aggressive_nutritional_support_with_proteins_calories_or_enteral' :
      category === 'moderately_malnourished_sga_b' ? 'enhanced_oral_nutrition_dietician_intervention' : 'maintain_current_intake',
    citations: CITATIONS,
  };
}

module.exports = { mst_screen, sga_assessment, CITATIONS, ValidationError };