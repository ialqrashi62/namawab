'use strict';
// TIER4_ENDO_EXT-105: Obesity - BMI category + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AHA_Obesity_2014', 'Endocrine_Obesity_2015', 'ADA_Obesity_2022'];

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
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.waist_cm, 'waist_cm');
  ensureBool(req.female, 'female');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.htn, 'htn');
  ensureBool(req.osteoarthritis, 'osteoarthritis');
  ensureBool(req.osap, 'osap');

  let category = 'normal';
  if (req.bmi >= 40) category = 'class_iii_obesity';
  else if (req.bmi >= 35) category = 'class_ii_obesity';
  else if (req.bmi >= 30) category = 'class_i_obesity';
  else if (req.bmi >= 25) category = 'overweight';
  const waist_abnormal = req.female ? req.waist_cm > 88 : req.waist_cm > 102;
  return {
    bmi: req.bmi,
    category,
    waist_cm: req.waist_cm,
    waist_abnormal,
    comorbidities: req.diabetes || req.htn || req.osteoarthritis || req.osap,
    bariatric_indicated: req.bmi >= 40 || req.bmi >= 35 && (req.diabetes || req.osteoarthritis || req.osap),
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.htn, 'htn');
  ensureBool(req.cvd, 'cvd');
  ensureNumber(req.previous_attempts, 'previous_attempts');
  ensureBool(req.bariatric_surgery_eligible, 'bariatric_surgery_eligible');

  let first_line;
  if (req.bmi >= 27 && req.diabetes) first_line = 'glp1_agonist_or_lifestyle_intensive';
  else if (req.bmi >= 30) first_line = 'lifestyle_intensive_with_medication_orlistat_or_phentermine';
  else if (req.bmi >= 25) first_line = 'lifestyle_intensive_diet_exercise';
  else first_line = 'maintain_weight_lifestyle';
  const second_line = req.bmi >= 30 && !req.diabetes ? 'consider_liraglutide_or_naltrexone_bupropion' : 'phentermine_topiramate_extended_release';
  const surgery = req.bariatric_surgery_eligible ? 'roux_en_y_gastric_bypass_or_sleeve_gastrectomy' : 'not_indicated';
  return {
    first_line,
    second_line,
    surgery,
    lifestyle: ['caloric_deficit_500_750_kcal_per_day', '150_min_weekly_moderate_exercise', 'behavioral_counseling'],
    citations: CITATIONS,
  };
}

module.exports = { classify, treatment, CITATIONS, ValidationError };