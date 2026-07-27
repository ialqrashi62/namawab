// P3-DA pcc_functional_medicine unit tests
const Engine = require('./pcc_functional_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_functional_medicine engine tests:');
it('RootCause', () => assertEq(Engine.RootCause({ t: 'yes' }).plan, 'rootcause-protocol'));
it('Timeline', () => assertEq(Engine.Timeline({ t: 'yes' }).plan, 'timeline-protocol'));
it('EliminationDiet', () => assertEq(Engine.EliminationDiet({ t: 'yes' }).plan, 'eliminationdiet-protocol'));
it('GutHealing', () => assertEq(Engine.GutHealing({ t: 'yes' }).plan, 'guthealing-protocol'));
it('HormoneBalance', () => assertEq(Engine.HormoneBalance({ t: 'yes' }).plan, 'hormonebalance-protocol'));
it('Toxicity', () => assertEq(Engine.Toxicity({ t: 'yes' }).plan, 'toxicity-protocol'));
it('Inflammation', () => assertEq(Engine.Inflammation({ t: 'yes' }).plan, 'inflammation-protocol'));
it('MitochondrialSupport', () => assertEq(Engine.MitochondrialSupport({ t: 'yes' }).plan, 'mitochondrialsupport-protocol'));
it('ImmuneModulation', () => assertEq(Engine.ImmuneModulation({ t: 'yes' }).plan, 'immunemodulation-protocol'));
it('PersonalizedPlan', () => assertEq(Engine.PersonalizedPlan({ t: 'yes' }).plan, 'personalizedplan-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
