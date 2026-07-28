# 49 — Unit Tests (CARD-001)

> Owner: ORC + SA · Snippet: snippet:test-pattern · Tier 1

## Framework: `node:test` (Node 20+ native)

## Test files

```
namaweb/cardiology_engine_test.js          # pure engine functions
namaweb/cardiology_red_flag_test.js        # red flag detection
namaweb/cardiology_copilot_test.js         # co-pilot helpers
namaweb/cardiology_nphies_test.js          # NPHIES helpers
```

## Coverage target: 85% (Tier-1)

## Unit tests: cardiology.heartScore

```js
// namaweb/cardiology_engine_test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const cardiology = require('./cardiology_engine');

test('heartScore: low risk (0-3) returns discharge recommendation', () => {
  const r = cardiology.heartScore({ history: 0, ecg: 0, age: 0, riskFactors: 0, troponin: 0 });
  assert.equal(r.score, 0);
  assert.equal(r.risk, 'low');
  assert.match(r.recommendation, /discharge/i);
  assert.equal(r.redFlag, false);
});

test('heartScore: high risk (7-10) returns invasive workup + redFlag', () => {
  const r = cardiology.heartScore({ history: 2, ecg: 2, age: 1, riskFactors: 1, troponin: 1 });
  assert.equal(r.score, 7);
  assert.equal(r.risk, 'high');
  assert.match(r.recommendation, /invasive/i);
  assert.equal(r.redFlag, true);
});

test('heartScore: throws on missing ctx', () => {
  assert.throws(() => cardiology.heartScore(null), /ctx required/);
});

test('heartScore: throws on out-of-range value', () => {
  assert.throws(() => cardiology.heartScore({ history: 3, ecg: 0, age: 0, riskFactors: 0, troponin: 0 }), /0\.\.2/);
});

// 8 more heartScore tests...
```

## Unit tests: cardiology.cha2ds2vasc

```js
test('cha2ds2vasc: male 65 with HTN+DM = 3 (anticoag indicated)', () => {
  const r = cardiology.cha2ds2vasc({ htn: 1, age: 1, diabetes: 1 });
  assert.equal(r.score, 3);
  assert.match(r.indication, /anticoag/i);
  assert.equal(r.redFlag, true); // score>=2 + not on anticoag
});

test('cha2ds2vasc: female 50 lone AF = 1 (consider)', () => {
  const r = cardiology.cha2ds2vasc({ sex: 1 });
  assert.equal(r.score, 1);
  assert.match(r.indication, /consider/i);
});

test('cha2ds2vasc: throws on age=2 when age<65', () => {
  assert.throws(() => cardiology.cha2ds2vasc({ age: 2 }), /age/);
});

// 7 more...
```

## Unit tests: cardiology.hfGdmt

```js
test('hfGdmt: HFrEF, no meds, eGFR=60, K=4.0 → recommend all 4 pillars', () => {
  const r = cardiology.hfGdmt({
    ef: 30, nyha: 2, bp_systolic: 120, hr: 70, egfr: 60, k: 4.0,
    current_meds: [], allergies: []
  });
  assert.equal(r.changes.length, 4);  // ARNI + BB + MRA + SGLT2i
  assert.equal(r.redFlag, false);
});

test('hfGdmt: HFrEF, K=5.5 → MRA contraindicated', () => {
  const r = cardiology.hfGdmt({
    ef: 30, nyha: 2, bp_systolic: 120, hr: 70, egfr: 60, k: 5.5,
    current_meds: [], allergies: []
  });
  assert.ok(r.contra.some(c => /MRA/.test(c)));
});

test('hfGdmt: SBP<100 → start enalapril low dose', () => {
  const r = cardiology.hfGdmt({
    ef: 30, nyha: 2, bp_systolic: 95, hr: 70, egfr: 60, k: 4.0,
    current_meds: [], allergies: []
  });
  assert.ok(r.changes.some(c => /enalapril.*2\.5/.test(c.dose)));
});

test('hfGdmt: K>=6.0 → redFlag', () => {
  const r = cardiology.hfGdmt({
    ef: 30, nyha: 2, bp_systolic: 120, hr: 70, egfr: 60, k: 6.0,
    current_meds: [], allergies: []
  });
  assert.equal(r.redFlag, true);
});

// 11 more...
```

## Unit tests: cardiology.ecgBasic (red flag detection)

```js
test('ecgBasic: anterior STEMI (V1-V3 elevation) → redFlag', () => {
  const r = cardiology.ecgBasic({
    rate: 80, rhythm: 'sinus', pr_ms: 160, qrs_ms: 90, qtc_ms: 410, axis_deg: 60,
    st_per_lead: { V1: 2.5, V2: 3.0, V3: 2.0, II: 0, III: 0, aVF: 0 },
    q_per_lead: {},
  });
  assert.equal(r.redFlag, true);
  assert.equal(r.urgency, 'critical');
  assert.match(r.impression, /STEMI/);
});

test('ecgBasic: inferior STEMI (II, III, aVF elevation) → redFlag', () => {
  const r = cardiology.ecgBasic({
    rate: 80, rhythm: 'sinus', pr_ms: 160, qrs_ms: 90, qtc_ms: 410, axis_deg: 60,
    st_per_lead: { II: 2.0, III: 2.5, aVF: 2.0, V1: 0, V2: 0, V3: 0 },
    q_per_lead: {},
  });
  assert.equal(r.redFlag, true);
  assert.match(r.impression, /STEMI.*II|III|aVF/);
});

test('ecgBasic: lateral STEMI (I, aVL, V5, V6) → redFlag', () => {
  const r = cardiology.ecgBasic({
    rate: 80, rhythm: 'sinus', pr_ms: 160, qrs_ms: 90, qtc_ms: 410, axis_deg: -30,
    st_per_lead: { I: 1.5, aVL: 1.5, V5: 2.0, V6: 2.0 },
    q_per_lead: {},
  });
  assert.equal(r.redFlag, true);
});

test('ecgBasic: AF with RVR → not redFlag but tachycardia', () => {
  const r = cardiology.ecgBasic({
    rate: 160, rhythm: 'AF', pr_ms: null, qrs_ms: 90, qtc_ms: 410, axis_deg: 60,
    st_per_lead: {}, q_per_lead: {},
  });
  assert.equal(r.redFlag, false);
  assert.equal(r.rhythm, 'AF');
});

test('ecgBasic: VT → redFlag critical', () => {
  const r = cardiology.ecgBasic({
    rate: 200, rhythm: 'VT', pr_ms: null, qrs_ms: 160, qtc_ms: 480, axis_deg: -90,
    st_per_lead: {}, q_per_lead: {},
  });
  assert.equal(r.redFlag, true);
  assert.equal(r.urgency, 'critical');
});

test('ecgBasic: normal sinus → no redFlag', () => {
  const r = cardiology.ecgBasic({
    rate: 72, rhythm: 'sinus', pr_ms: 160, qrs_ms: 90, qtc_ms: 410, axis_deg: 60,
    st_per_lead: {}, q_per_lead: {},
  });
  assert.equal(r.redFlag, false);
  assert.equal(r.urgency, 'routine');
  assert.match(r.impression, /Normal|sinus/);
});

// 14 more (NSTEMI, BBB, ischemia patterns, etc.)...
```

## Test runner

```bash
node --test namaweb/cardiology_engine_test.js
node --test namaweb/cardiology_red_flag_test.js
node --test namaweb/cardiology_copilot_test.js
node --test namaweb/cardiology_nphies_test.js
```

## Coverage

```bash
node --test --experimental-test-coverage namaweb/cardiology_engine_test.js
```

## Total unit tests for CARD-001

- heartScore: 12
- cha2ds2vasc: 10
- hasBled: 8
- hfGdmt: 15
- ecgBasic: 20
- copilot helpers: 10
- nphies helpers: 8
- **Total: 83 unit tests**
