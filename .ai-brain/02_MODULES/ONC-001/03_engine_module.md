# ONC-001 — Engine Module

```javascript
// namaweb/onc_engine.js

function calculateBSA(height, weight) {
  // Mosteller formula
  return Math.sqrt((height * weight) / 3600);
}

function calculateCockcroft(age, weight, creatinine, sex) {
  const factor = sex === 'F' ? 0.85 : 1.0;
  return ((140 - age) * weight / (72 * creatinine)) * factor;
}

function calculateECOG(status) {
  if (status === 0) return { description: 'Fully active' };
  if (status === 1) return { description: 'Restricted, ambulatory' };
  if (status === 2) return { description: 'Self-care only' };
  if (status === 3) return { description: 'Limited self-care' };
  if (status === 4) return { description: 'Bed-bound' };
}

function classifyTumorLysis(tls) {
  if (tls.uricAcid > 8 && tls.potassium > 6 && tls.phosphate > 1.5) {
    return { risk: 'HIGH', prophylaxis: 'Aggressive hydration, rasburicase' };
  }
  if (tls.uricAcid > 4.5 || tls.potassium > 5.5) {
    return { risk: 'MODERATE', prophylaxis: 'Hydration, allopurinol' };
  }
  return { risk: 'LOW' };
}

function calculateNeutropenia(anc) {
  if (anc >= 1500) return { severity: 'NORMAL' };
  if (anc >= 1000) return { severity: 'MILD' };
  if (anc >= 500) return { severity: 'MODERATE' };
  if (anc >= 100) return { severity: 'SEVERE' };
  return { severity: 'VERY_SEVERE' };
}

module.exports = { calculateBSA, calculateCockcroft, calculateECOG, classifyTumorLysis, calculateNeutropenia };
```
