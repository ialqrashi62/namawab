'use strict';

const Engine = require('./dental_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('dental engine tests', () => {
  it('DMFT high', () => {
    const r = Engine.DMFTIndex({ decayed: 8, missing: 2, filled: 3, age: 35 });
    assertEq(r.category, 'high');
  });
  it('CPITN code 4', () => {
    const r = Engine.PeriodontalCPITN({ pocketDepthMM: 7 });
    assertEq(r.code, 'code-4-severe-periodontitis');
  });
  it('IOTN grade 5', () => {
    const r = Engine.OrthodonticIOTN({ cleft: true });
    assertEq(r.grade, 'grade-5-treatment-essential');
  });
  it('pulp necrotic', () => {
    const r = Engine.ToothVitality({ coldTest: 'absent', electricPulpTest: 'absent' });
    assertEq(r.diagnosis, 'necrotic-pulp');
  });
  it('CAMBRA extreme', () => {
    const r = Engine.CariesRiskCAMBRA({ dmftScore: 5, sugarFrequency: 'high', fluorideExposure: 'none', salivaFlow: 'low' });
    assertEq(r.category, 'extreme-risk');
  });
  it('avulsion immediate', () => {
    const r = Engine.DentalTraumaIADT({ avulsion: true, timeSinceAvulsion: 30 });
    assertEq(r.classification, 'avulsion-immediate-replantation');
  });
  it('oral cancer high-risk', () => {
    const r = Engine.OralCancerScreening({ lesionType: 'erythroplakia' });
    assertEq(r.risk, 'high-risk-malignant-referral');
  });
  it('wisdom horizontal', () => {
    const r = Engine.WisdomToothImpaction({ angulation: 'horizontal' });
    assertEq(r.category, 'high-risk-impacted');
  });
  it('OHI poor', () => {
    const r = Engine.OralHygieneIndexSimplified({ debrisIndex: 2.5, calculusIndex: 1.5 });
    assertEq(r.category, 'poor');
  });
  it('class-III underbite', () => {
    const r = Engine.AngleMalocclusion({ molarRelationship: 'class-III', overjet: -3 });
    assertEq(r.classification, 'class-III-underbite');
  });
});

console.log(`\ndental engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
