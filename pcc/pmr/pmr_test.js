'use strict';
const Engine = require('./pmr_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PMR ENGINE TESTS\n========================================');

describe('ASIAClassification', () => {
  it('ASIA A complete', () => {
    const r = Engine.ASIAClassification({ motorRightLow: 0, motorLeftLow: 0, motorRightHigh: 0, motorLeftHigh: 0, lightTouchRight: 0, lightTouchLeft: 0, pinPrickRight: 0, pinPrickLeft: 0, analContraction: 'no', analSensation: 'no', completeness: 'complete' });
    assertEq(r.level, 'ASIA-A');
  });
  it('ASIA E normal', () => {
    const r = Engine.ASIAClassification({ motorRightLow: 25, motorLeftLow: 25, motorRightHigh: 25, motorLeftHigh: 25, lightTouchRight: 28, lightTouchLeft: 28, pinPrickRight: 28, pinPrickLeft: 28, analContraction: 'yes', analSensation: 'yes', completeness: 'incomplete' });
    assertEq(r.level, 'ASIA-E');
  });
});

describe('BarthelIndex', () => {
  it('independent', () => {
    const r = Engine.BarthelIndex({ feeding: 10, bathing: 5, grooming: 5, dressing: 10, bowels: 10, bladder: 10, toiletUse: 10, chairBedTransfer: 15, mobility: 15, stairs: 10 });
    assertEq(r.score, 100);
    assertEq(r.dependency, 'independent');
  });
  it('total', () => {
    const r = Engine.BarthelIndex({ feeding: 0, bathing: 0, grooming: 0, dressing: 0, bowels: 0, bladder: 0, toiletUse: 0, chairBedTransfer: 0, mobility: 0, stairs: 0 });
    assertEq(r.dependency, 'total-dependency');
  });
});

describe('FIM', () => {
  it('total assist', () => {
    const r = Engine.FunctionalIndependenceMeasure({ eating: 1, grooming: 1, bathing: 1, dressingUpper: 1, dressingLower: 1, toileting: 1, bladder: 1, bowels: 1, chairTransfer: 1, toiletTransfer: 1, tubTransfer: 1, walking: 1, stairs: 1, comprehension: 1, expression: 1, socialInteraction: 1, problemSolving: 1, memory: 1 });
    assertEq(r.level, 'total-assist');
  });
});

describe('BergBalance', () => {
  it('high fall risk', () => {
    const r = Engine.BergBalance({ sitToStand: 1, standUnsupported: 1, sitUnsupported: 2, standToSit: 1, transfers: 1, standEyesClosed: 1, standFeetTogether: 1, reachForward: 1, pickUpObject: 1, turnToLookBehind: 1, turn360: 1, placeAlternateFoot: 1, standOneFootFront: 1, standOnOneLeg: 1 });
    assertEq(r.fallRisk, 'high-fall-risk-wheelchair');
  });
});

describe('StrokeRecovery', () => {
  it('good recovery mild', () => {
    const r = Engine.StrokeRecovery({ nihssScore: 3, daysPostStroke: 14, rehabilitationIntensity: 'high', age: 55, comorbidities: 0, motivationScore: 9 });
    assert(r.recoveryScore >= 70);
  });
});

describe('AmputeeMobility', () => {
  it('BK K3', () => {
    const r = Engine.AmputeeMobility({ amputationLevel: 'below-knee', prostheticFit: 'good', residualLimbHealing: 'complete', comorbidities: 0, age: 50, weightBearing: 'full' });
    assert(r.mobilityPotential >= 70);
  });
});

describe('PressureInjuryBraden', () => {
  it('high risk', () => {
    const r = Engine.PressureInjuryBraden({ sensoryPerception: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, frictionShear: 1 });
    assertEq(r.risk, 'very-high-risk');
  });
});

describe('SpasticityMAS', () => {
  it('severe', () => {
    const r = Engine.SpasticityMAS({ elbow: 4, wrist: 4, fingers: 4, hip: 4, knee: 4, ankle: 4 });
    assertEq(r.grade, 'severe-spasticity');
    assertEq(r.treatment, 'botulinum-toxin-or-intrathecal-baclofen');
  });
});

describe('WheelchairPrescription', () => {
  it('power wheelchair', () => {
    const r = Engine.WheelchairPrescription({ diagnosis: 'CVA', functionalLevel: 'dependent', posture: 'normal', skinIntegrity: 'intact', cognition: 'intact', environment: 'community', weight: 80, height: 175 });
    assert(r.chairType.includes('power'));
  });
});

console.log();
console.log('pmr engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
