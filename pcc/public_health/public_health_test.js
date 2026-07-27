'use strict';

const Engine = require('./public_health_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('public_health engine tests', () => {
  it('vaccine unimmunized', () => {
    const r = Engine.VaccineScheduleAdherence({ dosesReceived: [], dueVaccines: ['DTaP', 'IPV', 'MMR'] });
    assertEq(r.status, 'unimmunized-high-risk');
  });
  it('outbreak epidemic', () => {
    const r = Engine.OutbreakAttackRate({ exposed: 100, ill: 30, totalPopulation: 500, deaths: 1, secondaryCases: 70 });
    assertEq(r.severity, 'epidemic-spreading');
  });
  it('contact high-risk', () => {
    const r = Engine.ContactTracingRisk({ distance: 0.5, durationMinutes: 60, maskUsed: false, enclosedSpace: true });
    assertEq(r.risk, 'high-risk-close-contact');
  });
  it('vaccine 80% eff', () => {
    const r = Engine.VaccineEffectiveness({ vaccinatedCases: 20, unvaccinatedCases: 100, vaccinatedTotal: 1000, unvaccinatedTotal: 1000 });
    assertEq(r.recommendation, 'high-efficacy-clear-benefit');
  });
  it('TB positive', () => {
    const r = Engine.TuberculosisScreening({ igraResult: 'positive' });
    assertEq(r.interpretation, 'positive-ltbi');
  });
  it('flu critical', () => {
    const r = Engine.InfluenzaSeverityScore({ oxygenRequirement: 2, respiratoryRate: 32, age: 70, comorbidities: 3, consciousness: 'altered' });
    assertEq(r.severity, 'critical-ICU-oseltamivir');
  });
  it('HepB non-responder', () => {
    const r = Engine.HepatitisBVaccineResponse({ antiHbsTiter: 2, age: 30 });
    assertEq(r.response, 'non-responder-revaccinate');
  });
  it('dengue high', () => {
    const r = Engine.VectorBorneDiseaseRisk({ aedesIndex: 4, fever: true, thrombocytopenia: true });
    assertEq(r.diseaseRisk, 'high-dengue-risk');
  });
  it('breast high-risk', () => {
    const r = Engine.BreastCancerScreeningEligibility({ age: 35, familyHistory: true });
    assertEq(r.eligibility, 'high-risk-annual-MRI-and-mammogram');
  });
  it('hand hygiene poor', () => {
    const r = Engine.HandHygieneCompliance({ opportunities: 100, observedActions: 50 });
    assertEq(r.category, 'poor-compliance');
  });
});

console.log(`\npublic_health engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
