# GI-001 — Engine Module

```javascript
// namaweb/gi_engine.js
'use strict';

function calculateChildPugh(patient) {
  let score = 0;
  // Bilirubin
  if (patient.bilirubin < 2) score += 1;
  else if (patient.bilirubin < 3) score += 2;
  else score += 3;
  // Albumin
  if (patient.albumin > 3.5) score += 1;
  else if (patient.albumin > 2.8) score += 2;
  else score += 3;
  // INR
  if (patient.inr < 1.7) score += 1;
  else if (patient.inr < 2.3) score += 2;
  else score += 3;
  // Ascites
  if (!patient.ascites) score += 1;
  else if (patient.ascitesControlled) score += 2;
  else score += 3;
  // Encephalopathy
  if (!patient.encephalopathy) score += 1;
  else if (patient.encephalopathyGrade12) score += 2;
  else score += 3;
  const cls = score <= 6 ? 'A' : score <= 9 ? 'B' : 'C';
  return { total: score, class: cls, mortality1Year: cls === 'A' ? '5%' : cls === 'B' ? '20%' : '55%' };
}

function calculateMELD(meld) {
  // MELD = 3.78*ln(bili) + 11.2*ln(INR) + 9.57*ln(creatinine) + 6.43
  const score = 3.78 * Math.log(meld.bilirubin) + 11.2 * Math.log(meld.inr) + 9.57 * Math.log(meld.creatinine) + 6.43;
  return {
    score: Math.round(score * 10) / 10,
    risk: score < 10 ? 'LOW' : score < 20 ? 'MODERATE' : 'HIGH',
    transplantPriority: score >= 15
  };
}

function calculateMELDNa(meld) {
  // MELD-Na
  const meldScore = calculateMELD(meld).score;
  const sodiumScore = meld.sodium >= 125 ? 1.32 * (137 - meld.sodium) - 0.033 * meldScore * (137 - meld.sodium) : 0;
  return {
    score: Math.round((meldScore + sodiumScore) * 10) / 10
  };
}

function calculateGlasgowBlatchford(gbs) {
  let score = 0;
  if (gbs.ureaNitrogen >= 18.2 && gbs.ureaNitrogen < 22.4) score += 2;
  else if (gbs.ureaNitrogen >= 22.4 && gbs.ureaNitrogen < 28) score += 3;
  else if (gbs.ureaNitrogen >= 28 && gbs.ureaNitrogen < 70) score += 4;
  else if (gbs.ureaNitrogen >= 70) score += 6;
  if (gbs.hemoglobin < 10) score += 6;
  else if (gbs.hemoglobin < 12) score += 3;
  else if (gbs.hemoglobin >= 12 && gbs.hemoglobin < 13) score += 1;
  if (gbs.systolicBp < 90) score += 3;
  else if (gbs.systolicBp >= 90 && gbs.systolicBp < 100) score += 2;
  else if (gbs.systolicBp >= 100 && gbs.systolicBp < 110) score += 1;
  if (gbs.pulse >= 100) score += 1;
  if (gbs.melena) score += 1;
  if (gbs.syncope) score += 2;
  if (gbs.hepaticDisease) score += 2;
  if (gbs.cardiacFailure) score += 2;
  return {
    score,
    risk: score === 0 ? 'LOW' : score <= 3 ? 'MODERATE' : 'HIGH',
    needForIntervention: score >= 6
  };
}

function classifyIBD(activity) {
  // Mayo score for UC
  if (activity === 'MILD') return { severity: 'MILD', treatment: '5-ASA' };
  if (activity === 'MODERATE') return { severity: 'MODERATE', treatment: 'Steroid + biologic' };
  if (activity === 'SEVERE') return { severity: 'SEVERE', treatment: 'IV steroid, biologic, surgery' };
  return null;
}

function classifyPancreatitisSeverity(bisap) {
  // BISAP score
  if (bisap.bun > 25) bisap.score += 1;
  if (bisap.impaired_mental_status) bisap.score += 1;
  if (bisap.sirs) bisap.score += 1;
  if (bisap.age > 60) bisap.score += 1;
  if (bisap.pleural_effusion) bisap.score += 1;
  return {
    score: bisap.score,
    mortality: bisap.score === 0 ? '<1%' : bisap.score === 1 ? '2%' : '5-22%'
  };
}

module.exports = {
  calculateChildPugh, calculateMELD, calculateMELDNa,
  calculateGlasgowBlatchford, classifyIBD, classifyPancreatitisSeverity
};
```
