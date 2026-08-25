// filepath: tier7_pop_health_ext_104_hedis_engine.js
// TIER7_POP_HEALTH_EXT-104: HEDIS quality measures
'use strict';

const CITATIONS = ['NCQA_HEDIS_MY2024','CMS_STAR_RATINGS_2023'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hedis_diabetes_a1c(req) {
  ensureStr(req.measure_id, 'measure_id');
  ensureNumber(req.denominator, 'denominator');
  ensureNumber(req.numerator, 'numerator');
  ensureBool(req.controlled_threshold, 'controlled_threshold');
  ensureEnum(req.measurement_year, 'measurement_year', ['2022','2023','2024']);

  const rate = req.denominator > 0 ? req.numerator / req.denominator : 0;
  let band;
  if (rate >= 0.85) band = 'five_star_top_decile';
  else if (rate >= 0.75) band = 'four_star_above_benchmark';
  else if (rate >= 0.65) band = 'three_star_at_benchmark';
  else if (rate >= 0.5) band = 'two_star_below_benchmark';
  else band = 'one_star_priority_improvement';

  return { measure_rate_pct: Math.round(rate * 1000) / 10, band, year: req.measurement_year };
}

function hedis_blood_pressure(req) {
  ensureStr(req.measure_id, 'measure_id');
  ensureNumber(req.denominator, 'denominator');
  ensureNumber(req.numerator, 'numerator');
  ensureNumber(req.target_bp_pct, 'target_bp_pct');
  ensureBool(req.exclusion_documented, 'exclusion_documented');

  const rate = req.denominator > 0 ? req.numerator / req.denominator : 0;
  const target_rate = req.target_bp_pct / 100;
  let summary;
  if (rate >= target_rate) summary = 'meets_target_quality_bonus';
  else if (rate >= target_rate * 0.85) summary = 'approaching_target';
  else summary = 'below_target_improvement_program';

  return { rate_pct: Math.round(rate * 1000) / 10, target_pct: req.target_bp_pct, summary };
}

function hedis_cancer_screening(req) {
  ensureStr(req.measure_id, 'measure_id');
  ensureEnum(req.screening_type, 'screening_type', ['breast','colorectal','cervical']);
  ensureNumber(req.eligible_population, 'eligible_population');
  ensureNumber(req.screened_population, 'screened_population');
  ensureNumber(req.exclusions, 'exclusions');

  const adjusted_denom = req.eligible_population - req.exclusions;
  const rate = adjusted_denom > 0 ? req.screened_population / adjusted_denom : 0;
  let band;
  if (rate >= 0.8) band = 'five_star_top_performance';
  else if (rate >= 0.7) band = 'four_star_solid';
  else if (rate >= 0.6) band = 'three_star_average';
  else band = 'below_average_priority_action';

  return { rate_pct: Math.round(rate * 1000) / 10, band, screening: req.screening_type };
}

function hedis_readmission(req) {
  ensureStr(req.measure_id, 'measure_id');
  ensureNumber(req.index_admissions, 'index_admissions');
  ensureNumber(req.readmissions_30d, 'readmissions_30d');
  ensureNumber(req.expected_readmissions, 'expected_readmissions');
  ensureBool(req.planned_readmission_excluded, 'planned_readmission_excluded');

  const observed_rate = req.index_admissions > 0 ? req.readmissions_30d / req.index_admissions : 0;
  const expected_rate = req.index_admissions > 0 ? req.expected_readmissions / req.index_admissions : 0;
  const ratio = expected_rate > 0 ? observed_rate / expected_rate : 0;

  let band;
  if (ratio < 0.85) band = 'better_than_expected_top_quartile';
  else if (ratio <= 1.15) band = 'as_expected_average';
  else if (ratio <= 1.5) band = 'worse_than_expected_priority_action';
  else band = 'far_worse_immediate_intervention';

  return { observed_pct: Math.round(observed_rate * 1000) / 10, ratio: Math.round(ratio * 100) / 100, band };
}

function hedis_star_calc(req) {
  ensureStr(req.measurement_year, 'measurement_year');
  ensureNumber(req.measure_count, 'measure_count');
  ensureNumber(req.measure_score_sum, 'measure_score_sum');
  ensureNumber(req.weight_sum, 'weight_sum');
  ensureNumber(req.bonus_points, 'bonus_points');

  const overall = req.weight_sum > 0 ? (req.measure_score_sum + req.bonus_points) / req.weight_sum : 0;
  let stars;
  if (overall >= 4.5) stars = 5;
  else if (overall >= 4) stars = 4;
  else if (overall >= 3) stars = 3;
  else if (overall >= 2) stars = 2;
  else stars = 1;

  return { overall_score: Math.round(overall * 100) / 100, stars, year: req.measurement_year };
}

function funcs() { return { hedis_diabetes_a1c, hedis_blood_pressure, hedis_cancer_screening, hedis_readmission, hedis_star_calc }; }
module.exports = { funcs, CITATIONS, ValidationError };