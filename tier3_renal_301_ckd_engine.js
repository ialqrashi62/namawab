/**
 * TIER3_RENAL-301 CKD Engine
 * CKD-EPI 2021 eGFR + KDIGO staging + albuminuria + anemia management + bone-mineral
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_2024: 'KDIGO CKD 2024', KDIGO_BMD: 'KDIGO CKD-MBD 2017' };

function ckdEpiEgfr(input) {
  const { creatinine, age, gender, race } = input;
  if (!creatinine || !age || !gender) throw new ValidationError('INVALID', 'creatinine, age, gender required');
  const kappa = gender === 'female' ? 0.7 : 0.9;
  const alpha = gender === 'female' ? -0.241 : -0.302;
  const sexFactor = gender === 'female' ? 1.012 : 1;
  const raceFactor = (race === 'black' && gender === 'female') ? 1.08 : 1;
  const min_ratio = Math.min(creatinine / kappa, 1);
  const max_ratio = Math.max(creatinine / kappa, 1);
  const egfr = 142 * Math.pow(min_ratio, alpha) * Math.pow(max_ratio, -1.200) * Math.pow(0.9938, age) * sexFactor * raceFactor;
  return { egfr: Math.round(egfr * 100) / 100, formula: 'CKD-EPI 2021', citation: CITATIONS.KDIGO_2024 };
}

function kdigoStaging(input) {
  const { egfr, uacr } = input;
  let gfr_stage = 'G1'; let gfr_desc = 'Normal (>=90)';
  if (egfr < 15) { gfr_stage = 'G5'; gfr_desc = 'Kidney failure (<15)'; }
  else if (egfr < 30) { gfr_stage = 'G4'; gfr_desc = 'Severe decrease (15-29)'; }
  else if (egfr < 60) { gfr_stage = 'G3'; gfr_desc = 'Moderate decrease (30-59)'; }
  else if (egfr < 90) { gfr_stage = 'G2'; gfr_desc = 'Mild decrease (60-89)'; }
  let alb_stage = 'A1'; let alb_desc = '<30 mg/g (normal-mild)';
  if (uacr >= 300) { alb_stage = 'A3'; alb_desc = '>=300 mg/g (severely increased)'; }
  else if (uacr >= 30) { alb_stage = 'A2'; alb_desc = '30-299 mg/g (moderately increased)'; }
  return {
    gfr_stage, gfr_desc, alb_stage, alb_desc,
    risk_category: { 'G1A1': 'low', 'G2A1': 'low', 'G3aA1': 'moderate', 'G3bA1': 'high', 'G4A1': 'high', 'G5A1': 'very_high', 'G3aA2': 'high', 'G3bA2': 'very_high' }[`${gfr_stage}${alb_stage}`] || 'very_high',
    nephrology_referral: egfr < 30 || uacr >= 300,
    citation: CITATIONS.KDIGO_2024,
  };
}

function anemiaManagement(input) {
  const { hemoglobin, transferrin_saturation, ferritin, egfr, on_esa } = input;
  let recommend_esa = false; let iron_indicated = false; let iron_type = 'none';
  if (hemoglobin < 10 && egfr < 30) recommend_esa = !on_esa;
  if (transferrin_saturation < 30 || ferritin < 500) iron_indicated = true;
  if (hemoglobin < 11) iron_type = 'IV_iron';
  else if (transferrin_saturation < 30) iron_type = 'oral_iron';
  return { target_hgb: 10, recommend_esa, iron_indicated, iron_type, citation: CITATIONS.KDIGO_2024 };
}

function ckdMbd(input) {
  const { calcium, phosphorus, pth, vitamin_d_25oh } = input;
  return {
    hyperphosphatemia: phosphorus > 5.5,
    hyperparathyroidism: pth > 65,
    vitamin_d_deficient: vitamin_d_25oh < 20,
    phosphate_binder: phosphorus > 5.5 ? 'sevelamer OR lanthanum' : 'not_indicated',
    cinacalcet: pth > 800 ? 'consider_cinacalcet' : 'not_indicated',
    calcitriol: pth > 300 && vitamin_d_25oh < 30 ? 'consider_active_vitamin_D' : 'not_indicated',
    citation: CITATIONS.KDIGO_BMD,
  };
}

function ckdProgression(input) {
  const { baseline_egfr, current_egfr, months_between } = input;
  const slope_per_year = ((current_egfr - baseline_egfr) / months_between) * 12;
  return {
    slope_ml_per_min_per_year: Math.round(slope_per_year * 100) / 100,
    rapid_progressor: slope_per_year < -5,
    recommend_nephrology: slope_per_year < -5 || current_egfr < 30,
    recommend_renin_angiotensin_blockade: slope_per_year < -3,
  };
}

function dialysisReadiness(input) {
  const { egfr, symptoms, uremic, fluid_overload, age, comorbidity } = input;
  const urgent_referral = egfr < 20 || uremic || fluid_overload;
  const plan_access = egfr < 20 && comorbidity === 'favorable' ? 'AVF_planning' : 'monitor';
  return { urgent_referral, plan_access, modality_options: egfr < 15 ? ['hemodialysis', 'peritoneal_dialysis', 'transplant'] : ['monitor_preemptive_transplant'] };
}

module.exports = { ckdEpiEgfr, kdigoStaging, anemiaManagement, ckdMbd, ckdProgression, dialysisReadiness, CITATIONS, ValidationError };