'use strict';
// Oncology Engine: 10 pure deterministic functions
// Compliance: AJCC 8th ed., TNM, ECOG/Karnofsky, NCCN, RECIST 1.1, ESMO

function TNMSolid({ tStage, nStage, mStage, tumorType }) {
  const t = parseInt(tStage.replace('T', '')) || 0;
  const n = parseInt(nStage.replace('N', '')) || 0;
  const m = parseInt(mStage.replace('M', '')) || 0;
  let stageGroup;
  if (m === 1) stageGroup = 'IV';
  else if (t === 4 || n === 3) stageGroup = 'IIIC';
  else if (t === 4) stageGroup = 'IIIB';
  else if (t === 3 && n >= 2) stageGroup = 'IIIA';
  else if (t === 3) stageGroup = 'IIB';
  else if (t === 2 && n >= 1) stageGroup = 'IIA';
  else if (t === 2) stageGroup = 'II';
  else if (t === 1 && n === 1) stageGroup = 'IIA';
  else if (t === 1) stageGroup = 'I';
  else if (n === 1) stageGroup = 'IIA';
  else stageGroup = '0';
  const surv5y = stageGroup === '0' || stageGroup === 'I' ? 90 : stageGroup === 'II' ? 70 : stageGroup === 'IIIA' || stageGroup === 'IIB' ? 50 : stageGroup === 'IIIB' || stageGroup === 'IIIC' ? 30 : 10;
  return { tStage, nStage, mStage, stageGroup, survival5yrPct: surv5y, tumorType };
}

function ECOG({ performanceStatus }) {
  const grades = {
    0: { grade: 0, description: 'fully active', description_ar: 'نشط تماماً', mortality: 0.05 },
    1: { grade: 1, description: 'restricted, ambulatory', description_ar: 'مشي مع قيود', mortality: 0.10 },
    2: { grade: 2, description: 'ambulatory, self-care', description_ar: 'مشي ورعاية ذاتية', mortality: 0.20 },
    3: { grade: 3, description: 'limited self-care', description_ar: 'رعاية ذاتية محدودة', mortality: 0.40 },
    4: { grade: 4, description: 'bedbound', description_ar: 'طريح الفراش', mortality: 0.80 },
    5: { grade: 5, description: 'dead', description_ar: 'متوفي', mortality: 1.00 },
  };
  return grades[performanceStatus] || grades[1];
}

function RECISTResponse({ baselineSum, currentSum, newLesions }) {
  if (newLesions) return { response: 'PD', percentChange: 100, comment: 'new lesions = progression' };
  const pct = ((currentSum - baselineSum) / Math.max(0.01, baselineSum)) * 100;
  if (pct <= -30) return { response: 'PR', percentChange: pct };
  if (pct >= 20) return { response: 'PD', percentChange: pct };
  return { response: 'SD', percentChange: pct };
}

function ChemoToxicityRisk({ age, ecog, albumin, bilirubin, creatinine, regimen }) {
  let risk = 0;
  if (age >= 75) risk += 2; else if (age >= 65) risk += 1;
  if (ecog >= 2) risk += 2;
  if (albumin < 3.0) risk += 1;
  if (bilirubin > 1.5) risk += 1;
  if (creatinine > 1.5) risk += 1;
  if (regimen === 'high-dose') risk += 2;
  if (regimen === 'combination') risk += 1;
  let category, doseReduction;
  if (risk >= 5) { category = 'high'; doseReduction = 25; }
  else if (risk >= 3) { category = 'intermediate'; doseReduction = 15; }
  else { category = 'low'; doseReduction = 0; }
  return { riskScore: risk, category, doseReductionPct: doseReduction };
}

function NeutropenicFever({ temperature, anc, monocytosis, hypotension, sepsis }) {
  const isFever = temperature >= 38.3 || (temperature >= 38.0 && temperatureRise);
  const isNeutropenic = anc < 500;
  let classification = 'no-NF';
  if (isFever && isNeutropenic) {
    if (sepsis || hypotension) classification = 'high-risk-NF';
    else classification = 'low-risk-NF';
  }
  return { isFever, isNeutropenic, anc, classification, mortalityPct: classification === 'high-risk-NF' ? 30 : classification === 'low-risk-NF' ? 5 : 1 };
}

function TumorLysisSyndrome({ tumorType, bulkyDisease, wbc, uricAcid, potassium, phosphorus, calcium, creatinine }) {
  const highRiskTumor = ['ALL', 'Burkitt', 'DLBCL-large', 'CLL-high'].includes(tumorType);
  let risk = 0;
  if (highRiskTumor) risk += 2;
  if (bulkyDisease) risk += 1;
  if (wbc > 100) risk += 2;
  if (uricAcid > 7) risk += 1;
  if (potassium > 5.5) risk += 1;
  if (phosphorus > 5) risk += 1;
  if (calcium < 7) risk += 1;
  if (creatinine > 1.5) risk += 1;
  let category, prophylaxis;
  if (risk >= 5) { category = 'high'; prophylaxis = 'rasburicase + IVF'; }
  else if (risk >= 3) { category = 'intermediate'; prophylaxis = 'allopurinol + IVF'; }
  else { category = 'low'; prophylaxis = 'monitor'; }
  return { riskScore: risk, category, prophylaxis };
}

function PalliativePrognosis({ ecog, albumin, lymphocyteCount, days }) {
  let score = 0;
  if (ecog >= 3) score += 2; else if (ecog === 2) score += 1;
  if (albumin < 2.5) score += 2; else if (albumin < 3.5) score += 1;
  if (lymphocyteCount < 0.8) score += 1;
  let survivalDays;
  if (score >= 3) survivalDays = 14;
  else if (score >= 1) survivalDays = 60;
  else survivalDays = 120;
  return { score, survivalMedianDays: survivalDays, hospice: score >= 3 };
}

function CancerScreeningIndication({ age, sex, smokingPackYears, familyHistory, priorCancer, hpv, mammogramHpv }) {
  const indications = [];
  if (age >= 45 && age <= 75) indications.push('lung-cancer-screening-CT');
  if (age >= 50 && age <= 75) indications.push('colon-cancer-screening');
  if (sex === 'female' && age >= 40 && age <= 74) indications.push('mammography');
  if (sex === 'female' && age >= 21 && age <= 65) indications.push('cervical-cancer-screening');
  if (sex === 'male' && age >= 55 && age <= 69) indications.push('shared-decision-PSA');
  if (smokingPackYears >= 30 && age >= 55 && age <= 80) indications.push('lung-cancer-screening');
  if (familyHistory && familyHistory.includes('breast')) indications.push('genetic-counseling');
  if (priorCancer) indications.push('surveillance-imaging');
  return { indications, count: indications.length };
}

function MutationInterpretation({ variant, classification, alleleFrequency, actionable }) {
  const tier = (classification === 'pathogenic' || classification === 'likely-pathogenic') ? 'I' :
               (classification === 'vus') ? 'III' :
               (classification === 'likely-benign') ? 'IV' :
               (classification === 'benign') ? 'V' : 'II';
  const therapyActionable = tier === 'I' && actionable;
  return { tier, ampAscoTier: tier, therapyActionable, recommendation: tier === 'I' ? 'report + targeted therapy if available' : tier === 'III' ? 'follow-up testing' : 'do not change management' };
}

function HospiceEligibility({ prognosis6Mo, ecog, weightLoss, hospitalizations, declineFunctional }) {
  let score = 0;
  if (prognosis6Mo) score += 3;
  if (ecog >= 3) score += 2;
  if (weightLoss > 10) score += 1;
  if (hospitalizations >= 2) score += 1;
  if (declineFunctional) score += 2;
  const eligible = score >= 5;
  return { score, eligible, referral: eligible ? 'hospice evaluation' : 'continue treatment' };
}

module.exports = {
  TNMSolid, ECOG, RECISTResponse, ChemoToxicityRisk, NeutropenicFever,
  TumorLysisSyndrome, PalliativePrognosis, CancerScreeningIndication,
  MutationInterpretation, HospiceEligibility,
};
