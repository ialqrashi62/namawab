'use strict';

const Engine = require('./occupational_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('occupational engine tests', () => {
  it('FFD unfit', () => {
    const r = Engine.FitnessForDuty({ cardiovascular: 'restricted', pulmonary: 'restricted', musculoskeletal: 'restricted', comorbidityIndex: 3 });
    assertEq(r.fitness, 'unfit-restrictions-required');
  });
  it('respirator not cleared', () => {
    const r = Engine.RespiratorClearanceOSHA({ fev1: 60 });
    assertEq(r.clearance, 'not-cleared-pulmonary-eval-needed');
  });
  it('NIOSH over-exposure', () => {
    const r = Engine.HearingConservationNIOSH({ noiseExposureDb: 95, exposureHours: 8 });
    assertEq(r.action, 'over-exposure-required-hearing-protection');
  });
  it('RTW full-return', () => {
    const r = Engine.ReturnToWorkPlan({ daysSinceInjury: 30, functionalCapacity: 'full', jobPhysicalDemand: 'medium', psychologicalReadiness: 'ready' });
    assertEq(r.plan, 'full-return-acceptable');
  });
  it('RULA action-4', () => {
    const r = Engine.RULAERGO({ armScore: 3, neckScore: 2, trunkScore: 2, legScore: 1, force: 'high', repetition: 'high' });
    assertEq(r.actionLevel, 'action-level-4-investigate-immediately');
  });
  it('chemical over-exposure', () => {
    const r = Engine.ChemicalExposureLimit({ measuredLevel: 5, tlvTwa: 1 });
    assertEq(r.exposureCategory, 'over-exposure-immediate-action');
  });
  it('shift-work high', () => {
    const r = Engine.ShiftWorkDisorder({ shiftType: 'night', yearsOnShift: 8, sleepHours: 5 });
    assertEq(r.risk, 'high-shift-work-disorder');
  });
  it('BBP HIV high-risk', () => {
    const r = Engine.BloodborneExposure({ exposureType: 'percutaneous', sourceStatus: 'HIV-positive', volume: 'large' });
    assertEq(r.risk, 'high-risk-HIV');
  });
  it('burnout severe', () => {
    const r = Engine.BurnoutMaslach({ emotionalExhaustion: 30, depersonalization: 12 });
    assertEq(r.category, 'severe-burnout');
  });
  it('WMSD very high', () => {
    const r = Engine.WMSDRisk({ repetitiveMotion: 'high', forceLevel: 'high', awkwardPosture: 'high', vibration: 'high', staticPosture: 'high', durationHours: 8 });
    assertEq(r.risk, 'very-high-WMSD-risk');
  });
});

console.log(`\noccupational engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
