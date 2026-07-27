// P3-CZ pcc_pain_rehab unit tests
const Engine = require('./pcc_pain_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pain_rehab engine tests:');
it('PainAdmission', () => assertEq(Engine.PainAdmission({ t: 'yes' }).plan, 'painadmission-protocol'));
it('Multidisciplinary', () => assertEq(Engine.Multidisciplinary({ t: 'yes' }).plan, 'multidisciplinary-protocol'));
it('PhysicalTherapy', () => assertEq(Engine.PhysicalTherapy({ t: 'yes' }).plan, 'physicaltherapy-protocol'));
it('OccupationalTherapy', () => assertEq(Engine.OccupationalTherapy({ t: 'yes' }).plan, 'occupationaltherapy-protocol'));
it('Psychology', () => assertEq(Engine.Psychology({ t: 'yes' }).plan, 'psychology-protocol'));
it('Interventional', () => assertEq(Engine.Interventional({ t: 'yes' }).plan, 'interventional-protocol'));
it('MedicationTaper', () => assertEq(Engine.MedicationTaper({ t: 'yes' }).plan, 'medicationtaper-protocol'));
it('FunctionalRestoration', () => assertEq(Engine.FunctionalRestoration({ t: 'yes' }).plan, 'functionalrestoration-protocol'));
it('Discharge', () => assertEq(Engine.Discharge({ t: 'yes' }).plan, 'discharge-protocol'));
it('RelapsePrevention', () => assertEq(Engine.RelapsePrevention({ t: 'yes' }).plan, 'relapseprevention-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
