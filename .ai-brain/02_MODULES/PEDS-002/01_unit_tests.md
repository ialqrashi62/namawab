# PEDS-002 — Unit Tests

```js
const {
  calculateCorrectedAge, calculateGestationalAgeAtBirth, classifyBirthWeight,
  classifyROP, classifyIVH, calculateAPGAR, calculatePEWS
} = require('../peds_nicu_engine');

describe('Corrected Age', () => {
  test('Born 2026-01-01, today 2026-05-01 → 17+2', () => {
    const r = calculateCorrectedAge('2026-01-01', '2026-05-01');
    expect(r.weeks).toBe(17);
    expect(r.days).toBe(2);
  });
});

describe('Gestational Age at Birth', () => {
  test('LMP 2025-04-01, birth 2025-10-08 → 28+0', () => {
    const r = calculateGestationalAgeAtBirth('2025-10-08', '2025-04-01');
    expect(r.weeks).toBe(28);
    expect(r.isTerm).toBe(false);
    expect(r.isPreterm).toBe(true);
  });
  test('Full term: 40+0', () => {
    const r = calculateGestationalAgeAtBirth('2025-12-08', '2025-03-01');
    expect(r.weeks).toBe(40);
    expect(r.isTerm).toBe(true);
  });
});

describe('Birth Weight Classification', () => {
  test('500g → ELBW', () => {
    expect(classifyBirthWeight(500)).toBe('EXTREMELY_LOW_BIRTH_WEIGHT');
  });
  test('1000g → VLBW', () => {
    expect(classifyBirthWeight(1000)).toBe('VERY_LOW_BIRTH_WEIGHT');
  });
  test('2000g → LBW', () => {
    expect(classifyBirthWeight(2000)).toBe('LOW_BIRTH_WEIGHT');
  });
  test('3500g → NORMAL', () => {
    expect(classifyBirthWeight(3500)).toBe('NORMAL');
  });
  test('5000g → MACROSOMIA', () => {
    expect(classifyBirthWeight(5000)).toBe('MACROSOMIA');
  });
});

describe('IVH Grading', () => {
  test('Grade 1 → GERMINAL_MATRIX', () => {
    expect(classifyIVH(1).severity).toBe('GERMINAL_MATRIX');
  });
  test('Grade 3 → INTRAPARENCHYMAL', () => {
    expect(classifyIVH(3).severity).toBe('INTRAPARENCHYMAL');
  });
  test('Grade 4 → INTRAPARENCHYMAL POOR', () => {
    expect(classifyIVH(4).prognosis).toBe('POOR');
  });
});

describe('ROP Staging', () => {
  test('Stage 3 + plus disease → treatment', () => {
    expect(classifyROP(3, true).requiresTreatment).toBe(true);
  });
  test('Stage 1 → no treatment', () => {
    expect(classifyROP(1, false).requiresTreatment).toBe(false);
  });
});

describe('APGAR', () => {
  test('All 0 → 0', () => {
    expect(calculateAPGAR({heartRate: 0, respiratoryEffort: 0, muscleTone: 0, reflexIrritability: 0, color: 0}).total).toBe(0);
  });
  test('All 2 → 10', () => {
    expect(calculateAPGAR({heartRate: 2, respiratoryEffort: 2, muscleTone: 2, reflexIrritability: 2, color: 2}).total).toBe(10);
  });
  test('5 → MODERATELY', () => {
    expect(calculateAPGAR({heartRate: 1, respiratoryEffort: 1, muscleTone: 1, reflexIrritability: 1, color: 1}).interpretation).toBe('MODERATELY_DEPRESSED');
  });
  test('9 → REASSURING', () => {
    expect(calculateAPGAR({heartRate: 2, respiratoryEffort: 2, muscleTone: 2, reflexIrritability: 2, color: 1}).interpretation).toBe('REASSURING');
  });
});

describe('PEWS (Pediatric Early Warning)', () => {
  test('Normal vitals → LOW', () => {
    expect(calculatePEWS({heartRate: 130, respiratoryRate: 40, spo2: 98, temperatureC: 37, capillaryRefill: 1, mentalStatus: 'ALERT'}).riskLevel).toBe('LOW');
  });
  test('High HR, low SpO2 → HIGH', () => {
    expect(calculatePEWS({heartRate: 200, respiratoryRate: 65, spo2: 85, temperatureC: 38, capillaryRefill: 3, mentalStatus: 'VOICE'}).riskLevel).toBe('HIGH');
  });
});
```

## Test Count
- 18 tests across 6 describe blocks
- Coverage: corrected age, GA, birth weight, IVH, ROP, APGAR, PEWS
