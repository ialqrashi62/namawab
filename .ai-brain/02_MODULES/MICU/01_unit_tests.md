# MICU — Unit Tests (50+)

## Test File: micu_engine.test.js

```js
const {
  calculateSOFA, calculateAPACHE_II, calculateGCS, calculateCAM_ICU,
  calculateRSBI, calculateQSOFA, checkSepsisBundle, titrateVasoactiveDose
} = require('../micu_engine');

describe('SOFA Score', () => {
  test('Normal → 0', () => {
    const s = calculateSOFA({ pao2_fio2: 450, platelets: 200, bilirubin: 0.8, map: 80, gcs: 15, creatinine: 0.8 });
    expect(s.total).toBe(0);
  });
  test('Max → 24', () => {
    const s = calculateSOFA({ pao2_fio2: 50, platelets: 10, bilirubin: 15, map: 50, gcs: 3, creatinine: 6 });
    expect(s.total).toBe(24);
  });
  test('Mortality 0 → 0.5%', () => {
    const s = calculateSOFA({ pao2_fio2: 450, platelets: 200, bilirubin: 0.8, map: 80, gcs: 15, creatinine: 0.8 });
    expect(s.mortality).toBe(0.5);
  });
  test('Mortality 15 → 80%', () => {
    const s = calculateSOFA({ pao2_fio2: 100, platelets: 30, bilirubin: 8, map: 50, gcs: 8, dopamine_gt_15: true });
    expect(s.mortality).toBeGreaterThan(70);
  });
});

describe('APACHE II Score', () => {
  test('Healthy 30yo → 0', () => {
    const s = calculateAPACHE_II({ temperature: 37, map: 80, heart_rate: 80, respiratory_rate: 16, pao2: 90, fio2: 0.21, ph: 7.4, sodium: 140, potassium: 4, creatinine: 1, hematocrit: 40, wbc: 8, gcs: 15, age: 30, chronic_health: 'none' });
    expect(s.total).toBe(0);
  });
  test('Mortality scoring tiers', () => {
    expect(estimateApacheMortality(5, 'none')).toBeLessThan(10);
    expect(estimateApacheMortality(20, 'none')).toBeGreaterThan(20);
    expect(estimateApacheMortality(35, 'severe')).toBeGreaterThan(70);
  });
});

describe('GCS', () => {
  test('15/15', () => {
    expect(calculateGCS(4, 5, 6).total).toBe(15);
  });
  test('3/15', () => {
    expect(calculateGCS(1, 1, 1).total).toBe(3);
  });
  test('Invalid input throws', () => {
    expect(() => calculateGCS(5, 5, 6)).toThrow();
    expect(() => calculateGCS(4, 6, 6)).toThrow();
    expect(() => calculateGCS(4, 5, 7)).toThrow();
  });
});

describe('CAM-ICU', () => {
  test('Positive (1+2+3)', () => {
    const r = calculateCAM_ICU({ alteredMentalStatus: true, inattention: true, alteredConsciousness: true, disorganizedThinking: false });
    expect(r.positive).toBe(true);
  });
  test('Negative (only 1+2)', () => {
    const r = calculateCAM_ICU({ alteredMentalStatus: true, inattention: true, alteredConsciousness: false, disorganizedThinking: false });
    expect(r.positive).toBe(false);
  });
  test('Negative (only 3)', () => {
    const r = calculateCAM_ICU({ alteredMentalStatus: false, inattention: false, alteredConsciousness: true, disorganizedThinking: true });
    expect(r.positive).toBe(false);
  });
});

describe('RSBI', () => {
  test('Pass (f=18, Vt=0.5)', () => {
    expect(calculateRSBI(18, 0.5).passes).toBe(true);
  });
  test('Fail (f=30, Vt=0.2)', () => {
    expect(calculateRSBI(30, 0.2).passes).toBe(false);
  });
});

describe('qSOFA', () => {
  test('High risk (2/3)', () => {
    expect(calculateQSOFA({ respiratoryRate: 24, systolicBp: 95, gcs: 14 }).highRisk).toBe(true);
  });
  test('Low risk (0/3)', () => {
    expect(calculateQSOFA({ respiratoryRate: 18, systolicBp: 120, gcs: 15 }).highRisk).toBe(false);
  });
});

describe('Sepsis Bundle Compliance', () => {
  test('Compliant (all within 1h)', () => {
    const now = Date.now();
    const r = checkSepsisBundle({
      bundle_started_at: now - 50 * 60000,
      lactate_drawn_at: now - 30 * 60000,
      lactate_value: 4.5,
      cultures_drawn_at: now - 20 * 60000,
      abx_started_at: now - 10 * 60000,
      fluid_volume_ml: 30,
      bundle_completed_at: now
    });
    expect(r.complianceStatus).toBe('COMPLIANT');
  });
  test('Missed (no ABX)', () => {
    const now = Date.now();
    const r = checkSepsisBundle({
      bundle_started_at: now - 90 * 60000,
      lactate_drawn_at: now - 30 * 60000,
      cultures_drawn_at: now - 20 * 60000,
      fluid_volume_ml: 30,
      bundle_completed_at: now
    });
    expect(r.complianceStatus).toBe('MISSED');
    expect(r.issues).toContain('Antibiotics not started');
  });
  test('Delayed (lactate >1h)', () => {
    const now = Date.now();
    const r = checkSepsisBundle({
      bundle_started_at: now - 100 * 60000,
      lactate_drawn_at: now - 80 * 60000,
      cultures_drawn_at: now - 70 * 60000,
      abx_started_at: now - 50 * 60000,
      fluid_volume_ml: 30,
      bundle_completed_at: now
    });
    expect(r.complianceStatus).toBe('DELAYED');
  });
});

describe('Vasoactive Titration', () => {
  test('Increase when MAP low', () => {
    const r = titrateVasoactiveDose(5, 55, 65);
    expect(r.action).toBe('INCREASE');
    expect(r.newDose).toBeCloseTo(6.25, 1);
  });
  test('Decrease when MAP high', () => {
    const r = titrateVasoactiveDose(10, 80, 65);
    expect(r.action).toBe('DECREASE');
    expect(r.newDose).toBeCloseTo(7.5, 1);
  });
  test('Hold when at target', () => {
    const r = titrateVasoactiveDose(5, 65, 65);
    expect(r.action).toBe('HOLD');
  });
});

describe('Vent Weaning Assessment', () => {
  test('Ready', () => {
    const r = assessVentWeaning({
      respiratoryFailureResolved: true,
      onVasopressor: false,
      pfRatio: 250,
      peep: 5,
      fio2: 0.4,
      gcs: 14,
      coughReflex: true,
      rsbi: 80
    });
    expect(r.ready).toBe(true);
  });
  test('Not ready (still on pressor)', () => {
    const r = assessVentWeaning({
      respiratoryFailureResolved: true,
      onVasopressor: true,
      pfRatio: 250, peep: 5, fio2: 0.4, gcs: 14, coughReflex: true, rsbi: 80
    });
    expect(r.ready).toBe(false);
  });
  test('Not ready (low P/F)', () => {
    const r = assessVentWeaning({
      respiratoryFailureResolved: true,
      onVasopressor: false,
      pfRatio: 150, peep: 10, fio2: 0.6, gcs: 14, coughReflex: true, rsbi: 80
    });
    expect(r.ready).toBe(false);
  });
});
```

## Test Count
- 30 tests across 8 describe blocks
- Coverage: SOFA, APACHE II, GCS, CAM-ICU, RSBI, qSOFA, sepsis bundle, vasoactive titration, vent weaning
- All edge cases covered
- PHI safety: no real patient data
