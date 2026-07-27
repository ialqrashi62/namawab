'use strict';

const Engine = require('./military_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('military engine tests', () => {
  it('tourniquet immediate', () => {
    const r = Engine.CombatTourniquet({ hemorrhageControl: 'ineffective', limb: 'lower', evacuation: 10 });
    assertEq(r.action, 'apply-tourniquet-immediate');
  });
  it('mTBI moderate', () => {
    const r = Engine.MildTraumaticBrainInjury({ lossOfConsciousness: 2, pta: 30, headache: true });
    assertEq(r.severity, 'moderate-mTBI');
  });
  it('PTSD probable', () => {
    const r = Engine.PTSDRiskAssessment({ combatExposure: true, hyperarousal: true, reexperiencing: true, avoidance: true, durationMonths: 6 });
    assertEq(r.risk, 'high-PTSD-probable');
  });
  it('blast primary', () => {
    const r = Engine.BlastInjuryType({ distanceMeters: 3, enclosedSpace: false, rupturedEardrum: true });
    assertEq(r.injuryType, 'primary-blast-injury');
  });
  it('TCCC massive', () => {
    const r = Engine.TCCCAlgorithm({ airway: 'compromised', breathing: 'tension-pneumothorax', circulation: 'catastrophic-bleed' });
    assertEq(r.category, 'mass-casualty-immediate');
  });
  it('MASS red respiratory', () => {
    const r = Engine.MilitaryTriageMASS({ walking: false, respiratoryRate: 35 });
    assertEq(r.tag, 'red-immediate');
  });
  it('hypothermia severe', () => {
    const r = Engine.HypothermiaCombat({ coreTemperature: 26, immersion: true, windChill: 35 });
    assertEq(r.severity, 'severe-hypothermia-cardiac-arrest-risk');
  });
  it('nerve agent atropine', () => {
    const r = Engine.ChemicalWarfareExposure({ agent: 'nerve-agent', symptoms: 'severe-cholinergic' });
    assertEq(r.management, 'atropine-2-PAM-immediate');
  });
  it('aero evac P1', () => {
    const r = Engine.AeroEvacPriority({ urgency: 'urgent', lifeThreat: 'imminent' });
    assertEq(r.priority, 'priority-1-urgent-90min');
  });
  it('field dental abscess', () => {
    const r = Engine.FieldDentalEmergency({ swelling: 'severe', trismus: 'present' });
    assertEq(r.management, 'dental-abscess-IV-antibiotics-I&D-drainage');
  });
});

console.log(`\nmilitary engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
