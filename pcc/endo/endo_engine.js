/**
 * pcc/endo/endo_engine.js — PCC #18: Endocrinology
 * 10 deterministic functions for endocrine emergencies & management.
 *
 * Compliance: ATA · AACE · ADA · Endocrine Society.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. ThyroidStorm — Burch-Wartofsky score.
 */
function ThyroidStorm({ temperature, hr, atrialFibrillation, cns, gi, cardiac, heartFailure, totalScore }) {
  let score = 0;
  if (temperature >= 40) score += 30;
  else if (temperature >= 39.5) score += 25;
  else if (temperature >= 39) score += 20;
  else if (temperature >= 38.5) score += 15;
  else if (temperature >= 38) score += 10;
  if (hr >= 140) score += 25;
  else if (hr >= 130) score += 20;
  else if (hr >= 120) score += 15;
  else if (hr >= 110) score += 10;
  if (atrialFibrillation) score += 10;
  if (cns) score += cns === 'coma' ? 30 : cns === 'severe' ? 20 : 10;
  if (gi) score += gi === 'severe' ? 20 : 10;
  if (cardiac) score += 10;
  if (heartFailure) score += 10;
  if (totalScore) score += totalScore;
  return { score, diagnosis: score >= 45 ? 'thyroid_storm' : score >= 25 ? 'impending_storm' : 'unlikely' };
}

/**
 * 2. MyxedemaComa — diagnostic criteria.
 */
function MyxedemaComa({ gcs, temperature, bradycardia, hypothermia, sodiumLow, cortisolLow, tsh, t4, hasCardiac, hasSeizure }) {
  if (tsh >= 10 && t4 < 0.7 && (gcs < 13 || temperature < 35)) {
    return { diagnosis: 'myxedema_coma', severity: 'critical', treatment: 'IV_levothyroxine_glucocorticoids' };
  }
  if (tsh >= 5 && t4 < 0.8 && (bradycardia || hypothermia || hasCardiac)) {
    return { diagnosis: 'severe_hypothyroid', severity: 'severe' };
  }
  return { diagnosis: 'uncomplicated', severity: 'mild' };
}

/**
 * 3. DKAInitialFluidResuscitation — diabetic ketoacidosis.
 */
function DKAInitialFluidResuscitation({ weightKg, sodium, glucose, hourOfDay }) {
  const total = weightKg * 10;
  const initialRate = 1000 / 1; // 1L/hr first
  const correctedNa = sodium + 1.6 * ((glucose - 100) / 100);
  return {
    totalFirstHourMl: round(total, 0),
    correctedNa: round(correctedNa, 1),
    useNormalSaline: correctedNa < 135,
    useHalfNormal: correctedNa >= 135,
    transitionToD5: glucose < 200,
  };
}

/**
 * 4. HHSInitialManagement — hyperosmolar hyperglycemic state.
 */
function HHSInitialManagement({ glucose, osmolality, sodium, consciousness, weightKg }) {
  const severity = osmolality >= 320 ? 'severe' : osmolality >= 300 ? 'moderate' : 'mild';
  return {
    severity,
    fluidRate: weightKg * 15,
    ivInsulin: true,
    potassiumMonitoring: true,
    fluidChoice: sodium < 135 ? 'NS' : 'halfNS',
    transitionToSubQ: consciousness === 'alert' && osmolality < 300,
  };
}

/**
 * 5. AdrenalInsufficiencyDiagnosis — cosyntropin test.
 */
function AdrenalInsufficiencyDiagnosis({ baselineCortisol, postStimCortisol, acthLevel }) {
  if (baselineCortisol < 3) return { diagnosis: 'adrenal_crisis', treatment: 'stress_dose_steroids_immediate' };
  if (postStimCortisol < 18) return { diagnosis: 'adrenal_insufficiency', subtype: acthLevel > 100 ? 'primary' : 'secondary' };
  return { diagnosis: 'adrenal_sufficient', treatment: 'none' };
}

/**
 * 6. HypoglycemiaSeverity — Whipple's triad.
 */
function HypoglycemiaSeverity({ glucose, symptoms, resolutionAfterGlucose }) {
  let severity = 'mild';
  if (glucose < 50) severity = 'moderate';
  if (glucose < 30 || symptoms === 'altered_mental_status' || symptoms === 'seizure') severity = 'severe';
  if (!resolutionAfterGlucose) severity = 'critical';
  return {
    severity,
    glucagonIndicated: severity === 'severe' || severity === 'critical',
    dextroseIndicated: severity !== 'mild',
    octreotide: symptoms === 'sulfonylurea_overuse',
  };
}

/**
 * 7. HypercalcemiaMalignancyDiagnosis — corrected calcium + PTH.
 */
function HypercalcemiaMalignancyDiagnosis({ totalCalcium, albumin, pth, vitaminD, phosphorus }) {
  const corrected = totalCalcium + 0.8 * (4 - albumin);
  if (corrected < 11) return { diagnosis: 'normal' };
  if (pth < 25) return { diagnosis: 'PTH_independent', workup: 'malignancy_screen_PTHrP_vitamin_D' };
  if (pth >= 65) return { diagnosis: 'primary_hyperparathyroidism', workup: 'sestamibi_scan_parathyroidectomy' };
  return { diagnosis: 'PTH_dependent', workup: 'recheck_PTH_renal_function' };
}

/**
 * 8. SIADHDiagnosis — Schwartz-Bartter criteria.
 */
function SIADHDiagnosis({ sodium, osmolality, urineOsmolality, volume, thyroid, adrenal }) {
  if (sodium > 135 || osmolality > 290) return { diagnosis: 'not_SIADH' };
  if (urineOsmolality < 100) return { diagnosis: 'not_SIADH_low_urine_osm' };
  if (volume === 'euvolemic' && thyroid === 'normal' && adrenal === 'normal') {
    return { diagnosis: 'SIADH', treatment: 'fluid_restrict_500ml_d' };
  }
  return { diagnosis: 'hyponatremia_other', workup: 'recheck_volume_hormones' };
}

/**
 * 9. PheochromocytomaScreening — plasma free metanephrines.
 */
function PheochromocytomaScreening({ plasmaMetanephrines, urinaryMetanephrines, familyHistory, imaging, symptomsScore }) {
  let probability = 'low';
  if (plasmaMetanephrines >= 4) probability = 'high';
  else if (plasmaMetanephrines >= 2) probability = 'intermediate';
  if (symptomsScore >= 10) probability = 'high';
  if (imaging === 'mass_2cm') probability = 'definite';
  return {
    probability,
    workup: probability === 'low' ? 'no_workup' : probability === 'intermediate' ? 'recheck_imaging' : 'prepare_for_surgery_alpha_blockade',
  };
}

/**
 * 10. DiabetesInitialRegimen — AACE/ADA algorithm.
 */
function DiabetesInitialRegimen({ a1c, age, egfr, bmi, htn, hf, ascvd }) {
  let firstLine;
  if (hba1cLower(a1c) < 9) firstLine = 'metformin';
  else if (hba1cLower(a1c) < 10) firstLine = 'metformin_plus_glp1';
  else firstLine = 'metformin_plus_insulin';
  if (ascvd) firstLine += '_plus_sglt2_or_glp1';
  if (hf) firstLine += '_plus_sglt2';
  if (egfr < 45) firstLine = firstLine.replace('metformin', 'alternative_avoid_metformin');
  if (age >= 75) firstLine += '_relaxed_a1c_target';
  return {
    firstLine,
    hba1cTarget: age < 65 ? 7 : 8,
    hba1c: a1c,
    secondLine: 'add_sglt2_or_dpp4',
  };
}
function hba1cLower(a) { return a; }

module.exports = {
  ThyroidStorm, MyxedemaComa, DKAInitialFluidResuscitation,
  HHSInitialManagement, AdrenalInsufficiencyDiagnosis, HypoglycemiaSeverity,
  HypercalcemiaMalignancyDiagnosis, SIADHDiagnosis,
  PheochromocytomaScreening, DiabetesInitialRegimen,
};
