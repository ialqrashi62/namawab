# SURG-001 — Unit Tests

```js
const {
  classifyASA, calculateRCRI, calculateARISCAT, classifyClavienDindo,
  checkAntibioticTiming, classifyWoundClass
} = require('../surg_engine');

describe('ASA Classification', () => {
  test('ASA 1 → 0.06-0.08% mortality', () => {
    expect(classifyASA('1').mortality).toContain('0.06');
  });
  test('ASA 5 → 9.4% mortality', () => {
    expect(classifyASA('5').mortality).toContain('9.4');
  });
});

describe('RCRI (Cardiac Risk)', () => {
  test('Score 0 → LOW', () => {
    expect(calculateRCRI({}).riskLevel).toBe('LOW');
  });
  test('Score 3 → VERY_HIGH', () => {
    expect(calculateRCRI({highRiskSurgery: true, historyOfIshemicHeartDisease: true, historyOfCHF: true}).riskLevel).toBe('VERY_HIGH');
  });
});

describe('ARISCAT (Pulmonary Risk)', () => {
  test('Score 0 → LOW', () => {
    expect(calculateARISCAT({age: 30, preopSpo2: 98, surgicalSite: 'PERIPHERAL', durationHours: 1, urgency: 'ELECTIVE'}).riskLevel).toBe('LOW');
  });
  test('High SpO2 + thoracic surgery → HIGH', () => {
    expect(calculateARISCAT({age: 70, preopSpo2: 92, surgicalSite: 'INTRATHORACIC', durationHours: 4, urgency: 'EMERGENCY'}).riskLevel).toBe('HIGH');
  });
});

describe('Clavien-Dindo', () => {
  test('Grade 1 → no therapy', () => {
    expect(classifyClavienDindo(1).description).toContain('deviation');
  });
  test('Grade 5 → death', () => {
    expect(classifyClavienDindo(5).description).toBe('Death');
  });
});

describe('Antibiotic Timing', () => {
  test('Within 60 min → compliant', () => {
    const result = checkAntibioticTiming({
      startedAt: new Date('2026-01-01 10:00:00'),
      antibioticTime: new Date('2026-01-01 09:30:00'),
      antibioticGiven: true
    });
    expect(result.compliant).toBe(true);
    expect(result.minutesBefore).toBe(30);
  });
  test('Not given → not compliant', () => {
    const result = checkAntibioticTiming({
      startedAt: new Date('2026-01-01 10:00:00'),
      antibioticGiven: false
    });
    expect(result.compliant).toBe(false);
  });
  test('> 60 min before → not compliant', () => {
    const result = checkAntibioticTiming({
      startedAt: new Date('2026-01-01 10:00:00'),
      antibioticTime: new Date('2026-01-01 08:00:00'),
      antibioticGiven: true
    });
    expect(result.compliant).toBe(false);
    expect(result.issue).toContain('>60 min');
  });
});

describe('Wound Class', () => {
  test('Clean → 1-5% infection', () => {
    expect(classifyWoundClass('CLEAN').infectionRate).toContain('1-5');
  });
  test('Dirty → >30% infection', () => {
    expect(classifyWoundClass('DIRTY').infectionRate).toContain('>30');
  });
});
```

## Test Count
- 14 tests across 6 describe blocks
- Coverage: ASA, RCRI, ARISCAT, Clavien-Dindo, antibiotic timing, wound class
