// P3-EG pcc_pediatric_pulm unit tests
const Engine = require('./pcc_pediatric_pulm_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_pulm engine tests:');
it('PediatricAsthmaManagement', () => assertEq(Engine.PediatricAsthmaManagement({ t: 'yes' }).plan, 'pediatricAsthmaManagement-protocol'));
it('PediatricCysticFibrosis', () => assertEq(Engine.PediatricCysticFibrosis({ t: 'yes' }).plan, 'pediatricCysticFibrosis-protocol'));
it('BronchiolitisManagement', () => assertEq(Engine.BronchiolitisManagement({ t: 'yes' }).plan, 'bronchiolitisManagement-protocol'));
it('PediatricPneumonia', () => assertEq(Engine.PediatricPneumonia({ t: 'yes' }).plan, 'pediatricPneumonia-protocol'));
it('PediatricTuberculosis', () => assertEq(Engine.PediatricTuberculosis({ t: 'yes' }).plan, 'pediatricTuberculosis-protocol'));
it('PediatricSleepApnea', () => assertEq(Engine.PediatricSleepApnea({ t: 'yes' }).plan, 'pediatricSleepApnea-protocol'));
it('PediatricChronicLungDisease', () => assertEq(Engine.PediatricChronicLungDisease({ t: 'yes' }).plan, 'pediatricChronicLungDisease-protocol'));
it('PediatricVentilationSupport', () => assertEq(Engine.PediatricVentilationSupport({ t: 'yes' }).plan, 'pediatricVentilationSupport-protocol'));
it('PediatricAirwayAnomalies', () => assertEq(Engine.PediatricAirwayAnomalies({ t: 'yes' }).plan, 'pediatricAirwayAnomalies-protocol'));
it('PediatricPulmonaryHypertension', () => assertEq(Engine.PediatricPulmonaryHypertension({ t: 'yes' }).plan, 'pediatricPulmonaryHypertension-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
