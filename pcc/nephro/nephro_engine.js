/**
 * pcc/nephro/nephro_engine.js — PCC #20: Nephrology
 * 10 deterministic functions for renal medicine.
 *
 * Compliance: KDIGO · KDOQI · NKF · ASN.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. GFR_CKDEPI_2021 — race-free CKD-EPI equation.
 */
function GFR_CKDEPI_2021({ creatinine, age, sex }) {
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;
  const multiplier = sex === 'female' ? 1.012 : 1.0;
  const term = creatinine / kappa;
  const egfr = 142 * Math.pow(Math.min(term, 1), alpha) * Math.pow(Math.max(term, 1), -1.200) * Math.pow(0.9938, age) * multiplier;
  return { egfr: round(egfr, 1), stage: egfr >= 90 ? 1 : egfr >= 60 ? 2 : egfr >= 45 ? '3a' : egfr >= 30 ? '3b' : egfr >= 15 ? 4 : 5 };
}

/**
 * 2. AKIKDIGO_Staging — acute kidney injury criteria.
 */
function AKIKDIGO_Staging({ baselineCr, currentCr, urineOutputMlKgHr, hoursOfOliguria }) {
  const ratio = currentCr / baselineCr;
  let stage = 0;
  if (ratio >= 3 || currentCr >= 4.0) stage = 3;
  else if (ratio >= 2) stage = 2;
  else if (ratio >= 1.5 || currentCr - baselineCr >= 0.3) stage = 1;
  if (urineOutputMlKgHr < 0.3) {
    if (hoursOfOliguria >= 24 || stage < 3) stage = Math.max(stage, 3);
  } else if (urineOutputMlKgHr < 0.5) {
    if (hoursOfOliguria >= 12) stage = Math.max(stage, 2);
  }
  return { stage, requiresRRT: stage === 3 };
}

/**
 * 3. HyperkalemiaECG_Emergency — ECG-driven treatment urgency.
 */
function HyperkalemiaECG_Emergency({ potassium, ecgChanges, dialysisAccess, onLasix }) {
  let action;
  if (ecgChanges === 'peaked_t' || ecgChanges === 'wide_qrs') action = 'calcium_immediately';
  else if (potassium >= 6.5) action = 'insulin_dextrose';
  else if (potassium >= 6.0) action = 'monitor_q1h';
  else action = 'no_immediate_action';
  if (potassium >= 6.5 && !dialysisAccess) action += '_arrange_dialysis';
  if (onLasix && potassium < 5.0) action = 'reduce_lasix';
  return { action, urgency: ecgChanges === 'wide_qrs' ? 'emergent' : ecgChanges === 'peaked_t' ? 'urgent' : 'urgent' };
}

/**
 * 4. RenalReplacementModality — choice between HD, HDF, CRRT, PD.
 */
function RenalReplacementModality({ aki, hemodynamicStability, vascularAccess, residualUrineOutput, fluidOverload, transferToIcuPossible }) {
  if (aki && !hemodynamicStability) return { modality: 'CRRT', reason: 'unstable_aki_continuous_preferred' };
  if (aki && transferToIcuPossible) return { modality: 'SLED', reason: 'hybrid_24h' };
  if (!aki && residualUrineOutput > 200) return { modality: 'PD', reason: 'preserved_residual_function' };
  if (fluidOverload) return { modality: 'HDF', reason: 'high_volume_fluid_removal' };
  return { modality: 'HD_thrice_weekly', reason: 'stable_esrd' };
}

/**
 * 5. RRTInitiationTiming — KDIGO 2012 criteria.
 */
function RRTInitiationTiming({ akiStage, refractoryFluidOverload, refractoryHyperkalemia, severeAcidosis, urea, uremicComplications }) {
  const absolute = akiStage === 3 && (refractoryFluidOverload || refractoryHyperkalemia || severeAcidosis);
  if (absolute) return { initiate: true, urgency: 'emergent', reason: 'life_threatening_complication' };
  if (uremicComplications || urea >= 100) return { initiate: true, urgency: 'urgent' };
  return { initiate: akiStage === 3, urgency: 'monitor_close' };
}

/**
 * 6. HeparinInducedThrombocytopenia — 4T score.
 */
function HeparinInducedThrombocytopenia({ thrombocytopeniaNadir, pltDropPct, timingDays, thrombosis, otherCauses, skinNecrosis }) {
  let score = 0;
  if (pltDropPct >= 50) score += 2;
  else if (pltDropPct >= 30) score += 1;
  if (thrombocytopeniaNadir >= 20) score += 2;
  else if (thrombocytopeniaNadir >= 10) score += 1;
  if (timingDays >= 5 && timingDays <= 10) score += 2;
  else if (timingDays > 10) score += 1;
  if (thrombosis) score += 2;
  if (skinNecrosis) score += 1;
  if (otherCauses) score -= 1;
  let probability = 'low';
  if (score >= 6) probability = 'high';
  else if (score >= 4) probability = 'intermediate';
  return { score, probability, action: probability === 'high' ? 'stop_heparin_start_argatroban' : probability === 'intermediate' ? 'send_antiPF4_antibody' : 'continue_heparin' };
}

/**
 * 7. HyponatremiaCorrection — sodium deficit + correction rate.
 */
function HyponatremiaCorrection({ weightKg, currentNa, targetNa, durationHours }) {
  const deficit = 0.6 * weightKg * (targetNa - currentNa);
  const rate = (targetNa - currentNa) / durationHours;
  let safe;
  if (durationHours >= 48) safe = rate <= 0.5;
  else safe = rate <= 1.0;
  return { deficitMeqL: round(deficit, 1), correctionRateMeqLPerHour: round(rate, 2), safeCorrection: safe, fluidRestriction: currentNa < 125, demyelinationRisk: !safe };
}

/**
 * 8. HypernatremiaCorrection — slow correction rate.
 */
function HypernatremiaCorrection({ weightKg, currentNa, targetNa }) {
  const freeWaterDeficit = 0.4 * weightKg * (currentNa - targetNa) / targetNa;
  const rate = Math.min(0.5, (currentNa - targetNa) / 48);
  return { freeWaterDeficitL: round(freeWaterDeficit, 1), correctionRateMeqLPerHour: round(rate, 2), route: 'oral_or_D5' };
}

/**
 * 9. CKDProgressionMonitoring — frequency of nephrology follow-up by stage.
 */
function CKDProgressionMonitoring({ egfr, albuminuriaCategory, bpControl, diabetesControl, hba1c }) {
  const stage = egfr >= 90 ? 1 : egfr >= 60 ? 2 : egfr >= 45 ? '3a' : egfr >= 30 ? '3b' : egfr >= 15 ? 4 : 5;
  const followUpMonths = stage === 1 ? 12 : stage === 2 ? 6 : stage === '3a' ? 6 : stage === '3b' ? 4 : 3;
  return { stage, followUpMonths, nephrologyReferral: stage === 4 || stage === 5, kidneyBiopsyConsider: stage <= 2 && albuminuriaCategory === 'A3' };
}

/**
 * 10. RenalTransplantEvaluation — eligibility screening.
 */
function RenalTransplantEvaluation({ egfr, age, malignancy, activeInfection, bmi, psychiatricClearance, financialClearance, donorAvailable }) {
  let eligibilityScore = 0;
  if (egfr < 20) eligibilityScore += 3;
  if (age < 70) eligibilityScore += 2;
  if (!malignancy) eligibilityScore += 1;
  if (!activeInfection) eligibilityScore += 2;
  if (bmi < 35) eligibilityScore += 1;
  if (psychiatricClearance) eligibilityScore += 1;
  if (financialClearance) eligibilityScore += 1;
  if (donorAvailable) eligibilityScore += 2;
  return { eligibilityScore, status: eligibilityScore >= 10 ? 'strong_candidate' : eligibilityScore >= 6 ? 'candidate' : 'not_candidate', workup: eligibilityScore >= 6 ? ['cardiology', 'infectious_disease', 'surgical'] : [] };
}

module.exports = {
  GFR_CKDEPI_2021, AKIKDIGO_Staging, HyperkalemiaECG_Emergency,
  RenalReplacementModality, RRTInitiationTiming,
  HeparinInducedThrombocytopenia, HyponatremiaCorrection, HypernatremiaCorrection,
  CKDProgressionMonitoring, RenalTransplantEvaluation,
};
