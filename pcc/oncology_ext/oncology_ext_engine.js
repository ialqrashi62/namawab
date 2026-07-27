'use strict';
// Oncology Extended Engine: 10 pure deterministic functions
// Compliance: RECIST 1.1, ECOG, Khorana, NCCN, ESMO, AJCC 8th

function RECIST11({ targetLesionsSum, nadirSum, newLesions, nonTargetProgression }) {
  const pctChange = nadirSum > 0 ? ((targetLesionsSum - nadirSum) / nadirSum) * 100 : 0;
  let response;
  if (newLesions || nonTargetProgression) response = 'PD-progressive-disease';
  else if (pctChange >= 20) response = 'PD-progressive-disease';
  else if (pctChange <= -30) response = 'PR-partial-response';
  else if (targetLesionsSum === 0) response = 'CR-complete-response';
  else response = 'SD-stable-disease';
  return { sumMm: targetLesionsSum, nadirMm: nadirSum, percentChange: Math.round(pctChange), response };
}

function ECOGPerformance({ activity }) {
  let score;
  if (activity === 'fully-active') score = 0;
  else if (activity === 'ambulatory') score = 1;
  else if (activity === 'self-care') score = 2;
  else if (activity === 'limited-self-care') score = 3;
  else if (activity === 'bedridden') score = 4;
  else score = 5;
  return { ecog: score, recommendation: score <= 2 ? 'eligible-chemo' : score === 3 ? 'consider-modified-regimen' : 'palliative-care' };
}

function KhoranaScore({ cancerType, hemoglobin, leukocytes, platelets, bmi, gemcitabine, platinum }) {
  let score = 0;
  if (cancerType === 'stomach' || cancerType === 'pancreas') score += 2;
  else if (cancerType === 'lung' || cancerType === 'lymphoma' || cancerType === 'gynecologic' || cancerType === 'bladder' || cancerType === 'testicular') score += 1;
  if (hemoglobin < 10) score += 1;
  if (leukocytes > 11) score += 1;
  if (platelets >= 350) score += 1;
  if (bmi >= 35) score += 1;
  if (gemcitabine) score += 1;
  if (platinum) score += 1;
  let risk;
  if (score >= 3) risk = 'high-VTE-risk-consider-prophylaxis';
  else if (score >= 1) risk = 'intermediate-VTE-risk';
  else risk = 'low-VTE-risk';
  return { score, risk, recommendation: score >= 3 ? 'DOAC-or-LMWH-prophylaxis' : 'monitor' };
}

function TumorMarkerTrend({ ca125Baseline, ca125Current, psaBaseline, psaCurrent, afpBaseline, afpCurrent, ceaBaseline, ceaCurrent }) {
  const trends = [];
  if (ca125Baseline && ca125Current) {
    const r = ca125Current / ca125Baseline;
    if (r > 1.5) trends.push({ marker: 'CA-125', trend: 'rising', fold: Math.round(r * 10) / 10 });
    else if (r < 0.5) trends.push({ marker: 'CA-125', trend: 'falling', fold: Math.round(r * 10) / 10 });
    else trends.push({ marker: 'CA-125', trend: 'stable', fold: Math.round(r * 10) / 10 });
  }
  if (psaBaseline && psaCurrent) {
    const r = psaCurrent / psaBaseline;
    if (r > 1.5) trends.push({ marker: 'PSA', trend: 'rising', fold: Math.round(r * 10) / 10 });
    else if (r < 0.5) trends.push({ marker: 'PSA', trend: 'falling', fold: Math.round(r * 10) / 10 });
    else trends.push({ marker: 'PSA', trend: 'stable', fold: Math.round(r * 10) / 10 });
  }
  if (afpBaseline && afpCurrent) {
    const r = afpCurrent / afpBaseline;
    if (r > 1.5) trends.push({ marker: 'AFP', trend: 'rising', fold: Math.round(r * 10) / 10 });
    else if (r < 0.5) trends.push({ marker: 'AFP', trend: 'falling', fold: Math.round(r * 10) / 10 });
    else trends.push({ marker: 'AFP', trend: 'stable', fold: Math.round(r * 10) / 10 });
  }
  if (ceaBaseline && ceaCurrent) {
    const r = ceaCurrent / ceaBaseline;
    if (r > 1.5) trends.push({ marker: 'CEA', trend: 'rising', fold: Math.round(r * 10) / 10 });
    else if (r < 0.5) trends.push({ marker: 'CEA', trend: 'falling', fold: Math.round(r * 10) / 10 });
    else trends.push({ marker: 'CEA', trend: 'stable', fold: Math.round(r * 10) / 10 });
  }
  return { trends, recommendation: trends.some(t => t.trend === 'rising') ? 're-stage-imaging' : 'continue' };
}

function NeutropenicFever({ temperatureNeutropenia, anc, hypotension, respiratory, mentalStatus, dehydration, age, comorbidities }) {
  let risk = 0;
  if (anc < 100) risk += 3;
  else if (anc < 500) risk += 2;
  if (hypotension) risk += 2;
  if (respiratory) risk += 2;
  if (mentalStatus) risk += 2;
  if (dehydration) risk += 1;
  if (age >= 60) risk += 1;
  if (comorbidities >= 2) risk += 1;
  let category;
  if (risk >= 7) category = 'high-risk-ICU';
  else if (risk >= 4) category = 'high-risk-admit';
  else category = 'low-risk-possibly-outpatient';
  let treatment;
  if (category === 'high-risk-ICU') treatment = 'ICU-broad-spectrum-antibiotics-anti-fungal';
  else if (category === 'high-risk-admit') treatment = 'admit-broad-spectrum-antibiotics';
  else treatment = 'oral-antibiotics-possibly-outpatient';
  return { riskScore: risk, category, treatment, anc };
}

function FebrileNeutropeniaProphylaxis({ chemoRegimen, patientRisk, age, comorbidities, priorFebrileNeutropenia }) {
  let indication = false;
  let gcsf = 'no-GCSF';
  if (chemoRegimen === 'high-risk-FN') indication = true;
  if (priorFebrileNeutropenia) indication = true;
  if (age >= 65 && chemoRegimen !== 'low-risk-FN') indication = true;
  if (comorbidities >= 2) indication = true;
  if (indication) gcsf = 'pegfilgrastim-or-filgrastim';
  return { indication, gcsf, recommendation: indication ? 'prophylactic-GCSF' : 'no-prophylaxis' };
}

function TumorLysisRisk({ cancerType, wbc, bulkyDisease, renalInvolvement, baselineUricAcid, baselineCreatinine, hydration, allopurinolStarted, rasburicaseStarted }) {
  let risk = 0;
  if (cancerType === 'AML' || cancerType === 'ALL' || cancerType === 'Burkitt') risk += 3;
  if (wbc >= 50000) risk += 2;
  if (bulkyDisease) risk += 2;
  if (renalInvolvement) risk += 1;
  if (baselineUricAcid >= 8) risk += 2;
  if (baselineCreatinine >= 2) risk += 1;
  let category;
  if (risk >= 7) category = 'high-risk-TLS';
  else if (risk >= 4) category = 'intermediate-risk-TLS';
  else category = 'low-risk-TLS';
  let treatment;
  if (category === 'high-risk-TLS') treatment = 'IV-hydration-rasburicase-aggressive';
  else if (category === 'intermediate-risk-TLS') treatment = 'IV-hydration-allopurinol';
  else treatment = 'monitor-hydration';
  return { riskScore: risk, category, treatment };
}

function ChemoDoseAdjustment({ currentDose, anc, platelets, creatinine, bilirubin, ast, alt, age }) {
  let adjustment = 'no-change';
  const reasons = [];
  if (anc < 1500) { adjustment = 'hold-or-reduce'; reasons.push('neutropenia'); }
  else if (anc < 2000) { adjustment = 'reduce-25pct'; reasons.push('borderline-neutropenia'); }
  if (platelets < 100000) { adjustment = 'hold-or-reduce'; reasons.push('thrombocytopenia'); }
  if (creatinine >= 2) { adjustment = 'reduce-or-avoid-renal-cleared'; reasons.push('renal'); }
  if (bilirubin >= 2) { adjustment = 'reduce-or-avoid-hepatic'; reasons.push('hepatic'); }
  if (ast >= 5 || alt >= 5) { adjustment = 'reduce-50pct'; reasons.push('transaminitis'); }
  if (age >= 75 && reasons.length >= 1) { adjustment = 'consider-greater-reduction'; reasons.push('elderly'); }
  return { adjustment, reasons, currentDose };
}

function PalliativePrognosis({ ppScore, dnrStatus, hospitalAdmissionsLastMonth, weightLoss, edEmergency, albumin, declineInFunction }) {
  let prognosis;
  if (ppScore >= 70) prognosis = 'weeks-to-days';
  else if (ppScore >= 50) prognosis = 'weeks-to-months';
  else if (ppScore >= 30) prognosis = 'months';
  else prognosis = 'months-to-years';
  let careLevel;
  if (hospitalAdmissionsLastMonth >= 2 || edEmergency) careLevel = 'hospice-consider';
  else if (declineInFunction) careLevel = 'home-hospice-referral';
  else if (ppScore >= 70) careLevel = 'hospice';
  else careLevel = 'palliative-care-co-management';
  return { prognosis, careLevel, recommendation: careLevel === 'hospice' || careLevel === 'hospice-consider' ? 'hospice-discussion' : 'continue-palliative' };
}

function ImmunotherapyToxicity({ irAE, organSystem, grade, onCorticosteroids, hospitalAdmission }) {
  let classification;
  if (grade >= 3) classification = 'severe-G3-G4';
  else if (grade === 2) classification = 'moderate-G2';
  else if (grade === 1) classification = 'mild-G1';
  else classification = 'none';
  let management;
  if (classification === 'severe-G3-G4') management = 'hold-immunotherapy-IV-methylprednisolone-hospitalize';
  else if (classification === 'moderate-G2') management = 'hold-immunotherapy-oral-prednisone';
  else if (classification === 'mild-G1') management = 'continue-immunotherapy-monitor-symptomatic';
  else management = 'continue-monitoring';
  if (organSystem === 'pneumonitis' && grade >= 2) management += '-infliximab-or-IVIG-if-refractory';
  if (organSystem === 'hepatitis' && grade >= 3) management += '-mycophenolate-if-refractory';
  return { irAE, organSystem, grade, classification, management };
}

module.exports = {
  RECIST11, ECOGPerformance, KhoranaScore, TumorMarkerTrend, NeutropenicFever,
  FebrileNeutropeniaProphylaxis, TumorLysisRisk, ChemoDoseAdjustment, PalliativePrognosis, ImmunotherapyToxicity,
};
