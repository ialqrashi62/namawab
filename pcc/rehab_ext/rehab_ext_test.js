'use strict';

const Engine = require('./rehab_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('rehab_ext engine tests', () => {
  it('FIM total dependence', () => {
    const r = Engine.FIMScore({ motorSelfCare: 1, motorSphincter: 1, motorMobility: 1, motorLocomotion: 1, motorStairs: 1, cognitionCommunication: 1, cognitionSocial: 1, cognitionProblemSolving: 1 });
    assertEq(r.category, 'total-dependence');
  });
  it('Barthel independent', () => {
    const r = Engine.BarthelIndex({});
    assertEq(r.category, 'independent');
  });
  it('Rancho level 5', () => {
    const r = Engine.RanchoLosAmigos({ level: 5 });
    assertEq(r.level, 5);
  });
  it('ASIA A complete', () => {
    const r = Engine.ASIAImpairmentScale({ sensorySacral: 'absent', motorSacral: 'absent' });
    assertEq(r.grade, 'A-complete');
  });
  it('Fugl-Meyer mild', () => {
    const r = Engine.FuglMeyerStroke({ motorUpperExtremity: 60, motorLowerExtremity: 32, balance: 13, sensation: 22, rangeOfMotion: 40, pain: 40 });
    assertEq(r.category, 'mild-impairment');
  });
  it('Cardiac rehab high-risk', () => {
    const r = Engine.CardiacRehabRiskStratification({ ejectionFraction: 25, exerciseCapacityMets: 3, ischemia: true, arrhythmia: true, recentMI: true });
    assertEq(r.category, 'high-risk-supervised-only');
  });
  it('Ashworth severe', () => {
    const r = Engine.ModifiedAshworth({ tone: 3 });
    assertEq(r.category, 'severe-spasticity');
  });
  it('Braden very high', () => {
    const r = Engine.BradenScale({ sensory: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, frictionShear: 1 });
    assertEq(r.risk, 'very-high-risk');
  });
  it('Dysphagia severe NPO', () => {
    const r = Engine.DysphagiaSeverity({ aspirationRisk: 'high', dietLevel: 1 });
    assertEq(r.severity, 'severe-need-NPO');
  });
  it('Wheelchair custom tilt-in-space', () => {
    const r = Engine.WheelchairSeatingAssessment({ pelvicObliquity: 'severe', kyphosis: 'severe', scoliosis: 'mild' });
    assertEq(r.chairType, 'custom-tilt-in-space-with-molded-seating');
  });
});

console.log(`\nrehab_ext engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
