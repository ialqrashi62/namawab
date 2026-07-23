# CARD-001 — Unit Tests

```js
const {
  calculateTIMI, calculateGRACE, calculateHEARTScore,
  calculateCHA2DS2VASc, calculateHASBLED, calculateKillipClass,
  classifyEcgStemi, classifyNYHA
} = require('../card_engine');

describe('TIMI Score', () => {
  test('Score 0 → LOW', () => {
    const r = calculateTIMI({});
    expect(r.score).toBe(0);
    expect(r.riskLevel).toBe('LOW');
  });
  test('Score 5 → HIGH', () => {
    const r = calculateTIMI({
      age: 65, atLeast3RiskFactors: true, priorCoronaryStenosis50: true,
      aspirinLast7Days: true, severeAnginaLast24h: true
    });
    expect(r.score).toBe(5);
  });
});

describe('GRACE Score', () => {
  test('Low risk (score <109)', () => {
    const r = calculateGRACE({
      age: 50, heartRate: 70, systolicBp: 140, creatinine: 1.0,
      killipClass: 1
    });
    expect(r.riskLevel).toBe('LOW');
  });
  test('High risk (Killip 4)', () => {
    const r = calculateGRACE({
      age: 70, heartRate: 110, systolicBp: 90, creatinine: 1.5,
      killipClass: 4
    });
    expect(r.riskLevel).toBe('HIGH');
  });
});

describe('HEART Score', () => {
  test('Score 0 → LOW', () => {
    const r = calculateHEARTScore({
      history: 'SLIGHTLY_SUSPICIOUS', ecg: 'NORMAL', age: 40,
      riskFactors: false, troponin: 0.01
    });
    expect(r.riskLevel).toBe('LOW');
  });
  test('Score 9 → HIGH', () => {
    const r = calculateHEARTScore({
      history: 'HIGHLY_SUSPICIOUS', ecg: 'SIGNIFICANT_ST_DEPRESSION',
      age: 75, riskFactors: true, troponin: 5
    });
    expect(r.score).toBe(9);
    expect(r.riskLevel).toBe('HIGH');
  });
});

describe('CHA2DS2-VASc', () => {
  test('Male, score 0 → No anticoag', () => {
    const r = calculateCHA2DS2VASc({sex: 'M'});
    expect(r.score).toBe(0);
    expect(r.recommendation).toContain('No anticoag');
  });
  test('Female, age 75, HTN, DM → anticoag', () => {
    const r = calculateCHA2DS2VASc({sex: 'F', age: 75, hypertension: true, diabetes: true});
    expect(r.score).toBeGreaterThanOrEqual(4);
    expect(r.recommendation).toContain('Anticoag');
  });
});

describe('HAS-BLED', () => {
  test('Score 0 → LOW', () => {
    const r = calculateHASBLED({});
    expect(r.score).toBe(0);
  });
  test('Score 3 → HIGH', () => {
    const r = calculateHASBLED({
      hypertension: true, abnormalRenalFunction: true, stroke: true
    });
    expect(r.score).toBe(3);
    expect(r.riskLevel).toBe('HIGH');
  });
});

describe('Killip Class', () => {
  test('No rales → 1', () => {
    expect(calculateKillipClass({}).class).toBe(1);
  });
  test('Cardiogenic shock → 4', () => {
    expect(calculateKillipClass({cardioGenicShock: true}).class).toBe(4);
  });
});

describe('STEMI Classification', () => {
  test('Anterior STEMI (V1, V2, V3)', () => {
    const r = classifyEcgStemi({
      stElevation: {V1: true, V2: true, V3: true, V4: false, V5: false, V6: false}
    });
    expect(r.isStemi).toBe(true);
  });
  test('No ST elevation → not STEMI', () => {
    const r = classifyEcgStemi({stElevation: {V1: false, V2: false, V3: false}});
    expect(r.isStemi).toBe(false);
  });
});

describe('NYHA Class', () => {
  test('No limitation → 1', () => {
    expect(classifyNYHA({}).class).toBe(1);
  });
  test('Symptoms at rest → 4', () => {
    expect(classifyNYHA({symptomsAtRest: true}).class).toBe(4);
  });
});
```

## Test Count
- 16 tests across 8 describe blocks
- Coverage: TIMI, GRACE, HEART, CHA2DS2-VASc, HAS-BLED, Killip, STEMI, NYHA
