/**
 * pcc/ticu/ticu_engine.js — PCC #7: Trauma ICU
 * 10 deterministic functions.
 */
'use strict';

function ICPMonitorTrend({ currentIcp, baselineIcp, timeMinutes }) {
  const delta = currentIcp - baselineIcp;
  const ratePerMin = timeMinutes > 0 ? delta / timeMinutes : 0;
  let status;
  if (currentIcp > 25) status = 'critical';
  else if (delta > 5 && timeMinutes < 30) status = 'rising_rapidly';
  else if (currentIcp > 20) status = 'elevated';
  else if (currentIcp > 15) status = 'mildly_elevated';
  else status = 'normal';
  return { currentIcp, baselineIcp, delta, ratePerMin, status, requiresTreatment: status !== 'normal' };
}

function CerebralPerfusionPressure({ map, icp }) {
  const cpp = map - icp;
  let status;
  if (cpp < 50) status = 'critical_low';
  else if (cpp < 60) status = 'below_target';
  else if (cpp > 70) status = 'above_target';
  else status = 'optimal';
  return { cpp, status, targetRange: '60-70' };
}

function GCSProgression({ baselineGcs, currentGcs, timeHours }) {
  const delta = currentGcs - baselineGcs;
  const ratePerHour = timeHours > 0 ? delta / timeHours : 0;
  if (currentGcs <= 8) return { status: 'severe', intubate: true, icpMonitor: true };
  if (delta <= -2) return { status: 'worsening', intubate: false, icpMonitor: delta <= -3 };
  if (delta >= 2) return { status: 'improving', intubate: false, icpMonitor: false };
  return { status: 'stable', intubate: false, icpMonitor: false };
}

function CervicalSpineClearance({ nuchalTenderness, midlineTenderness, rangeOfMotion, intoxication, distractingInjury, alteredMentalStatus, age }) {
  if (nuchalTenderness || midlineTenderness) return { cleared: false, imaging: 'CT_cervical' };
  if (intoxication || alteredMentalStatus || distractingInjury) return { cleared: false, imaging: 'CT_cervical_then_MRI_when_able' };
  if (age < 14) return { cleared: false, imaging: 'CT_MRI_combined' };
  if (rangeOfMotion === 'full_painfree') return { cleared: true, imaging: null };
  return { cleared: false, imaging: 'CT_cervical' };
}

function CompartmentPressure({ pressureMmHg, diastolicBP, location }) {
  const delta = diastolicBP - pressureMmHg;
  let status;
  if (delta < 30) status = 'fasciotomy_immediate';
  else if (delta < 40) status = 'impending_close_follow_recheck';
  else status = 'normal';
  return { status, delta, location, requiresFasciotomy: status === 'fasciotomy_immediate' };
}

function CrushRhabdomyolysis({ ckLevel, urineOutputMlPerHour, potassium, calcium, fluidRateMlPerHour }) {
  const risk = {
    ckHigh: ckLevel > 5000,
    oliguria: urineOutputMlPerHour < 200,
    hyperkalemia: potassium > 6,
    hypocalcemia: calcium < 8,
    underResuscitated: fluidRateMlPerHour < 500,
  };
  const riskCount = Object.values(risk).filter(Boolean).length;
  return {
    severity: riskCount >= 3 ? 'severe' : riskCount >= 1 ? 'moderate' : 'mild',
    riskFactors: risk,
    requiresDialysis: risk.ckHigh && risk.oliguria,
  };
}

function VTEProphylaxis({ injuryPattern, timeSinceInjury, bleedingRisk, contraindication, weightKg }) {
  if (contraindication) return { lwmh: false, reason: 'contraindicated' };
  if (timeSinceInjury < 24) return { lwmh: false, mechanicalOnly: true, reason: 'within_24h' };
  if (bleedingRisk === 'high') return { lwmh: false, mechanicalOnly: true, reason: 'high_bleeding_risk' };
  if (weightKg < 50) return { lwmh: true, dose: 'enoxaparin_30mg_subq_daily', monitoring: 'anti_xa' };
  return { lwmh: true, dose: 'enoxaparin_40mg_subq_daily', monitoring: 'standard' };
}

function PulmonaryEmbolismRuleOut({ wellsScore, age, hr, spo2, hemodynamicallyStable, recentSurgery }) {
  if (!hemodynamicallyStable) return { peLikely: true, requiresCTPA: true, severity: 'massive' };
  if (wellsScore >= 6) return { peLikely: true, requiresCTPA: true, severity: 'submassive_if_stable' };
  if (wellsScore >= 2) return { peLikely: 'intermediate', requiresCTPA: true, severity: 'subsegmental_possible' };
  if (wellsScore < 2) return { peLikely: 'low', requiresCTPA: false, severity: 'unlikely' };
  return { peLikely: 'unknown', requiresCTPA: true };
}

function RehabilitationEligibility({ gcs, mobility, cognitiveStatus, socialSupport, premorbidFunctional }) {
  if (gcs <= 8) return { eligible: false, reason: 'not_awake' };
  if (cognitiveStatus === 'impaired_severe') return { eligible: false, reason: 'cognitive' };
  if (mobility === 'bedbound' && premorbidFunctional === 'independent') return { eligible: true, level: 'early_mobility' };
  if (mobility === 'sitting') return { eligible: true, level: 'transfer_training' };
  if (mobility === 'standing') return { eligible: true, level: 'gait_training' };
  return { eligible: true, level: 'full_rehab' };
}

function MassiveTransfusion({ hr, sbp, lactate, baseDeficit, positiveFAST, penetratingTrauma }) {
  let triggers = 0;
  if (hr > 120) triggers++;
  if (sbp < 90) triggers++;
  if (lactate > 4) triggers++;
  if (baseDeficit < -6) triggers++;
  if (positiveFAST) triggers += 2;
  if (penetratingTrauma) triggers++;
  return { mtpActivated: triggers >= 3, ratio: '1:1:1', firstRoundUnits: 6, triggersCount: triggers };
}

module.exports = {
  ICPMonitorTrend, CerebralPerfusionPressure, GCSProgression,
  CervicalSpineClearance, CompartmentPressure, CrushRhabdomyolysis,
  VTEProphylaxis, PulmonaryEmbolismRuleOut, RehabilitationEligibility,
  MassiveTransfusion,
};
