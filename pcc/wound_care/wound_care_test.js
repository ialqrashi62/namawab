'use strict';
const Engine = require('./wound_care_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('WOUND CARE ENGINE TESTS\n========================================');

describe('BradenScale', () => {
  it('no risk', () => {
    const r = Engine.BradenScale({ sensoryPerception: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, frictionShear: 3 });
    assertEq(r.risk, 'no-risk');
  });
  it('very high risk', () => {
    const r = Engine.BradenScale({ sensoryPerception: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, frictionShear: 1 });
    assertEq(r.risk, 'very-high-risk');
  });
});

describe('PressureInjuryStaging', () => {
  it('stage 1', () => {
    const r = Engine.PressureInjuryStaging({ stage: 1 });
    assertEq(r.healing, true);
  });
  it('stage 4', () => {
    const r = Engine.PressureInjuryStaging({ stage: 4, depth: 5, tissueType: 'granulation' });
    assertEq(r.healing, false);
  });
});

describe('WagnerDFU', () => {
  it('grade 0', () => {
    const r = Engine.WagnerDFU({ depth: 0 });
    assertEq(r.wagner, 0);
  });
  it('grade 5 gangrene', () => {
    const r = Engine.WagnerDFU({ depth: 5, gangrene: true });
    assertEq(r.wagner, 5);
  });
});

describe('WoundExudate', () => {
  it('saturated green infection', () => {
    const r = Engine.WoundExudate({ amount: 'saturated', color: 'green', consistency: 'thick' });
    assertEq(r.amountCategory, 'saturated');
    assertEq(r.infectionConcern, true);
  });
  it('dry clear', () => {
    const r = Engine.WoundExudate({ amount: 'scant', color: 'clear', consistency: 'thin' });
    assertEq(r.infectionConcern, false);
  });
});

describe('BatesJensen', () => {
  it('good healing', () => {
    const r = Engine.BatesJensen({ size: 1, depth: 1, edges: 1, undermining: 1, necroticTissue: 1, exudateType: 1, exudateAmount: 1, skinColor: 1, granulationTissue: 1, epithelialization: 1 });
    assertEq(r.healing, 'good-healing');
  });
});

describe('VLUClassification', () => {
  it('advanced', () => {
    const r = Engine.VLUClassification({ ceap: 6, ulcertype: 'active', location: 'medial' });
    assertEq(r.severity, 'advanced-chronic-venous-disease');
  });
});

describe('DiabeticFootRisk', () => {
  it('class 3 high', () => {
    const r = Engine.DiabeticFootRisk({ neuropathy: true, priorUlcer: true, priorAmputation: true });
    assertEq(r.category, 'IUF-class-3');
  });
  it('class 0 low', () => {
    const r = Engine.DiabeticFootRisk({});
    assertEq(r.category, 'IUF-class-0');
  });
});

describe('NegativePressureWound', () => {
  it('suitable chronic', () => {
    const r = Engine.NegativePressureWound({ woundType: 'chronic', exudateAmount: 'moderate', depth: 3 });
    assertEq(r.suitable, true);
  });
  it('infection contra', () => {
    const r = Engine.NegativePressureWound({ woundType: 'acute', exudateAmount: 'moderate', depth: 3, infection: true });
    assertEq(r.suitable, false);
  });
});

describe('CompressionTherapy', () => {
  it('severe arterial', () => {
    const r = Engine.CompressionTherapy({ abi: 0.4 });
    assertEq(r.appropriate, false);
  });
  it('venous ulcer', () => {
    const r = Engine.CompressionTherapy({ abi: 1.0, indication: 'venous', ulcerSize: 5 });
    assertEq(r.appropriate, true);
  });
});

describe('WoundInfection', () => {
  it('deep OM', () => {
    const r = Engine.WoundInfection({ erythema: true, warmth: true, swelling: true, pain: true, exudate: true, fever: true, leukocytosis: true });
    assertEq(r.classification, 'deep-OM');
  });
  it('no infection', () => {
    const r = Engine.WoundInfection({});
    assertEq(r.classification, 'no-infection');
  });
});

console.log();
console.log('wound_care engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
