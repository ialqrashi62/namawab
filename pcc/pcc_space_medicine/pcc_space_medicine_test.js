// P3-DC pcc_space_medicine unit tests
const Engine = require('./pcc_space_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_space_medicine engine tests:');
it('MicrogravityPhysiology', () => assertEq(Engine.MicrogravityPhysiology({ t: 'yes' }).plan, 'microgravityphysiology-protocol'));
it('RadiationProtection', () => assertEq(Engine.RadiationProtection({ t: 'yes' }).plan, 'radiationprotection-protocol'));
it('IsolationPsychology', () => assertEq(Engine.IsolationPsychology({ t: 'yes' }).plan, 'isolationpsychology-protocol'));
it('EVAMedical', () => assertEq(Engine.EVAMedical({ t: 'yes' }).plan, 'evamedical-protocol'));
it('Countermeasures', () => assertEq(Engine.Countermeasures({ t: 'yes' }).plan, 'countermeasures-protocol'));
it('SpaceNutrition', () => assertEq(Engine.SpaceNutrition({ t: 'yes' }).plan, 'spacenutrition-protocol'));
it('TelemedicineSpace', () => assertEq(Engine.TelemedicineSpace({ t: 'yes' }).plan, 'telemedicinespace-protocol'));
it('ReentryCare', () => assertEq(Engine.ReentryCare({ t: 'yes' }).plan, 'reentrycare-protocol'));
it('AstronautSelection', () => assertEq(Engine.AstronautSelection({ t: 'yes' }).plan, 'astronautselection-protocol'));
it('LongDurationHealth', () => assertEq(Engine.LongDurationHealth({ t: 'yes' }).plan, 'longdurationhealth-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
