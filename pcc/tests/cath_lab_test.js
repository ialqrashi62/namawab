/**
 * pcc/tests/cath_lab_test.js
 *
 * Runs without a live DB. Tests the engine + middleware + schemas
 * only. For integration tests that hit a real DB, see
 * pcc/tests/cath_lab_integration_test.js (skipped if no DB).
 */
'use strict';

const assert = require('assert');
const Engine = require('../engines/cath_lab_specialized_engine');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    passed++;
    // eslint-disable-next-line no-console
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    // eslint-disable-next-line no-console
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

function describe(suite, fn) {
  // eslint-disable-next-line no-console
  console.log(`\n${suite}`);
  fn();
}

// =========================================================
// 1. CTOScoreJCTO
// =========================================================
describe('CTOScoreJCTO', () => {
  it('returns 0 / easy when no criteria met', () => {
    const r = Engine.CTOScoreJCTO({});
    assert.strictEqual(r.score, 0);
    assert.strictEqual(r.difficulty, 'easy');
  });
  it('counts all 5 criteria', () => {
    const r = Engine.CTOScoreJCTO({
      bluntProximalCap: true, severeCalcification: true, severeBend: true,
      lengthGt20: true, priorFailedAttempt: true,
    });
    assert.strictEqual(r.score, 5);
    assert.strictEqual(r.difficulty, 'very_difficult');
  });
  it('classifies intermediate at 1', () => {
    const r = Engine.CTOScoreJCTO({ severeCalcification: true });
    assert.strictEqual(r.score, 1);
    assert.strictEqual(r.difficulty, 'intermediate');
  });
  it('classifies difficult at 2', () => {
    const r = Engine.CTOScoreJCTO({ severeCalcification: true, lengthGt20: true });
    assert.strictEqual(r.score, 2);
    assert.strictEqual(r.difficulty, 'difficult');
  });
});

// =========================================================
// 2. SyntaxScoreCategory
// =========================================================
describe('SyntaxScoreCategory', () => {
  it('low at 22', () => assert.strictEqual(Engine.SyntaxScoreCategory(22), 'low'));
  it('intermediate at 23', () => assert.strictEqual(Engine.SyntaxScoreCategory(23), 'intermediate'));
  it('intermediate at 32', () => assert.strictEqual(Engine.SyntaxScoreCategory(32), 'intermediate'));
  it('high at 33', () => assert.strictEqual(Engine.SyntaxScoreCategory(33), 'high'));
  it('throws on negative', () => {
    assert.throws(() => Engine.SyntaxScoreCategory(-1));
  });
});

// =========================================================
// 3. CalciumScoreIVUS
// =========================================================
describe('CalciumScoreIVUS', () => {
  it('0 when none', () => assert.strictEqual(Engine.CalciumScoreIVUS({}), 0));
  it('1 when 1 quadrant superficial', () =>
    assert.strictEqual(Engine.CalciumScoreIVUS({ quadrantsSuperficial: 1 }), 1));
  it('2 when 1 quadrant both', () =>
    assert.strictEqual(Engine.CalciumScoreIVUS({ quadrantsSuperficial: 1, quadrantsDeep: 1 }), 2));
  it('3 when multi-quadrant both', () =>
    assert.strictEqual(Engine.CalciumScoreIVUS({ quadrantsSuperficial: 2, quadrantsDeep: 2 }), 3));
  it('4 when circumferential', () =>
    assert.strictEqual(Engine.CalciumScoreIVUS({ circumferential: true }), 4));
});

// =========================================================
// 4. FFRiFRAnalysis
// =========================================================
describe('FFRiFRAnalysis', () => {
  it('FFR positive at 0.75', () => {
    const r = Engine.FFRiFRAnalysis({ type: 'FFR', value: 0.75 });
    assert.strictEqual(r.positive, true);
    assert.strictEqual(r.recommendation, 'proceed_to_pci');
  });
  it('FFR borderline at 0.79', () => {
    const r = Engine.FFRiFRAnalysis({ type: 'FFR', value: 0.79 });
    assert.strictEqual(r.positive, true);
    assert.strictEqual(r.confidence_band, 'borderline');
  });
  it('FFR negative at 0.85', () => {
    const r = Engine.FFRiFRAnalysis({ type: 'FFR', value: 0.85 });
    assert.strictEqual(r.positive, false);
    assert.strictEqual(r.recommendation, 'defer_optimize_medical_therapy');
  });
  it('iFR positive at 0.85', () => {
    const r = Engine.FFRiFRAnalysis({ type: 'iFR', value: 0.85 });
    assert.strictEqual(r.positive, true);
  });
  it('iFR negative at 0.92', () => {
    const r = Engine.FFRiFRAnalysis({ type: 'iFR', value: 0.92 });
    assert.strictEqual(r.positive, false);
  });
  it('throws on bad type', () => {
    assert.throws(() => Engine.FFRiFRAnalysis({ type: 'XYZ', value: 0.5 }));
  });
});

// =========================================================
// 5. BifurcationMedina
// =========================================================
describe('BifurcationMedina', () => {
  it('0,0,0 notation', () => {
    const r = Engine.BifurcationMedina({});
    assert.strictEqual(r.notation, '0,0,0');
  });
  it('1,1,1 notation', () => {
    const r = Engine.BifurcationMedina({ proximal: true, distalMain: true, sideBranch: true });
    assert.strictEqual(r.notation, '1,1,1');
  });
  it('0,1,0 (medina 0,1,0)', () => {
    const r = Engine.BifurcationMedina({ distalMain: true });
    assert.strictEqual(r.notation, '0,1,0');
  });
});

// =========================================================
// 6. PerforationEllis
// =========================================================
describe('PerforationEllis', () => {
  it('Type I low severity', () => {
    const r = Engine.PerforationEllis('I', false);
    assert.strictEqual(r.severity, 'low');
    assert.strictEqual(r.action, 'observe_30min_then_repeat_angio');
  });
  it('Type III high + pericardiocentesis when tamponade', () => {
    const r = Engine.PerforationEllis('III', true);
    assert.strictEqual(r.severity, 'high');
    assert.strictEqual(r.action, 'covered_stent_or_emergent_surgery');
    assert.strictEqual(r.requiresPericardiocentesis, true);
  });
  it('Type IV critical + surgery', () => {
    const r = Engine.PerforationEllis('IV', false);
    assert.strictEqual(r.action, 'emergent_surgery');
  });
  it('throws on bad type', () => {
    assert.throws(() => Engine.PerforationEllis('X', false));
  });
});

// =========================================================
// 7. RotablationBurr
// =========================================================
describe('RotablationBurr', () => {
  it('3.0mm artery -> 1.75mm burr', () => {
    const r = Engine.RotablationBurr(3.0);
    assert.strictEqual(r.recommendedBurrSizeMm, 1.75);
  });
  it('5.0mm artery -> 2.5mm burr (largest available)', () => {
    const r = Engine.RotablationBurr(5.0);
    assert.strictEqual(r.recommendedBurrSizeMm, 2.5);
  });
  it('throws on zero', () => {
    assert.throws(() => Engine.RotablationBurr(0));
  });
});

// =========================================================
// 8. IVLDelivery
// =========================================================
describe('IVLDelivery', () => {
  it('3.0mm artery -> 3.0mm balloon', () => {
    const r = Engine.IVLDelivery(3.0);
    assert.strictEqual(r.recommendedBalloonMm, 3.0);
  });
  it('5.0mm artery -> 4.0mm (max)', () => {
    const r = Engine.IVLDelivery(5.0);
    assert.strictEqual(r.recommendedBalloonMm, 4.0);
  });
  it('pulse cycles 8', () => {
    const r = Engine.IVLDelivery(3.5);
    assert.strictEqual(r.pulseCycles, 8);
  });
});

// =========================================================
// 9. NoReflowPredict
// =========================================================
describe('NoReflowPredict', () => {
  it('SVG + thrombus -> high risk + prophylactic', () => {
    const r = Engine.NoReflowPredict({ isSVG: true, hasThrombus: true });
    assert.strictEqual(r.risk, 'high');
    assert.strictEqual(r.prophylactic, 'IC_adenosine_verapamil_nitroprusside');
  });
  it('no risk factors -> low risk', () => {
    const r = Engine.NoReflowPredict({});
    assert.strictEqual(r.risk, 'low');
  });
  it('moderate at 2', () => {
    const r = Engine.NoReflowPredict({ longStent: true, highPressurePostDilatation: true });
    assert.strictEqual(r.risk, 'moderate');
  });
});

// =========================================================
// 10. CoronaryDissectionType
// =========================================================
describe('CoronaryDissectionType', () => {
  it('Type A observe', () => {
    const r = Engine.CoronaryDissectionType('A');
    assert.strictEqual(r.action, 'observe');
  });
  it('Type C stent to seal', () => {
    const r = Engine.CoronaryDissectionType('C');
    assert.strictEqual(r.action, 'stent_to_seal');
  });
  it('Type F urgent stent or surgery', () => {
    const r = Engine.CoronaryDissectionType('F');
    assert.strictEqual(r.action, 'urgent_stent_or_surgery');
  });
  it('throws on bad type', () => {
    assert.throws(() => Engine.CoronaryDissectionType('Z'));
  });
});

// =========================================================
// SUMMARY
// =========================================================
// eslint-disable-next-line no-console
console.log(`\n${'='.repeat(40)}`);
// eslint-disable-next-line no-console
console.log(`Engine tests: ${passed} passed, ${failed} failed`);
// eslint-disable-next-line no-console
console.log('='.repeat(40));

if (failed > 0) process.exit(1);
