'use strict';

// Cardiothoracic-Surgery PCC — 10 pure deterministic functions
// Compliance: STS, ACC/AHA, ESC, EACTS, ISHLT, AATS, NMDP

const Engine = module.exports = {};

// 1) CABG risk — EuroSCORE II
Engine.CABGEuroSCOREII = function (input = {}) {
  const { age = 60, sex = 'male', creatinine = 100, ef = 50, previousMI = false, pulmonaryDisease = false, neurologicalDysfunction = false, recentMI = false, urgency = 'elective', criticalPreop = false, diabetes = false } = input;
  let score = 0;
  if (age >= 75) score += 1.5; else if (age >= 65) score += 1.0; else if (age >= 60) score += 0.5;
  if (sex === 'female') score += 0.5;
  if (creatinine > 200) score += 1.5; else if (creatinine > 150) score += 1.0;
  if (ef < 30) score += 1.5; else if (ef < 50) score += 1.0;
  if (previousMI) score += 0.5;
  if (pulmonaryDisease) score += 0.5;
  if (neurologicalDysfunction) score += 1.0;
  if (recentMI) score += 0.5;
  if (urgency === 'emergency') score += 1.5; else if (urgency === 'urgent') score += 1.0;
  if (criticalPreop) score += 1.5;
  if (diabetes) score += 0.5;
  let risk;
  if (score >= 6) risk = 'high-risk';
  else if (score >= 3) risk = 'moderate-risk';
  else if (score >= 1) risk = 'low-moderate-risk';
  else risk = 'low-risk';
  return { score, risk, recommendation: risk === 'high-risk' ? 'consider-TAVR-or-medical-therapy' : 'CABG-recommended' };
};

// 2) Valve surgery indication — aortic stenosis
Engine.AorticStenosisValveIndication = function (input = {}) {
  const { meanGradient = 0, aorticValveArea = 1.5, ef = 60, symptomatic = false, lvEf50 = true } = input;
  let indication;
  if (symptomatic && (meanGradient >= 40 || aorticValveArea <= 1.0)) indication = 'Class-I-AVR-indicated';
  else if (!symptomatic && ef < 50 && meanGradient >= 40) indication = 'Class-I-AVR-asymptomatic-LV-dysfunction';
  else if (symptomatic && meanGradient < 40 && aorticValveArea <= 1.0) indication = 'Class-I-low-flow-low-gradient-AVR';
  else if (asymptomatic_seriouslyConsider(meanGradient, aorticValveArea, lvEf50)) indication = 'Class-IIa-consider-AVR';
  else indication = 'monitor-surveillance';
  function asymptomatic_seriouslyConsider(mg, ava, normalEf) { return normalEf && ((mg >= 60) || (ava <= 0.6)); }
  return { indication, recommendation: indication.startsWith('Class-I') ? 'surgical-or-TAVR-referral' : 'echocardiographic-surveillance-6-12-mo' };
};

// 3) ECMO weaning readiness — VA ECMO
Engine.ECMOWeaningReadiness = function (input = {}) {
  const { ef = 30, lactate = 5, mapOnSupport = 65, centralVenousPressure = 15, dobutamineDose = 5, norepinephrineDose = 0.1, mechanicalVentilationDays = 2 } = input;
  const score = (ef >= 30 ? 2 : 0) + (lactate < 2 ? 2 : (lactate < 4 ? 1 : 0)) + (mapOnSupport >= 65 ? 1 : 0) + (centralVenousPressure < 12 ? 1 : 0) + (dobutamineDose <= 5 ? 1 : 0) + (norepinephrineDose <= 0.1 ? 1 : 0) + (mechanicalVentilationDays < 7 ? 1 : 0);
  let readiness;
  if (score >= 7) readiness = 'ready-to-wean';
  else if (score >= 5) readiness = 'borderline-optimize';
  else readiness = 'not-ready-continue-support';
  return { score, readiness, recommendation: readiness === 'ready-to-wean' ? 'ECMO-flow-decrement-trial' : 'continue-ECMO-optimize-hemodynamics' };
};

// 4) Post-cardiotomy low cardiac output — vasoactive-inotropic score
Engine.VasoactiveInotropicScore = function (input = {}) {
  const { dopamineDose = 0, dobutamineDose = 0, milrinoneDose = 0, epinephrineDose = 0, norepinephrineDose = 0, vasopressinDose = 0 } = input;
  const vis = dopamineDose + dobutamineDose + (milrinoneDose * 10) + (epinephrineDose * 100) + (norepinephrineDose * 100) + (vasopressinDose * 10000);
  let category;
  if (vis >= 45) category = 'very-high-mortality-risk';
  else if (vis >= 20) category = 'high-risk';
  else if (vis >= 10) category = 'moderate-risk';
  else category = 'low-risk-stable';
  return { vis, category, recommendation: vis >= 20 ? 'mechanical-circulatory-support-ECMO-IABP' : 'wean-vasoactives-monitor' };
};

// 5) Lung resection — predicted postoperative FEV1
Engine.PredictedPostOpFEV1 = function (input = {}) {
  const { preoperativeFEV1 = 80, segmentsRemaining = 19, segmentsResected = 0 } = input;
  const ppoFEV1 = preoperativeFEV1 * (segmentsRemaining / 19);
  let risk;
  if (ppoFEV1 < 30) risk = 'high-risk-functional-inoperable';
  else if (ppoFEV1 < 40) risk = 'high-risk-functional-borderline';
  else if (ppoFEV1 < 60) risk = 'acceptable-risk';
  else risk = 'good-risk-cleared';
  return { ppoFEV1, risk, recommendation: risk === 'high-risk-functional-inoperable' ? 'non-surgical-treatment' : 'lobectomy-or-pneumonectomy-feasible' };
};

// 6) Aortic dissection — Stanford classification management
Engine.AorticDissectionStanford = function (input = {}) {
  const { type = 'B', involvement = 'descending-only', malperfusion = false, rupture = false, refractoryPain = false, diameter = 35 } = input;
  let management;
  if (type === 'A') management = 'emergent-surgical-repair-OR-TEVAR-hybrid';
  else if (type === 'B' && (rupture || refractoryPain || malperfusion)) management = 'TEVAR-complicated-Type-B';
  else if (type === 'B' && diameter >= 55) management = 'elective-TEVAR-large-diameter';
  else management = 'medical-management-BP-control-IMAGING-follow-up';
  return { management, recommendation: type === 'A' ? 'immediate-OR-team-activation' : 'ICU-BP-control-CT-angio-6mo' };
};

// 7) Atrial fibrillation post-CABG — CHA2DS2-VASc
Engine.PostCABGAFStrokeRisk = function (input = {}) {
  const { chf = false, hypertension = false, age = 60, diabetes = false, stroke = false, vascular = false, sex = 'male' } = input;
  let score = 0;
  if (chf) score += 1;
  if (hypertension) score += 1;
  if (age >= 75) score += 2; else if (age >= 65) score += 1;
  if (diabetes) score += 1;
  if (stroke) score += 2;
  if (vascular) score += 1;
  if (sex === 'female') score += 1;
  let category;
  if (score >= 4) category = 'high-stroke-risk-anticoagulation';
  else if (score >= 2) category = 'moderate-consider-anticoagulation';
  else category = 'low-risk-aspirin';
  return { score, category, recommendation: score >= 2 ? 'anticoagulation-Warfarin-or-DOAC' : 'aspirin-rate-control' };
};

// 8) Mitral valve repair — Carpentier classification
Engine.MitralValveCarpentier = function (input = {}) {
  const { leafletMotion = 'normal', leaflet = 'anterior', annularDilation = false, chordalRupture = false, vegetation = false, rheumatic = false } = input;
  let carpentierType, repairability;
  if (rheumatic) { carpentierType = 'Type-IIIa-restricted'; repairability = 'limited-replacement-likely'; }
  else if (chordalRupture) { carpentierType = 'Type-II-prolapse'; repairability = 'high-repair-success'; }
  else if (leafletMotion === 'restricted' && annularDilation) { carpentierType = 'Type-I-annular-dilation'; repairability = 'ring-annuloplasty'; }
  else if (leafletMotion === 'prolapse') { carpentierType = 'Type-II-prolapse'; repairability = leaflet === 'posterior' ? 'excellent-repair-posterior' : 'moderate-repair-anterior'; }
  else { carpentierType = 'Type-I-normal-motion'; repairability = 'no-repair-needed'; }
  return { carpentierType, repairability, recommendation: repairability.includes('replacement') ? 'mitral-replacement' : 'mitral-repair-ring-annuloplasty' };
};

// 9) Esophagectomy risk — ASA + FEV1 composite
Engine.EsophagectomyRisk = function (input = {}) {
  const { asaClass = 1, fev1 = 80, age = 60, weightLoss = 0, neoadjuvantChemoradiation = false } = input;
  const riskScore = (asaClass - 1) + (fev1 < 60 ? 1 : 0) + (age >= 70 ? 1 : 0) + (weightLoss > 10 ? 1 : 0) + (neoadjuvantChemoradiation ? 1 : 0);
  let risk;
  if (riskScore >= 4) risk = 'very-high-risk';
  else if (riskScore >= 3) risk = 'high-risk';
  else if (riskScore >= 2) risk = 'moderate-risk';
  else risk = 'acceptable-risk';
  return { riskScore, risk, recommendation: risk === 'very-high-risk' ? 'definitive-chemoradiation-not-surgical' : 'esophagectomy-with-enhanced-recovery' };
};

// 10) Mediastinitis post-sternotomy — El Gamel classification
Engine.MediastinitisElGamel = function (input = {}) {
  const { timing = 'early', depth = 'superficial', microbiology = 'negative', priorRadiation = false, sternalDehiscence = false } = input;
  let classType, treatment;
  if (timing === 'early' && depth === 'superficial') { classType = 'Class-I-superficial-early'; treatment = 'antibiotics-wound-care'; }
  else if (timing === 'early' && depth === 'deep') { classType = 'Class-II-deep-early'; treatment = 'debridement-closed-irrigation-vac'; }
  else if (timing === 'late' && depth === 'deep') { classType = 'Class-III-deep-late'; treatment = 'radical-debridement-muscle-flap'; }
  else if (priorRadiation || sternalDehiscence) { classType = 'Class-IV-complex'; treatment = 'multidisciplinary-flap-reconstruction'; }
  else { classType = 'unclassified'; treatment = 'individualized-MDT'; }
  return { classType, treatment, recommendation: treatment.includes('flap') ? 'plastic-surgery-consult' : 'cardiothoracic-irrigation' };
};
