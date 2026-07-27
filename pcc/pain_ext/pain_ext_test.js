'use strict';

const Engine = require('./pain_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('pain_ext engine tests', () => {
  it('WHO step 3', () => {
    const r = Engine.WHOLadderAnalgesic({ currentPainScore: 7 });
    assertEq(r.step.startsWith('step-3'), true);
  });
  it('CDC high dose', () => {
    const r = Engine.OpioidDoseCDC({ morphineMilligramEquivalentDaily: 200 });
    assertEq(r.category, 'high-dose-carefully-justify');
  });
  it('COMM severe', () => {
    const r = Engine.ConstipationOpioidRisk({ opioidDose: 150, mobility: 'low', fiber: 0 });
    assertEq(r.risk, 'severe-opioid-induced-constipation');
  });
  it('neuropathic likely', () => {
    const r = Engine.NeuropathicPainScreening({ painDN4: { burning: true, electric: true, numbness: true, allodynia: true } });
    assertEq(r.diagnosis, 'neuropathic-pain-likely');
  });
  it('fibromyalgia probable', () => {
    const r = Engine.FibromyalgiaDiagnostic({ widespreadPainIndex: 7, symptomSeverity: 7 });
    assertEq(r.diagnosis, 'fibromyalgia-probable');
  });
  it('migraine prophylaxis', () => {
    const r = Engine.MigraineProphylaxisIndication({ monthlyMigraineDays: 8, acuteMedicationDays: 12 });
    assertEq(r.indication, 'prophylaxis-indicated');
  });
  it('CGRP response', () => {
    const r = Engine.CGRPInhibitorResponse({ monthlyMigraineDays: 4, priorProphylaxisFailure: 2 });
    assertEq(r.response, 'good-candidate-CGRP-inhibitor');
  });
  it('ketamine for CRPS', () => {
    const r = Engine.KetamineInfusion({ diagnosis: 'CRPS', priorTherapy: 'failed-3-lines' });
    assertEq(r.indication, 'IV-ketamine-4h-protocol');
  });
  it('overdose high', () => {
    const r = Engine.OverdoseRiskScore({ opioidDose: 200, benzodiazepine: true, substanceUse: 'active', mentalHealth: 'unstable' });
    assertEq(r.risk, 'very-high-overdose-risk');
  });
  it('PROMIS high-impact', () => {
    const r = Engine.ChronicPainImpactPROMIS({ painInterference: 80, physicalFunction: 20, anxiety: 80, depression: 80, sleepDisturbance: 80 });
    assertEq(r.impact, 'high-impact-chronic-pain');
  });
});

console.log(`\npain_ext engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
