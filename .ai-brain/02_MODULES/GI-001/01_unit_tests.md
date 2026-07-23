# GI-001 — Tests

## Unit Tests
```js
const { calculateChildPugh, calculateMELD, calculateGlasgowBlatchford } = require('../gi_engine');

describe('Child-Pugh', () => {
  test('Class A: bili 1, alb 4, INR 1.2, no ascites, no enceph → 5', () => {
    const r = calculateChildPugh({bilirubin: 1, albumin: 4, inr: 1.2});
    expect(r.class).toBe('A');
  });
  test('Class B: bili 3, alb 3, INR 1.8, ascites controlled, enceph 1-2 → 8', () => {
    const r = calculateChildPugh({bilirubin: 3, albumin: 3, inr: 1.8, ascites: true, ascitesControlled: true, encephalopathy: true, encephalopathyGrade12: true});
    expect(r.class).toBe('B');
  });
  test('Class C: bili 5, alb 2, INR 3, refractory ascites + enceph → 13+', () => {
    const r = calculateChildPugh({bilirubin: 5, albumin: 2, inr: 3, ascites: true, encephalopathy: true});
    expect(r.class).toBe('C');
  });
});

describe('MELD', () => {
  test('Low MELD (low bili, INR, Cr)', () => {
    const r = calculateMELD({bilirubin: 1, inr: 1, creatinine: 1});
    expect(r.score).toBeLessThan(15);
  });
  test('High MELD → transplant', () => {
    const r = calculateMELD({bilirubin: 10, inr: 3, creatinine: 3});
    expect(r.transplantPriority).toBe(true);
  });
});

describe('Glasgow-Blatchford', () => {
  test('Score 0 → LOW (outpatient)', () => {
    const r = calculateGlasgowBlatchford({});
    expect(r.risk).toBe('LOW');
  });
  test('Score 12 → HIGH', () => {
    const r = calculateGlasgowBlatchford({
      ureaNitrogen: 50, hemoglobin: 8, systolicBp: 85, pulse: 110, melena: true, syncope: true
    });
    expect(r.needForIntervention).toBe(true);
  });
});
```

## Integration Tests (5 tests)
## E2E Tests (3 tests)
