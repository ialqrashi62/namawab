# NEPH-001 — Unit Tests (12)

```js
const {
  calculateEGFR, classifyCKD, classifyAKI, calculateRRTIndications,
  calculateCorrectedSodium, classifyHyperkalemiaSeverity
} = require('../neph_engine');

describe('eGFR (CKD-EPI 2021)', () => {
  test('40yo M, Cr 1.0', () => {
    const r = calculateEGFR(1.0, 40, 'M', 'non-black');
    expect(r.eGFR).toBeGreaterThan(90);
  });
  test('70yo F, Cr 2.0', () => {
    const r = calculateEGFR(2.0, 70, 'F', 'non-black');
    expect(r.eGFR).toBeLessThan(60);
  });
});

describe('CKD Stage', () => {
  test('eGFR 75 → G2', () => {
    expect(classifyCKD(75).stage).toBe('G2');
  });
  test('eGFR 10 → G5 (dialysis)', () => {
    expect(classifyCKD(10).needsDialysis).toBe(true);
  });
});

describe('AKI Stage', () => {
  test('Stage 1 → MILD', () => {
    expect(classifyAKI(1).severity).toBe('MILD');
  });
  test('Stage 3 → SEVERE', () => {
    expect(classifyAKI(3).severity).toBe('SEVERE');
  });
});

describe('RRT Indications (AEIOU)', () => {
  test('Hyperkalemia → RRT', () => {
    expect(calculateRRTIndications({k: 7}).needsRRT).toBe(true);
  });
  test('No indication → no RRT', () => {
    expect(calculateRRTIndications({}).needsRRT).toBe(false);
  });
});

describe('Corrected Sodium', () => {
  test('Na 130, glucose 500 → 136.4', () => {
    const r = calculateCorrectedSodium(130, 500);
    expect(r.correctedNa).toBeCloseTo(136.4, 1);
  });
  test('Normal glucose → no correction', () => {
    expect(calculateCorrectedSodium(140, 100).correctedNa).toBe(140);
  });
});

describe('Hyperkalemia Severity', () => {
  test('K 7.0 → SEVERE + ECG', () => {
    expect(classifyHyperkalemiaSeverity(7.0).ecgChanges).toBe(true);
  });
  test('K 5.3 → MILD', () => {
    expect(classifyHyperkalemiaSeverity(5.3).severity).toBe('MILD');
  });
});
```

## 12 tests across 6 describe blocks
