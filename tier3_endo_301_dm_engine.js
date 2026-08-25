/**
 * TIER3_ENDO-301 Diabetes Mellitus Engine
 * ADA 2024 staging + DKA/HHS management + insulin dosing + complications screening + CGM interpretation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ADA_2024: 'ADA Standards of Care 2024', ISPAD: 'ISPAD 2024' };

function dmDiagnosisClassification(input) {
  const { age, bmi, autoantibodies, c_peptide, ketones, onset_acute, family_history_t1, family_history_t2 } = input;
  let type = 'unclassified';
  if (autoantibodies === 'positive' || onset_acute || c_peptide < 0.6) type = 'T1DM';
  else if (bmi >= 25 && age >= 30 && c_peptide >= 1.0) type = 'T2DM';
  else if (onset_acute && bmi < 25) type = 'ketosis_prone_T2DM';
  else if (family_history_t1 && autoantibodies === 'negative') type = 'possible_MODY';
  return {
    type, age, bmi, c_peptide,
    autoantibody_positive: autoantibodies === 'positive',
    cgm_recommended: type !== 'unclassified',
    citation: CITATIONS.ADA_2024,
  };
}

function dkaManagement(input) {
  const { glucose_mg_dl, ph, bicarbonate, anion_gap, potassium, ketones, mental_status } = input;
  const severity = ph < 7 ? 'severe' : ph < 7.2 ? 'moderate' : 'mild';
  return {
    severity,
    iv_fluid: '0.9% saline 15-20 mL/kg bolus first hour, then 250-500 mL/hr based on corrected Na',
    insulin_drip: '0.1 U/kg/hr IV bolus then 0.1 U/kg/hr continuous',
    target_glucose_decline: '50-75 mg/dL per hour',
    dextrose_add: glucose_mg_dl < 200 ? 'add_D5W_to_fluids' : 'continue_until_anion_gap_closure',
    potassium_management: potassium < 3.3 ? 'hold_insulin_replete_K_first' : potassium > 5.3 ? 'hold_supplementation' : '20-30 mEq/L in fluids',
    bicarb: ph < 6.9 ? 'consider_sodium_bicarb' : 'not_indicated',
    switch_to_subq_criteria: 'anion_gap_closed + pH > 7.3 + subQ insulin overlap 2h',
    citation: CITATIONS.ADA_2024,
  };
}

function hhsManagement(input) {
  const { glucose_mg_dl, effective_osmolality, mental_status, sodium_corrected, age } = input;
  const severity = effective_osmolality >= 340 ? 'severe' : 'moderate';
  return {
    severity,
    fluid_resuscitation: '0.9% saline first hour 15-20 mL/kg, then 250-500 mL/hr depending on CVP/urine output',
    target_decline_osm: '3-8 mOsm/hr',
    glucose_target: '250-300 mg/dL add D5W',
    replace_deficit: sodium_corrected && sodium_corrected > 145 ? 'switch_to_0.45_saline' : 'continue_NS',
    insulin_dose: '0.05 U/kg/hr IV (lower than DKA due to fluid shifts)',
    complications: ['thrombosis', 'rhabdomyolysis', 'AKI', 'stroke'],
    citation: CITATIONS.ADA_2024,
  };
}

function insulinDosingBasalBolus(input) {
  const { weight_kg, tdd_units_previous, glucose_avg_mg_dl, glucose_target, sensitivity_factor, carb_ratio } = input;
  const tdd = tdd_units_previous || weight_kg * 0.5;
  const basal = Math.round(tdd * 0.5 * 10) / 10;
  const bolus_total = Math.round(tdd * 0.5 * 10) / 10;
  const sf = sensitivity_factor || 1800 / tdd;
  const cr = carb_ratio || 450 / tdd;
  return {
    tdd: Math.round(tdd * 10) / 10,
    basal_long_acting: basal,
    bolus_total_daily: bolus_total,
    sensitivity_factor: Math.round(sf * 10) / 10,
    carb_ratio: Math.round(cr),
    glucose_target,
    citation: CITATIONS.ADA_2024,
  };
}

function complicationsScreening(input) {
  const { dm_type, years_since_diagnosis, age, last_eye_exam_months, last_foot_exam_months, egfr, uacr, ldl, bp, last_dental } = input;
  return {
    retinopathy: dm_type === 'T1DM' && years_since_diagnosis >= 5 ? 'annual_eye_exam' : 'annual_eye_exam_after_diagnosis',
    nephropathy: years_since_diagnosis >= 5 || egfr < 60 || uacr >= 30 ? 'egfr_annually + uacr' : 'egfr_annually',
    foot_exam: 'every_visit_for_high_risk_annually_for_all',
    lipid: ldl >= 70 ? 'statin_therapy' : 'statin_consider',
    bp_target: bp >= 130 ? 'tight_control' : 'maintain',
    dental: last_dental > 12 ? 'annual_reminder' : 'current',
    depression: 'screen_annually',
    citation: CITATIONS.ADA_2024,
  };
}

function cgmInterpretation(input) {
  const { tir_pct, time_below_range_pct, time_above_range_pct, glucose_variability_pct, estimated_a1c } = input;
  return {
    tir_pct, time_below_range_pct, time_above_range_pct, glucose_variability_pct: Math.round(glucose_variability_pct * 100) / 100,
    estimated_a1c: estimated_a1c ? Math.round(estimated_a1c * 10) / 10 : null,
    control_status: tir_pct >= 70 && time_below_range_pct < 4 ? 'good' : tir_pct >= 50 ? 'suboptimal' : 'poor',
    interventions: tir_pct < 70 ? ['basal_rate_adjust', 'meal_management', 'cgm_alarm_review'] : ['maintain'],
    citation: CITATIONS.ADA_2024,
  };
}

module.exports = { dmDiagnosisClassification, dkaManagement, hhsManagement, insulinDosingBasalBolus, complicationsScreening, cgmInterpretation, CITATIONS, ValidationError };