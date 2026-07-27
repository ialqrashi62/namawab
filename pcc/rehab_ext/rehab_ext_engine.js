'use strict';

// Rehab-Extended PCC — 10 pure deterministic functions
// Compliance: AAPMR, AAP, ACRM, NIH-NINDS, WHO-ICF, ASIA/ISNCSCI

const Engine = module.exports = {};

// 1) FIM — Functional Independence Measure
Engine.FIMScore = function (input = {}) {
  const { motorSelfCare = 7, motorSphincter = 7, motorMobility = 7, motorLocomotion = 7, motorStairs = 7, cognitionCommunication = 7, cognitionSocial = 7, cognitionProblemSolving = 7 } = input;
  const motorTotal = motorSelfCare + motorSphincter + motorMobility + motorLocomotion + motorStairs;
  const cognitionTotal = cognitionCommunication + cognitionSocial + cognitionProblemSolving;
  const total = motorTotal + cognitionTotal;
  let category;
  if (total >= 100) category = 'near-independent';
  else if (total >= 75) category = 'modified-independent-supervision';
  else if (total >= 50) category = 'moderate-assistance';
  else if (total >= 25) category = 'maximal-assistance';
  else category = 'total-dependence';
  return { motorTotal, cognitionTotal, total, category, recommendation: total < 50 ? '24-hr-caregiver-inpatient-rehab' : 'outpatient-therapy' };
};

// 2) Barthel Index
Engine.BarthelIndex = function (input = {}) {
  const { feeding = 10, bathing = 5, grooming = 5, dressing = 10, bowelControl = 10, bladderControl = 10, toiletUse = 10, chairBedTransfer = 15, mobility = 15, stairs = 10 } = input;
  const total = feeding + bathing + grooming + dressing + bowelControl + bladderControl + toiletUse + chairBedTransfer + mobility + stairs;
  let category;
  if (total >= 90) category = 'independent';
  else if (total >= 70) category = 'slight-dependency';
  else if (total >= 50) category = 'moderate-dependency';
  else if (total >= 25) category = 'severe-dependency';
  else category = 'total-dependency';
  return { total, category, recommendation: total < 50 ? '24-hr-care-inpatient' : 'community-living-with-support' };
};

// 3) Rancho Los Amigos — Level of Cognitive Functioning
Engine.RanchoLosAmigos = function (input = {}) {
  const { level = 1 } = input;
  let description, recommendation;
  if (level === 10) { description = 'purposeful-appropriate-modified-independent'; recommendation = 'community-integration'; }
  else if (level === 9) { description = 'purposeful-appropriate-stand-by-assistance'; recommendation = 'structured-environment'; }
  else if (level === 8) { description = 'purposeful-appropriate-min-assist'; recommendation = 'community-skills-training'; }
  else if (level === 7) { description = 'automatic-appropriate-min-assist'; recommendation = 'community-re-entry-program'; }
  else if (level === 6) { description = 'confused-appropriate-max-assist'; recommendation = 'structured-routine-orientation'; }
  else if (level === 5) { description = 'confused-inappropriate-max-assist'; recommendation = 'frequent-redirection-supervision'; }
  else if (level === 4) { description = 'confused-agitated-max-assist'; recommendation = 'safe-environment-min-stimulation'; }
  else if (level === 3) { description = 'localized-response-max-assist'; recommendation = 'sensory-stimulation-program'; }
  else if (level === 2) { description = 'generalized-response-total-assist'; recommendation = 'comprehensive-stimulation'; }
  else { description = 'no-response-coma'; recommendation = 'coma-stimulation-program'; }
  return { level, description, recommendation };
};

// 4) ASIA Impairment Scale
Engine.ASIAImpairmentScale = function (input = {}) {
  const { sensorySacral = 'present', motorSacral = 'present', motorBelowLevel = 'preserved', neurologicalLevel = 'T6' } = input;
  let grade;
  if (sensorySacral === 'absent' && motorSacral === 'absent') grade = 'A-complete';
  else if (sensorySacral === 'present' && motorSacral === 'absent') grade = 'B-sensory-incomplete';
  else if (motorSacral === 'present' && motorBelowLevel === 'more-than-half') grade = 'C-motor-incomplete';
  else if (motorSacral === 'present' && motorBelowLevel === 'preserved') grade = 'D-motor-incomplete';
  else grade = 'E-normal';
  return { grade, neurologicalLevel, recommendation: grade === 'A-complete' ? 'wheelchair-mobility-skin-care' : 'gait-training-strengthening' };
};

// 5) Stroke recovery — Fugl-Meyer Assessment
Engine.FuglMeyerStroke = function (input = {}) {
  const { motorUpperExtremity = 66, motorLowerExtremity = 34, balance = 14, sensation = 24, rangeOfMotion = 44, pain = 44 } = input;
  const total = motorUpperExtremity + motorLowerExtremity + balance + sensation + rangeOfMotion + pain;
  const maxScore = 226;
  const percentScore = (total / maxScore) * 100;
  let category;
  if (percentScore >= 85) category = 'mild-impairment';
  else if (percentScore >= 50) category = 'moderate-impairment';
  else if (percentScore >= 20) category = 'severe-impairment';
  else category = 'very-severe-impairment';
  return { total, percentScore: Math.round(percentScore * 10) / 10, category, recommendation: percentScore < 50 ? 'intensive-constraint-therapy' : 'community-ambulation-program' };
};

// 6) Cardiac rehab risk stratification — AACVPR
Engine.CardiacRehabRiskStratification = function (input = {}) {
  const { ejectionFraction = 50, exerciseCapacityMets = 7, ischemia = false, arrhythmia = false, recentMI = false, diabetes = false } = input;
  let risk = 0;
  if (ejectionFraction < 30) risk += 2; else if (ejectionFraction < 50) risk += 1;
  if (exerciseCapacityMets < 5) risk += 2; else if (exerciseCapacityMets < 8) risk += 1;
  if (ischemia) risk += 1;
  if (arrhythmia) risk += 2;
  if (recentMI) risk += 1;
  if (diabetes) risk += 1;
  let category;
  if (risk >= 5) category = 'high-risk-supervised-only';
  else if (risk >= 3) category = 'moderate-risk-supervised-with-monitoring';
  else category = 'low-risk-community-program';
  return { riskScore: risk, category, recommendation: category === 'high-risk-supervised-only' ? 'ECG-monitored-rehab-only' : 'community-based-eligible' };
};

// 7) Spasticity — Modified Ashworth Scale
Engine.ModifiedAshworth = function (input = {}) {
  const { joint = 'elbow', tone = 0, contracture = false, pain = 0 } = input;
  const score = tone + (contracture ? 1 : 0) + (pain > 5 ? 1 : 0);
  let category, treatment;
  if (tone === 4) { category = 'rigid'; treatment = 'intrathecal-baclofen-pump'; }
  else if (tone === 3) { category = 'severe-spasticity'; treatment = 'botulinum-toxin-stretching-bracing'; }
  else if (tone === 2) { category = 'moderate-spasticity'; treatment = 'oral-baclofen-physio-therapy'; }
  else if (tone === 1) { category = 'slight-increase-tone'; treatment = 'stretching-exercises-only'; }
  else { category = 'normal-tone'; treatment = 'monitor-no-treatment'; }
  return { joint, category, treatment, recommendation: tone >= 2 ? 'refer-spasticity-clinic' : 'PT-monitoring' };
};

// 8) Pressure ulcer — Braden Scale
Engine.BradenScale = function (input = {}) {
  const { sensory = 4, moisture = 4, activity = 4, mobility = 4, nutrition = 4, frictionShear = 3 } = input;
  const total = sensory + moisture + activity + mobility + nutrition + frictionShear;
  let risk;
  if (total <= 9) risk = 'very-high-risk';
  else if (total <= 12) risk = 'high-risk';
  else if (total <= 14) risk = 'moderate-risk';
  else if (total <= 18) risk = 'mild-risk';
  else risk = 'no-risk';
  return { total, risk, recommendation: total <= 14 ? 'pressure-relief-mattress-2hr-turn' : 'standard-prevention' };
};

// 9) Dysphagia severity
Engine.DysphagiaSeverity = function (input = {}) {
  const { dietLevel = 7, aspirationRisk = 'low', weightLoss = 0, hydrationStatus = 'normal' } = input;
  let severity;
  if (aspirationRisk === 'high' || dietLevel <= 2) severity = 'severe-need-NPO';
  else if (aspirationRisk === 'moderate' || weightLoss > 10) severity = 'moderate-modified-diet';
  else if (aspirationRisk === 'low' && dietLevel <= 5) severity = 'mild-soft-diet';
  else severity = 'minimal-normal-diet';
  return { severity, recommendation: severity === 'severe-need-NPO' ? 'PEG-tube-MBS-swallow-study' : 'swallow-therapy-diet-upgrade' };
};

// 10) Wheelchair seating — postural assessment
Engine.WheelchairSeatingAssessment = function (input = {}) {
  const { pelvicObliquity = 'neutral', kyphosis = 'mild', scoliosis = 'absent', tone = 'normal', skinIntegrity = 'intact', pressureRedistributionNeeded = false } = input;
  const score = (pelvicObliquity === 'severe' ? 2 : pelvicObliquity === 'mild' ? 1 : 0) + (kyphosis === 'severe' ? 2 : kyphosis === 'mild' ? 1 : 0) + (scoliosis === 'severe' ? 2 : scoliosis === 'mild' ? 1 : 0) + (tone === 'spastic' ? 1 : 0);
  let chairType;
  if (score >= 4) chairType = 'custom-tilt-in-space-with-molded-seating';
  else if (score >= 2) chairType = 'custom-configurable-with-cushion';
  else chairType = 'standard-manual-wheelchair';
  return { score, chairType, recommendation: pressureRedistributionNeeded ? 'pressure-redistribution-cushion-roho' : 'standard-foam-cushion' };
};
