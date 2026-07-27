'use strict';

// Bone-Marrow-Transplant (HSCT) PCC — 10 pure deterministic functions
// Compliance: EBMT, CIBMTR, ASBMT, NMDP, JACIE, FACT

const Engine = module.exports = {};

// 1) HCT comorbidity index
Engine.HCTComorbidityIndex = function (input = {}) {
  const { age = 50, karnofsky = 90, cardiac = false, pulmonary = false, hepatic = 'none', renal = false, priorSolidTumor = false, infection = false, psychiatric = false } = input;
  let score = 0;
  if (age >= 60) score += 1;
  if (karnofsky < 80) score += 1;
  if (cardiac) score += 1;
  if (pulmonary) score += 1;
  if (hepatic === 'severe') score += 3; else if (hepatic === 'mild') score += 1;
  if (renal) score += 1;
  if (priorSolidTumor) score += 1;
  if (infection) score += 1;
  if (psychiatric) score += 1;
  let category;
  if (score >= 5) category = 'very-high-NRM-risk';
  else if (score >= 3) category = 'high-NRM-risk';
  else if (score >= 1) category = 'moderate-NRM-risk';
  else category = 'low-NRM-risk';
  return { score, category, recommendation: score >= 3 ? 'reduced-intensity-conditioning-or-alternative-donor' : 'standard-myeloablative-eligible' };
};

// 2) Acute GVHD — Glucksberg/IBMTR grade
Engine.AcuteGVHDGrade = function (input = {}) {
  const { skinStage = 0, liverStage = 0, gutStage = 0 } = input;
  const overallSkin = Math.min(4, skinStage), overallLiver = Math.min(4, liverStage), overallGut = Math.min(4, gutStage);
  let grade;
  if (overallSkin === 4 || overallLiver === 4 || overallGut === 4) grade = 'grade-IV-life-threatening';
  else if (overallSkin === 3 || overallLiver === 3 || overallGut === 3) grade = 'grade-III-severe';
  else if ((overallSkin === 2 || overallLiver === 2 || overallGut === 2) || (overallSkin === 1 && overallGut === 1)) grade = 'grade-II-moderate';
  else if (overallSkin === 1 || overallLiver === 1 || overallGut === 1) grade = 'grade-I-mild';
  else grade = 'no-GVHD';
  return { grade, recommendation: grade.startsWith('grade-IV') ? 'ATG-ECP-ICU' : (grade === 'grade-III-severe' ? 'high-dose-steroids-ATG' : (grade === 'grade-II-moderate' ? 'systemic-steroids' : 'topical-monitor')) };
};

// 3) Engraftment — neutrophil / platelet recovery
Engine.EngraftmentAssessment = function (input = {}) {
  const { dayPostTransplant = 10, anc = 0.2, plateletCount = 30, chimerism = 100 } = input;
  let neutrophilStatus, plateletStatus;
  if (anc >= 0.5) neutrophilStatus = 'engrafted'; else if (anc >= 0.1) neutrophilStatus = 'imminent-engraftment'; else neutrophilStatus = 'pre-engraftment';
  if (plateletCount >= 20) plateletStatus = 'engrafted'; else if (plateletCount >= 10) plateletStatus = 'imminent'; else plateletStatus = 'pre-engraftment';
  let engraftmentSyndrome = 'none';
  if (anc >= 0.5 && dayPostTransplant <= 14) engraftmentSyndrome = 'engraftment-syndrome-risk';
  let chimerismStatus;
  if (chimerism >= 95) chimerismStatus = 'full-donor-chimerism'; else if (chimerism >= 50) chimerismStatus = 'mixed-chimerism'; else chimerismStatus = 'recipient-predominant';
  return { neutrophilStatus, plateletStatus, engraftmentSyndrome, chimerismStatus, recommendation: chimerismStatus === 'recipient-predominant' ? 'consider-DLI-or-second-transplant' : 'monitor-engraftment-support' };
};

// 4) VOD/SOS severity — EBMT criteria
Engine.VenoOcclusiveDiseaseEBMT = function (input = {}) {
  const { bilirubin = 1.0, weightGain = 0, hepatomegaly = false, rightUpperQuadrantPain = false, fluidOverload = false, renalFailure = false, encephalopathy = false, pulmonary = false } = input;
  const classicPresent = bilirubin >= 2 && (weightGain > 5 || hepatomegaly || rightUpperQuadrantPain);
  let severity;
  if (renalFailure || pulmonary || encephalopathy) severity = 'very-severe-VOD-with-OD';
  else if (fluidOverload && bilirubin >= 5) severity = 'severe-VOD';
  else if (classicPresent) severity = 'moderate-VOD';
  else severity = 'mild-or-no-VOD';
  return { severity, recommendation: severity === 'very-severe-VOD-with-OD' ? 'defibrotide-ICU' : (severity === 'severe-VOD' ? 'defibrotide-monitoring' : 'supportive-fluid-restriction') };
};

// 5) Conditioning regimen intensity
Engine.ConditioningIntensity = function (input = {}) {
  const { regimen = 'BU-FU', age = 50, comorbidityIndex = 0, donorType = 'matched-related' } = input;
  let intensity;
  if (regimen === 'BU-FU' || regimen === 'CY-TBI-12Gy' || regimen === 'BEAM') intensity = 'myeloablative';
  else if (regimen === 'BU-FLU' || regimen === 'CY-TBI-2Gy' || regimen === 'FLU-MEL') intensity = 'reduced-intensity';
  else if (regimen === 'FLU-CY' || regimen === 'TLI-ATG') intensity = 'non-myeloablative';
  else intensity = 'unknown';
  let recommendation;
  if (intensity === 'myeloablative' && (age >= 60 || comorbidityIndex >= 3)) recommendation = 'consider-RIC-due-to-comorbidities';
  else if (intensity === 'myeloablative' && donorType === 'haploidentical') recommendation = 'consider-PTCy-platform';
  else recommendation = 'standard-platform';
  return { intensity, recommendation };
};

// 6) Cytopenias differential post-HSCT
Engine.PostTransplantCytopenias = function (input = {}) {
  const { dayPostTransplant = 30, anc = 0.5, platelet = 30, reticulocyte = 0.5, gvhd = false, drugImplicated = false, viralInfection = false } = input;
  let differential;
  if (dayPostTransplant < 30 && anc < 0.5) differential = 'pre-engraftment';
  else if (gvhd) differential = 'GVHD-related';
  else if (drugImplicated) differential = 'drug-induced-marrow-suppression';
  else if (viralInfection) differential = 'viral-suppression-CMV-BK-PARVO';
  else if (dayPostTransplant < 100) differential = 'engraftment-syndrome-or-relapse';
  else differential = 'relapse-or-secondary-graft-failure';
  return { differential, recommendation: differential === 'relapse-or-secondary-graft-failure' ? 'bone-marrow-biopsy-chimerism-DLI' : 'supportive-G-CSF-evaluate-causes' };
};

// 7) Relapse risk post-HSCT
Engine.HSCTRelapseRisk = function (input = {}) {
  const { disease = 'AML', diseaseStatusAtTransplant = 'CR1', karnofsky = 90, donorType = 'matched-related', tCellDepletion = false, gvhd = false } = input;
  let score = 0;
  if (diseaseStatusAtTransplant !== 'CR1') score += 2;
  if (karnofsky < 80) score += 1;
  if (donorType === 'haploidentical' || donorType === 'cord') score += 1;
  if (tCellDepletion) score += 2;
  if (gvhd) score -= 1;
  if (disease === 'ALL' || disease === 'AML-M4-M5') score += 1;
  let risk;
  if (score >= 4) risk = 'very-high-relapse-risk';
  else if (score >= 2) risk = 'high-relapse-risk';
  else if (score >= 1) risk = 'moderate-relapse-risk';
  else risk = 'low-relapse-risk';
  return { score, risk, recommendation: risk === 'very-high-relapse-risk' ? 'DLI-maintenance-therapy-clinical-trial' : 'maintenance-monitoring-MRD' };
};

// 8) VZV reactivation prophylaxis
Engine.VZVReactivationRisk = function (input = {}) {
  const { serostatus = 'positive', immunosuppression = 'standard', gvhd = false, priorReactivation = false } = input;
  let recommendation;
  if (serostatus === 'negative' && immunosuppression === 'intensive') recommendation = 'VZV-Ig-prophylaxis-consider-vaccination';
  else if (gvhd || priorReactivation) recommendation = 'long-term-acyclovir-12mo-or-longer';
  else if (serostatus === 'positive' && immunosuppression === 'standard') recommendation = 'acyclovir-6-12mo-standard-prophylaxis';
  else recommendation = 'monitor-no-prophylaxis';
  return { recommendation };
};

// 9) Sinusoidal obstruction syndrome prophylaxis
Engine.SOSProphylaxisIndication = function (input = {}) {
  const { age = 30, gemtuzumab = false, inotuzumab = false, priorSOS = false, ironOverload = false, conditioning = 'BU-FU' } = input;
  let indication;
  if (priorSOS) indication = 'defibrotide-secondary-prophylaxis';
  else if ((age < 1 || age > 40) && (gemtuzumab || inotuzumab)) indication = 'defibrotide-prophylaxis-high-risk';
  else if (ironOverload && (conditioning === 'BU-FU' || conditioning === 'CY-TBI')) indication = 'ursodiol-prophylaxis';
  else indication = 'standard-monitoring-no-prophylaxis';
  return { indication, recommendation: indication.startsWith('defibrotide') ? 'defibrotide-IV-prophylaxis' : 'ursodiol-oral-monitoring' };
};

// 10) Donor lymphocyte infusion eligibility
Engine.DLIEligibility = function (input = {}) {
  const { relapsedDisease = 'AML', chimerism = 100, daysPostTransplant = 100, gvhd = false, donorAvailable = true } = input;
  let eligibility;
  if (!donorAvailable) eligibility = 'ineligible-no-donor';
  else if (geldonor()) eligibility = 'contraindicated-active-GVHD';
  else if (daysPostTransplant < 60) eligibility = 'too-early-consider-after-90-days';
  else if (chimerism < 30) eligibility = 'poor-engraftment-DLI-risky';
  else if (relapsedDisease === 'CML') eligibility = 'highly-effective-CML';
  else if (relapsedDisease === 'AML' || relapsedDisease === 'MDS') eligibility = 'effective-monitor-for-GVHD';
  else eligibility = 'limited-efficacy';
  function geldonor() { return gvhd; }
  return { eligibility, recommendation: eligibility === 'contraindicated-active-GVHD' ? 'treat-GVHD-first' : (eligibility.startsWith('highly') ? 'DLI-titrate-doses' : 'DLI-with-caution-monitor') };
};
