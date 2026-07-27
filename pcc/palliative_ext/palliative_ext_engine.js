'use strict';

// Palliative-Care-Extended PCC — 10 pure deterministic functions
// Compliance: WHO-PC, AAHPM, NHPCO, NICE-Palliative, ASCO, NCCN, EAPC

const Engine = module.exports = {};

// 1) ESAS (Edmonton Symptom Assessment System)
Engine.ESASSymptomBurden = function (input = {}) {
  const { pain = 0, fatigue = 0, nausea = 0, depression = 0, anxiety = 0, drowsiness = 0, appetite = 0, wellbeing = 0, dyspnea = 0, sleep = 0 } = input;
  const total = pain + fatigue + nausea + depression + anxiety + drowsiness + appetite + wellbeing + dyspnea + sleep;
  const maxPossible = 100;
  const percent = (total / maxPossible) * 100;
  let severity;
  if (percent >= 70) severity = 'severe-burden-urgent-palliative';
  else if (percent >= 50) severity = 'moderate-severe-burden-palliative-care';
  else if (percent >= 30) severity = 'moderate-burden-monitor';
  else severity = 'mild-burden';
  return { total, percent: Math.round(percent * 10) / 10, severity, recommendation: severity === 'severe-burden-urgent-palliative' ? 'urgent-palliative-consult' : (severity === 'mild-burden' ? 'monitor-routine' : 'palliative-consult') };
};

// 2) PPS (Palliative Performance Scale)
Engine.PalliativePerformanceScale = function (input = {}) {
  const { ambulation = 'normal', activity = 'normal', selfCare = 'full', intake = 'normal', conscious = 'full' } = input;
  let score = 100;
  if (ambulation === 'mainly-bed') score -= 50; else if (ambulation === 'mainly-sit') score -= 30; else if (ambulation === 'reduced') score -= 20;
  if (activity === 'unable') score -= 20; else if (activity === 'reduced') score -= 10;
  if (selfCare === 'severe-assist') score -= 5; else if (selfCare === 'moderate-assist') score -= 3;
  if (intake === 'minimal') score -= 5; else if (intake === 'reduced') score -= 3;
  if (conscious === 'drowsy') score -= 3; else if (conscious === 'confusion') score -= 5;
  if (score < 10) score = 10;
  if (score > 100) score = 100;
  let performanceStatus = score;
  if (score >= 70) performanceStatus = score;
  else performanceStatus = score;
  return { performanceStatus, recommendation: score >= 70 ? 'transition-of-care-discussion' : (score >= 40 ? 'hospice-eligibility-discuss' : 'comfort-care-end-of-life') };
};

// 3) Opioid rotation
Engine.OpioidRotation = function (input = {}) {
  const { currentOpioid = 'morphine', currentDose = 60, targetOpioid = 'oxycodone', reasonForRotation = 'side-effects', painControl = 'inadequate' } = input;
  let indication;
  const mme = currentOpioid === 'morphine' ? currentDose : (currentOpioid === 'oxycodone' ? currentDose * 1.5 : currentDose);
  if (mme >= 200) indication = 'high-dose-rotation-recommended';
  else if (painControl === 'inadequate') indication = 'inadequate-pain-control-rotation';
  else if (reasonForRotation === 'side-effects') indication = 'intolerable-side-effects-rotation';
  else if (mme >= 100) indication = 'moderate-dose-rotation-consider';
  else indication = 'no-immediate-rotation-needed';
  return { indication, recommendation: indication.includes('rotation') ? 'reduce-equivalent-dose-25-50%-start-target' : 'monitor-and-optimize' };
};

// 4) Cancer cachexia
Engine.CancerCachexia = function (input = {}) {
  const { weightLoss6mo = 0, bmi = 25, albumin = 4, inflammation = 'none' } = input;
  let stage;
  if (weightLoss6mo >= 15 || bmi < 18.5 || (albumin < 2.5 && inflammation === 'high')) stage = 'refractory-cachexia';
  else if (weightLoss6mo >= 5 && inflammation === 'high') stage = 'cachexia-with-inflammation';
  else if (weightLoss6mo >= 5) stage = 'pre-cachexia';
  else if (bmi < 20) stage = 'underweight-monitor';
  else stage = 'no-cachexia';
  return { stage, recommendation: stage === 'refractory-cachexia' ? 'comfort-nutrition-MDT' : (stage === 'cachexia-with-inflammation' ? 'anti-inflammatory-nutrition-support' : 'monitor-nutrition') };
};

// 5) Terminal delirium
Engine.TerminalDelirium = function (input = {}) {
  const { reversibility = 'irreversible', daysToDeath = 7, agitation = 'severe' } = input;
  let classification;
  if (reversibility === 'irreversible' && daysToDeath <= 3) classification = 'terminal-delirium';
  else if (reversibility === 'irreversible' && daysToDeath <= 14) classification = 'pre-terminal-delirium';
  else if (reversibility === 'reversible') classification = 'reversible-delirium-treat-cause';
  else classification = 'palliative-delirium';
  return { classification, recommendation: classification === 'terminal-delirium' ? 'symptomatic-haloperidol-comfort' : (classification === 'reversible-delirium-treat-cause' ? 'workup-and-treat-cause' : 'haloperidol-monitor') };
};

// 6) Dyspnea management
Engine.DyspneaManagement = function (input = {}) {
  const { spo2 = 95, respiratoryRate = 18, useOfAccessory = false, opioidNaive = true, anxiety = false } = input;
  let category;
  if (spo2 < 88 && respiratoryRate >= 30) category = 'severe-dyspnea-opioid-needed';
  else if (spo2 < 90 || useOfAccessory) category = 'moderate-dyspnea-consider-opioid';
  else if (respiratoryRate >= 24) category = 'mild-dyspnea-non-pharm';
  else category = 'no-dyspnea';
  return { category, recommendation: category === 'severe-dyspnea-opioid-needed' ? 'IV/SC-morphine-2.5-5mg-blow-by-O2' : (category === 'moderate-dyspnea-consider-opioid' ? 'low-dose-morphine-fan-oxygen' : 'fan-positioning-oxygen') };
};

// 7) Delirium — palliative
Engine.DeliriumPalliative = function (input = {}) {
  const { agitation = 'mild', reversibility = 'unknown', daysToDeath = 30, priorEpisode = false } = input;
  let classification;
  if (agitation === 'severe' && daysToDeath <= 14) classification = 'severe-delirium';
  else if (agitation === 'severe') classification = 'severe-delirium';
  else if (agitation === 'moderate') classification = 'moderate-delirium';
  else if (agitation === 'mild' && reversibility === 'irreversible') classification = 'mild-irreversible-delirium';
  else if (agitation === 'mild') classification = 'mild-delirium';
  else classification = 'subsyndromal-delirium';
  return { classification, recommendation: classification.includes('severe') ? 'haloperidol-2-5mg-IV-SC' : (classification.includes('moderate') ? 'haloperidol-1mg-low-dose' : 'monitor-orientation') };
};

// 8) Prognosis estimate — palliative
Engine.PrognosisEstimate = function (input = {}) {
  const { performanceStatus = 70, albumin = 3.5, delirium = false, edVisits = 0, weightLoss = false } = input;
  let score = 0;
  if (performanceStatus < 30) score += 3; else if (performanceStatus < 50) score += 2; else if (performanceStatus < 70) score += 1;
  if (albumin < 2.5) score += 3; else if (albumin < 3) score += 2; else if (albumin < 3.5) score += 1;
  if (delirium) score += 1;
  if (edVisits >= 2) score += 1;
  if (weightLoss) score += 1;
  let prognosisCategory;
  if (score >= 7) prognosisCategory = 'days-1-7';
  else if (score >= 5) prognosisCategory = 'weeks-1-4';
  else if (score >= 3) prognosisCategory = 'months-1-3';
  else if (score >= 1) prognosisCategory = 'months-3-6';
  else prognosisCategory = 'months-6-plus';
  return { score, prognosisCategory, recommendation: score >= 5 ? 'hospice-eligibility-discuss' : 'palliative-care-monitoring' };
};

// 9) Artificial nutrition
Engine.ArtificialNutrition = function (input = {}) {
  const { lifeExpectancyDays = 30, swallowingStatus = 'normal', prognosis = 'good' } = input;
  let recommendation;
  if (lifeExpectancyDays <= 7 && swallowingStatus === 'NPO') recommendation = 'comfort-feeds-only';
  else if (lifeExpectancyDays <= 30 && prognosis === 'poor') recommendation = 'carefully-consider-artificial-nutrition';
  else if (swallowingStatus === 'NPO' && prognosis === 'good') recommendation = 'enteral-nutrition-NGT-or-PEG';
  else if (swallowingStatus === 'partial') recommendation = 'texture-modified-diet-oral-supplements';
  else recommendation = 'normal-oral-intake';
  return { recommendation, recommendation_detail: recommendation === 'comfort-feeds-only' ? 'symptom-management-no-tubes' : recommendation };
};

// 10) Grief / bereavement
Engine.GriefBereavement = function (input = {}) {
  const { durationMonths = 1, suicidal = false, functioning = 'mild-impairment', depressionSymptoms = false } = input;
  let classification;
  if (suicidal) classification = 'complicated-grief-suicide-risk';
  else if (durationMonths > 12 && functioning === 'severe-impairment') classification = 'prolonged-grief-disorder';
  else if (durationMonths > 6 && functioning === 'moderate-impairment') classification = 'prolonged-grief-monitor';
  else if (depressionSymptoms && durationMonths > 6) classification = 'complicated-grief-depression';
  else if (durationMonths <= 6) classification = 'normal-grief';
  else classification = 'monitoring-grief';
  return { classification, recommendation: classification.includes('complicated') || classification === 'prolonged-grief-disorder' ? 'psychiatry-bereavement-counseling' : 'bereavement-support' };
};
