/**
 * pcc/picu/picu_engine.js — PCC #5: Pediatric ICU
 * 10 deterministic functions.
 */
'use strict';

function PediatricApacheScore({ age, heartRate, sbp, respRate, paO2, ph, sodium, potassium, creatinine, hematocrit, wbc, glasgow }) {
  let score = 0;
  // Age (pediatric)
  if (age < 1) score += 18;
  else if (age < 12) score += 12;
  else if (age < 24) score += 8;
  else if (age < 60) score += 5;
  else score += 0;
  // Vitals
  if (heartRate > 180 || heartRate < 50) score += 4;
  else if (heartRate > 140) score += 2;
  if (sbp > 200 || sbp < 30) score += 4;
  else if (sbp < 50) score += 2;
  if (respRate > 70 || respRate < 10) score += 3;
  if (paO2 < 200) score += 2;
  if (ph < 7.0 || ph > 7.7) score += 4;
  else if (ph < 7.2) score += 2;
  if (sodium > 165 || sodium < 120) score += 3;
  if (potassium > 7.5 || potassium < 2) score += 3;
  if (creatinine > 1.5) score += 2;
  if (hematocrit < 20) score += 2;
  if (wbc > 40 || wbc < 1) score += 2;
  // Glasgow
  if (glasgow < 5) score += 4;
  else if (glasgow < 8) score += 2;
  return { score, mortality: score > 30 ? 'high' : score > 15 ? 'moderate' : 'low' };
}

function PediatricGCS({ eye, verbal, motor }) {
  const total = eye + verbal + motor;
  const category = total <= 8 ? 'severe' : total <= 12 ? 'moderate' : 'mild';
  return { total, category, components: { eye, verbal, motor } };
}

function PediatricSepsisRecognition({ age, temperatureC, heartRate, respRate, wbc, suspectedInfection, organDysfunction }) {
  let triggers = 0;
  if (temperatureC > 38.5 || temperatureC < 36) triggers++;
  if (heartRate > (age < 1 ? 180 : 140)) triggers++;
  if (respRate > (age < 1 ? 60 : 40)) triggers++;
  if (wbc > 15 || wbc < 5) triggers++;
  if (organDysfunction) triggers++;
  if (!suspectedInfection) return { sepsis: false, triggers, reason: 'no_infection' };
  return { sepsis: triggers >= 2, triggers, sepsisShock: triggers >= 3 && organDysfunction };
}

function PediatricAsthmaSeverity({ age, spo2, speechAbility, retractions, wheezing, mentalStatus }) {
  let severity;
  if (spo2 < 90 || mentalStatus === 'altered') severity = 'severe';
  else if (spo2 < 94 || speechAbility === 'short_phrases' || retractions === 'severe') severity = 'moderate';
  else severity = 'mild';
  return { severity, requiresContinuousAlbuterol: severity === 'severe', requiresICU: severity === 'severe' };
}

function CroupSeverity({ stridorAtRest, barking, hoarseness, respiratoryDistress, age }) {
  if (stridorAtRest && respiratoryDistress === 'severe') return { severity: 'severe', racemicEpi: true, requiresAdmission: true };
  if (stridorAtRest) return { severity: 'moderate', racemicEpi: true, requiresAdmission: age < 6 };
  if (barking || hoarseness) return { severity: 'mild', racemicEpi: false, requiresAdmission: false };
  return { severity: 'none' };
}

function PediatricFluidBolus({ weightKg, percentLoss, severity }) {
  if (severity === 'severe' || percentLoss >= 10) {
    const bolus = weightKg * 20; // 20 mL/kg crystalloid
    return { bolusMl: bolus, fluid: 'isotonic_crystalloid', rate: 'rapid_push' };
  }
  const bolus = weightKg * 10;
  return { bolusMl: bolus, fluid: 'isotonic_crystalloid', rate: 'over_30min' };
}

function PediatricSepsisBundle({ weightKg }) {
  const fluid = weightKg * 20; // 20 mL/kg
  const antibioticsWithinHour = true;
  const lactate = 'within_1_hour';
  const bloodCulture = 'before_antibiotics';
  return { fluidBolusMl: fluid, antibioticsWithinHour, lactate, bloodCulture };
}

function PediatricPainScale({ age, flaccScore, facesScore, numericScore }) {
  if (age < 3 && typeof flaccScore === 'number') {
    return { pain: flaccScore >= 7 ? 'severe' : flaccScore >= 4 ? 'moderate' : 'mild', tool: 'FLACC' };
  }
  if (age < 7 && typeof facesScore === 'number') {
    return { pain: facesScore >= 8 ? 'severe' : facesScore >= 4 ? 'moderate' : 'mild', tool: 'FACES' };
  }
  if (typeof numericScore === 'number') {
    return { pain: numericScore >= 7 ? 'severe' : numericScore >= 4 ? 'moderate' : 'mild', tool: 'numeric' };
  }
  return { pain: 'unknown', tool: 'none' };
}

function ChildAbuseScreening({ inconsistentHistory, delayedPresentation, patternedBruising, sentinelInjuries, age }) {
  const redFlags = [];
  if (inconsistentHistory) redFlags.push('inconsistent_history');
  if (delayedPresentation) redFlags.push('delayed_presentation');
  if (patternedBruising) redFlags.push('patterned_bruising');
  if (sentinelInjuries && age < 1) redFlags.push('sentinel_injuries_under_1y');
  return { abuseSuspected: redFlags.length >= 2, redFlags, mandatoryReport: redFlags.length >= 1 };
}

function PediatricEWS({ heartRate, respRate, spo2, systolic, temperature, avpu }) {
  let score = 0;
  if (heartRate < 50 || heartRate > 180) score += 3;
  else if (heartRate < 60 || heartRate > 160) score += 2;
  else if (heartRate < 70 || heartRate > 140) score += 1;
  if (respRate < 8 || respRate > 60) score += 3;
  else if (respRate < 12 || respRate > 50) score += 2;
  if (spo2 < 90) score += 3;
  else if (spo2 < 92) score += 2;
  else if (spo2 < 94) score += 1;
  if (systolic < 40) score += 3;
  else if (systolic < 50) score += 2;
  else if (systolic < 60) score += 1;
  if (temperature < 35 || temperature > 40) score += 2;
  if (avpu === 'V' || avpu === 'P' || avpu === 'U') score += 3;
  else if (avpu === 'A') score += 0;
  return { score, risk: score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low' };
}

module.exports = {
  PediatricApacheScore, PediatricGCS, PediatricSepsisRecognition,
  PediatricAsthmaSeverity, CroupSeverity, PediatricFluidBolus,
  PediatricSepsisBundle, PediatricPainScale, ChildAbuseScreening,
  PediatricEWS,
};
