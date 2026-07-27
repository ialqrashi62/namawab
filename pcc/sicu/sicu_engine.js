/**
 * pcc/sicu/sicu_engine.js — PCC #6: Surgical ICU
 * 10 deterministic functions.
 */
'use strict';

function ApacheScore({ age, chronicHealth, glasgow, temperature, map, heartRate, respRate, paO2, ph, sodium, potassium, creatinine, hematocrit, wbc }) {
  let score = 0;
  if (age >= 75) score += 6;
  else if (age >= 65) score += 5;
  else if (age >= 55) score += 3;
  else if (age >= 45) score += 2;
  if (chronicHealth) score += 5;
  if (glasgow < 6) score += 4;
  else if (glasgow < 9) score += 3;
  else if (glasgow < 12) score += 2;
  if (temperature < 30 || temperature > 41) score += 4;
  if (map < 50 || map > 160) score += 4;
  if (heartRate < 40 || heartRate > 180) score += 4;
  if (respRate < 6 || respRate > 50) score += 4;
  if (paO2 < 55) score += 4;
  if (ph < 7.2 || ph > 7.7) score += 4;
  if (sodium < 120 || sodium > 160) score += 4;
  if (potassium < 2.5 || potassium > 7) score += 4;
  if (creatinine > 3.5) score += 4;
  if (hematocrit < 20 || hematocrit > 60) score += 4;
  if (wbc < 1 || wbc > 40) score += 4;
  return { score, mortality: score > 25 ? 'high' : score > 15 ? 'moderate' : 'low' };
}

function SofaScore({ paO2FiO2, platelets, bilirubin, map, glasgow, creatinine, urineOutput }) {
  let score = 0;
  if (paO2FiO2 < 100) score += 4;
  else if (paO2FiO2 < 200) score += 3;
  else if (paO2FiO2 < 300) score += 2;
  else if (paO2FiO2 < 400) score += 1;
  if (platelets < 20) score += 4;
  else if (platelets < 50) score += 3;
  else if (platelets < 100) score += 2;
  else if (platelets < 150) score += 1;
  if (bilirubin > 12) score += 4;
  else if (bilirubin > 6) score += 3;
  else if (bilirubin > 2) score += 2;
  else if (bilirubin > 1.2) score += 1;
  if (map < 70) score += 1;
  if (glasgow < 6) score += 4;
  else if (glasgow < 10) score += 3;
  else if (glasgow < 13) score += 2;
  else if (glasgow < 15) score += 1;
  if (creatinine > 5) score += 4;
  else if (creatinine > 3.5) score += 3;
  else if (creatinine > 2) score += 2;
  else if (creatinine > 1.2) score += 1;
  if (urineOutput < 200) score += 4;
  else if (urineOutput < 500) score += 3;
  return { score, sepsisOrganDysfunction: score >= 2 };
}

function AnastomoticLeakScreening({ postOpDay, fever, tachycardia, abdominalPain, drainOutput, wbc, freeAir }) {
  let score = 0;
  if (fever) score += 2;
  if (tachycardia > 110) score += 2;
  if (abdominalPain === 'severe') score += 2;
  if (drainOutput === 'bilious_or_purulent') score += 3;
  if (wbc > 15) score += 1;
  if (freeAir) score += 4;
  if (postOpDay > 5 && score >= 4) score += 1; // late leak more concerning
  return { score, risk: score >= 6 ? 'high' : score >= 3 ? 'moderate' : 'low' };
}

function PostOpHemorrhage({ drainOutputMlPerHour, heartRate, sbp, hemoglobinTrend, coagsNormal }) {
  const drainExcessive = drainOutputMlPerHour > 200;
  const tachy = heartRate > 120;
  const hypotensive = sbp < 90;
  const hbDropping = hemoglobinTrend === 'rapid_drop';
  if (drainExcessive && (tachy || hypotensive || hbDropping)) return { hemorrhaging: true, severity: 'major', action: 'return_to_or' };
  if (drainExcessive || hbDropping) return { hemorrhaging: true, severity: 'moderate', action: 'transfuse_resuscitate' };
  if (!coagsNormal) return { hemorrhaging: false, severity: 'coagulopathy', action: 'correct_coagulation' };
  return { hemorrhaging: false, severity: 'none' };
}

function AbdominalCompartmentPressure({ bladderPressureMmHg, organDysfunction }) {
  if (bladderPressureMmHg > 25) return { compartmentSyndrome: true, severity: 'severe', requiresDecompression: true };
  if (bladderPressureMmHg > 20) return { compartmentSyndrome: true, severity: 'moderate', requiresDecompression: organDysfunction };
  if (bladderPressureMmHg > 15) return { compartmentSyndrome: false, severity: 'mild', requiresDecompression: false };
  return { compartmentSyndrome: false, severity: 'normal' };
}

function ERASCompliance({ earlyMobilization, earlyFeeding, opioidSparing, regionalAnesthesia, foleyRemovalDay }) {
  const checks = { earlyMobilization, earlyFeeding, opioidSparing, regionalAnesthesia };
  const passed = Object.values(checks).filter(Boolean).length;
  const foleyOk = foleyRemovalDay !== undefined && foleyRemovalDay <= 2;
  const total = passed + (foleyOk ? 1 : 0);
  return { score: total, max: 5, compliance: total >= 4 ? 'high' : total >= 2 ? 'moderate' : 'low' };
}

function SurgicalSiteInfection({ postOpDay, erythema, purulentDrainage, fever, deepTissueInvolvement }) {
  if (purulentDrainage) return { infection: true, severity: deepTissueInvolvement ? 'deep' : 'superficial', requiresOR: deepTissueInvolvement };
  if (erythema && fever && postOpDay > 5) return { infection: true, severity: 'superficial', requiresOR: false };
  return { infection: false };
}

function VasopressorDose({ norepinephrineMcgKgMin, vasopressinUnitsPerHour, epinephrineMcgKgMin }) {
  let tier = 'none';
  if (norepinephrineMcgKgMin > 0.5 || epinephrineMcgKgMin > 0.3) tier = 'high';
  else if (norepinephrineMcgKgMin > 0.1 || epinephrineMcgKgMin > 0.05) tier = 'moderate';
  else if (norepinephrineMcgKgMin > 0 || vasopressinUnitsPerHour > 0 || epinephrineMcgKgMin > 0) tier = 'low';
  return { tier, recommendation: tier === 'high' ? 'consider_MCS_or_cortisol' : 'titrate' };
}

function WoundCareAssessment({ woundType, exudate, odor, surrounding, depth, undermining }) {
  let stage = 'healthy_granulating';
  if (exudate === 'purulent' || odor === 'foul') stage = 'infected';
  if (surrounding === 'erythematous_extending') stage = 'cellulitis';
  if (depth === 'deep' || undermining > 2) stage = 'complex_needs_surgery';
  return { stage, requiresDebridement: stage === 'infected' || stage === 'complex_needs_surgery' };
}

function DeliriumCAMICU({ acuteOnset, inattention, alteredConsciousness, disorganizedThinking }) {
  const features = (acuteOnset ? 1 : 0) + (inattention ? 1 : 0) + (alteredConsciousness ? 1 : 0) + (disorganizedThinking ? 1 : 0);
  const delirium = features >= 3 && acuteOnset && inattention;
  return { delirium, features, severity: features === 4 ? 'severe' : features === 3 ? 'moderate' : 'mild' };
}

module.exports = {
  ApacheScore, SofaScore, AnastomoticLeakScreening, PostOpHemorrhage,
  AbdominalCompartmentPressure, ERASCompliance, SurgicalSiteInfection,
  VasopressorDose, WoundCareAssessment, DeliriumCAMICU,
};
