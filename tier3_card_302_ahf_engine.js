/**
 * Advanced Heart Failure — Engine
 * Pure functions for HF clinical scoring and decision support.
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
  AHA_2022: 'AHA/ACC/HFSA 2022 HF Guidelines',
  ESC_2021: 'European Society of Cardiology 2021 HF Guidelines',
  ISHLT_2023: 'ISHLT 2023 Transplant Consensus',
  INTERMACS_2023: 'INTERMACS 2023 Manual',
  SCAI_2022: 'SCAI SHOCK 2022 Stages',
  SCOT_2024: 'Saudi Center for Organ Transplantation 2024',
};

/**
 * NYHA Class
 */
function nyhaClass(input) {
  const class_num = parseInt(input.class);
  const map = {
    1: { name: 'No limitation', description: 'Ordinary physical activity does not cause symptoms' },
    2: { name: 'Slight limitation', description: 'Comfortable at rest, ordinary activity causes symptoms' },
    3: { name: 'Marked limitation', description: 'Comfortable at rest, less than ordinary activity causes symptoms' },
    4: { name: 'Severe limitation', description: 'Symptoms at rest' },
  };
  if (!map[class_num]) throw new ValidationError('INVALID', 'NYHA class must be 1-4');
  return { class: class_num, ...map[class_num], citation: CITATIONS.AHA_2022 };
}

/**
 * ACC/AHA Stage
 */
function accStage(input) {
  const stage = String(input.stage).toUpperCase();
  const map = {
    'A': 'At risk but no structural disease or symptoms',
    'B': 'Structural disease but no symptoms',
    'C': 'Structural disease with prior or current symptoms',
    'D': 'Refractory HF requiring specialized interventions',
  };
  if (!map[stage]) throw new ValidationError('INVALID', 'Stage must be A, B, C, or D');
  return { stage, description: map[stage], citation: CITATIONS.AHA_2022 };
}

/**
 * LVEF Classification
 */
function lvefClassification(input) {
  const ef = parseInt(input.ef_pct);
  if (isNaN(ef) || ef < 0 || ef > 100) throw new ValidationError('INVALID', 'EF must be 0-100%');
  let type = 'normal';
  if (ef <= 40) type = 'HFrEF';
  else if (ef <= 49) type = 'HFmrEF';
  else type = 'HFpEF';
  return { ef_pct: ef, type, severity: type === 'HFrEF' ? 'reduced' : (type === 'HFmrEF' ? 'mid-range' : 'preserved'), citation: CITATIONS.AHA_2022 };
}

/**
 * NT-proBNP Interpretation
 */
function ntprobnpInterpret(input) {
  const value = parseInt(input.nt_probnp);
  const age = parseInt(input.age);
  let threshold = 450;
  if (age >= 75) threshold = 1800;
  let severity = 'normal';
  if (value > threshold) severity = 'elevated';
  if (value > 1000) severity = 'high';
  if (value > 5000) severity = 'critical';
  if (value > 10000) severity = 'severe_disease';
  return { value, threshold_age_adjusted: threshold, severity, citation: CITATIONS.AHA_2022 };
}

/**
 * MAGGIC Score (1-year mortality)
 */
function maggicScore(input) {
  const { age, ef, sbp, bmi, creatinine, nyha, diabetes, copd, smoker, years_since_dx } = input;
  let score = 0;
  if (age >= 80) score += 14;
  else if (age >= 75) score += 12;
  else if (age >= 70) score += 10;
  else if (age >= 65) score += 7;
  else if (age >= 60) score += 4;
  else if (age >= 55) score += 2;
  if (ef < 20) score += 7;
  else if (ef < 25) score += 5;
  else if (ef < 30) score += 3;
  else if (ef < 35) score += 2;
  if (sbp < 110) score += 5;
  else if (sbp < 120) score += 3;
  else if (sbp < 130) score += 2;
  if (bmi < 20) score += 6;
  else if (bmi < 25) score += 4;
  else if (bmi > 35) score += 4;
  if (creatinine > 1.4) score += 5;
  else if (creatinine > 1.2) score += 3;
  if (nyha === 4) score += 10;
  else if (nyha === 3) score += 6;
  if (diabetes) score += 3;
  if (copd) score += 2;
  if (smoker) score += 2;
  if (years_since_dx > 10) score += 2;
  const mortality_1yr = 0.10 + (score * 0.012);
  return { score, mortality_1yr: Math.round(mortality_1yr * 100) / 100, citation: CITATIONS.AHA_2022 };
}

/**
 * INTERMACS Profile
 */
function intermacsProfile(input) {
  const profile = parseInt(input.profile);
  const map = {
    1: 'Critical cardiogenic shock — "Crash and burn"',
    2: 'Progressive decline — "Sliding on inotropes"',
    3: 'Stable but inotrope-dependent — "Dependent stability"',
    4: 'Resting symptoms at home — "Frequent flyer"',
    5: 'Exertion intolerant — "Housebound"',
    6: 'Exertion limited — "Exertion limited"',
    7: 'Advanced NYHA III — "Placeholder"',
  };
  if (!map[profile]) throw new ValidationError('INVALID', 'INTERMACS profile must be 1-7');
  const urgent = profile <= 3;
  return { profile, description: map[profile], mcs_candidate: urgent, citation: CITATIONS.INTERMACS_2023 };
}

/**
 * SCAI Shock Stage
 */
function scaiShockStage(input) {
  const { sbp, lactate, ci, pvr, inotropes, arrest } = input;
  let stage = 'A';
  if (sbp < 90 || lactate > 4 || ci < 1.8 || inotropes > 2) stage = 'C';
  else if (sbp < 90 || lactate > 2 || ci < 2.2 || inotropes > 1) stage = 'B';
  if (arrest) stage = 'E';
  if (ci < 1.0 || svr < 800) stage = 'D';
  const map = {
    'A': 'At risk for cardiogenic shock',
    'B': 'Beginning cardiac insult',
    'C': 'Classic cardiogenic shock',
    'D': 'Deteriorating despite support',
    'E': 'Extremis — cardiac arrest',
  };
  return { stage, description: map[stage], citation: CITATIONS.SCAI_2022 };
}

/**
 * GDMT 4-Pillar Eligibility
 */
function gdmtEligibility(input) {
  const { ef, nyha, systolic_bp, potassium, gfr, hr } = input;
  const pillars = {
    arni: { eligible: true, reason: '' },
    betablocker: { eligible: true, reason: '' },
    mra: { eligible: true, reason: '' },
    sglt2i: { eligible: true, reason: '' },
  };
  if (ef < 40) {
    if (systolic_bp < 100) { pillars.arni.eligible = false; pillars.arni.reason = 'SBP <100'; }
    if (potassium > 5.0) { pillars.mra.eligible = false; pillars.mra.reason = 'K+ >5.0'; }
    if (gfr < 30) { pillars.sglt2i.eligible = false; pillars.sglt2i.reason = 'GFR <30'; pillars.mra.eligible = false; pillars.mra.reason = 'GFR <30'; }
    if (hr < 60) { pillars.betablocker.eligible = false; pillars.betablocker.reason = 'HR <60'; }
  } else {
    pillars.arni.eligible = false; pillars.arni.reason = 'EF >=40 — ARNI not indicated';
    pillars.betablocker.eligible = false; pillars.betablocker.reason = 'EF >=40 — BB not indicated';
    pillars.mra.eligible = false; pillars.mra.reason = 'EF >=40 — MRA not indicated';
    pillars.sglt2i.eligible = false; pillars.sglt2i.reason = 'EF >=40 — SGLT2i may be considered for HFpEF';
  }
  const complete = Object.values(pillars).every(p => p.eligible);
  return { pillars, complete, citation: CITATIONS.AHA_2022 };
}

/**
 * ARNI Dosing (Sacubitril/Valsartan)
 */
function arniDosing(input) {
  const { sbp, potassium, gfr, current_acei } = input;
  if (sbp < 100) throw new ValidationError('CONTRA', 'SBP <100 — avoid ARNI');
  if (potassium > 5.0) throw new ValidationError('CONTRA', 'K+ >5.0 — use caution');
  if (gfr < 30) throw new ValidationError('CONTRA', 'GFR <30 — use caution');
  if (current_acei) throw new ValidationError('CONTRA', '36-hour washout from ACEi required');
  const start_mg = 24_26;  // 24 mg sacubitril / 26 mg valsartan
  const target_mg = 97_103;  // 97 mg / 103 mg BID
  return { start_dose_mg: `${start_mg[0]}/${start_mg[1]} BID`, target_dose_mg: `${target_mg[0]}/${target_mg[1]} BID`, washout_required: true, citation: CITATIONS.AHA_2022 };
}

/**
 * SGLT2i Dosing
 */
function sglt2iDosing(input) {
  const { drug, gfr, egfr_kfre_5yr } = input;
  const drugMap = {
    dapagliflozin: { dose: '10 mg daily', min_gfr: 20, eGFR_KFRE_warn: 20 },
    empagliflozin: { dose: '10 mg daily', min_gfr: 20, eGFR_KFRE_warn: 20 },
  };
  if (!drugMap[drug]) throw new ValidationError('INVALID', 'Drug must be dapagliflozin or empagliflozin');
  const info = drugMap[drug];
  if (gfr < info.min_gfr) throw new ValidationError('CONTRA', `GFR <${info.min_gfr} — contraindicated`);
  return { drug, dose: info.dose, eligible: true, citation: CITATIONS.AHA_2022 };
}

/**
 * LVAD Pre-Op Checklist
 */
function lvadPreOpChecklist(input) {
  const checklist = {
    cardiac_cath: !!input.cardiac_cath,
    rhc_pvr_ok: !!input.rhc_pvr_ok,
    cpet_vo2_low: !!input.cpet_vo2_low,
    renal_gfr_ok: !!input.renal_gfr_ok,
    liver_ok: !!input.liver_ok,
    pulmonary_ok: !!input.pulmonary_ok,
    psychosocial_clear: !!input.psychosocial_clear,
    financial_counseled: !!input.financial_counseled,
    scot_listed_or_dt: !!input.scot_listed_or_dt,
    age_appropriate: !!input.age_appropriate,
  };
  const completed = Object.values(checklist).filter(Boolean).length;
  const total = Object.keys(checklist).length;
  return { items: checklist, completed, total, ready: completed === total, citation: CITATIONS.ISHLT_2023 };
}

/**
 * Heart Transplant Listing Status
 */
function transplantListingStatus(input) {
  const { on_inotropes, icu, mcs, lvad_complications, age, comorbidities } = input;
  let status = 'inactive';
  if (icu && (on_inotropes || mcs)) status = '1A';
  else if (mcs || lvad_complications) status = '1B';
  else if (age >= 18 && comorbidities === 'stable') status = '2';
  return { status, eligible: status !== 'inactive', citation: CITATIONS.ISHLT_2023 };
}

/**
 * LVAD Pump Thrombosis Risk
 */
function lvadPumpThrombosisRisk(input) {
  const { speed_rpm, power_w, flow_lpm, ldh, plasma_hemoglobin } = input;
  const risk = [];
  if (power_w > 7) risk.push('elevated_power');
  if (flow_lpm < 3) risk.push('low_flow');
  if (speed_rpm > 6000) risk.push('high_speed');
  if (ldh > 1000) risk.push('high_ldh');
  if (plasma_hemoglobin > 40) risk.push('high_hemolysis');
  const high_risk = risk.length >= 2;
  return { risk_factors: risk, high_risk, recommendation: high_risk ? 'Urgent LVAD team review — consider CT/MI' : 'Continue monitoring', citation: CITATIONS.INTERMACS_2023 };
}

/**
 * HeartMate 3 Risk Score
 */
function heartMate3Risk(input) {
  const { age, creatinine, ldh, rvad, cardiopulmonary_bypass } = input;
  let score = 0;
  if (age >= 70) score += 2;
  if (creatinine > 1.5) score += 2;
  if (ldh > 1000) score += 2;
  if (rvad) score += 2;
  if (cardiopulmonary_bypass) score += 1;
  return { score, risk_level: score >= 6 ? 'high' : (score >= 3 ? 'moderate' : 'low'), citation: CITATIONS.INTERMACS_2023 };
}

/**
 * Acute Decompensation Diuretic Dose
 */
function diureticDose(input) {
  const { weight_kg, daily_oral_dose, current_creatinine, urine_output_ml_hr } = input;
  const base = daily_oral_dose * 2.5;  // 2.5x oral dose IV
  if (current_creatinine > 2.0) return { iv_dose_mg: base, recommendation: 'Add thiazide for synergy', citation: CITATIONS.AHA_2022 };
  if (urine_output_ml_hr < 30) return { iv_dose_mg: base * 1.5, recommendation: 'High dose + thiazide', citation: CITATIONS.AHA_2022 };
  return { iv_dose_mg: base, recommendation: 'Standard dose', citation: CITATIONS.AHA_2022 };
}

/**
 * Palliative Care Trigger
 */
function palliativeCareTrigger(input) {
  const triggers = [];
  if (input.acc_stage === 'D') triggers.push('ACC Stage D');
  if (input.nyha === 4) triggers.push('NYHA IV persistent');
  if (input.intermacs <= 3) triggers.push('INTERMACS 1-3');
  if (input.multiple_hospitalizations > 3) triggers.push('Multiple HF hospitalizations');
  if (input.cardiac_cachexia) triggers.push('Cardiac cachexia');
  if (input.refractory_shock) triggers.push('Refractory shock');
  return { triggers, eligible: triggers.length >= 2, citation: CITATIONS.AHA_2022 };
}

module.exports = {
  nyhaClass,
  accStage,
  lvefClassification,
  ntprobnpInterpret,
  maggicScore,
  intermacsProfile,
  scaiShockStage,
  gdmtEligibility,
  arniDosing,
  sglt2iDosing,
  lvadPreOpChecklist,
  transplantListingStatus,
  lvadPumpThrombosisRisk,
  heartMate3Risk,
  diureticDose,
  palliativeCareTrigger,
  CITATIONS,
  ValidationError,
};
