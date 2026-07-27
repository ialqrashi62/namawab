'use strict';
// Palliative Engine: 10 pure deterministic functions
// Compliance: WHO, ESMO, ASCO, NHPCO, AAHPM, ELNEC, NICE palliative

function ESAS({ pain, tiredness, drowsiness, nausea, appetite, dyspnea, depression, anxiety, wellbeing, other }) {
  const items = { pain, tiredness, drowsiness, nausea, appetite, dyspnea, depression, anxiety, wellbeing, other: other || 0 };
  const total = Object.values(items).reduce((a, b) => a + b, 0);
  let classification;
  if (total >= 70) classification = 'severe-burden';
  else if (total >= 40) classification = 'moderate-burden';
  else if (total >= 20) classification = 'mild-burden';
  else classification = 'minimal-burden';
  const severeSymptoms = Object.entries(items).filter(([_, v]) => v >= 7).map(([k]) => k);
  return { items, total, classification, severeSymptoms, recommendation: severeSymptoms.length > 0 ? 'symptom-management' : 'monitor' };
}

function Karnofsky({ score }) {
  let grade;
  if (score >= 90) grade = 'normal-activity';
  else if (score >= 70) grade = 'unable-to-work';
  else if (score >= 50) grade = 'requires-assistance';
  else if (score >= 30) grade = 'severe-disability';
  else if (score >= 10) grade = 'moribund';
  else grade = 'dead';
  return { kps: score, grade, mortality1yrPct: score <= 50 ? 70 : score <= 70 ? 30 : 5 };
}

function PalliativePerformanceScale({ ambulation, activity, selfCare, intake, consciousnessLevel }) {
  const scores = { 100: 100, 90: 90, 80: 80, 70: 70, 60: 60, 50: 50, 40: 40, 30: 30, 20: 20, 10: 10 };
  const total = (scores[ambulation] || 0) + (scores[activity] || 0) + (scores[selfCare] || 0) + (scores[intake] || 0) + (scores[consciousnessLevel] || 0);
  const avg = total / 5;
  return { pps: avg, ambulation, activity, selfCare, intake, consciousnessLevel, mortality: avg <= 30 ? 'days-weeks' : avg <= 50 ? 'weeks-months' : 'months' };
}

function OpioidRotation({ currentOpioid, currentDose, targetOpioid, painControl }) {
  const conversionFactors = { 'morphine-PO': 1, 'oxycodone-PO': 1.5, 'hydromorphone-PO': 4, 'fentanyl-TD': 30, 'methadone': 8 };
  const curFactor = conversionFactors[currentOpioid] || 1;
  const targetFactor = conversionFactors[targetOpioid] || 1;
  const targetDose = (currentDose * curFactor) / targetFactor;
  const reduction = painControl === 'inadequate' ? 0.85 : 0.75;
  const finalDose = targetDose * reduction;
  return { currentDose, targetDose: Math.round(finalDose * 10) / 10, reduction, targetOpioid, recommendation: `reduce-by-15-25%-for-safety` };
}

function SymptomAssessmentDelirium({ acuteOnset, inattention, disorganizedThinking, alteredConsciousness, psychomotor, rASS }) {
  let features = (acuteOnset ? 1 : 0) + (inattention ? 1 : 0) + (disorganizedThinking ? 1 : 0) + (alteredConsciousness ? 1 : 0);
  let classification;
  if (features >= 4) classification = 'delirium-NOS';
  else if (features >= 3) classification = 'probable-delirium';
  else if (features >= 1) classification = 'possible-delirium';
  else classification = 'no-delirium';
  const hyperactive = rASS > 0;
  const hypoactive = rASS < 0;
  return { classification, features, psychomotor: hyperactive ? 'hyperactive' : hypoactive ? 'hypoactive' : 'mixed', management: classification.includes('delirium') ? 'workup+management' : 'monitor' };
}

function PrognosticIndicatorPPI({ pps, delrium, edema, dyspneaAtRest, weightLoss, dysphagia }) {
  let score = 0;
  if (pps <= 20) score += 2.5; else if (pps <= 40) score += 1.5;
  if (delrium) score += 1.5;
  if (edema) score += 1;
  if (dyspneaAtRest) score += 1;
  if (weightLoss > 10) score += 1;
  if (dysphagia) score += 1;
  let medianSurvival;
  if (score >= 6) medianSurvival = 2;
  else if (score >= 4) medianSurvival = 14;
  else if (score >= 2.5) medianSurvival = 30;
  else medianSurvival = 60;
  return { ppiScore: score, medianSurvivalDays: medianSurvival, poor: score >= 6 };
}

function LiverpoolCarePathway({ diagnosis, comfortCare, hydration, medications, familyMeetings, lastDaysOfLife }) {
  let careProvided = 0;
  if (comfortCare) careProvided += 1;
  if (hydration) careProvided += 1;
  if (medications && medications.length > 0) careProvided += 1;
  if (familyMeetings && familyMeetings > 0) careProvided += 1;
  if (lastDaysOfLife) careProvided += 1;
  return { careProvided, lastDaysOfLife, recommendation: careProvided >= 4 ? 'continue-LCP' : 'review-LCP' };
}

function OpioidSideEffects({ opioid, constipation, nausea, sedation, respiratoryDepression, myoclonus, pruritus, neuropathicComponent }) {
  const issues = [];
  if (constipation) issues.push('constipation-laxative-needed');
  if (nausea) issues.push('nausea-antiemetic');
  if (sedation) issues.push('sedation-monitor');
  if (respiratoryDepression) issues.push('respiratory-depression-naloxone');
  if (myoclonus) issues.push('myoclonus-rotate');
  if (pruritus) issues.push('pruritus-antihistamine');
  if (neuropathicComponent) issues.push('consider-nerve-block-or-adjuvant');
  return { opioid, issues, urgent: respiratoryDepression, recommendation: respiratoryDepression ? 'urgent-naloxone' : 'manage-symptoms' };
}

function SpiritualAssessment({ faith, distressLevel, hopeLevel, socialSupport, endOfLifeDiscussion, advanceDirectives }) {
  let score = 0;
  if (distressLevel >= 7) score += 2;
  if (hopeLevel <= 3) score += 2;
  if (socialSupport === 'limited') score += 2;
  if (endOfLifeDiscussion === 'pending') score += 1;
  if (advanceDirectives === 'absent') score += 1;
  let classification;
  if (score >= 5) classification = 'severe-spiritual-distress';
  else if (score >= 3) classification = 'moderate-spiritual-distress';
  else classification = 'mild-spiritual-distress';
  return { faith, score, classification, recommendation: score >= 3 ? 'chaplain-spiritual-care-referral' : 'standard' };
}

function HospiceEligibility6Mo({ progressiveDisease, recentHospitalizations, weightLoss, edemea, dyspnea, ecog, hospiceDecline }) {
  let score = 0;
  if (progressiveDisease) score += 2;
  if (recentHospitalizations >= 2) score += 1;
  if (weightLoss > 10) score += 1;
  if (edemea) score += 1;
  if (dyspnea) score += 1;
  if (ecog >= 3) score += 2;
  if (hospiceDecline) score += 2;
  return { score, eligible: score >= 5, recommendation: score >= 5 ? 'hospice-evaluation' : 'palliative-care' };
}

module.exports = {
  ESAS, Karnofsky, PalliativePerformanceScale, OpioidRotation, SymptomAssessmentDelirium,
  PrognosticIndicatorPPI, LiverpoolCarePathway, OpioidSideEffects, SpiritualAssessment, HospiceEligibility6Mo,
};
