'use strict';
// Pedi-ICU Engine: 10 pure deterministic functions
// Compliance: PALISI, ESPNIC, SCCM-PALS, ARDSNet-pedi, AAP, NICE

function PELOD2({ ageMonths, glasgowScore, pupillaryReactions, mechanicalVentilation, pao2, fio2, paco2, lactate, platelets, crp, inotropicSupport }) {
  let score = 0;
  if (glasgowScore < 5) score += 4; else if (glasgowScore < 10) score += 2;
  if (pupillaryReactions === 'unequal') score += 4; else if (pupillaryReactions === 'fixed') score += 6;
  if (pao2 && fio2 && (pao2 / fio2) < 60) score += 4; else if (pao2 && fio2 && (pao2 / fio2) < 200) score += 2;
  if (paco2 > 75) score += 2;
  if (lactate > 5) score += 3;
  if (platelets < 20) score += 4; else if (platelets < 50) score += 2; else if (platelets < 100) score += 1;
  if (crp > 100) score += 2;
  if (inotropicSupport > 0) score += 4; else if (inotropicSupport === 'any') score += 2;
  let mortality;
  if (score >= 20) mortality = 70;
  else if (score >= 12) mortality = 30;
  else if (score >= 5) mortality = 10;
  else mortality = 2;
  return { pelod2: score, mortalityPct: mortality, severity: score >= 12 ? 'high' : score >= 5 ? 'moderate' : 'low' };
}

function PARDSDiagnosis({ ageMonths, onsetTiming, imagingFindings, oxygenation, cardiacFailure, etiology }) {
  const age = ageMonths < 12 ? 'infant' : ageMonths < 60 ? 'pedi' : 'older-pedi';
  let severity;
  if (oxygenation) {
    if (oxygenation.osi >= 12) severity = 'severe';
    else if (oxygenation.osi >= 7.5) severity = 'moderate';
    else if (oxygenation.osi >= 5) severity = 'mild';
    else severity = 'at-risk';
  }
  const cardiacOrigin = cardiacFailure === 'left-ventricular' || cardiacFailure === 'right-ventricular';
  return { age, onsetTiming, imagingFindings, oxygenation, severity, etiology, cardiacOrigin, diagnosis: 'PARDS' };
}

function PedsVentSettings({ ageMonths, weightKg, heightCm, pardsSeverity, mode }) {
  const vt = 6;
  const ibw = weightKg < 10 ? (weightKg * 1.2) : (weightKg > 35 ? (weightKg * 0.5) : (weightKg * 0.75));
  let peep, fio2, plateauPressure;
  if (pardsSeverity === 'severe') {
    peep = 10; fio2 = 0.6; plateauPressure = 28;
  } else if (pardsSeverity === 'moderate') {
    peep = 8; fio2 = 0.5; plateauPressure = 26;
  } else if (pardsSeverity === 'mild') {
    peep = 6; fio2 = 0.4; plateauPressure = 24;
  } else {
    peep = 5; fio2 = 0.3; plateauPressure = 22;
  }
  return { ageMonths, weightKg, ibw, vt, peep, fio2, plateauPressure, mode: mode || 'PRVC' };
}

function SedationLevel({ rassScore, comfortB, comfortNeo, sedationIndication, agitation }) {
  let interpretation;
  if (rassScore === 0) interpretation = 'alert-calm';
  else if (rassScore > 0) interpretation = 'agitated';
  else if (rassScore >= -2) interpretation = 'light-sedation';
  else if (rassScore >= -3) interpretation = 'moderate-sedation';
  else interpretation = 'deep-sedation';
  return { rassScore, comfortB, comfortNeo, interpretation, recommendation: interpretation === 'agitated' ? 'consider-bolus' : interpretation === 'deep-sedation' ? 'consider-weaning' : 'maintain' };
}

function DeliriumPedi({ ageMonths, acuteChange, inattention, alteredConsciousness, disorganizedThinking, ageAdjusted }) {
  let features = (acuteChange ? 1 : 0) + (inattention ? 1 : 0) + (alteredConsciousness ? 1 : 0) + (disorganizedThinking ? 1 : 0);
  let classification;
  if (ageMonths < 6) classification = 'CAPD-cornell';
  else classification = 'pCAM-ICU';
  let delirium;
  if (features >= 4) delirium = 'definite-delirium';
  else if (features >= 3) delirium = 'probable-delirium';
  else if (features >= 1) delirium = 'possible';
  else delirium = 'no-delirium';
  return { classification, ageAdjusted, features, delirium };
}

function VasoactiveScore({ dopamine, dobutamine, epinephrine, norepinephrine, vasopressin, milrinone, weightKg }) {
  const inoScore = (dopamine * 1) + (dobutamine * 1) + (epinephrine * 100) + (norepinephrine * 100) + (vasopressin * 10000) + (milrinone * 10);
  const indexed = weightKg > 0 ? inoScore / weightKg : 0;
  let category;
  if (indexed > 80) category = 'severe-vasoactive-need';
  else if (indexed > 40) category = 'high-vasoactive-need';
  else if (indexed > 20) category = 'moderate';
  else if (indexed > 5) category = 'mild';
  else category = 'minimal';
  return { inotropicScore: inoScore, indexedScore: Math.round(indexed * 100) / 100, category, weightKg };
}

function FluidResuscitationPedi({ weightKg, ageMonths, shockType, fluidResuscitated, diuresis, urineOutput, sodium }) {
  let recommendation;
  if (shockType === 'hypovolemic') recommendation = 'crystalloid-bolus-20mL/kg-3-bolus-max-60';
  else if (shockType === 'cardiogenic') recommendation = 'inotropic-support-minimize-fluids';
  else if (shockType === 'distributive') recommendation = 'crystalloid-bolus-20mL/kg-vasoactive';
  else recommendation = 'crystalloid-bolus-20mL/kg';
  const overloaded = fluidResuscitated > 60 || sodium > 150;
  return { weightKg, ageMonths, shockType, recommendation, overloaded, urineOutput };
}

function PediatricStatusEpilepticus({ ageMonths, seizureDuration, refractorySeizures, intubated, midazolamGiven, levetiracetamGiven }) {
  let phase;
  if (seizureDuration < 5) phase = 'stabilization';
  else if (seizureDuration < 20) phase = 'initial-therapy';
  else if (seizureDuration < 40) phase = 'second-therapy';
  else if (refractorySeizures) phase = 'refractory-SE';
  else phase = 'third-therapy';
  const protocol = !midazolamGiven ? 'benzodiazepine-first' : !levetiracetamGiven ? 'levetiracetam-or-fosphenytoin' : 'phenobarbital-or-valproate';
  return { ageMonths, phase, protocol, intubated: !!intubated, recommendation: phase === 'refractory-SE' ? 'midazolam-infusion+intubation' : 'standard' };
}

function WithdrawalAssessment({ ageMonths, opioidDays, benzoDays, totalScore, currentWAT1Score }) {
  let severity;
  if (currentWAT1Score >= 12) severity = 'severe';
  else if (currentWAT1Score >= 8) severity = 'moderate';
  else if (currentWAT1Score >= 4) severity = 'mild';
  else severity = 'no-withdrawal';
  const weanable = opioidDays >= 5 || benzoDays >= 5;
  return { ageMonths, opioidDays, benzoDays, totalScore, currentWAT1Score, severity, weanable, recommendation: severity === 'severe' ? 'increase-opioid-25%' : severity === 'moderate' ? 'maintain-then-wean-slowly' : 'continue-weaning' };
}

function PediatricTBI({ ageMonths, gcs, pupilsAnisocoric, sbp, mechanism, ctFindings }) {
  let severity;
  if (gcs <= 8) severity = 'severe-TBI';
  else if (gcs <= 12) severity = 'moderate-TBI';
  else severity = 'mild-TBI';
  let thresholdSBP;
  if (ageMonths < 12) thresholdSBP = 70;
  else if (ageMonths < 60) thresholdSBP = 80;
  else thresholdSBP = 90;
  const hypotension = sbp < thresholdSBP;
  return { ageMonths, gcs, severity, thresholdSBP, hypotension, pupilsAnisocoric, ctFindings, mortality: severity === 'severe-TBI' ? 30 : 5 };
}

module.exports = {
  PELOD2, PARDSDiagnosis, PedsVentSettings, SedationLevel, DeliriumPedi,
  VasoactiveScore, FluidResuscitationPedi, PediatricStatusEpilepticus, WithdrawalAssessment, PediatricTBI,
};
