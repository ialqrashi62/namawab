'use strict';

const Engine = require('./disaster_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('disaster engine tests', () => {
  it('START red', () => {
    const r = Engine.STARTTriage({ respiratoryRate: 0, perfusion: 'absent', mentalStatus: 'unresponsive', canWalk: false });
    assertEq(r.category, 'black-deceased-or-unsalvageable');
  });
  it('incident command', () => {
    const r = Engine.IncidentCommandActivation({ magnitude: 'catastrophic', fatalities: 50, injuries: 200 });
    assertEq(r.level, 'level-1-ICS-full-activation');
  });
  it('decon definite', () => {
    const r = Engine.HazmatDeconNeed({ agent: 'chemical-known', exposure: 'confirmed', symptoms: 'severe' });
    assertEq(r.deconLevel, 'definitive-decontamination');
  });
  it('mass-casualty yellow', () => {
    const r = Engine.MCIResourceAllocation({ totalCasualties: 50, redCount: 10, yellowCount: 20, greenCount: 18, blackCount: 2 });
    assertEq(r.mciLevel, 'MCI-level-2-moderate');
  });
  it('triage sieve P1', () => {
    const r = Engine.MedicalTriageSieve({ respiratoryRate: 28, heartRate: 110, consciousness: 'voice' });
    assertEq(r.priority, 'P1-immediate');
  });
  it('shelter overcrowded', () => {
    const r = Engine.ShelterCapacityPlan({ population: 1000, capacity: 500, days: 7, sanitation: 'poor' });
    assertEq(r.status, 'overcrowded-immediate-relief');
  });
  it('water shortage', () => {
    const r = Engine.WaterSanitationEmergency({ peopleAffected: 50000, waterLitersPerDay: 3 });
    assertEq(r.alertLevel, 'critical-water-shortage');
  });
  it('epi outbreak', () => {
    const r = Engine.EpidemicOutbreakDetection({ casesPerWeek: 30, expectedBaseline: 5, doublingTimeDays: 7 });
    assertEq(r.alert, 'epidemic-outbreak');
  });
  it('mortality high', () => {
    const r = Engine.MortalityRateCrisis({ deaths: 60, population: 1000, days: 7 });
    assertEq(r.severity, 'mass-fatality-event');
  });
  it('tetanus booster', () => {
    const r = Engine.WoundTetanusRiskAssessment({ lastTetanusYears: 15, woundType: 'puncture' });
    assertEq(r.action, 'tetanus-booster-and-TIG');
  });
});

console.log(`\ndisaster engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
