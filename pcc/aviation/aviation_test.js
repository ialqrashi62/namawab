'use strict';

const Engine = require('./aviation_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('aviation engine tests', () => {
  it('hypoxia critical', () => {
    const r = Engine.AltitudeHypoxia({ cabinPressureEquivalentFeet: 35000, oxygenSaturation: 80 });
    assertEq(r.severity, 'critical-immediate-oxygen-100');
  });
  it('G-LOC severe', () => {
    const r = Engine.GLOCAssessment({ gForce: 8, durationSeconds: 8, antiGSuit: false });
    assertEq(r.risk, 'high-G-LOC');
  });
  it('decompression Class I', () => {
    const r = Engine.RapidDecompression({ pressureDrop: 8000, timeSeconds: 1, altitude: 35000 });
    assertEq(r.classType, 'Class-I-explosive');
  });
  it('pilot class I', () => {
    const r = Engine.PilotMedicalClass({ vision: '20-20', hearing: 'normal', cardiac: 'cleared', neurologic: 'cleared' });
    assertEq(r.medicalClass, 'Class-I-first-class');
  });
  it('cosmic radiation high', () => {
    const r = Engine.CosmicRadiationDose({ flightHours: 800, altitude: 35000, latitude: 70 });
    assertEq(r.risk, 'elevated-radiation-exposure');
  });
  it('DVT very high', () => {
    const r = Engine.DVTLongFlightRisk({ flightDurationHours: 12, priorDVT: true, oralContraceptives: true });
    assertEq(r.risk, 'very-high-DVT-risk');
  });
  it('jet lag severe', () => {
    const r = Engine.JetLagDisorder({ timeZonesCrossed: 9, direction: 'eastward', days: 2 });
    assertEq(r.severity.startsWith('severe'), true);
  });
  it('sinus barotrauma', () => {
    const r = Engine.BarotraumaAssessment({ baroSite: 'sinus', descent: 'rapid', symptoms: 'severe-pain' });
    assertEq(r.severity, 'severe-barosinusitis');
  });
  it('spatial severe', () => {
    const r = Engine.SpatialDisorientation({ nightFlight: true, weather: 'IMC', vestibularDisease: true });
    assertEq(r.risk, 'high-spatial-disorientation');
  });
  it('cabin air poor', () => {
    const r = Engine.CabinAirQuality({ co2Level: 1500, humidity: 8, ozone: 'high' });
    assertEq(r.assessment, 'significant-cabin-air-issues');
  });
});

console.log(`\naviation engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
