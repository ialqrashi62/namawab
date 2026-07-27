'use strict';
const Engine = require('./rheum_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('RHEUM EXT ENGINE TESTS\n========================================');

describe('CASPAR', () => {
  it('PsA positive', () => {
    const r = Engine.CASPAR({ psoriasisCurrent: true, nailChanges: true, rheumatoidFactorNegative: true });
    assertEq(r.classification, 'psoriatic-arthritis');
  });
  it('not PsA', () => {
    const r = Engine.CASPAR({});
    assertEq(r.classification, 'not-classified-PsA');
  });
});

describe('ModifiedNewYork', () => {
  it('definite AS', () => {
    const r = Engine.ModifiedNewYork({ inflammatoryLowBackPain: true, bilateralSacroliitis: true });
    assertEq(r.classification, 'ankylosing-spondylitis-definite');
  });
});

describe('BVASv3', () => {
  it('severe vasculitis', () => {
    const r = Engine.BVASv3({ systemic: { fever: true, weightLoss: true, fatigue: true }, renal: { bpsgn: true, hematuria: true, creat: true }, nervous: { stroke: true, motor: true } });
    assertEq(r.category, 'severe-vasculitis-active');
  });
  it('remission', () => {
    const r = Engine.BVASv3({});
    assertEq(r.category, 'remission');
  });
});

describe('SLEDAIScore', () => {
  it('severe flare', () => {
    const r = Engine.SLEDAIScore({ seizure: true, psychosis: true, vasculitis: true });
    assertEq(r.activity, 'severe-flare');
  });
});

describe('SCLClassification', () => {
  it('diffuse Scl-70', () => {
    const r = Engine.SCLClassification({ skinInvolvement: 'diffuse', antiScl70: true });
    assertEq(r.subtype, 'diffuse-cutaneous');
  });
});

describe('GoutFlare', () => {
  it('acute flare', () => {
    const r = Engine.GoutFlare({ affectedJoints: 1, hotSwollenJoint: true, uricAcid: 8, renalFunction: 1.0 });
    assertEq(r.diagnosis, 'acute-gout-flare');
  });
});

describe('SjogrenSSDAI', () => {
  it('low activity', () => {
    const r = Engine.SjogrenSSDAI({ constitutional: 1, gland: 1 });
    assertEq(r.activity, 'low-activity');
  });
});

describe('OsteoporosisFRAX', () => {
  it('high risk bisphosphonate', () => {
    const r = Engine.OsteoporosisFRAX({ age: 75, sex: 'female', weightKg: 50, heightCm: 160, priorFracture: true, parentalHipFracture: true, currentSmoking: true, glucocorticoids: true, femoralNeckBMD: -3.0 });
    assert(r.treatment.includes('bisphosphonate'));
  });
});

describe('PMRDiagnosis', () => {
  it('PMR classified', () => {
    const r = Engine.PMRDiagnosis({ age: 70, bilateralShoulderPain: true, morningStiffnessMinutes: 60, elevatedESR: true, rheumatoidFactorNegative: true, rapidSteroidResponse: true });
    assertEq(r.classification, 'PMR-classified');
  });
});

describe('StillDisease', () => {
  it('definite Still', () => {
    const r = Engine.StillDisease({ spikingFever: true, evanescentRash: true, arthritis: true, ferritin: 6000 });
    assertEq(r.classification, 'definite-Still-disease');
  });
});

console.log();
console.log('rheum_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
