/**
 * TIER3_ENDO-305 Bone & Parathyroid Engine
 * Osteoporosis FRAX + DEXA interpretation + parathyroid workup + vitamin D + treatment monitoring
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NOF: 'NOF Clinician Guide 2024', AACE: 'AACE Osteoporosis 2020', AACE_PTH: 'AACE Parathyroid 2022' };

function fraxCalculation(input) {
  const { age, gender, weight_kg, height_cm, prior_fracture, parental_hip_fracture, current_smoking, glucocorticoids, ra, alcohol_3_or_more, bmd_femoral_neck_tscore, secondary_osteoporosis } = input;
  const bmi = weight_kg / Math.pow(height_cm / 100, 2);
  let risk_factors = 0;
  if (prior_fracture) risk_factors += 1;
  if (parental_hip_fracture) risk_factors += 1;
  if (current_smoking) risk_factors += 1;
  if (glucocorticoids) risk_factors += 1;
  if (ra) risk_factors += 1;
  if (alcohol_3_or_more) risk_factors += 1;
  if (secondary_osteoporosis) risk_factors += 1;
  const major_osteoporotic_fracture_threshold = 20;
  const hip_fracture_threshold = 3;
  return {
    bmi: Math.round(bmi * 100) / 100,
    risk_factors,
    femoral_neck_tscore: bmd_femoral_neck_tscore,
    treatment_indicated: bmd_femoral_neck_tscore <= -2.5 || risk_factors >= 3 || (age >= 65 && risk_factors >= 1),
    frax_major_threshold: major_osteoporotic_fracture_threshold,
    frax_hip_threshold: hip_fracture_threshold,
    citation: CITATIONS.NOF,
  };
}

function dexaInterpretation(input) {
  const { lumbar_tscore, femoral_neck_tscore, hip_total_tscore, age } = input;
  let classification = 'normal';
  const min_t = Math.min(lumbar_tscore, femoral_neck_tscore, hip_total_tscore);
  if (min_t <= -2.5) classification = 'osteoporosis';
  else if (min_t <= -1) classification = 'osteopenia';
  return {
    classification, lumbar_tscore, femoral_neck_tscore, hip_total_tscore,
    lowest_tscore: Math.round(min_t * 100) / 100,
    rescan_interval_years: age >= 65 ? 2 : 3,
    fragility_fracture: 'Verify_worst_site',
    citation: CITATIONS.NOF,
  };
}

function parathyroidWorkup(input) {
  const { pth, calcium_corrected, phosphate, vitamin_d_25oh, urinary_calcium, neck_mass } = input;
  let diagnosis = 'unclassified';
  if (pth >= 65 && calcium_corrected >= 10.5) diagnosis = 'primary_hyperparathyroidism';
  else if (pth >= 65 && calcium_corrected < 8.5 && phosphate >= 4.5) diagnosis = 'secondary_hyperparathyroidism';
  else if (pth >= 100 && phosphate < 2.5 && urinary_calcium > 300) diagnosis = 'tertiary_hyperparathyroidism';
  else if (pth < 20 && calcium_corrected < 8.5) diagnosis = 'hypoparathyroidism';
  else if (pth >= 200 && vitamin_d_25oh < 10) diagnosis = 'vitamin_D_deficiency';
  return {
    pth, calcium_corrected, phosphate, vitamin_d_25oh,
    diagnosis,
    surgical_referral: diagnosis === 'primary_hyperparathyroidism' && (calcium_corrected >= 11.5 || urinary_calcium > 400),
    parathyroidectomy_indicated: diagnosis === 'primary_hyperparathyroidism' && neck_mass,
    citation: CITATIONS.AACE_PTH,
  };
}

function vitaminDManagement(input) {
  const { vitamin_d_25oh, age, pregnancy, malabsorption, bariatric_history, hx_fracture, bmd_tscore } = input;
  const deficient = vitamin_d_25oh < 20;
  const insufficient = vitamin_d_25oh < 30 && !deficient;
  let dose = 0;
  if (deficient) dose = malabsorption ? 50000 : 4000;
  else if (insufficient) dose = 1000;
  else dose = 600;
  return {
    status: deficient ? 'deficient' : insufficient ? 'insufficient' : 'sufficient',
    recommendation: 'cholecalciferol',
    dose_iu_daily: dose,
    duration_weeks: deficient ? 12 : 0,
    retest_weeks: deficient ? 12 : 24,
    target_25oh: 30,
    citation: CITATIONS.NOF,
  };
}

function osteoporosisTreatmentMonitoring(input) {
  const { baseline_bmd, current_bmd, months_on_therapy, vertebral_fracture, on_bisphosphonate, on_denosumab, on_romosozumab, on_teriparatide } = input;
  const treatment_response = current_bmd - baseline_bmd;
  const expected_lumbar_increase = on_bisphosphonate ? 3 : on_denosumab ? 5 : on_romosozumab ? 8 : on_teriparatide ? 8 : 0;
  return {
    lumbar_bmd_change_pct: Math.round(treatment_response * 100) / 100,
    expected_increase_pct_2y: expected_lumbar_increase * 2,
    adequate_response: treatment_response >= 0 || on_teriparatide,
    new_vertebral_fracture: vertebral_fracture,
    action: treatment_response < 0 && months_on_therapy >= 24 ? 'reassess_adherence_and_consider_switch' : 'continue',
    citation: CITATIONS.AACE,
  };
}

module.exports = { fraxCalculation, dexaInterpretation, parathyroidWorkup, vitaminDManagement, osteoporosisTreatmentMonitoring, CITATIONS, ValidationError };