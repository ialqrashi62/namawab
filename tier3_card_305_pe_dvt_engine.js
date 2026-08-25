/**
 * PE/DVT — Engine
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
  ESC_2019: 'ESC 2019 PE Guidelines',
  ACC_2024: 'ACC 2024 PE',
  AHA_2024: 'AHA 2024 PE',
  CHEST_2024: 'CHEST 2024 Antithrombotic',
};

/**
 * sPESI Score
 */
function sPesi(input) {
  const { age, cancer, chronic_cardiopulmonary, sbp, hr, spo2 } = input;
  let score = 0;
  if (age > 80) score += 1;
  if (cancer) score += 1;
  if (chronic_cardiopulmonary) score += 1;
  if (sbp < 100) score += 1;
  if (hr >= 110) score += 1;
  if (spo2 < 90) score += 1;
  const risk = score === 0 ? 'low' : 'high';
  const mortality_30d = score === 0 ? 1.1 : 8.9;
  return { score, risk, mortality_30d_pct: mortality_30d, citation: CITATIONS.ESC_2019 };
}

/**
 * Wells DVT Score
 */
function wellsDvt(input) {
  const { active_cancer, paralysis_recent_immob, recently_bedridden, localized_tenderness, entire_leg_swollen, calf_swelling_3cm, pitting_edema_collateral, alternative_diagnosis_likely, previous_dvt } = input;
  let score = 0;
  if (active_cancer) score += 1;
  if (paralysis_recent_immob) score += 1;
  if (recently_bedridden) score += 1;
  if (localized_tenderness) score += 1;
  if (entire_leg_swollen) score += 1;
  if (calf_swelling_3cm) score += 1;
  if (pitting_edema_collateral) score += 1;
  if (previous_dvt) score += 1;
  if (alternative_diagnosis_likely) score -= 2;
  let probability = 'low';
  if (score >= 3) probability = 'high';
  else if (score >= 1) probability = 'moderate';
  return { score, probability, citation: CITATIONS.ACC_2024 };
}

/**
 * Wells PE Score
 */
function wellsPe(input) {
  const { clinical_signs_dvt, pe_most_likely, hr_gt_100, immob_surgery, previous_dvt_pe, hemoptysis, malignancy } = input;
  let score = 0;
  if (clinical_signs_dvt) score += 3;
  if (pe_most_likely) score += 3;
  if (hr_gt_100) score += 1.5;
  if (immob_surgery) score += 1.5;
  if (previous_dvt_pe) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;
  let probability = 'low';
  if (score > 6) probability = 'high';
  else if (score > 1) probability = 'moderate';
  return { score, probability, citation: CITATIONS.ESC_2019 };
}

/**
 * PE Severity Classification
 */
function peSeverity(input) {
  const { hemodynamically_unstable, rv_dysfunction, biomarker_positive, sbp, cardiac_arrest } = input;
  if (hemodynamically_unstable || cardiac_arrest) {
    return { severity: 'massive', rv_lv_ratio: input.rv_lv_ratio, recommendation: 'PERT activation + thrombolysis', citation: CITATIONS.ESC_2019 };
  }
  if (rv_dysfunction && biomarker_positive) {
    return { severity: 'intermediate_high', recommendation: 'PERT + close monitoring + consider thrombolysis', citation: CITATIONS.ESC_2019 };
  }
  if (rv_dysfunction || biomarker_positive) {
    return { severity: 'intermediate_low', recommendation: 'Anticoagulation + monitoring', citation: CITATIONS.ESC_2019 };
  }
  return { severity: 'low', recommendation: 'Anticoagulation + early discharge', citation: CITATIONS.ESC_2019 };
}

/**
 * Thrombolysis Eligibility
 */
function thrombolysisEligibility(input) {
  const { massive_pe, sbp, age, recent_surgery, recent_stroke, active_bleeding, intracranial_hemorrhage_history } = input;
  const eligible = massive_pe && sbp < 90 && !recent_surgery && !recent_stroke && !active_bleeding && !intracranial_hemorrhage_history;
  let drug = 'Alteplase';
  let dose = '100 mg IV over 2 hours';
  if (age < 65) { drug = 'Tenecteplase'; dose = '30-50 mg IV bolus'; }
  return { eligible, drug, dose, contraindication: !eligible ? (recent_surgery ? 'Recent surgery' : recent_stroke ? 'Recent stroke' : active_bleeding ? 'Active bleeding' : 'History of ICH') : null, citation: CITATIONS.ACC_2024 };
}

/**
 * Catheter-Directed Therapy
 */
function catheterDirectedTherapy(input) {
  const { intermediate_high_pe, contraindications_systemic, ekos_available, age, bleeding_risk } = input;
  const eligible = intermediate_high_pe && contraindications_systemic && ekos_available;
  return { eligible, device: 'EKOS', duration_hours: 12, citation: CITATIONS.ACC_2024 };
}

/**
 * Mechanical Thrombectomy
 */
function mechanicalThrombectomy(input) {
  const { massive_pe, intermediate_high_pe, contraindications, flowtriever_available } = input;
  const eligible = (massive_pe || intermediate_high_pe) && contraindications && flowtriever_available;
  return { eligible, device: 'FlowTriever / Indigo', citation: CITATIONS.ACC_2024 };
}

/**
 * IVC Filter Decision
 */
function ivcFilterDecision(input) {
  const { acute_anticoagulation_contraindicated, pe_with_dvt, recurrent_pe_on_anticoag } = input;
  const eligible = acute_anticoagulation_contraindicated || (pe_with_dvt && recurrent_pe_on_anticoag);
  return { eligible, type: 'Retrievable', retrieval_window_days: 30, citation: CITATIONS.ACC_2024 };
}

/**
 * Anticoagulation Choice
 */
function anticoagulationChoice(input) {
  const { cancer, gi_lesions, pregnancy, mechanical_heart_valve, severe_renal_impairment, hemodynamics } = input;
  let first_line = 'apixaban';
  if (cancer) first_line = 'doac';
  if (cancer && (gi_lesions || input.gastric_cancer)) first_line = 'lmwh';
  if (pregnancy) first_line = 'lmwh';
  if (mechanical_heart_valve) first_line = 'warfarin';
  if (severe_renal_impairment) first_line = 'warfarin';
  return { first_line, duration_months: 3, citation: CITATIONS.CHEST_2024 };
}

/**
 * CTEPH Workup
 */
function ctephWorkup(input) {
  const { persistent_dyspnea_after_pe, vq_scan_mismatch, mean_pa_pressure_gt_20, pvr_gt_2 } = input;
  const suspected = persistent_dyspnea_after_pe && (vq_scan_mismatch || mean_pa_pressure_gt_20);
  return {
    suspected,
    workup_recommendation: suspected ? 'V/Q scan + Right heart cath' : 'Continue anticoagulation',
    pea_eligible: suspected && pvr_gt_2 ? true : false,
    citation: CITATIONS.ESC_2019,
  };
}

/**
 * PERT Activation Decision
 */
function pertActivation(input) {
  const { massive_pe, intermediate_high_pe, deterioration, rv_failure, thrombolysis_being_considered } = input;
  const activate = massive_pe || intermediate_high_pe || deterioration || rv_failure || thrombolysis_being_considered;
  return {
    activate,
    teams_to_activate: activate ? ['Cardiology', 'Pulmonology', 'Cardiac Surgery', 'IR', 'Hematology', 'ICU'] : [],
    citation: CITATIONS.AHA_2024,
  };
}

/**
 * Bleeding Risk on Anticoagulation
 */
function bleedingRiskAssessment(input) {
  const { has_bled_score, recent_bleeding, intracranial_aneurysm, platelet } = input;
  let risk = 'low';
  if (has_bled_score >= 3 || recent_bleeding) risk = 'high';
  if (platelet < 50000) risk = 'very_high';
  return { risk, recommendation: risk === 'very_high' ? 'Hold anticoagulation, IVC filter' : 'Continue with monitoring', citation: CITATIONS.CHEST_2024 };
}

module.exports = {
  sPesi, wellsDvt, wellsPe, peSeverity, thrombolysisEligibility,
  catheterDirectedTherapy, mechanicalThrombectomy, ivcFilterDecision,
  anticoagulationChoice, ctephWorkup, pertActivation, bleedingRiskAssessment,
  CITATIONS, ValidationError,
};
