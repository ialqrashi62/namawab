'use strict';

// Dental / Maxillofacial PCC — 10 pure deterministic functions
// Compliance: ADA, AAP, AAOMS, AAPD, FDI, WHO-ICD-11, IADT

const Engine = module.exports = {};

// 1) DMFT (Decayed-Missing-Filled Teeth) index
Engine.DMFTIndex = function (input = {}) {
  const { decayed = 0, missing = 0, filled = 0, age = 30 } = input;
  const total = decayed + missing + filled;
  const mean = age >= 18 ? total : null;
  let category;
  if (total === 0) category = 'caries-free';
  else if (total <= 3) category = 'very-low';
  else if (total <= 6) category = 'low';
  else if (total <= 10) category = 'moderate';
  else category = 'high';
  return { total, mean, category, recommendation: category === 'high' ? 'urgent-restorative-treatment' : 'routine-care-fluoride' };
};

// 2) Periodontal disease — CPITN / Pocket depth
Engine.PeriodontalCPITN = function (input = {}) {
  const { pocketDepthMM = 2, bleeding = false, calculus = false, sextants = [0, 0, 0, 0, 0, 0] } = input;
  const maxPocket = Math.max(pocketDepthMM, ...sextants);
  let code;
  if (maxPocket >= 6) code = 'code-4-severe-periodontitis';
  else if (maxPocket >= 4) code = 'code-3-moderate-periodontitis';
  else if (maxPocket >= 3 || calculus) code = 'code-2-calculus-gingivitis';
  else if (bleeding) code = 'code-1-bleeding';
  else code = 'code-0-healthy';
  return { maxPocket, code, recommendation: code === 'code-4-severe-periodontitis' ? 'specialist-referral-surgery' : (code === 'code-3-moderate-periodontitis' ? 'deep-scaling-root-planing' : (code === 'code-2-calculus-gingivitis' ? 'scaling-polishing-OHI' : 'maintain-OH')) };
};

// 3) Orthodontic treatment need — IOTN
Engine.OrthodonticIOTN = function (input = {}) {
  const { overjetMM = 2, overbiteMM = 2, crossbite = 'absent', crowding = 'mild', missingTeeth = 0, cleft = false } = input;
  let grade;
  if (cleft || missingTeeth >= 4) grade = 'grade-5-treatment-essential';
  else if (overjetMM > 9 || crossbite === 'severe') grade = 'grade-4-treatment-very-desirable';
  else if (overjetMM > 6 || crowding === 'severe') grade = 'grade-3-treatment-desirable';
  else if (overjetMM > 3.5 || crowding === 'moderate') grade = 'grade-2-moderate';
  else grade = 'grade-1-minimal-no-treatment';
  return { grade, recommendation: grade === 'grade-1-minimal-no-treatment' ? 'no-treatment-monitor' : 'orthodontic-referral-comprehensive-care' };
};

// 4) Tooth vitality — pulp testing
Engine.ToothVitality = function (input = {}) {
  const { coldTest = 'normal', electricPulpTest = 'normal', percussion = 'absent', palpation = 'absent', radiolucency = 'absent' } = input;
  let diagnosis;
  if (coldTest === 'absent' && electricPulpTest === 'absent') diagnosis = 'necrotic-pulp';
  else if (coldTest === 'lingering-pain' || radiolucency === 'periapical') diagnosis = 'irreversible-pulpitis';
  else if (coldTest === 'brief-pain' || percussion === 'present') diagnosis = 'reversible-pulpitis';
  else if (coldTest === 'normal' && electricPulpTest === 'normal') diagnosis = 'vital-healthy-pulp';
  else diagnosis = 'indeterminate';
  return { diagnosis, recommendation: diagnosis === 'necrotic-pulp' ? 'root-canal-or-extraction' : (diagnosis === 'irreversible-pulpitis' ? 'root-canal-therapy' : (diagnosis === 'reversible-pulpitis' ? 'pulp-capping-restoration' : 'observe-routine-care')) };
};

// 5) Caries risk assessment — CAMBRA
Engine.CariesRiskCAMBRA = function (input = {}) {
  const { dmftScore = 0, sugarFrequency = 'low', fluorideExposure = 'optimal', salivaFlow = 'normal', previousCaries = false, medicationsCausingXerostomia = false } = input;
  let risk = 0;
  if (dmftScore >= 3) risk += 2;
  if (sugarFrequency === 'high') risk += 2;
  if (fluorideExposure === 'none') risk += 2;
  if (salivaFlow === 'low') risk += 2;
  if (previousCaries) risk += 1;
  if (medicationsCausingXerostomia) risk += 1;
  let category;
  if (risk >= 7) category = 'extreme-risk';
  else if (risk >= 5) category = 'high-risk';
  else if (risk >= 3) category = 'moderate-risk';
  else category = 'low-risk';
  return { riskScore: risk, category, recommendation: risk >= 5 ? 'high-fluoride-varnish-3-month-recall' : '6-month-recall-standard-prevention' };
};

// 6) Dental trauma — IADT classification
Engine.DentalTraumaIADT = function (input = {}) {
  const { injuryType = 'enamel-fracture', displacement = 'none', pulpExposure = false, alveolarFracture = false, avulsion = false, timeSinceAvulsion = 0 } = input;
  let classification, treatment;
  if (avulsion) {
    if (timeSinceAvulsion <= 60) { classification = 'avulsion-immediate-replantation'; treatment = 'replant-within-60min-splint-2wk-RCT-7-10d'; }
    else { classification = 'avulsion-delayed'; treatment = 'RCT-extra-oral-or-splint-monitor'; }
  } else if (alveolarFracture) { classification = 'alveolar-fracture'; treatment = 'reposition-splint-4wk'; }
  else if (injuryType === 'complicated-crown-fracture' && pulpExposure) { classification = 'complicated-crown-fracture'; treatment = 'pulpotomy-or-RCT-restoration'; }
  else if (injuryType === 'uncomplicated-crown-fracture') { classification = 'uncomplicated-crown-fracture'; treatment = 'restoration-follow-up'; }
  else if (displacement === 'lateral-luxation') { classification = 'lateral-luxation'; treatment = 'reposition-splint-2-4wk-pulp-test-follow-up'; }
  else if (displacement === 'intrusion') { classification = 'intrusion'; treatment = 'allow-eruption-or-surgical-reposition'; }
  else { classification = injuryType; treatment = 'observe-radiographs-follow-up'; }
  return { classification, treatment, recommendation: 'follow-up-6mo-1yr-radiograph' };
};

// 7) Oral cancer screening — leukoplakia / erythroplakia
Engine.OralCancerScreening = function (input = {}) {
  const { lesionType = 'absent', site = 'none', size = 0, duration = 0, induration = false, riskFactors = [] } = input;
  let risk;
  if (lesionType === 'erythroplakia' || (lesionType === 'leukoplakia' && induration && duration > 14)) risk = 'high-risk-malignant-referral';
  else if (lesionType === 'leukoplakia' && (size >= 200 || duration > 14)) risk = 'moderate-risk-biopsy';
  else if (lesionType === 'leukoplakia') risk = 'low-risk-monitor';
  else if (lesionType === 'ulcer' && duration > 14) risk = 'moderate-risk-biopsy';
  else if (lesionType === 'absent') risk = 'no-suspicious-lesion';
  else risk = 'minimal-risk';
  return { risk, recommendation: risk === 'high-risk-malignant-referral' ? 'urgent-biopsy-OHNS-referral' : (risk === 'moderate-risk-biopsy' ? 'biopsy-2-week-follow-up' : 'routine-6mo-recheck') };
};

// 8) Wisdom tooth impaction — Pell-Gregory classification
Engine.WisdomToothImpaction = function (input = {}) {
  const { angulation = 'vertical', depth = 'A', ramusRelationship = 'class-I', symptoms = false, pathology = 'none' } = input;
  let category, recommendation;
  if (pathology !== 'none' || symptoms) { category = 'symptomatic-pathology-extraction'; recommendation = 'surgical-extraction'; }
  else if (angulation === 'horizontal' || angulation === 'mesioangular') { category = 'high-risk-impacted'; recommendation = 'prophylactic-extraction'; }
  else if (depth === 'C' || ramusRelationship === 'class-III') { category = 'severely-impacted'; recommendation = 'surgical-extraction-2-week-postop'; }
  else if (angulation === 'vertical' && depth === 'A') { category = 'mildly-impacted'; recommendation = 'monitor-annual-panoramic'; }
  else { category = 'partial-eruption'; recommendation = 'monitor-extract-if-symptoms'; }
  return { category, recommendation };
};

// 9) OHI-S (Oral Hygiene Index — Simplified)
Engine.OralHygieneIndexSimplified = function (input = {}) {
  const { debrisIndex = 0, calculusIndex = 0 } = input;
  const total = debrisIndex + calculusIndex;
  let category;
  if (total === 0) category = 'excellent';
  else if (total <= 1.2) category = 'good';
  else if (total <= 3.0) category = 'fair';
  else category = 'poor';
  return { total, category, recommendation: category === 'poor' ? 'OHI-reinforcement-professional-cleaning' : 'maintain-current-OH' };
};

// 10) Malocclusion — Angle classification
Engine.AngleMalocclusion = function (input = {}) {
  const { molarRelationship = 'class-I', overjet = 2, overbite = 2, midlineDeviation = 0, crossbite = false } = input;
  let classification;
  if (molarRelationship === 'class-I' && Math.abs(overjet) <= 3 && Math.abs(overbite) <= 3 && !crossbite) classification = 'class-I-normal-occlusion';
  else if (molarRelationship === 'class-II' && overjet > 3) classification = 'class-II-division-1-overjet';
  else if (molarRelationship === 'class-II' && overbite > 3) classification = 'class-II-division-2-deep-bite';
  else if (molarRelationship === 'class-III' && overjet < 0) classification = 'class-III-underbite';
  else classification = 'class-I-malocclusion-mild';
  return { classification, recommendation: classification === 'class-I-normal-occlusion' ? 'no-treatment-needed' : 'orthodontic-evaluation' };
};
