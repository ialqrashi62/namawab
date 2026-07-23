# PEDS-002 — Engine Module

```javascript
// namaweb/peds_nicu_engine.js
'use strict';

function calculateCorrectedAge(birthDate, currentDate) {
  const birth = new Date(birthDate);
  const today = new Date(currentDate);
  const ageMs = today - birth;
  const totalDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days, totalDays, notation: `${weeks}+${days}` };
}

function calculateGestationalAgeAtBirth(birthDate, lmpDate) {
  const lmp = new Date(lmpDate);
  const birth = new Date(birthDate);
  const diffDays = Math.floor((birth - lmp) / (1000 * 60 * 60 * 24));
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
    notation: `${Math.floor(diffDays / 7)}+${diffDays % 7}`,
    isTerm: diffDays >= 259 && diffDays <= 293,
    isPreterm: diffDays < 259,
    isPostTerm: diffDays > 293
  };
}

function classifyBirthWeight(grams) {
  if (grams < 500) return 'EXTREMELY_LOW_BIRTH_WEIGHT';
  if (grams < 1000) return 'EXTREMELY_LOW_BIRTH_WEIGHT';
  if (grams < 1500) return 'VERY_LOW_BIRTH_WEIGHT';
  if (grams < 2500) return 'LOW_BIRTH_WEIGHT';
  if (grams > 4500) return 'MACROSOMIA';
  return 'NORMAL';
}

function calculateDSurf(birthWeightG) {
  // First dose of surfactant
  if (birthWeightG < 750) return 1.5; // mL
  if (birthWeightG < 1250) return 1.0;
  return 0.7;
}

function calculateEnteralFeed(birthWeightG, day) {
  // Volume per feed, advancing schedule
  if (day < 2) return 1; // mL trophic
  if (day < 7) return birthWeightG / 1000 * 0.5;
  return birthWeightG / 1000 * 1.0;
}

function calculateNippleScore(nipple) {
  let score = 0;
  if (nipple.rooting >= 2) score += 1;
  if (nipple.suckStrength >= 2) score += 1;
  if (nipple.suckPausPattern >= 2) score += 1;
  if (nipple.oralTone >= 2) score += 1;
  if (score >= 3) return { ready: true, score };
  return { ready: false, score };
}

function classifyROP(stage, plusDisease) {
  // Retinopathy of prematurity
  if (stage === 1) return { severity: 'MILD', requiresTreatment: false };
  if (stage === 2) return { severity: 'MODERATE', requiresTreatment: false };
  if (stage === 3 && plusDisease) return { severity: 'SEVERE', requiresTreatment: true };
  if (stage === 4) return { severity: 'RETINAL_DETACHMENT', requiresTreatment: true };
  if (stage === 5) return { severity: 'END_STAGE', requiresTreatment: true };
  return { severity: 'UNKNOWN' };
}

function classifyIVH(grade) {
  // Papile grading
  if (grade === 1) return { severity: 'GERMINAL_MATRIX', prognosis: 'GOOD' };
  if (grade === 2) return { severity: 'INTRAVENTRICULAR_NO_DILATION', prognosis: 'GOOD' };
  if (grade === 3) return { severity: 'INTRAVENTRICULAR_WITH_DILATION', prognosis: 'MODERATE' };
  if (grade === 4) return { severity: 'INTRAPARENCHYMAL', prognosis: 'POOR' };
  return { severity: 'UNKNOWN' };
}

function calculateAPGAR(score) {
  const total = score.heartRate + score.respiratoryEffort + score.muscleTone + score.reflexIrritability + score.color;
  let interpretation;
  if (total >= 7) interpretation = 'REASSURING';
  else if (total >= 4) interpretation = 'MODERATELY_DEPRESSED';
  else interpretation = 'SEVERELY_DEPRESSED';
  return { total, interpretation };
}

function calculatePEWS(vitals) {
  let score = 0;
  if (vitals.heartRate > 180 || vitals.heartRate < 90) score += 1;
  if (vitals.respiratoryRate > 60) score += 1;
  if (vitals.spo2 < 90) score += 2;
  if (vitals.temperature > 38.5 || vitals.temperature < 36) score += 1;
  if (vitals.capillaryRefill > 2) score += 1;
  if (vitals.mentalStatus !== 'ALERT') score += 2;
  return { score, riskLevel: score >= 4 ? 'HIGH' : score >= 2 ? 'MODERATE' : 'LOW' };
}

module.exports = {
  calculateCorrectedAge, calculateGestationalAgeAtBirth, classifyBirthWeight,
  calculateDSurf, calculateEnteralFeed, calculateNippleScore,
  classifyROP, classifyIVH, calculateAPGAR, calculatePEWS
};
```
