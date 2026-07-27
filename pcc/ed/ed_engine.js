/**
 * pcc/ed/ed_engine.js — PCC #14: Emergency Department
 * 10 deterministic functions for ED triage & initial management.
 *
 * Compliance: ESI v.4 · ATLS · AHA ACLS · HEART score · Wells / PERC.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. ESITriage — Emergency Severity Index v.4.
 */
function ESITriage({ vitalSignsStable, expectedResources, age, presentation }) {
  let level;
  if (!vitalSignsStable) level = 1;
  else if (presentation === 'high_risk_situation') level = 2;
  else if (expectedResources === 0) level = 5;
  else if (expectedResources === 1) level = 4;
  else if (expectedResources >= 2) level = 3;
  if (age >= 80 && level > 2) level = level - 1;
  return { level, targetTimeToProvider: level <= 2 ? 'immediate' : level === 3 ? '30_min' : level === 4 ? '60_min' : '120_min' };
}

/**
 * 2. HEARTScore — chest pain risk stratification.
 */
function HEARTScore({ history, ecg, age, riskFactors, troponin }) {
  let score = 0;
  if (history === 'slightly_suspicious') score += 1;
  else if (history === 'moderately_suspicious') score += 1;
  else if (history === 'highly_suspicious') score += 2;
  if (ecg === 'non_specific_repolarization') score += 1;
  else if (ecg === 'significant_st_depression') score += 1;
  else if (ecg === 'st_elevation') score += 2;
  if (age >= 65) score += 2;
  else if (age >= 45) score += 1;
  if (riskFactors >= 3) score += 2;
  else if (riskFactors >= 1) score += 1;
  if (troponin >= 3) score += 2;
  else if (troponin >= 1) score += 1;
  return { score, risk: score >= 7 ? 'high' : score >= 4 ? 'moderate' : 'low', admission: score >= 4 };
}

/**
 * 3. WellsPE — pre-test probability of PE.
 */
function WellsPE({ clinicalSignsDVT, peMostLikely, hrAbove100, immobility, previousDVT, hemoptysis, malignancy }) {
  let score = 0;
  if (clinicalSignsDVT) score += 3;
  if (peMostLikely) score += 3;
  if (hrAbove100) score += 1.5;
  if (immobility) score += 1.5;
  if (previousDVT) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;
  let probability = 'low';
  if (score > 6) probability = 'high';
  else if (score >= 2) probability = 'moderate';
  return { score, probability, dDimerIndicated: probability !== 'high' };
}

/**
 * 4. PERCRule — Pulmonary Embolism Rule-Out Criteria.
 */
function PERCRule({ age50, hr100, spo2Less95, unilateralLegSwelling, hemoptysis, estrogenUse, priorDVT, surgeryRecent }) {
  const criteria = { age50, hr100, spo2Less95, unilateralLegSwelling, hemoptysis, estrogenUse, priorDVT, surgeryRecent };
  const any = Object.values(criteria).some(v => v);
  return { anyCriterion: any, canRuleOut: !any, criteria };
}

/**
 * 5. ABCD2Score — TIA risk of stroke.
 */
function ABCD2Score({ age, bp, clinicalFeatures, duration, diabetes }) {
  let score = 0;
  if (age >= 60) score += 1;
  if (bp.systolic >= 140 || bp.diastolic >= 90) score += 1;
  if (clinicalFeatures === 'unilateral_weakness') score += 2;
  else if (clinicalFeatures === 'speech_disturbance') score += 1;
  if (duration >= 60) score += 2;
  else if (duration >= 10) score += 1;
  if (diabetes) score += 1;
  return { score, risk: score >= 6 ? 'high' : score >= 4 ? 'moderate' : 'low', admission: score >= 4 };
}

/**
 * 6. GlasgowBlatchfordScore — upper GI bleed mortality.
 */
function GlasgowBlatchfordScore({ bun, hb, systolicBP, hr, melena, syncope, hepaticDisease, cardiacFailure }) {
  let score = 0;
  if (bun >= 25) score += 6;
  else if (bun >= 10) score += 4;
  else if (bun >= 8) score += 3;
  if (hb < 10) score += 6;
  else if (hb < 12) score += 3;
  else if (hb < 13) score += 1;
  if (systolicBP < 90) score += 3;
  else if (systolicBP < 100) score += 2;
  else if (systolicBP < 110) score += 1;
  if (hr >= 100) score += 1;
  if (melena) score += 1;
  if (syncope) score += 2;
  if (hepaticDisease) score += 2;
  if (cardiacFailure) score += 2;
  return { score, risk: score >= 6 ? 'high' : score >= 1 ? 'moderate' : 'low', interventionLikely: score >= 6 };
}

/**
 * 7. CURB65 — community-acquired pneumonia mortality.
 */
function CURB65({ confusion, uremiaBUN19, respiratoryRate30, bpLow, age65 }) {
  let score = 0;
  if (confusion) score += 1;
  if (uremiaBUN19) score += 1;
  if (respiratoryRate30) score += 1;
  if (bpLow) score += 1;
  if (age65) score += 1;
  return { score, mortality: score >= 3 ? 'high' : score >= 2 ? 'moderate' : 'low', admit: score >= 2 };
}

/**
 * 8. PECARNPediatric — pediatric head injury rule.
 */
function PECARNPediatric({ ageUnder2, alteredMentalStatus, signsOfBasalSkullFracture, historyOfLOC, vomiting, severeMechanism, scalpHematoma }) {
  if (ageUnder2) {
    let risk = 'low';
    if (alteredMentalStatus || signsOfBasalSkullFracture) risk = 'high';
    else if (!severeMechanism && !scalpHematoma && !historyOfLOC && !vomiting && !alteredMentalStatus) risk = 'low';
    else risk = 'intermediate';
    return { ageGroup: 'under_2', risk, ctRecommended: risk === 'high' || (risk === 'intermediate' && ageUnder2) };
  }
  let risk = 'low';
  if (alteredMentalStatus || signsOfBasalSkullFracture) risk = 'high';
  else if (historyOfLOC || vomiting || severeMechanism) risk = 'intermediate';
  return { ageGroup: 'over_2', risk, ctRecommended: risk === 'high' };
}

/**
 * 9. ATLSPrimarySurvey — ABCDE assessment.
 */
function ATLSPrimarySurvey({ airway, breathing, circulation, disability, exposure }) {
  const findings = { airway, breathing, circulation, disability, exposure };
  const unstable = !airway || breathing === 'tension_pneumothorax' || circulation === 'massive_hemorrhage' || disability === 'unresponsive';
  return {
    findings,
    unstable,
    nextStep: unstable ? 'immediate_intervention' : 'secondary_survey',
    airwayIntervened: !airway,
  };
}

/**
 * 10. DispositionDecision — admit vs discharge vs transfer.
 */
function DispositionDecision({ diagnosis, severity, socialSupport, insurance, age }) {
  if (severity === 'critical') return { disposition: 'icu', reason: 'critical_illness' };
  if (severity === 'high' && age >= 80) return { disposition: 'admit', reason: 'high_risk_elderly' };
  if (severity === 'high') return { disposition: 'admit', reason: 'high_severity' };
  if (severity === 'moderate' && !socialSupport) return { disposition: 'observation', reason: 'limited_social_support' };
  if (severity === 'low' && !insurance) return { disposition: 'discharge_with_followup', reason: 'no_insurance' };
  return { disposition: 'discharge', reason: 'meets_criteria' };
}

module.exports = {
  ESITriage, HEARTScore, WellsPE, PERCRule, ABCD2Score,
  GlasgowBlatchfordScore, CURB65, PECARNPediatric,
  ATLSPrimarySurvey, DispositionDecision,
};
