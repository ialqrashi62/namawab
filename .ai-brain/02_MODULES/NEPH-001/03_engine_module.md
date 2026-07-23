# NEPH-001 — Engine Module

```javascript
// namaweb/neph_engine.js

function calculateEGFR(creatinine, age, sex, race) {
  // CKD-EPI 2021 (race-free)
  const k = sex === 'F' ? 0.7 : 0.9;
  const alpha = sex === 'F' ? -0.241 : -0.302;
  const multiplier = sex === 'F' ? 1.012 : 1.0;
  const eGFR = 142 * Math.min(creatinine / k, 1) ** alpha * Math.max(creatinine / k, 1) ** -1.2 * 0.9938 ** age * multiplier;
  return { eGFR: Math.round(eGFR * 10) / 10 };
}

function classifyCKD(eGFR) {
  if (eGFR >= 90) return { stage: 'G1', severity: 'NORMAL' };
  if (eGFR >= 60) return { stage: 'G2', severity: 'MILD' };
  if (eGFR >= 45) return { stage: 'G3a', severity: 'MODERATE' };
  if (eGFR >= 30) return { stage: 'G3b', severity: 'MODERATE_SEVERE' };
  if (eGFR >= 15) return { stage: 'G4', severity: 'SEVERE' };
  return { stage: 'G5', severity: 'KIDNEY_FAILURE', needsDialysis: true };
}

function classifyAKI(stage, baselineCr, currentCr) {
  if (stage === 1) return { severity: 'MILD', criteria: 'Cr ↑ ≥0.3 or 1.5-1.9× baseline' };
  if (stage === 2) return { severity: 'MODERATE', criteria: 'Cr 2-2.9× baseline' };
  if (stage === 3) return { severity: 'SEVERE', criteria: 'Cr ≥3× baseline or ≥4 mg/dL or RRT' };
  return null;
}

function calculateRRTIndications(patient) {
  const indications = [];
  if (patient.k > 6.5) indications.push('Hyperkalemia');
  if (patient.ph < 7.1) indications.push('Severe acidosis');
  if (patient.fluidOverload) indications.push('Fluid overload');
  if (patient.uremic) indications.push('Uremia');
  if (patient.toxicIngestion) indications.push('Toxin');
  return { indications, needsRRT: indications.length > 0 };
}

function calculateCorrectedSodium(measuredNa, glucose) {
  // For every 100 mg/dL glucose >100, add 1.6 to Na
  if (glucose <= 100) return { correctedNa: measuredNa };
  return { correctedNa: measuredNa + 1.6 * ((glucose - 100) / 100) };
}

function classifyHyperkalemiaSeverity(k) {
  if (k < 5.0) return { severity: 'NORMAL' };
  if (k < 5.5) return { severity: 'MILD' };
  if (k < 6.5) return { severity: 'MODERATE' };
  if (k < 7.0) return { severity: 'SEVERE', ecgChanges: true };
  return { severity: 'LIFE_THREATENING', ecgChanges: true, needsRRT: true };
}

module.exports = {
  calculateEGFR, classifyCKD, classifyAKI, calculateRRTIndications,
  calculateCorrectedSodium, classifyHyperkalemiaSeverity
};
```
