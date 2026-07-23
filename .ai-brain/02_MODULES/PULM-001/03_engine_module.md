# PULM-001 — Engine Module

```javascript
// namaweb/pulm_engine.js
'use strict';

function calculatePFTPattern(fev1, fvc, ratio) {
  if (!fev1 || !fvc || !ratio) return { pattern: 'UNKNOWN' };
  if (ratio >= 0.7) {
    if (fvc >= 0.8) return { pattern: 'NORMAL' };
    return { pattern: 'RESTRICTIVE' };
  }
  if (ratio < 0.7) {
    return { pattern: 'OBSTRUCTIVE' };
  }
  return { pattern: 'UNKNOWN' };
}

function classifyCOPDSeverity(fev1Percent) {
  if (fev1Percent >= 80) return { stage: 1, severity: 'MILD' };
  if (fev1Percent >= 50) return { stage: 2, severity: 'MODERATE' };
  if (fev1Percent >= 30) return { stage: 3, severity: 'SEVERE' };
  return { stage: 4, severity: 'VERY_SEVERE' };
}

function calculateWellsScore(patient) {
  let score = 0;
  if (patient.clinicalSignsDvt) score += 3;
  if (patient.peMostLikely) score += 3;
  if (patient.heartRateGt100) score += 1.5;
  if (patient.immobilization3Days) score += 1.5;
  if (patient.previousDvtPe) score += 1.5;
  if (patient.hemoptysis) score += 1;
  if (patient.malignancy) score += 1;
  return {
    score,
    riskLevel: score <= 4 ? 'LOW' : score <= 6 ? 'MODERATE' : 'HIGH'
  };
}

function classifyAsthmaSeverity(patient) {
  if (patient.symptomsGt2PerWeek) return { severity: 'MODERATE_PERSISTENT' };
  if (patient.symptomsThroughoutDay) return { severity: 'SEVERE_PERSISTENT' };
  if (patient.symptomsContinuous) return { severity: 'SEVERE_PERSISTENT' };
  return { severity: 'INTERMITTENT' };
}

function calculateAsthmaControl(actScore) {
  if (actScore >= 20) return { control: 'WELL_CONTROLLED' };
  if (actScore >= 16) return { control: 'NOT_WELL_CONTROLLED' };
  return { control: 'VERY_POORLY_CONTROLLED' };
}

function classifyPleuralEffusionLight(lightCriteria) {
  if (!lightCriteria.protein) return { classification: 'UNKNOWN' };
  const ratio = lightCriteria.protein_pleural / lightCriteria.protein_serum;
  const ldhRatio = lightCriteria.ldh_pleural / lightCriteria.ldh_serum;
  const exudate = ratio > 0.5 || ldhRatio > 0.6 || lightCriteria.ldh_pleural > 2 * lightCriteria.ldh_serum_upper;
  return {
    classification: exudate ? 'EXUDATE' : 'TRANSUDATE',
    ratio,
    ldhRatio
  };
}

function classifyPneumoniaSeverity(psi, patient) {
  // PSI / PORT Score
  let score = patient.age;
  if (patient.nursingHome) score += 10;
  if (patient.neoplasm) score += 30;
  if (patient.liverDisease) score += 20;
  if (patient.chf) score += 10;
  if (patient.cerebrovascularDisease) score += 10;
  if (patient.renalDisease) score += 10;
  if (patient.alteredMentalStatus) score += 20;
  if (patient.respiratoryRateGt30) score += 20;
  if (patient.systolicBpLt90) score += 20;
  if (patient.temperatureLt35 || patient.temperatureGt40) score += 15;
  if (patient.heartRateGt125) score += 10;
  if (patient.phLt7_35) score += 30;
  if (patient.bunGt30) score += 20;
  if (patient.sodiumLt130) score += 20;
  if (patient.glucoseGt250) score += 10;
  if (patient.hematocritLt30) score += 10;
  if (patient.po2Lt60) score += 10;
  if (patient.pleuralEffusion) score += 10;
  return {
    score,
    riskClass: score <= 70 ? 'I' : score <= 90 ? 'II' : score <= 130 ? 'III' : score <= 130 ? 'IV' : 'V',
    mortality: score <= 70 ? '0.1%' : score <= 90 ? '0.6%' : score <= 130 ? '0.9-2.8%' : '8-31%'
  };
}

module.exports = {
  calculatePFTPattern, classifyCOPDSeverity, calculateWellsScore,
  classifyAsthmaSeverity, calculateAsthmaControl,
  classifyPleuralEffusionLight, classifyPneumoniaSeverity
};
```
