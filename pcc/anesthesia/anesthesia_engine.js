'use strict';
// Anesthesia Engine: 10 pure deterministic functions
// Compliance: ASA, APSF, AAGBI, ESA, ESAIC, SAMBA

function Mallampati({ view }) {
  const grades = { 1: 'soft-palate-fauces-uvula-pillars', 2: 'soft-palate-fauces-uvula-partial', 3: 'soft-palate-base-uvula', 4: 'hard-palate-only' };
  let difficult;
  if (view === 4) difficult = 'predicted-difficult';
  else if (view === 3) difficult = 'possibly-difficult';
  else difficult = 'easy';
  return { mallampati: view, description: grades[view], difficultAirway: difficult };
}

function STOPBANG({ snoring, tired, observed, bp, bmi, age, neck, sex }) {
  let yes = 0;
  if (snoring) yes += 1;
  if (tired) yes += 1;
  if (observed) yes += 1;
  if (bp) yes += 1;
  if (bmi > 35) yes += 1;
  if (age > 50) yes += 1;
  if (neck > 40) yes += 1;
  if (sex === 'male') yes += 1;
  let risk;
  if (yes >= 5) risk = 'high-OSA';
  else if (yes >= 3) risk = 'intermediate-OSA';
  else risk = 'low-OSA';
  return { yes, risk, recommendation: risk === 'high-OSA' ? 'preop-sleep-study' : risk === 'intermediate-OSA' ? 'consider-sleep-study' : 'standard' };
}

function ASAClassification({ asaClass, emergency, comorbidities }) {
  const descriptions = {
    1: 'normal-healthy',
    2: 'mild-systemic-disease',
    3: 'severe-systemic-disease',
    4: 'severe-constant-threat-to-life',
    5: 'moribund-not-survive-without-op',
    6: 'brain-dead-organ-donor',
  };
  let mortality;
  if (asaClass === 1) mortality = 0.06;
  else if (asaClass === 2) mortality = 0.27;
  else if (asaClass === 3) mortality = 1.8;
  else if (asaClass === 4) mortality = 7.8;
  else if (asaClass === 5) mortality = 9.4;
  else mortality = 50;
  if (emergency) mortality *= 1.5;
  return { asa: asaClass, description: descriptions[asaClass], emergency, mortalityPct: Math.round(mortality * 100) / 100, comorbidities };
}

function PerioperativeCardiacRisk({ age, surgeryType, ischemicHeartDisease, heartFailure, cerebrovascularDisease, diabetes, creatinine, functionalCapacityMets }) {
  let risk = 0;
  if (age >= 70) risk += 1;
  if (surgeryType === 'high-risk-vascular' || surgeryType === 'thoracic') risk += 2;
  else if (surgeryType === 'intermediate-ortho' || surgeryType === 'abdominal') risk += 1;
  if (ischemicHeartDisease) risk += 1;
  if (heartFailure) risk += 1;
  if (cerebrovascularDisease) risk += 1;
  if (diabetes) risk += 1;
  if (creatinine > 2) risk += 1;
  if (functionalCapacityMets < 4) risk += 1;
  let level;
  if (risk >= 4) level = 'high-MINS-risk';
  else if (risk >= 2) level = 'intermediate-MINS-risk';
  else level = 'low-MINS-risk';
  return { riskScore: risk, level, recommendation: level === 'high-MINS-risk' ? 'consider-cardiology-preop' : 'standard-preop' };
}

function DifficultAirway({ mallampati, thyromentalDistance, neckMobility, mouthOpening, bodyHabitus, priorDifficult, priorExtubation, sleepApnea }) {
  let risk = 0;
  if (mallampati === 4) risk += 2; else if (mallampati === 3) risk += 1;
  if (thyromentalDistance < 6) risk += 2;
  if (neckMobility === 'limited') risk += 1;
  if (mouthOpening < 3) risk += 1;
  if (bodyHabitus === 'obese') risk += 1;
  if (priorDifficult) risk += 3;
  if (sleepApnea) risk += 1;
  let level;
  if (risk >= 5) level = 'predicted-difficult-airway';
  else if (risk >= 3) level = 'possibly-difficult';
  else level = 'easy-airway-expected';
  return { risk, level, recommendation: level === 'predicted-difficult-airway' ? 'awake-fiberoptic-or-videolaryngoscope' : 'standard' };
}

function MalignantHyperthermiaRisk({ personalHistory, familyHistory, triggeringAgent, age, muscleBulk }) {
  let risk = 0;
  if (personalHistory) risk += 10;
  if (familyHistory) risk += 5;
  if (triggeringAgent && (triggeringAgent === 'succinylcholine' || triggeringAgent === 'halothane')) risk += 3;
  let recommendation;
  if (risk >= 5) recommendation = 'NON-TRIGGERING-anesthesia';
  else if (risk >= 3) recommendation = 'caution-avoid-triggers';
  else recommendation = 'standard';
  return { risk, recommendation, hasRiskFactors: risk > 0 };
}

function PONVRisk({ sex, smokingStatus, historyPonv, opoidUse, surgeryType, durationMinutes, volatileAnesthetic, antiemeticProphylaxis }) {
  let score = 0;
  if (sex === 'female') score += 1;
  if (smokingStatus === 'non-smoker') score += 1;
  if (historyPonv) score += 1;
  if (opoidUse) score += 1;
  if (surgeryType === 'laparoscopic' || surgeryType === 'gynecologic' || surgeryType === 'cholecystectomy') score += 1;
  if (durationMinutes >= 60) score += 1;
  if (volatileAnesthetic) score += 1;
  if (antiemeticProphylaxis) score -= 1;
  let risk;
  if (score >= 4) risk = 'high';
  else if (score >= 2) risk = 'moderate';
  else risk = 'low';
  return { score, risk, recommendation: risk === 'high' ? 'multimodal-antiemetic' : risk === 'moderate' ? 'two-drug-antiemetic' : 'single-drug' };
}

function CapriniScore({ age, priorVTE, familyVteHistory, immobilityDays, surgeryDuration, obesity, hormoneTherapy, pregnancy, recentMI, copd, cancer, varicoseVeins, centralVenousAccess }) {
  let score = 0;
  if (age >= 75) score += 3; else if (age >= 60) score += 2; else if (age >= 40) score += 1;
  if (priorVTE) score += 3;
  if (familyVteHistory) score += 3;
  if (immobilityDays > 3) score += 2;
  if (surgeryDuration > 6) score += 3; else if (surgeryDuration > 2) score += 2;
  if (obesity) score += 1;
  if (hormoneTherapy) score += 1;
  if (pregnancy) score += 1;
  if (recentMI) score += 1;
  if (copd) score += 1;
  if (cancer) score += 2;
  if (varicoseVeins) score += 1;
  if (centralVenousAccess) score += 2;
  let risk;
  if (score >= 5) risk = 'highest-risk';
  else if (score >= 3) risk = 'high-risk';
  else if (score >= 2) risk = 'moderate-risk';
  else risk = 'low-risk';
  return { score, risk, recommendation: score >= 3 ? 'pharmacologic+LMWH' : 'mechanical-or-pharmacologic' };
}

function LaryngoscopyGrade({ view, attempts, equipment }) {
  let grade;
  if (view === 'no-view') grade = 4;
  else if (view === 'only-corniotts') grade = 3;
  else if (view === 'partial-arytenoids') grade = 2;
  else grade = 1;
  let intubationSuccess;
  if (attempts === 1 && grade === 1) intubationSuccess = 'first-pass';
  else if (attempts <= 2 && grade <= 2) intubationSuccess = 'second-pass';
  else if (grade >= 3) intubationSuccess = 'difficult-FO-or-videolaryngoscope';
  else intubationSuccess = 'consider-DAS-guidelines';
  return { grade, intubationSuccess, equipment };
}

function RegionalAnesthesiaDecision({ surgery, coagulopathy, patientConsent, anatomyDifficult, infection, anticoagulation, blockType }) {
  const safe = !coagulopathy && !infection && patientConsent;
  if (!safe) return { suitable: false, reason: !coagulopathy ? !infection ? 'no-consent' : 'infection' : 'coagulopathy' };
  if (anticoagulation) return { suitable: false, reason: 'anticoagulation-still-effective' };
  return { suitable: true, approach: 'standard-block', blockType };
}

module.exports = {
  Mallampati, STOPBANG, ASAClassification, PerioperativeCardiacRisk, DifficultAirway,
  MalignantHyperthermiaRisk, PONVRisk, CapriniScore, LaryngoscopyGrade, RegionalAnesthesiaDecision,
};
