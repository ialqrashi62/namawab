/**
 * Cardio-Oncology — Engine
 * Pure functions for Cardio-Onc risk scoring and decision support.
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

const CITATIONS = {
  ESC_2022: 'ESC 2022 Cardio-Onc Guidelines',
  AHA_2023: 'AHA/ACC 2023 Cardio-Onc Statement',
  ICOS_2024: 'IC-OS 2024 ICI Myocarditis',
  ASCO_2020: 'ASCO 2020 Cardioprotection',
  NCCN_2024: 'NCCN 2024 VTE in Cancer',
  HFA_ICOS_2022: 'HFA-ICOS 2022 Risk Score',
};

/**
 * HFA-ICOS Risk Stratification
 */
function hfaIcosRiskScore(input) {
  const { age, cancer_type, therapy, baseline_ef, prior_radiation, comorbidities, anthracycline_dose, baseline_gls } = input;
  let score = 0;
  let risk = 'low';
  // Very high risk factors
  if (baseline_ef < 50) score += 4;
  if (input.prior_cardiotoxicity) score += 4;
  if (anthracycline_dose > 400) score += 4;
  if (input.al_amyloidosis) score += 4;
  // High risk factors
  if (baseline_ef >= 50 && baseline_ef <= 54) score += 3;
  if (anthracycline_dose > 250 && anthracycline_dose <= 400) score += 3;
  if (prior_radiation > 30) score += 3;
  if (baseline_gls < -17) score += 2;
  if (input.valvular_disease) score += 2;
  if (input.hypertensive_cardiomyopathy) score += 2;
  // Moderate risk factors
  if (age >= 65) score += 1;
  if (input.hypertension) score += 1;
  if (input.diabetes) score += 1;
  if (input.smoking) score += 1;
  if (input.hyperlipidemia) score += 1;
  if (input.alcohol) score += 1;
  if (input.creatinine > 1.3) score += 1;
  if (anthracycline_dose > 100 && anthracycline_dose <= 250) score += 1;
  if (input.imt_carotid) score += 1;
  if (therapy === 'trastuzumab') score += 1;
  if (input.combination_therapy) score += 1;
  if (input.chest_radiation_pending) score += 2;
  if (risk === 'low' && score >= 4) risk = 'moderate';
  if (score >= 6) risk = 'high';
  if (score >= 10) risk = 'very_high';
  return { score, risk, recommendation: risk === 'very_high' ? 'MUST involve Cardio-Onc before therapy' : 'Standard Cardio-Onc consult', citation: CITATIONS.HFA_ICOS_2022 };
}

/**
 * CTCAE v5.0 Cardiotoxicity Grade
 */
function ctcaeCardiotoxicityGrade(input) {
  const { ef_drop_pct, symptoms, lvef } = input;
  let grade = 'I';
  if (ef_drop_pct >= 20) grade = 'IV';
  else if (ef_drop_pct >= 10 && lvef < 50) grade = 'III';
  else if (symptoms === 'moderate') grade = 'II';
  else if (ef_drop_pct >= 5) grade = 'I';
  if (input.life_threatening) grade = 'IV';
  if (input.fatal) grade = 'V';
  return { grade, ef_drop_pct, recommendation: grade === 'IV' || grade === 'V' ? 'URGENT Cardio-Onc consult' : 'Continue with monitoring', citation: CITATIONS.ASCO_2020 };
}

/**
 * GLS Change Detection
 */
function glsChangeDetection(input) {
  const { baseline_gls, current_gls } = input;
  const delta = current_gls - baseline_gls;
  const relative_change = (delta / Math.abs(baseline_gls)) * 100;
  let action = 'continue';
  if (Math.abs(relative_change) > 15) action = 'hold_chemo';
  else if (Math.abs(relative_change) > 10) action = 'increase_monitoring';
  return {
    absolute_change: delta,
    relative_change_pct: Math.round(relative_change * 10) / 10,
    action,
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * ICI Myocarditis Severity (IC-OS)
 */
function iciMyocarditis(input) {
  const { troponin, uln, ef_pct, symptoms, ecg_findings, mri_findings, hemodynamics } = input;
  let severity = 'mild';
  const ratio = uln > 0 ? (troponin / uln) : 0;
  if (ratio > 3 && hemodynamics === 'unstable') severity = 'fulminant';
  else if (ratio > 3) severity = 'severe';
  else if (ratio >= 1) severity = 'moderate';
  if (ratio < 1) severity = 'mild';
  let treatment = 'Hold ICI, monitor';
  if (severity === 'moderate') treatment = 'Methylprednisolone 1-2 mg/kg/day';
  if (severity === 'severe') treatment = 'Methylprednisolone 500-1000 mg/day IV';
  if (severity === 'fulminant') treatment = 'ICU + mechanical support + transplant referral';
  return {
    severity,
    troponin_uln_ratio: Math.round(ratio * 10) / 10,
    treatment,
    citation: CITATIONS.ICOS_2024,
  };
}

/**
 * Anthracycline Cumulative Dose
 */
function anthracyclineDose(input) {
  const { drug, total_dose_mg_m2 } = input;
  const factor = { doxorubicin: 1, epirubicin: 0.67, daunorubicin: 0.67, idarubicin: 5, mitoxantrone: 4 };
  const dox_equiv = total_dose_mg_m2 * (factor[drug] || 1);
  let risk = 'low';
  if (dox_equiv > 250) risk = 'moderate';
  if (dox_equiv > 400) risk = 'high';
  if (dox_equiv > 550) risk = 'very_high';
  return {
    doxorubicin_equivalent_mg_m2: Math.round(dox_equiv * 10) / 10,
    risk,
    recommendation: dox_equiv > 400 ? 'Consider Dexrazoxane 10:1 ratio' : 'Monitor EF every 3 months',
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * Trastuzumab Cardiotoxicity Risk
 */
function trastuzumabCardiotoxicityRisk(input) {
  const { baseline_ef, current_ef, time_on_trastuzumab_months, anthracycline_dose } = input;
  const ef_drop = baseline_ef - current_ef;
  let severity = 'none';
  if (ef_drop >= 10 && current_ef < 50) severity = 'moderate';
  else if (ef_drop >= 10) severity = 'mild';
  if (anthracycline_dose > 250) severity = severity === 'mild' ? 'moderate' : 'severe';
  let action = 'Continue trastuzumab';
  if (severity === 'mild') action = 'Hold trastuzumab, optimize cardioprotection, reassess 4 weeks';
  if (severity === 'moderate') action = 'Hold trastuzumab, ACEi + BB, MDT';
  if (severity === 'severe') action = 'Permanent D/C trastuzumab, switch chemo';
  return {
    ef_drop,
    severity,
    action,
    recommendation: action,
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * QTc Monitoring
 */
function qtcMonitoring(input) {
  const { baseline_qtc, current_qtc } = input;
  const delta = current_qtc - baseline_qtc;
  let action = 'continue';
  if (current_qtc > 500) action = 'hold_agent';
  else if (delta > 60) action = 'hold_agent';
  else if (current_qtc > 480) action = 'increase_monitoring';
  return {
    baseline_qtc,
    current_qtc,
    delta_ms: delta,
    action,
    recommendation: action === 'hold_agent' ? 'Hold drug, check electrolytes, correct' : 'Continue with monitoring',
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * Cancer-Associated VTE Treatment
 */
function vteTreatment(input) {
  const { cancer_type, gi_lesions, creatinine, platelet, drug_interactions } = input;
  let first_line = 'doac';
  if (gi_lesions) first_line = 'lmwh';
  if (cancer_type === 'gastric' || cancer_type === 'pancreatic') first_line = 'lmwh';
  if (drug_interactions) first_line = 'lmwh';
  let dose = 'full_dose';
  if (platelet < 50000) dose = 'hold';
  else if (platelet < 25000) dose = 'reduce_dose';
  if (creatinine > 2) first_line = 'lmwh';
  return {
    first_line,
    dose,
    duration_months: 6,
    citation: CITATIONS.NCCN_2024,
  };
}

/**
 * Cardiac Amyloid Workup
 */
function cardiacAmyloidWorkup(input) {
  const { ef_pct, lvef, septal_thickness, lge_present, pyrophosphate_grade, mass_grades } = input;
  let suspicion = 'low';
  if (pyrophosphate_grade >= 2) suspicion = 'high';
  if (lge_present && septal_thickness >= 15) suspicion = 'high';
  if (mass_grades) suspicion = 'high';
  let next_step = 'monitor';
  if (suspicion === 'high' && !pyrophosphate_grade) next_step = 'pyrophosphate_scan';
  if (pyrophosphate_grade >= 2 && !input.ttr_sequenced) next_step = 'TTR_genetic_test';
  if (input.light_chains_abnormal) next_step = 'bone_marrow_biopsy';
  return {
    suspicion,
    next_step,
    recommendation: suspicion === 'high' ? 'Cardio-Onc + Hematology consult + biopsy' : 'Continue monitoring',
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * Cardioprotection Decision
 */
function cardioprotectionDecision(input) {
  const { risk_category, ef_pct, comorbidities } = input;
  const recommended = [];
  if (risk_category === 'high' || risk_category === 'very_high') {
    recommended.push({ drug: 'ACEi', example: 'Enalapril 5-10 mg daily', citation: CITATIONS.ESC_2022 });
    recommended.push({ drug: 'Beta-blocker', example: 'Carvedilol 6.25 mg BID → 25 mg BID', citation: CITATIONS.ESC_2022 });
    recommended.push({ drug: 'Statin', example: 'Atorvastatin 20-40 mg', citation: CITATIONS.ESC_2022 });
  }
  if (input.anthracycline_dose > 300) {
    recommended.push({ drug: 'Dexrazoxane', example: '10:1 ratio with doxorubicin', citation: CITATIONS.ASCO_2020 });
  }
  if (input.gls_drop > 15) {
    recommended.push({ drug: 'ACEi', example: 'Enalapril 10 mg', citation: CITATIONS.ESC_2022 });
  }
  return {
    recommended,
    note: 'Always discuss with oncology before starting cardioprotection',
    citation: CITATIONS.ESC_2022,
  };
}

/**
 * CTCAE Grade by Symptom
 */
function ctcaeGradeBySymptom(input) {
  const { symptoms, severity } = input;
  const map = {
    'none': 'I',
    'mild': 'II',
    'moderate': 'III',
    'severe': 'IV',
    'life_threatening': 'IV',
    'fatal': 'V',
  };
  return { grade: map[severity] || 'I', citation: CITATIONS.ASCO_2020 };
}

module.exports = {
  hfaIcosRiskScore,
  ctcaeCardiotoxicityGrade,
  glsChangeDetection,
  iciMyocarditis,
  anthracyclineDose,
  trastuzumabCardiotoxicityRisk,
  qtcMonitoring,
  vteTreatment,
  cardiacAmyloidWorkup,
  cardioprotectionDecision,
  ctcaeGradeBySymptom,
  CITATIONS,
  ValidationError,
};
