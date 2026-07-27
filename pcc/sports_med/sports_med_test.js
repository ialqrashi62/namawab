'use strict';

const Engine = require('./sports_med_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('sports_med engine tests', () => {
  it('Concussion high risk', () => {
    const r = Engine.ConcussionSCAT5({ symptomsScore: 5, lossOfConsciousness: true });
    assertEq(r.risk, 'high-risk-concussion');
  });
  it('RTP stage 5 cleared', () => {
    const r = Engine.ReturnToPlayStage({ daysPostConcussion: 200, symptomsResolved: true });
    assertEq(r.stage, 5);
  });
  it('ACL grade C severe', () => {
    const r = Engine.ACLIKDCGrade({ lachmanTest: 'soft-endpoint', pivotShift: 'gross' });
    assertEq(r.grade, 'grade-C-severe');
  });
  it('Heat stroke', () => {
    const r = Engine.HeatIllness({ coreTemperature: 41, mentalStatus: 'altered' });
    assertEq(r.category, 'heat-stroke-ICU-emergency');
  });
  it('Acute compartment', () => {
    const r = Engine.ExertionalCompartmentSyndrome({ compartmentPressure: 35, reliefWithRest: false });
    assertEq(r.diagnosis, 'acute-compartment-syndrome-emergent-fasciotomy');
  });
  it('SCD disqualify', () => {
    const r = Engine.SuddenCardiacDeathAthlete({ familyHistorySCD: true, ecgAbnormal: true });
    assertEq(r.risk, 'very-high-risk-disqualify');
  });
  it('Meniscus confirmed', () => {
    const r = Engine.MeniscusMcMurray({ mriConfirmed: 'positive' });
    assertEq(r.likelihood, 'confirmed-tear');
  });
  it('Hamstring grade III', () => {
    const r = Engine.HamstringStrainGrade({ defectPalpable: true });
    assertEq(r.grade, 'grade-III-complete-tear');
  });
  it('Tennis elbow stage VII', () => {
    const r = Engine.TennisElbowNirschl({ microtear: true });
    assertEq(r.stage, 'stage-VII-microtear-or-rupture');
  });
  it('Exercise cardiac rehab', () => {
    const r = Engine.ExercisePrescriptionFITT({ goal: 'cardiac-rehab' });
    assertEq(r.frequency, '3-5-days/week');
  });
});

console.log(`\nsports_med engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
