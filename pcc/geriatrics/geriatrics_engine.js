'use strict';
// Geriatrics Engine: 10 pure deterministic functions
// Compliance: AGS, Beers, STOPP, FRAIL, CDC STEADI, Mini-Cog, MDS

function BeersCriteria({ medications, age, fallHistory, dementia, chronicKidneyDisease }) {
  const avoidList = [];
  if (medications.includes('diphenhydramine') && age >= 65) avoidList.push('diphenhydramine-1st-gen-antihistamine');
  if (medications.includes('diazepam') && age >= 65) avoidList.push('benzodiazepine-long-acting');
  if (medications.includes('amiodarone') && age >= 65) avoidList.push('amiodarone-first-line-afib');
  if (medications.includes('glyburide') && age >= 65) avoidList.push('glyburide-long-acting-sulfonylurea');
  if (medications.includes('nitrofurantoin') && chronicKidneyDisease) avoidList.push('nitrofurantoin-ckd');
  if (medications.includes('sliding-scale-insulin') && age >= 65) avoidList.push('sliding-scale-insulin');
  if (medications.includes('meperidine') && age >= 65) avoidList.push('meperidine-delirium');
  if (medications.includes('chlorpromazine') && dementia) avoidList.push('chlorpromazine-dementia-delirium');
  return { avoidList, count: avoidList.length, recommendation: avoidList.length > 0 ? 'deprescribe-review-with-pharmacist' : 'continue-monitor' };
}

function STOPPCriteria({ medications, diagnoses }) {
  const inappropriate = [];
  if (medications.includes('nsaid') && diagnoses.includes('ckd')) inappropriate.push('NSAID-CKD');
  if (medications.includes('nsaid') && diagnoses.includes('heart-failure')) inappropriate.push('NSAID-heart-failure');
  if (medications.includes('loop-diuretic') && diagnoses.includes('hyponatremia')) inappropriate.push('loop-hyponatremia');
  if (medications.includes('warfarin') && diagnoses.includes('recurrent-falls')) inappropriate.push('warfarin-falls');
  if (medications.includes('benzodiazepine') && diagnoses.includes('recurrent-falls')) inappropriate.push('benzo-falls');
  if (medications.includes('anticholinergic') && diagnoses.includes('dementia')) inappropriate.push('anticholinergic-dementia');
  if (medications.includes('opiate') && !medications.includes('laxative')) inappropriate.push('opiate-no-laxative');
  return { inappropriate, count: inappropriate.length, recommendation: inappropriate.length > 0 ? 'deprescribe-and-substitute' : 'continue' };
}

function FRAILScale({ fatigue, resistance, ambulation, illness, weightLoss }) {
  const total = fatigue + resistance + ambulation + illness + weightLoss;
  let category;
  if (total >= 3) category = 'frail';
  else if (total >= 1) category = 'pre-frail';
  else category = 'robust';
  return { score: total, maxScore: 5, category, recommendation: category === 'frail' ? 'comprehensive-geriatric-assessment' : category === 'pre-frail' ? 'exercise-nutrition-counseling' : 'maintain' };
}

function MiniCogAssessment({ wordRecall, clockDrawing, recallScore, drawingScore }) {
  let totalScore = recallScore + drawingScore;
  let interpretation;
  if (totalScore === 0) interpretation = 'dementia-likely';
  else if (totalScore <= 2) interpretation = 'some-impairment-screening-fail';
  else interpretation = 'normal-screen-pass';
  return { totalScore, interpretation, recallScore, drawingScore, recommendation: interpretation === 'dementia-likely' || interpretation === 'some-impairment-screening-fail' ? 'full-cognitive-workup' : 'reassess-annually' };
}

function TUGTest({ timeSeconds, assistiveDevice, fallHistory }) {
  let risk;
  if (timeSeconds >= 30) risk = 'high-fall-risk';
  else if (timeSeconds >= 20) risk = 'moderate-fall-risk';
  else if (timeSeconds >= 14) risk = 'mild-fall-risk';
  else risk = 'normal-mobility';
  if (assistiveDevice) risk = 'high-fall-risk';
  if (fallHistory) risk = 'high-fall-risk';
  return { timeSeconds, risk, recommendation: risk === 'high-fall-risk' ? 'PT-balance-training-home-safety' : 'continue-exercise' };
}

function MorseFallScale({ historyFalling, secondaryDiagnosis, ambulatoryAid, ivHeparin, gait, mentalStatus }) {
  const score = historyFalling + secondaryDiagnosis + ambulatoryAid + ivHeparin + gait + mentalStatus;
  let risk;
  if (score >= 45) risk = 'high-fall-risk';
  else if (score >= 25) risk = 'moderate-fall-risk';
  else risk = 'low-fall-risk';
  return { score, maxScore: 125, risk, recommendation: risk === 'high-fall-risk' ? 'fall-prevention-protocol' : 'standard-fall-precautions' };
}

function Polypharmacy({ medicationCount, age, comorbidityCount, adverseEvents, compliance, prescribingPhysicians }) {
  let classification;
  if (medicationCount >= 10) classification = 'hyper-polypharmacy';
  else if (medicationCount >= 5) classification = 'polypharmacy';
  else classification = 'no-polypharmacy';
  let risk = 0;
  if (age >= 80) risk += 1;
  if (comorbidityCount >= 5) risk += 2;
  if (adverseEvents) risk += 2;
  if (compliance === 'poor') risk += 2;
  if (prescribingPhysicians >= 3) risk += 2;
  let recommendation;
  if (classification === 'hyper-polypharmacy' || risk >= 4) recommendation = 'urgent-medication-reconciliation';
  else if (classification === 'polypharmacy') recommendation = 'medication-review-quarterly';
  else recommendation = 'continue-monitor';
  return { medicationCount, classification, riskScore: risk, recommendation };
}

function DeliriumCAM({ acuteOnset, inattention, disorganizedThinking, alteredConsciousness, disorientation, memoryImpairment, psychomotorChanges }) {
  let score = 0;
  if (acuteOnset) score += 2;
  if (inattention) score += 2;
  if (disorganizedThinking) score += 2;
  if (alteredConsciousness) score++;
  if (disorientation) score++;
  if (memoryImpairment) score++;
  if (psychomotorChanges) score++;
  let category;
  if (score >= 4 && acuteOnset && inattention) category = 'delirium';
  else if (score >= 2) category = 'subsyndromal-delirium';
  else category = 'no-delirium';
  let treatment;
  if (category === 'delirium') treatment = 'urgent-workup-evaluate-cause';
  else if (category === 'subsyndromal-delirium') treatment = 'close-monitoring-prevention';
  else treatment = 'routine-monitoring';
  return { score, category, treatment };
}

function SPPB({ balanceScore, gaitSpeedScore, chairStandScore }) {
  const total = balanceScore + gaitSpeedScore + chairStandScore;
  let category;
  if (total <= 6) category = 'frailty-severe-disability';
  else if (total <= 9) category = 'frailty-moderate';
  else category = 'no-frailty';
  let recommendation;
  if (category === 'frailty-severe-disability') recommendation = 'comprehensive-rehab-PT-OT';
  else if (category === 'frailty-moderate') recommendation = 'exercise-program-balance-strength';
  else recommendation = 'maintain-active-lifestyle';
  return { totalScore: total, maxScore: 12, category, recommendation };
}

function AdvanceCarePlanning({ age, comorbidities, lifeExpectancy, codeStatus, dnrInPlace, surrogateDecisionMaker, advanceDirective, goalsOfCare }) {
  let stage;
  if (!codeStatus) stage = 'urgent-discussion-needed';
  else if (!advanceDirective) stage = 'discuss-advance-directive';
  else if (!goalsOfCare) stage = 'define-goals-of-care';
  else if (!surrogateDecisionMaker) stage = 'designate-surrogate';
  else stage = 'complete-document';
  let priority;
  if (age >= 75 && comorbidities >= 3) priority = 'high-priority';
  else if (age >= 65) priority = 'moderate-priority';
  else priority = 'routine';
  return { stage, priority, lifeExpectancy, recommendation: stage === 'urgent-discussion-needed' ? 'palliative-care-referral' : 'annual-review' };
}

module.exports = {
  BeersCriteria, STOPPCriteria, FRAILScale, MiniCogAssessment, TUGTest,
  MorseFallScale, Polypharmacy, DeliriumCAM, SPPB, AdvanceCarePlanning,
};
