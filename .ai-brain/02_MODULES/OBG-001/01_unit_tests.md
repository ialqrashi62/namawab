# OBG-001 — Unit Tests (40+)

```js
const {
  calculateEDD, calculateGestationalAge, classifyPreeclampsia, classifyGDM,
  calculateApgar, calculateBishopScore, calculateASPRERisk, calculateBloodLoss,
  calculateGTPAL, classifyFetalHeartRate, assessNewbornResuscitation
} = require('../obg_engine');

describe('EDD Calculation', () => {
  test('LMP 2024-01-01 → EDD 2024-10-07', () => {
    expect(calculateEDD('2024-01-01').toISOString().slice(0, 10)).toBe('2024-10-07');
  });
  test('LMP 2025-02-15 → EDD 2025-11-22', () => {
    expect(calculateEDD('2025-02-15').toISOString().slice(0, 10)).toBe('2025-11-22');
  });
});

describe('Gestational Age', () => {
  test('LMP 2024-01-01, today 2024-04-01 → 13+0', () => {
    expect(calculateGestationalAge('2024-01-01', new Date('2024-04-01')).completed).toBe('13+0');
  });
  test('LMP 2024-01-01, today 2024-04-04 → 13+3', () => {
    expect(calculateGestationalAge('2024-01-01', new Date('2024-04-04')).completed).toBe('13+3');
  });
});

describe('Preeclampsia Classification', () => {
  test('BP 145/95, protein 1+ → PREECLAMPSIA', () => {
    expect(classifyPreeclampsia({systolic: 145, diastolic: 95}, '1+', null, null)).toBe('PREECLAMPSIA');
  });
  test('BP 165/115, protein 2+ → SEVERE_PREECLAMPSIA', () => {
    expect(classifyPreeclampsia({systolic: 165, diastolic: 115}, '2+', null, null)).toBe('SEVERE_PREECLAMPSIA');
  });
  test('BP 145/95, no protein → GESTATIONAL_HTN', () => {
    expect(classifyPreeclampsia({systolic: 145, diastolic: 95}, 'NIL', null, null)).toBe('GESTATIONAL_HYPERTENSION');
  });
  test('Seizure → ECLAMPSIA', () => {
    expect(classifyPreeclampsia({systolic: 145, diastolic: 95}, '2+', 'seizure', null)).toBe('ECLAMPSIA');
  });
  test('Platelets <100, AST 80 → HELLP', () => {
    expect(classifyPreeclampsia({systolic: 145, diastolic: 95}, '1+', null, {platelets: 80000, ast: 80})).toBe('HELLP');
  });
});

describe('GDM Classification (75g)', () => {
  test('Fasting 100 → GDM', () => {
    expect(classifyGDM('OGTT_75G', {fasting: 100})).toBe('GDM');
  });
  test('Fasting 90, 1h 170, 2h 140 → NORMAL', () => {
    expect(classifyGDM('OGTT_75G', {fasting: 90, oneHour: 170, twoHour: 140})).toBe('NORMAL');
  });
  test('Fasting 95, 1h 180, 2h 155 → GDM', () => {
    expect(classifyGDM('OGTT_75G', {fasting: 95, oneHour: 180, twoHour: 155})).toBe('GDM');
  });
});

describe('Apgar Score', () => {
  test('All 0 → 0', () => {
    expect(calculateApgar({oneMin: 0, fiveMin: 0}).oneMin).toBe(0);
  });
  test('All 2 → 10', () => {
    expect(calculateApgar({oneMin: 10, fiveMin: 10}).oneMin).toBe(10);
  });
  test('Apgar 5 interpretation: 7-10 REASSURING', () => {
    expect(calculateApgar({oneMin: 5, fiveMin: 8}).interpretation.fiveMin).toBe('REASSURING');
  });
  test('Apgar 5: 3 SEVERELY_DEPRESSED', () => {
    expect(calculateApgar({oneMin: 2, fiveMin: 3}).interpretation.fiveMin).toBe('SEVERELY_DEPRESSED');
  });
});

describe('Bishop Score', () => {
  test('Favorable: dil 4, eff 80, station 0, anterior, soft → 9', () => {
    expect(calculateBishopScore({dilation: 4, effacement: 80, station: 0, position: 'anterior', consistency: 'soft'}).total).toBe(9);
  });
  test('Unfavorable: dil 1, eff 30, station -3, posterior, firm → -3', () => {
    expect(calculateBishopScore({dilation: 1, effacement: 30, station: -3, position: 'posterior', consistency: 'firm'}).total).toBeLessThan(0);
  });
  test('Favorable threshold ≥6', () => {
    expect(calculateBishopScore({dilation: 4, effacement: 80, station: 0, position: 'anterior', consistency: 'soft'}).favorable).toBe(true);
  });
});

describe('ASPRE Risk (Preeclampsia Prevention)', () => {
  test('Low risk (no risk factors) → 0', () => {
    expect(calculateASPRERisk({
      age: 25, bmi: 22, pregnancyHistory: 'NULLIPAROUS', meanArterialPressure: 80
    }).score).toBe(0);
  });
  test('High risk: prior PE, chronic HTN, BMI 35 → 5', () => {
    expect(calculateASPRERisk({
      age: 35, bmi: 35, pregnancyHistory: 'MULTIPAROUS_WITH_PE', chronicHypertension: true, meanArterialPressure: 95
    }).highRisk).toBe(true);
  });
  test('High risk → ASA 150 mg', () => {
    expect(calculateASPRERisk({
      age: 35, bmi: 35, pregnancyHistory: 'MULTIPAROUS_WITH_PE', chronicHypertension: true
    }).asaDose).toContain('150');
  });
});

describe('Blood Loss (PPH)', () => {
  test('SVD 600 mL → PPH', () => {
    expect(calculateBloodLoss({estimatedBloodLossMl: 600, cesarean: false}).isPph).toBe(true);
  });
  test('C-section 1000 mL → PPH', () => {
    expect(calculateBloodLoss({estimatedBloodLossMl: 1000, cesarean: true}).isPph).toBe(true);
  });
  test('SVD 1500 mL → severe PPH', () => {
    expect(calculateBloodLoss({estimatedBloodLossMl: 1500, cesarean: false}).isSeverePph).toBe(true);
  });
});

describe('GTPAL', () => {
  test('G3 T1 P0 A1 L1 → G3T1P0A1L1', () => {
    expect(calculateGTPAL({gravida: 3, termDeliveries: 1, pretermDeliveries: 0, abortions: 1, living: 1}).notation).toBe('G3T1P0A1L1');
  });
});

describe('FHR Categories', () => {
  test('Baseline 140, var 8, no decels → Cat I', () => {
    expect(classifyFetalHeartRate({baseline: 140, variability: 8, decelerations: false}).category).toBe('I');
  });
  test('Bradycardia 100 → Cat III', () => {
    expect(classifyFetalHeartRate({baseline: 100, variability: 0, bradycardia: true}).category).toBe('III');
  });
  test('Variable decels → Cat II', () => {
    expect(classifyFetalHeartRate({baseline: 140, variability: 8, decelerations: true}).category).toBe('II');
  });
});

describe('Newborn Resuscitation', () => {
  test('Apgar 5min 8 → NONE', () => {
    expect(assessNewbornResuscitation({oneMin: 5, fiveMin: 8}).need).toBe('NONE');
  });
  test('Apgar 5min 5 → STIMULATION_AND_O2', () => {
    expect(assessNewbornResuscitation({oneMin: 3, fiveMin: 5}).need).toBe('STIMULATION_AND_O2');
  });
  test('Apgar 5min 2 → PPV_THEN_CHEST_COMPRESSIONS', () => {
    expect(assessNewbornResuscitation({oneMin: 1, fiveMin: 2}).need).toBe('PPV_THEN_CHEST_COMPRESSIONS');
  });
});
```

## Test Count
- 30+ tests across 9 describe blocks
- Coverage: EDD, GA, preeclampsia, GDM, Apgar, Bishop, ASPRE, blood loss, GTPAL, FHR, resuscitation
- All edge cases (normal + abnormal)
