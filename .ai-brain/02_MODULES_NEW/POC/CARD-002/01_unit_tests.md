<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Unit Tests (cath_lab_engine.js)

## Setup
`js
const c = require('./cath_lab_engine');
const assert = require('assert');
`

## Tests
`js
// 1. D2B
assert.strictEqual(c.calculateD2BTime('14:30','15:50'), 80);
assert.strictEqual(c.calculateD2BTime('14:00','15:30'), 90);
assert.strictEqual(c.calculateD2BTime('14:00','16:00'), 120); // non-compliant

// 2. SYNTAX
const syntax = c.syntaxScore([{vessel:'LAD', segment:'mid', stenosis:90}, {vessel:'LCX', stenosis:80}]);
assert.ok(syntax.score >= 0 && syntax.score <= 65);

// 3. GRACE
const grace = c.graceScore(65, 95, 110, 1.2, 2, true, false);
assert.ok(grace.risk > 0);

// 4. TIMI STEMI
const timi = c.timiScoreStemi({age:65, dm:true, htn:true, angina:true, sbp<100:true, hr>100:true, killip2to3:true, weight<67:false, anteriorMI:true, lbbb:false});
assert.ok(timi.score >= 0);

// 5. CIN
const cin = c.assessCINRisk(45, 200, 70, true);
assert.ok(['low','moderate','high'].includes(cin.band));

// 6. ACT
assert.strictEqual(c.actTargetCheck(280, 250, 300), true);
assert.strictEqual(c.actTargetCheck(220, 250, 300), false);

// 7. Sheath removal
const sheath = c.sheathRemovalChecklist(170, true, true, true);
assert.strictEqual(sheath.ok, true);
assert.strictEqual(c.sheathRemovalChecklist(220, true, true, true).ok, false); // ACT too high

// 8. Contrast limit
const limit = c.contrastLimit(60, 80);
assert.ok(limit.maxMl === 180); // 3 × 60

// 9. Radiation alert
const rad = c.radiationDoseAlert(45, 350, 3500);
assert.strictEqual(rad.alert, false);
assert.strictEqual(c.radiationDoseAlert(75, 600, 6000).alert, true);

// 10. Stent pressure
assert.strictEqual(c.stentExpansionPressure(14), 'optimal');
assert.strictEqual(c.stentExpansionPressure(10), 'under-expanded');
`

---
*Section 09 of CARD-002. Tests. L1 DRAFT.*