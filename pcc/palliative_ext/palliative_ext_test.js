'use strict';

const Engine = require('./palliative_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('palliative_ext engine tests', () => {
  it('ESAS severe', () => {
    const r = Engine.ESASSymptomBurden({ pain: 9, fatigue: 9, nausea: 9, dyspnea: 9, depression: 9, anxiety: 9, drowsiness: 9, appetite: 9, wellbeing: 9, sleep: 9 });
    assertEq(r.severity, 'severe-burden-urgent-palliative');
  });
  it('PPS 30%', () => {
    const r = Engine.PalliativePerformanceScale({ ambulation: 'mainly-bed', activity: 'unable', selfCare: 'severe-assist', intake: 'normal', conscious: 'full' });
    assertEq(r.performanceStatus, 25);
  });
  it('rotating high', () => {
    const r = Engine.OpioidRotation({ currentOpioid: 'morphine', currentDose: 200, targetOpioid: 'oxycodone' });
    assertEq(r.indication, 'high-dose-rotation-recommended');
  });
  it('cachexia severe', () => {
    const r = Engine.CancerCachexia({ weightLoss6mo: 15, bmi: 19, albumin: 2.5, inflammation: 'high' });
    assertEq(r.stage, 'refractory-cachexia');
  });
  it('delirium terminal', () => {
    const r = Engine.TerminalDelirium({ reversibility: 'irreversible', daysToDeath: 2 });
    assertEq(r.classification, 'terminal-delirium');
  });
  it('dyspnea severe', () => {
    const r = Engine.DyspneaManagement({ spo2: 85, respiratoryRate: 32, useOfAccessory: true });
    assertEq(r.category, 'severe-dyspnea-opioid-needed');
  });
  it('delirium severe', () => {
    const r = Engine.DeliriumPalliative({ agitation: 'severe', reversibility: 'unknown', daysToDeath: 30 });
    assertEq(r.classification, 'severe-delirium');
  });
  it('prognosis days', () => {
    const r = Engine.PrognosisEstimate({ performanceStatus: 20, albumin: 2.0, delirium: true, edVisits: 3, weightLoss: true });
    assertEq(r.prognosisCategory, 'days-1-7');
  });
  it('NPO comfort', () => {
    const r = Engine.ArtificialNutrition({ lifeExpectancyDays: 5, swallowingStatus: 'NPO', prognosis: 'poor' });
    assertEq(r.recommendation, 'comfort-feeds-only');
  });
  it('grief normal', () => {
    const r = Engine.GriefBereavement({ durationMonths: 2, suicidal: false, functioning: 'mild-impairment' });
    assertEq(r.classification, 'normal-grief');
  });
});

console.log(`\npalliative_ext engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
