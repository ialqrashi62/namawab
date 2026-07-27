// P3-AR: Cardiology-Ext Engine — 10 pure functions
const Engine = {};

Engine.HEARTScore = function ({ history = 0, ecg = 0, age = 0, riskFactors = 0, troponin = 0 } = {}) {
  const total = history + ecg + age + riskFactors + troponin;
  let category;
  if (total >= 7) category = 'high-risk-72-percent-MACE';
  else if (total >= 4) category = 'moderate-high-risk-50-percent-MACE';
  else if (total >= 1) category = 'low-moderate-risk-17-percent-MACE';
  else category = 'low-risk-1.7-percent-MACE';
  return { total, category, recommendation: total >= 4 ? 'admit-for-workup-and-observation' : 'discharge-with-followup' };
};

Engine.TIMIScore = function ({ age = 65, aspirin = false, stChanges = false, riskFactors = 3, knownCAD = false, recentPCI = false } = {}) {
  let score = 0;
  if (age >= 65) score += 1;
  if (aspirin) score += 1;
  if (stChanges) score += 1;
  if (riskFactors >= 3) score += 1;
  if (knownCAD) score += 1;
  if (recentPCI) score += 1;
  let category;
  if (score >= 5) category = 'very-high-risk-24-percent-MACE-30d';
  else if (score >= 3) category = 'high-risk-16-percent-MACE-30d';
  else if (score >= 1) category = 'intermediate-risk-7-percent-MACE-30d';
  else category = 'low-risk-3-percent-MACE-30d';
  return { score, category, recommendation: score >= 3 ? 'admit-and-invasive-strategy' : 'consider-discharge' };
};

Engine.ACSSyndrome = function ({ chestPain = true, stElevation = false, stDepression = false, troponin = 0, dynamic = false } = {}) {
  let diagnosis;
  if (stElevation && troponin > 0.1) diagnosis = 'STEMI-emergent-PCI';
  else if (stElevation) diagnosis = 'STEMI-emergent-PCI-or-thrombolysis';
  else if (stDepression && troponin > 0.1) diagnosis = 'NSTEMI-invasive-within-24-48h';
  else if (troponin > 0.1 && dynamic) diagnosis = 'NSTEMI-invasive-within-24-48h';
  else if (troponin > 0.1) diagnosis = 'NSTEMI-invasive-and-risk-stratify';
  else if (chestPain) diagnosis = 'unstable-angina-medical-management';
  else diagnosis = 'no-ACS';
  return { diagnosis, recommendation: diagnosis.includes('STEMI') ? 'activate-cath-lab' : (diagnosis.includes('NSTEMI') ? 'admit-and-invasive' : 'risk-stratify') };
};

Engine.CardiogenicShock = function ({ sbp = 90, ci = 2.0, pcwp = 18, lactate = 1.5 } = {}) {
  let stage;
  if (sbp < 90 && ci < 1.8 && pcwp > 18) stage = 'stage-D-critical-cardiogenic-shock';
  else if (sbp < 90 && ci < 2.0) stage = 'stage-C-severe-cardiogenic-shock';
  else if (sbp < 100 && ci < 2.2) stage = 'stage-B-beginning-shock';
  else if (sbp < 100) stage = 'stage-A-at-risk';
  else stage = 'no-shock';
  return { stage, recommendation: stage.includes('stage-D') || stage.includes('stage-C') ? 'inotropes-and-mechanical-circulatory-support' : (stage.includes('stage-B') ? 'monitor-and-consider-inotropes' : 'monitor') };
};

Engine.PulmonaryHypertension = function ({ pap = 25, pcwp = 12, pvr = 2, cardiacOutput = 5 } = {}) {
  let classification;
  if (pap >= 25 && pcwp <= 15) classification = 'pulmonary-arterial-hypertension-group-1';
  else if (pap >= 25 && pcwp > 15) classification = 'PH-group-2-left-heart';
  else if (pap >= 25 && chronicLungDisease) classification = 'PH-group-3-lung-disease';
  else if (pap >= 25 && pvr > 3) classification = 'PH-group-4-chronic-thromboembolic';
  else classification = 'no-PH';
  return { classification, recommendation: classification.includes('group-1') ? 'PAH-specific-therapy-and-referral' : 'treat-underlying-cause' };
};

Engine.HeartFailureClassification = function ({ lvef = 50, symptoms = 'none', hospitalization = false, nyhaClass = 1 } = {}) {
  let category;
  if (lvef >= 50) category = 'HFpEF';
  else if (lvef >= 40) category = 'HFmrEF';
  else category = 'HFrEF';
  let treatment;
  if (category === 'HFrEF') treatment = 'GDMT-ARNI-beta-blocker-MRA-SGLT2i';
  else if (category === 'HFmrEF') treatment = 'consider-GDMT';
  else treatment = 'treat-comorbidities-and-SGLT2i';
  if (symptoms === 'severe' || nyhaClass >= 3) treatment += '-and-advanced-therapies';
  return { category, treatment, recommendation: hospitalization ? 'inpatient-GDMT-optimization' : 'outpatient-uptitration' };
};

Engine.ArrhythmiaRisk = function ({ qt = 400, qtc = 440, history = 'none', electrolyte = 'normal' } = {}) {
  let risk;
  if (qtc >= 500) risk = 'high-torsades-avoid-QT-prolonging';
  else if (qtc >= 480) risk = 'moderate-torsades-monitor';
  else if (qtc >= 450) risk = 'borderline-monitor-electrolytes';
  else if (history === 'torsades') risk = 'prior-torsades-avoid-triggers';
  else if (electrolyte === 'abnormal') risk = 'correct-electrolytes-and-monitor';
  else risk = 'low-arrhythmia-risk';
  return { risk, recommendation: risk.includes('high') || risk.includes('moderate') ? 'avoid-trigger-drugs' : 'standard' };
};

Engine.ValveAssessment = function ({ valve = 'aortic', severity = 'moderate', lvef = 60, symptoms = 'none' } = {}) {
  let pathway;
  if (severity === 'severe' && symptoms !== 'none') pathway = 'severe-symptomatic-surgical-referral';
  else if (severity === 'severe' && lvef < 50) pathway = 'severe-asymptomatic-with-LV-dysfunction-surgery';
  else if (severity === 'severe' && valve === 'aortic') pathway = 'severe-AS-surveillance-or-TAVR';
  else if (severity === 'moderate') pathway = 'moderate-surveillance-1-2-years';
  else pathway = 'mild-monitor';
  return { pathway, recommendation: pathway.includes('surgical') || pathway.includes('TAVR') ? 'heart-team' : 'cardiology-followup' };
};

Engine.ECG_STEMI = function ({ stElevationMm = 0, location = 'anterior', newLBBB = false, posterior = false, reciprocalChanges = false } = {}) {
  let stemi;
  if (stElevationMm >= 1 && (location === 'anterior' || location === 'inferior' || location === 'lateral')) stemi = 'STEMI-' + location;
  else if (stElevationMm >= 2 && location === 'anterior') stemi = 'STEMI-anterior-precordial-leads';
  else if (newLBBB) stemi = 'STEMI-equivalent-new-LBBB';
  else if (posterior && reciprocalChanges) stemi = 'STEMI-posterior-reciprocal-changes';
  else if (stElevationMm >= 1) stemi = 'possible-STEMI-check-leads';
  else stemi = 'no-STEMI';
  return { stemi, recommendation: stemi.includes('STEMI') ? 'activate-cath-lab' : 'serial-troponin-and-observation' };
};

Engine.LipidManagement = function ({ ldl = 130, ascvdRisk = 7, priorMI = false, diabetes = false, statinCurrently = 'none' } = {}) {
  let pathway;
  if (priorMI && ldl >= 70) pathway = 'high-intensity-statin-and-PCSK9i-consider';
  else if (diabetes && ascvdRisk >= 7.5) pathway = 'moderate-to-high-intensity-statin';
  else if (ascvdRisk >= 7.5) pathway = 'moderate-to-high-intensity-statin';
  else if (ascvdRisk >= 5) pathway = 'moderate-intensity-statin';
  else if (ldl >= 190) pathway = 'high-intensity-statin-familial-hypercholesterolemia';
  else pathway = 'lifestyle-modifications-and-recheck';
  return { pathway, recommendation: 'titrate-to-LDL-target' };
};

module.exports = Engine;
