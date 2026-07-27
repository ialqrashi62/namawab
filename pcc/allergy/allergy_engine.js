'use strict';
// Allergy/Immunology Engine: 10 pure deterministic functions
// Compliance: AAAAI, EAACI, GINA, NAEPP, WAO, ACAAI

function AsthmaControlTest({ daytimeSymptoms, nighttimeSymptoms, rescueInhaler, interference, selfRating, control }) {
  // ACT: 5 questions each scored 1-5; total 5-25. >=20 well, 16-19 not-well, <=15 poor
  const total = (5 - daytimeSymptoms) + (5 - nighttimeSymptoms) + (5 - rescueInhaler) + (5 - interference) + selfRating;
  let category;
  if (total >= 20) category = 'well-controlled';
  else if (total >= 16) category = 'not-well-controlled';
  else category = 'poorly-controlled';
  return { actScore: total, category, recommendation: category === 'well-controlled' ? 'maintain-current-step' : category === 'not-well-controlled' ? 'step-up-therapy' : 'step-up-urgent-followup' };
}

function GINAClassification({ controllerMedication, reliever, daySymptomsPerWeek, nightSymptomsPerMonth, activityLimitation, exacerbations }) {
  let step;
  if (!controllerMedication && daySymptomsPerWeek < 2) step = 'GINA-step-1';
  else if (controllerMedication === 'low-dose-ICS' && daySymptomsPerWeek < 2) step = 'GINA-step-2';
  else if (controllerMedication === 'low-dose-ICS-LABA' && daySymptomsPerWeek >= 2) step = 'GINA-step-3';
  else if (controllerMedication === 'medium-dose-ICS-LABA') step = 'GINA-step-4';
  else if (controllerMedication === 'high-dose-ICS-LABA' || controllerMedication === 'biologic') step = 'GINA-step-5';
  else step = 'GINA-step-1';
  let control = 'well-controlled';
  if (daySymptomsPerWeek > 2) control = 'partly-controlled';
  if (nightSymptomsPerMonth >= 1) control = 'partly-controlled';
  if (activityLimitation) control = 'uncontrolled';
  if (exacerbations >= 2) control = 'uncontrolled';
  return { ginaStep: step, controlLevel: control, recommendation: control === 'uncontrolled' ? 'step-up-biologic' : control === 'partly-controlled' ? 'step-up' : 'maintain' };
}

function AnaphylaxisSeverity({ symptomsOnset, cardiovascular, respiratory, skin, gastrointestinal, priorAnaphylaxis }) {
  let severity = 0;
  if (cardiovascular) severity += 3;
  if (respiratory) severity += 2;
  if (skin) severity += 1;
  if (gastrointestinal) severity += 1;
  if (symptomsOnset === 'rapid') severity += 2;
  if (priorAnaphylaxis) severity += 1;
  let category;
  if (severity >= 5) category = 'severe-grade-IV';
  else if (severity >= 3) category = 'moderate-grade-III';
  else if (severity >= 1) category = 'mild-grade-II';
  else category = 'minimal-grade-I';
  let treatment;
  if (cardiovascular || respiratory) treatment = 'epinephrine-immediate-911';
  else if (category === 'moderate-grade-III') treatment = 'epinephrine-antihistamine-steroid';
  else treatment = 'antihistamine-monitor';
  return { severity, category, treatment };
}

function AllergicRhinitisSeverity({ symptoms, impactOnSleep, impactOnDaily, nasalCongestion, sneezing, itchyEyes, season }) {
  let score = symptoms + impactOnSleep + impactOnDaily;
  let category;
  if (score >= 8) category = 'severe-persistent';
  else if (score >= 5) category = 'moderate-persistent';
  else if (score >= 3) category = 'mild-persistent';
  else if (score >= 1) category = 'intermittent';
  else category = 'none';
  let treatment;
  if (category === 'severe-persistent' || category === 'moderate-persistent') treatment = 'intranasal-corticosteroid-antihistamine';
  else if (category === 'mild-persistent') treatment = 'intranasal-corticosteroid-or-antihistamine';
  else if (category === 'intermittent') treatment = 'oral-antihistamine-as-needed';
  else treatment = 'monitor';
  return { score, category, treatment, season };
}

function UrticariaActivity({ numberOfHives, itchScore, swelling, duration, angioedema }) {
  const score = numberOfHives + itchScore + (swelling ? 5 : 0) + (angioedema ? 5 : 0);
  let severity;
  if (score >= 15) severity = 'severe';
  else if (score >= 8) severity = 'moderate';
  else if (score >= 1) severity = 'mild';
  else severity = 'none';
  let treatment;
  if (severity === 'severe') treatment = 'high-dose-antihistamine-omalizumab';
  else if (severity === 'moderate') treatment = 'high-dose-antihistamine';
  else if (severity === 'mild') treatment = 'second-gen-antihistamine';
  else treatment = 'monitor';
  return { score, severity, treatment, duration };
}

function FoodAllergySeverity({ reactionType, peanut, shellfish, epinephrineGiven, biphasicReaction, hospitalAdmission }) {
  let severity = 0;
  if (reactionType === 'anaphylaxis') severity += 5;
  else if (reactionType === 'systemic') severity += 3;
  else if (reactionType === 'local') severity += 1;
  if (peanut || shellfish) severity += 2;
  if (epinephrineGiven) severity += 2;
  if (biphasicReaction) severity += 3;
  if (hospitalAdmission) severity += 2;
  let category;
  if (severity >= 8) category = 'severe-persistent';
  else if (severity >= 4) category = 'moderate-persistent';
  else category = 'mild-resolved';
  return { severity, category, recommendation: severity >= 4 ? 'allergist-referral-OIT' : 'avoidance-emergency-plan' };
}

function AllergenImmunotherapy({ allergenType, age, severity, asthma, onBetaBlocker, compliance, premedication }) {
  let eligible = true;
  const contraindications = [];
  if (onBetaBlocker) { eligible = false; contraindications.push('beta-blocker'); }
  if (asthma === 'uncontrolled') { eligible = false; contraindications.push('uncontrolled-asthma'); }
  let treatment;
  if (!eligible) treatment = 'contraindicated';
  else if (severity >= 7) treatment = 'sublingual-immunotherapy';
  else if (severity >= 4) treatment = 'subcutaneous-immunotherapy';
  else treatment = 'subcutaneous-immunotherapy-standard';
  return { eligible, contraindications, treatment, allergenType };
}

function DrugAllergy({ reactionType, timeOfOnset, familyHistory, priorExposure, severity, organInvolvement }) {
  let severityScore = 0;
  if (reactionType === 'anaphylaxis') severityScore += 5;
  else if (reactionType === 'SJS-TEN') severityScore += 5;
  else if (reactionType === 'DRESS') severityScore += 4;
  else if (reactionType === 'urticaria') severityScore += 2;
  else if (reactionType === 'maculopapular') severityScore += 1;
  if (timeOfOnset === 'immediate') severityScore += 2;
  if (organInvolvement) severityScore += 2;
  let action;
  if (severityScore >= 6) action = 'strict-avoidance-and-bracelet';
  else if (severityScore >= 3) action = 'avoid-and-document';
  else action = 'document-and-monitor';
  return { severityScore, action, recommendation: severityScore >= 6 ? 'allergy-specialist' : 'primary-care' };
}

function EosinophilCountAssessment({ eosCount, asthma, parasiticInfection, medications, organInvolvement }) {
  let category;
  if (eosCount >= 1500) category = 'hypereosinophilia';
  else if (eosCount >= 500) category = 'eosinophilia';
  else if (eosCount >= 350) category = 'mild-eosinophilia';
  else category = 'normal';
  let workup;
  if (category === 'hypereosinophilia') workup = 'extensive-organ-damage-assessment';
  else if (category === 'eosinophilia') workup = 'targeted-workup';
  else if (category === 'mild-eosinophilia') workup = 'medication-review-stool-ova';
  else workup = 'no-workup';
  return { eosCount, category, workup };
}

function AtopicDermatitisSeverity({ extent, intensityScore, itchScore, sleepLoss, chronicity }) {
  const score = extent + intensityScore + itchScore + sleepLoss;
  let severity;
  if (score >= 30) severity = 'severe';
  else if (score >= 15) severity = 'moderate';
  else if (score >= 5) severity = 'mild';
  else severity = 'clear';
  let treatment;
  if (severity === 'severe') treatment = 'systemic-biologic-dupilumab';
  else if (severity === 'moderate') treatment = 'phototherapy-methotrexate';
  else if (severity === 'mild') treatment = 'topical-corticosteroid-tacrolimus';
  else treatment = 'moisturizers';
  return { score, severity, treatment };
}

module.exports = {
  AsthmaControlTest, GINAClassification, AnaphylaxisSeverity, AllergicRhinitisSeverity, UrticariaActivity,
  FoodAllergySeverity, AllergenImmunotherapy, DrugAllergy, EosinophilCountAssessment, AtopicDermatitisSeverity,
};
