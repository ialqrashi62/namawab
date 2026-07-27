'use strict';

const Engine = require('./veterinary_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('veterinary engine tests', () => {
  it('rabies PEP dog', () => {
    const r = Engine.RabiesPetExposurerisk({ species: 'dog', vaccinated: true, provoked: false, wound: 'bite' });
    assertEq(r.recommendation, 'observe-pet-10-days-or-test');
  });
  it('brucellosis acute', () => {
    const r = Engine.BrucellosisRisk({ animalContact: 'cattle-birthing', symptoms: 'fever-night-sweats' });
    assertEq(r.risk, 'high-acute-brucellosis');
  });
  it('anthrax cutaneous', () => {
    const r = Engine.AnthraxExposure({ animal: 'cattle', exposureType: 'skin-contact', symptoms: 'black-eschar' });
    assertEq(r.diagnosis, 'cutaneous-anthrax');
  });
  it('lepto severe', () => {
    const r = Engine.LeptospirosisSeverity({ jaundice: true, renalFailure: true, hemorrhage: true });
    assertEq(r.severity, 'severe-Weils-disease');
  });
  it('Q fever chronic', () => {
    const r = Engine.QFeverChronic({ endocarditis: true, hepatitis: false, duration: 8, iggPhase1: 1000 });
    assertEq(r.diagnosis, 'chronic-Q-fever-endocarditis');
  });
  it('Hendra doxy', () => {
    const r = Engine.HendraNipahRisk({ exposure: 'bat-or-pig', symptoms: 'encephalitis' });
    assertEq(r.recommendation, 'strict-isolation-ribavirin-consider');
  });
  it('cat scratch confirmed', () => {
    const r = Engine.CatScratchDisease({ catExposure: true, papule: true, lymphadenopathy: true });
    assertEq(r.diagnosis, 'cat-scratch-confirmed');
  });
  it('West Nile neuro', () => {
    const r = Engine.WestNileNeuroinvasive({ encephalitis: true, paralysis: true });
    assertEq(r.severity, 'neuroinvasive-WNV');
  });
  it('toxoplasma active', () => {
    const r = Engine.ToxoplasmaPregnancy({ igm: 'positive', avidity: 'low', gestationalAge: 14 });
    assertEq(r.risk, 'high-transmission-active-infection');
  });
  it('TB bovine 95%', () => {
    const r = Engine.MycobacteriumBovis({ unpasteurizedMilk: true, lymphadenitis: true, ppdPositive: true });
    assertEq(r.diagnosis, 'Mycobacterium-bovis-confirmed');
  });
});

console.log(`\nveterinary engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
