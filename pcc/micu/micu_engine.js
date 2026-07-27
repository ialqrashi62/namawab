/**
 * pcc/micu/micu_engine.js — PCC #8: Medical ICU
 * 10 deterministic functions.
 */
'use strict';

function APACHE_IIScore({ age, chronicHealth, glasgow, temperature, map, heartRate, respRate, paO2, ph, sodium, potassium, creatinine, hematocrit, wbc }) {
  let score = 0;
  if (age >= 75) score += 6;
  else if (age >= 65) score += 5;
  else if (age >= 55) score += 3;
  else if (age >= 45) score += 2;
  if (chronicHealth === 'severe') score += 5;
  else if (chronicHealth === 'moderate') score += 2;
  if (glasgow < 6) score += 4;
  else if (glasgow < 9) score += 3;
  else if (glasgow < 12) score += 2;
  else if (glasgow < 14) score += 1;
  if (temperature < 30 || temperature > 41) score += 4;
  else if (temperature < 32 || temperature > 39) score += 3;
  if (map < 50 || map > 160) score += 4;
  else if (map < 70) score += 1;
  if (heartRate < 40 || heartRate > 180) score += 4;
  if (respRate < 6 || respRate > 50) score += 4;
  if (paO2 < 55) score += 4;
  if (ph < 7.2 || ph > 7.7) score += 4;
  if (sodium < 120 || sodium > 160) score += 4;
  if (potassium < 2.5 || potassium > 7) score += 4;
  if (creatinine > 3.5) score += 4;
  if (hematocrit < 20) score += 4;
  if (wbc < 1 || wbc > 40) score += 4;
  return { score, mortality: score > 25 ? 'high' : score > 15 ? 'moderate' : 'low' };
}

function SOFAScore({ paO2FiO2, platelets, bilirubin, map, glasgow, creatinine, urineOutput }) {
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

function VentSettingsOptimizer({ weightKg, mode, currentPeep, currentFiO2, currentTidalVolume, paO2, paCO2, plateauPressure }) {
  const recommendations = [];
  if (paO2 < 60) {
    if (currentFiO2 < 0.6 && currentPeep < 15) recommendations.push('increase_PEEP');
    if (currentFiO2 < 0.8) recommendations.push('increase_FiO2');
  }
  if (paCO2 > 50) recommendations.push('increase_respiratory_rate');
  if (plateauPressure > 30) recommendations.push('reduce_tidal_volume');
  if (currentTidalVolume > 8 * weightKg) recommendations.push('reduce_tidal_to_6ml_kg');
  if (recommendations.length === 0) recommendations.push('maintain_current');
  return { recommendations, lungProtective: currentTidalVolume <= 8 * weightKg };
}

function SepsisBundleComplete({ lactate, bloodCultureBeforeAntibiotics, antibiotics, fluid30mlKg, vasopressorIfHypotensive, mapTarget65 }) {
  const completed = { lactate, bloodCultureBeforeAntibiotics, antibiotics, fluid30mlKg, vasopressorIfHypotensive, mapTarget65 };
  const all = Object.values(completed).every(Boolean);
  return { allCompleted: all, completed };
}

function SedationLevel({ rass, onVentilator }) {
  let interpretation;
  if (rass === 0) interpretation = 'alert_calm';
  else if (rass > 0) interpretation = 'agitated_or_restless';
  else if (rass === -1) interpretation = 'drowsy';
  else if (rass === -2) interpretation = 'light_sedation';
  else if (rass === -3) interpretation = 'moderate_sedation';
  else interpretation = 'deep_sedation';
  const targetMet = onVentilator ? (rass >= -2 && rass <= 0) : (rass === 0);
  return { interpretation, targetMet };
}

function CAMICU({ acuteOnset, inattention, alteredConsciousness, disorganizedThinking }) {
  const features = (acuteOnset ? 1 : 0) + (inattention ? 1 : 0) + (alteredConsciousness ? 1 : 0) + (disorganizedThinking ? 1 : 0);
  return { delirium: features >= 3 && acuteOnset && inattention, features, severity: features === 4 ? 'severe' : features === 3 ? 'moderate' : 'mild' };
}

function CRRTCircuitLife({ circuitHours, currentFlow, currentBfr, replacementFluid, anticoagulation }) {
  let predictedLifeHours = 72;
  if (circuitHours > 48 && !anticoagulation) predictedLifeHours = 12;
  if (anticoagulation === 'citrate') predictedLifeHours += 12;
  if (anticoagulation === 'heparin') predictedLifeHours += 6;
  if (currentBfr < 150) predictedLifeHours -= 12;
  return { predictedLifeHours, requiresChangeSoon: circuitHours >= predictedLifeHours - 6 };
}

function ECMOIndicationCheck({ paO2FiO2, ph, map, lactate, age, comorbidities, reversibility, refractoryVentilation }) {
    if (age > 70) return { indicated: false, reason: 'age_precludes' };
    if (comorbidities === 'severe') return { indicated: false, reason: 'comorbidities_preclude' };
    if (!reversibility) return { indicated: false, reason: 'irreversible' };
    if (paO2FiO2 < 80 && refractoryVentilation) return { indicated: true, modality: 'VV-ECMO' };
    if (map < 60 && lactate > 4 && reversibility) return { indicated: true, modality: 'VA-ECMO' };
}

function WithdrawalOfCareTrigger({ apacheScore, sofaScore, age, comorbidities, patientWishes, familyWishes }) {
  const apacheHigh = apacheScore > 30;
  const sofaHigh = sofaScore > 15;
  const ageFactor = age > 80;
  const comorbiditiesSevere = comorbidities === 'severe';
  if (patientWishes === 'dni_dnr' || familyWishes === 'comfort_care') return { consult: true, reason: 'patient_family_wishes' };
  if (apacheHigh && sofaHigh && ageFactor && comorbiditiesSevere) return { consult: true, reason: 'multiorgan_failure_age_comorbidity' };
  return { consult: false };
}

module.exports = {
  APACHE_IIScore, SOFAScore, VentSettingsOptimizer, SepsisBundleComplete,
  SedationLevel, CAMICU, CRRTCircuitLife, ECMOIndicationCheck,
  WithdrawalOfCareTrigger,
};
