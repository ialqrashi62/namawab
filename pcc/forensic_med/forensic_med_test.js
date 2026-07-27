'use strict';

const Engine = require('./forensic_med_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('forensic_med engine tests', () => {
  it('Manner natural', () => {
    const r = Engine.MannerOfDeath({ cause: 'natural', mechanism: 'disease' });
    assertEq(r.manner, 'natural');
  });
  it('Time since death 12-24h', () => {
    const r = Engine.TimeSinceDeath({ algorMortis: 25, rigorMortisStage: 'generalized', livorMortis: 'fixed' });
    assertEq(r.timeEstimate, '12-24-hours');
  });
  it('Mechanism cardiac+arrhythmia', () => {
    const r = Engine.MechanismOfDeath({ primaryCause: 'cardiac', secondaryCause: 'arrhythmia' });
    assertEq(r.allCauses.includes('cardiac'), true);
  });
  it('GSW contact range', () => {
    const r = Engine.GunshotWoundRange({ soot: 'present', stippling: 'present', muzzleImprint: true });
    assertEq(r.range, 'contact-or-near-contact');
  });
  it('Hanging', () => {
    const r = Engine.StrangulationClassification({ ligatureMark: true, ligatureContinuity: 'broken' });
    assertEq(r.classification, 'hanging-typical-suicidal');
  });
  it('Confirmed drowning', () => {
    const r = Engine.DrowningDiagnosis({ frothAirways: 'present', diatomTest: 'positive', pleuralEffusion: 'significant' });
    assertEq(r.diagnosis, 'confirmed-drowning');
  });
  it('Poly-substance overdose', () => {
    const r = Engine.DrugRelatedDeath({ opiates: 'high', alcohol: 300 });
    assertEq(r.category, 'poly-substance-overdose');
  });
  it('Skeletal age 25-40', () => {
    const r = Engine.SkeletalAgeEstimation({ pubicSymphysis: 'phase-III' });
    assertEq(r.ageEstimate, 'adult-25-40');
  });
  it('SA high evidence', () => {
    const r = Engine.SexualAssaultInjury({ genitalInjury: 'present', spermatozoa: 'present' });
    assertEq(r.evidenceStrength, 'high-evidence-of-assault');
  });
  it('Blunt force catastrophic', () => {
    const r = Engine.BluntForceTrauma({ brainInjury: 'massive' });
    assertEq(r.severity, 'catastrophic-immediate-death');
  });
});

console.log(`\nforensic_med engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
