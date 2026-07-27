'use strict';

// Occupational-Medicine PCC — 10 pure deterministic functions
// Compliance: OSHA, NIOSH, ILO, ACOM, AAOHN, WHO-ICF, JCAHO

const Engine = module.exports = {};

// 1) Fitness-for-duty assessment
Engine.FitnessForDuty = function (input = {}) {
  const { jobType = 'sedentary', cardiovascular = 'cleared', pulmonary = 'cleared', musculoskeletal = 'cleared', vision = 'adequate', hearing = 'adequate', age = 40, comorbidityIndex = 0 } = input;
  let risk = 0;
  if (cardiovascular === 'restricted') risk += 2;
  if (pulmonary === 'restricted') risk += 2;
  if (musculoskeletal === 'restricted') risk += 2;
  if (vision === 'inadequate' && jobType === 'driver') risk += 3;
  if (hearing === 'inadequate' && jobType === 'industrial') risk += 2;
  if (age >= 60) risk += 1;
  if (comorbidityIndex >= 3) risk += 2;
  let fitness;
  if (risk >= 5) fitness = 'unfit-restrictions-required';
  else if (risk >= 3) fitness = 'fit-with-restrictions';
  else fitness = 'fit-full-duty';
  return { riskScore: risk, fitness, recommendation: fitness === 'unfit-restrictions-required' ? 'vocational-rehab-reassignment' : (fitness === 'fit-with-restrictions' ? 'limited-duty-accommodation' : 'clear-for-full-duty') };
};

// 2) Pulmonary Function — OSHA respirator clearance
Engine.RespiratorClearanceOSHA = function (input = {}) {
  const { fev1 = 80, fev1FvcRatio = 0.8, smoking = false, age = 40, bmi = 25, cardiovascular = 'cleared' } = input;
  let clearance;
  if (fev1 < 70 || fev1FvcRatio < 0.7) clearance = 'not-cleared-pulmonary-eval-needed';
  else if (fev1 < 80 || smoking) clearance = 'cleared-with-limitations-annual-retest';
  else if (age >= 65 || bmi >= 40) clearance = 'cleared-with-extra-monitoring';
  else if (cardiovascular === 'restricted') clearance = 'cleared-with-cardiology-clearance';
  else clearance = 'fully-cleared-no-restrictions';
  return { fev1, clearance, recommendation: clearance === 'fully-cleared-no-restrictions' ? 'no-restrictions' : 'OSHA-medical-evaluation-form' };
};

// 3) Hearing conservation — NIOSH
Engine.HearingConservationNIOSH = function (input = {}) {
  const { noiseExposureDb = 75, exposureHours = 8, hearingThresholdShift = 0, baselineThreshold = 25, age = 40 } = input;
  const timeWeighted = noiseExposureDb + (10 * Math.log10(exposureHours / 8));
  const dosi = (timeWeighted / 85) * 100;
  let action;
  if (dosi >= 100) action = 'over-exposure-required-hearing-protection';
  else if (dosi >= 50) action = 'near-limit-hearing-protection-strongly-recommended';
  else action = 'within-limits-monitor';
  let stsl;
  if (hearingThresholdShift >= 25 || baselineThreshold >= 30) stsl = 'standard-threshold-shift-recorded';
  else stsl = 'no-stsl';
  return { dosi: Math.round(dosi * 10) / 10, stsl, action, recommendation: action === 'over-exposure-required-hearing-protection' ? 'mandatory-hearing-protection-audiometry-6mo' : 'annual-audiometry-monitoring' };
};

// 4) Return-to-work post-injury
Engine.ReturnToWorkPlan = function (input = {}) {
  const { injuryType = 'musculoskeletal', daysSinceInjury = 7, functionalCapacity = 'light', workRestrictions = [], jobPhysicalDemand = 'medium', psychologicalReadiness = 'ready' } = input;
  let plan;
  if (daysSinceInjury < 7) plan = 'too-early-no-return';
  else if (jobPhysicalDemand === 'heavy' && functionalCapacity === 'sedentary') plan = 'modified-duty-2-4-weeks';
  else if (jobPhysicalDemand === 'medium' && functionalCapacity === 'light') plan = 'modified-duty-1-2-weeks';
  else if (psychologicalReadiness !== 'ready') plan = 'psychological-clearance-needed';
  else if (workRestrictions.length >= 3) plan = 'modified-duty-multi-restriction';
  else plan = 'full-return-acceptable';
  return { plan, recommendation: plan === 'full-return-acceptable' ? 'release-to-full-duty' : (plan === 'too-early-no-return' ? 'continue-off-work' : 'modified-duty-with-restrictions') };
};

// 5) Ergonomic assessment — RULA / REBA
Engine.RULAERGO = function (input = {}) {
  const { armScore = 1, neckScore = 1, trunkScore = 1, legScore = 1, force = 'low', repetition = 'low' } = input;
  const grandTotal = armScore + neckScore + trunkScore + legScore + (force === 'high' ? 1 : 0) + (repetition === 'high' ? 1 : 0);
  let actionLevel;
  if (grandTotal >= 7) actionLevel = 'action-level-4-investigate-immediately';
  else if (grandTotal >= 5) actionLevel = 'action-level-3-investigate-soon';
  else if (grandTotal >= 3) actionLevel = 'action-level-2-monitor';
  else actionLevel = 'action-level-1-acceptable';
  return { grandTotal, actionLevel, recommendation: actionLevel === 'action-level-4-investigate-immediately' ? 'redesign-workstation-engineering-controls' : 'ergonomic-education' };
};

// 6) Chemical exposure — BEI / TLV
Engine.ChemicalExposureLimit = function (input = {}) {
  const { substance = 'benzene', measuredLevel = 0.5, tlvTwa = 1.0, exposureHours = 8, biologicalMonitor = 0, bei = 1.0 } = input;
  const exposureRatio = measuredLevel / tlvTwa;
  let exposureCategory;
  if (exposureRatio >= 2) exposureCategory = 'over-exposure-immediate-action';
  else if (exposureRatio >= 1) exposureCategory = 'at-limit-reduce-exposure';
  else if (exposureRatio >= 0.5) exposureCategory = 'below-limit-monitor';
  else exposureCategory = 'well-below-limit';
  const biologicalRatio = biologicalMonitor / bei;
  return { exposureRatio: Math.round(exposureRatio * 100) / 100, biologicalRatio: Math.round(biologicalRatio * 100) / 100, exposureCategory, recommendation: exposureCategory === 'over-exposure-immediate-action' ? 'remove-from-exposure-engineering-controls' : 'respiratory-protection-medical-monitoring' };
};

// 7) Shift-work disorder / circadian
Engine.ShiftWorkDisorder = function (input = {}) {
  const { shiftType = 'day', yearsOnShift = 0, sleepHours = 7, sleepQuality = 'good', fatigue = 'mild', comorbidities = 0 } = input;
  let risk;
  if (shiftType === 'night' && yearsOnShift >= 5 && sleepHours < 6) risk = 'high-shift-work-disorder';
  else if (shiftType === 'rotating' && yearsOnShift >= 3) risk = 'moderate-shift-work-disorder';
  else if (fatigue === 'severe' || sleepQuality === 'poor') risk = 'moderate-fatigue';
  else if (comorbidities >= 2) risk = 'moderate-cardiovascular-risk';
  else risk = 'minimal-risk';
  return { risk, recommendation: risk === 'high-shift-work-disorder' ? 'shift-reassignment-sleep-medicine' : (risk === 'moderate-shift-work-disorder' ? 'sleep-hygiene-melatonin-monitoring' : 'annual-health-surveillance') };
};

// 8) Bloodborne pathogen exposure
Engine.BloodborneExposure = function (input = {}) {
  const { exposureType = 'percutaneous', sourceStatus = 'unknown', device = 'hollow-bore-needle', depth = 'superficial', vaccinated = false, volume = 'small' } = input;
  let risk;
  if (sourceStatus === 'HIV-positive' && exposureType === 'percutaneous' && volume === 'large') risk = 'high-risk-HIV';
  else if (sourceStatus === 'HBsAg-positive' && !vaccinated) risk = 'high-risk-HBV';
  else if (sourceStatus === 'HCV-positive' && exposureType === 'percutaneous') risk = 'moderate-risk-HCV';
  else if (sourceStatus === 'unknown' && device === 'hollow-bore-needle') risk = 'moderate-risk-need-followup';
  else if (exposureType === 'mucous-membrane') risk = 'low-risk';
  else risk = 'minimal-risk';
  return { risk, recommendation: risk === 'high-risk-HIV' ? 'PEP-start-within-hours-HCV-HBV-test-6mo' : (risk === 'moderate-risk-HCV' ? 'baseline-HCV-RNA-3-6mo-followup' : 'baseline-testing-6mo-followup') };
};

// 9) Stress / burnout — Maslach
Engine.BurnoutMaslach = function (input = {}) {
  const { emotionalExhaustion = 10, depersonalization = 5, personalAccomplishment = 30, yearsInProfession = 5 } = input;
  let category;
  if (emotionalExhaustion >= 27 || depersonalization >= 10) category = 'severe-burnout';
  else if (emotionalExhaustion >= 17 || depersonalization >= 7) category = 'moderate-burnout';
  else if (personalAccomplishment < 33) category = 'reduced-accomplishment';
  else if (yearsInProfession >= 10) category = 'cumulative-fatigue';
  else category = 'no-burnout';
  return { category, recommendation: category === 'severe-burnout' ? 'urgent-mental-health-referral-consider-leave' : (category === 'moderate-burnout' ? 'EAP-counseling-2-week-followup' : 'resilience-program-monitoring') };
};

// 10) Work-related musculoskeletal disorder (WMSD)
Engine.WMSDRisk = function (input = {}) {
  const { repetitiveMotion = 'low', forceLevel = 'low', awkwardPosture = 'low', vibration = 'low', staticPosture = 'low', durationHours = 4 } = input;
  let score = 0;
  if (repetitiveMotion === 'high') score += 2; else if (repetitiveMotion === 'moderate') score += 1;
  if (forceLevel === 'high') score += 2; else if (forceLevel === 'moderate') score += 1;
  if (awkwardPosture === 'high') score += 2; else if (awkwardPosture === 'moderate') score += 1;
  if (vibration === 'high') score += 2;
  if (staticPosture === 'high') score += 2; else if (staticPosture === 'moderate') score += 1;
  if (durationHours >= 8) score += 1;
  let risk;
  if (score >= 7) risk = 'very-high-WMSD-risk';
  else if (score >= 5) risk = 'high-WMSD-risk';
  else if (score >= 3) risk = 'moderate-WMSD-risk';
  else risk = 'low-WMSD-risk';
  return { score, risk, recommendation: score >= 5 ? 'job-redesign-rotation-frequent-breaks' : 'stretching-microbreaks-training' };
};
