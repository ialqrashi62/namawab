# PULM-001 — Unit Tests

```js
const {
  calculatePFTPattern, classifyCOPDSeverity, calculateWellsScore,
  calculateAsthmaControl, classifyPleuralEffusionLight
} = require('../pulm_engine');

describe('PFT Pattern', () => {
  test('Normal: FEV1 4, FVC 5, ratio 0.8', () => {
    expect(calculatePFTPattern(4, 5, 0.8).pattern).toBe('NORMAL');
  });
  test('Obstructive: FEV1 2, FVC 4, ratio 0.5', () => {
    expect(calculatePFTPattern(2, 4, 0.5).pattern).toBe('OBSTRUCTIVE');
  });
  test('Restrictive: FEV1 2.5, FVC 3, ratio 0.83', () => {
    expect(calculatePFTPattern(2.5, 3, 0.83).pattern).toBe('RESTRICTIVE');
  });
});

describe('COPD Severity (GOLD)', () => {
  test('FEV1 85% → Stage 1 (mild)', () => {
    expect(classifyCOPDSeverity(85).stage).toBe(1);
  });
  test('FEV1 60% → Stage 2 (moderate)', () => {
    expect(classifyCOPDSeverity(60).stage).toBe(2);
  });
  test('FEV1 40% → Stage 3 (severe)', () => {
    expect(classifyCOPDSeverity(40).stage).toBe(3);
  });
  test('FEV1 25% → Stage 4 (very severe)', () => {
    expect(classifyCOPDSeverity(25).stage).toBe(4);
  });
});

describe('Wells Score', () => {
  test('All factors → 12.5 (HIGH)', () => {
    const r = calculateWellsScore({
      clinicalSignsDvt: true, peMostLikely: true, heartRateGt100: true,
      immobilization3Days: true, previousDvtPe: true, hemoptysis: true, malignancy: true
    });
    expect(r.riskLevel).toBe('HIGH');
  });
  test('No factors → LOW', () => {
    expect(calculateWellsScore({}).riskLevel).toBe('LOW');
  });
});

describe('Asthma Control (ACT)', () => {
  test('ACT 22 → Well controlled', () => {
    expect(calculateAsthmaControl(22).control).toBe('WELL_CONTROLLED');
  });
  test('ACT 18 → Not well controlled', () => {
    expect(calculateAsthmaControl(18).control).toBe('NOT_WELL_CONTROLLED');
  });
  test('ACT 12 → Very poorly controlled', () => {
    expect(calculateAsthmaControl(12).control).toBe('VERY_POORLY_CONTROLLED');
  });
});

describe('Light Criteria (Pleural Effusion)', () => {
  test('Exudate', () => {
    const r = classifyPleuralEffusionLight({
      protein_pleural: 5, protein_serum: 6,
      ldh_pleural: 300, ldh_serum: 200, ldh_serum_upper: 200
    });
    expect(r.classification).toBe('EXUDATE');
  });
  test('Transudate', () => {
    const r = classifyPleuralEffusionLight({
      protein_pleural: 2, protein_serum: 7,
      ldh_pleural: 80, ldh_serum: 200, ldh_serum_upper: 200
    });
    expect(r.classification).toBe('TRANSUDATE');
  });
});
```

## Test Count
- 12 tests across 5 describe blocks
