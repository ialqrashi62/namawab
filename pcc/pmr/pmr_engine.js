'use strict';
// PM&R (Physical Medicine & Rehabilitation) Engine: 10 pure deterministic functions
// Compliance: AAPM&R, ASIA, AANS, AAP, NINDS, CDC STEADI, AGS/BGS

function ASIAClassification({ motorRightLow, motorLeftLow, motorRightHigh, motorLeftHigh, lightTouchRight, lightTouchLeft, pinPrickRight, pinPrickLeft, analContraction, analSensation, completeness }) {
  const motor = motorRightLow + motorLeftLow + motorRightHigh + motorLeftHigh;
  const sensory = lightTouchRight + lightTouchLeft + pinPrickRight + pinPrickLeft;
  let level;
  const total = motor;
  if (total === 0 && completeness === 'complete') level = 'ASIA-A';
  else if (total === 100 && completeness === 'incomplete') level = 'ASIA-E';
  else if (analSensation === 'yes' && motor === 0) level = 'ASIA-A';
  else if (total >= 1 && completeness === 'incomplete') level = 'ASIA-D';
  else if (analSensation === 'yes') level = 'ASIA-B';
  else level = 'ASIA-C';
  return { motorScore: motor, sensoryScore: sensory, level, completeness };
}

function BarthelIndex({ feeding, bathing, grooming, dressing, bowels, bladder, toiletUse, chairBedTransfer, mobility, stairs }) {
  const total = feeding + bathing + grooming + dressing + bowels + bladder + toiletUse + chairBedTransfer + mobility + stairs;
  let dependency;
  if (total <= 20) dependency = 'total-dependency';
  else if (total <= 40) dependency = 'severe-dependency';
  else if (total <= 60) dependency = 'moderate-dependency';
  else if (total <= 80) dependency = 'mild-dependency';
  else dependency = 'independent';
  return { score: total, maxScore: 100, dependency };
}

function FunctionalIndependenceMeasure({ eating, grooming, bathing, dressingUpper, dressingLower, toileting, bladder, bowels, chairTransfer, toiletTransfer, tubTransfer, walking, stairs, comprehension, expression, socialInteraction, problemSolving, memory }) {
  const motor = eating + grooming + bathing + dressingUpper + dressingLower + toileting + bladder + bowels + chairTransfer + toiletTransfer + tubTransfer + walking + stairs;
  const cognitive = comprehension + expression + socialInteraction + problemSolving + memory;
  const total = motor + cognitive;
  let level;
  if (total >= 108) level = 'modified-independent';
  else if (total >= 90) level = 'modified-dependence';
  else if (total >= 72) level = 'supervised-modified-dependence';
  else if (total >= 54) level = 'minimal-assist';
  else if (total >= 36) level = 'moderate-assist';
  else if (total >= 19) level = 'maximal-assist';
  else level = 'total-assist';
  return { motorScore: motor, cognitiveScore: cognitive, total, level };
}

function BergBalance({ sitToStand, standUnsupported, sitUnsupported, standToSit, transfers, standEyesClosed, standFeetTogether, reachForward, pickUpObject, turnToLookBehind, turn360, placeAlternateFoot, standOneFootFront, standOnOneLeg }) {
  const total = sitToStand + standUnsupported + sitUnsupported + standToSit + transfers + standEyesClosed + standFeetTogether + reachForward + pickUpObject + turnToLookBehind + turn360 + placeAlternateFoot + standOneFootFront + standOnOneLeg;
  let fallRisk;
  if (total <= 20) fallRisk = 'high-fall-risk-wheelchair';
  else if (total <= 40) fallRisk = 'moderate-fall-risk-walking-aid';
  else if (total <= 52) fallRisk = 'low-fall-risk';
  else fallRisk = 'independent-no-risk';
  return { score: total, maxScore: 56, fallRisk };
}

function StrokeRecovery({ nihssScore, daysPostStroke, rehabilitationIntensity, age, comorbidities, motivationScore }) {
  let prediction = 0;
  if (nihssScore <= 5) prediction += 40;
  else if (nihssScore <= 15) prediction += 20;
  else prediction += 5;
  if (daysPostStroke <= 30) prediction += 20;
  else if (daysPostStroke <= 90) prediction += 10;
  if (rehabilitationIntensity === 'high') prediction += 20;
  else if (rehabilitationIntensity === 'moderate') prediction += 10;
  if (age < 65) prediction += 10;
  if (motivationScore >= 8) prediction += 10;
  if (comorbidities >= 3) prediction -= 10;
  return { recoveryScore: Math.max(0, Math.min(100, prediction)), recommendation: prediction >= 70 ? 'intensive-outpatient' : prediction >= 40 ? 'subacute-rehab' : 'long-term-skilled-nursing' };
}

function AmputeeMobility({ amputationLevel, prostheticFit, residualLimbHealing, comorbidities, age, weightBearing }) {
  let mobilityPotential = 0;
  if (amputationLevel === 'toe') mobilityPotential = 95;
  else if (amputationLevel === 'transmetatarsal') mobilityPotential = 85;
  else if (amputationLevel === 'below-knee') mobilityPotential = 70;
  else if (amputationLevel === 'above-knee') mobilityPotential = 50;
  else if (amputationLevel === 'hip-disarticulation') mobilityPotential = 30;
  if (prostheticFit === 'good') mobilityPotential += 5;
  if (residualLimbHealing === 'complete') mobilityPotential += 5;
  if (comorbidities >= 2) mobilityPotential -= 10;
  if (age >= 70) mobilityPotential -= 10;
  if (weightBearing === 'partial') mobilityPotential -= 5;
  return { mobilityPotential: Math.max(0, Math.min(100, mobilityPotential)), kLevel: mobilityPotential >= 80 ? 'K3-K4' : mobilityPotential >= 50 ? 'K2' : 'K0-K1', recommendation: weightBearing === 'none' ? 'wound-care-monitor' : 'prosthetic-training' };
}

function PressureInjuryBraden({ sensoryPerception, moisture, activity, mobility, nutrition, frictionShear }) {
  const total = sensoryPerception + moisture + activity + mobility + nutrition + frictionShear;
  let risk;
  if (total <= 9) risk = 'very-high-risk';
  else if (total <= 12) risk = 'high-risk';
  else if (total <= 14) risk = 'moderate-risk';
  else if (total <= 18) risk = 'mild-risk';
  else risk = 'no-risk';
  return { score: total, maxScore: 23, risk };
}

function ConcussionSCAT5({ symptomsScore, cognitiveScore, balanceScore, lossOfConsciousness, postTraumaticAmnesia, vomiting, mechanism }) {
  let severity = 0;
  severity += symptomsScore;
  severity += cognitiveScore;
  severity += balanceScore;
  if (lossOfConsciousciousness === 'yes' || lossOfConsciousciousness === undefined) severity += (lossOfConsciousciousness || 'no') === 'yes' ? 5 : 0;
  if (postTraumaticAmnesia === 'yes') severity += 5;
  if (vomiting) severity += 3;
  if (mechanism === 'high-impact') severity += 3;
  let category;
  if (severity >= 30) category = 'severe-concussion';
  else if (severity >= 15) category = 'moderate-concussion';
  else if (severity >= 5) category = 'mild-concussion';
  else category = 'no-concussion';
  return { severityScore: severity, category, recommendation: category === 'severe-concussion' ? 'CT-head-ER' : 'rest-24-48h-gradual-return' };
}

function SpasticityMAS({ elbow, wrist, fingers, hip, knee, ankle }) {
  const total = elbow + wrist + fingers + hip + knee + ankle;
  let grade;
  if (total === 0) grade = 'no-spasticity';
  else if (total <= 6) grade = 'mild-spasticity';
  else if (total <= 12) grade = 'moderate-spasticity';
  else grade = 'severe-spasticity';
  let treatment;
  if (grade === 'no-spasticity') treatment = 'monitor';
  else if (grade === 'mild-spasticity') treatment = 'stretching-bracing';
  else if (grade === 'moderate-spasticity') treatment = 'oral-baclofen-or-tizanidine';
  else treatment = 'botulinum-toxin-or-intrathecal-baclofen';
  return { totalScore: total, grade, treatment };
}

function WheelchairPrescription({ diagnosis, functionalLevel, posture, skinIntegrity, cognition, environment, weight, height }) {
  let chairType = 'manual-wheelchair';
  if (functionalLevel === 'dependent') chairType = 'power-wheelchair';
  else if (functionalLevel === 'tilt-in-space') chairType = 'tilt-in-space-wheelchair';
  if (posture === 'kyphotic' || posture === 'scoliotic') chairType += '-with-postural-support';
  if (skinIntegrity === 'impaired') chairType += '-with-pressure-relief-cushion';
  let customizations = [];
  if (environment === 'home-only') customizations.push('standard-wheels');
  if (environment === 'community') customizations.push('lightweight-wheels');
  if (cognition === 'impaired') customizations.push('brake-extensions');
  return { chairType, customizations, weight, height, recommendation: 'occupational-therapy-evaluation' };
}

module.exports = {
  ASIAClassification, BarthelIndex, FunctionalIndependenceMeasure, BergBalance, StrokeRecovery,
  AmputeeMobility, PressureInjuryBraden, ConcussionSCAT5, SpasticityMAS, WheelchairPrescription,
};
