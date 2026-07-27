// P3-DD pcc_occupational_rehab unit tests
const Engine = require('./pcc_occupational_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_occupational_rehab engine tests:');
it('WorkCapacity', () => assertEq(Engine.WorkCapacity({ t: 'yes' }).plan, 'workcapacity-protocol'));
it('ErgonomicAssessment', () => assertEq(Engine.ErgonomicAssessment({ t: 'yes' }).plan, 'ergonomicassessment-protocol'));
it('FunctionalRestoration', () => assertEq(Engine.FunctionalRestoration({ t: 'yes' }).plan, 'functionalrestoration-protocol'));
it('ReturnToWork', () => assertEq(Engine.ReturnToWork({ t: 'yes' }).plan, 'returntowork-protocol'));
it('VocationalRetraining', () => assertEq(Engine.VocationalRetraining({ t: 'yes' }).plan, 'vocationalretraining-protocol'));
it('WorkHardening', () => assertEq(Engine.WorkHardening({ t: 'yes' }).plan, 'workhardening-protocol'));
it('PainAtWork', () => assertEq(Engine.PainAtWork({ t: 'yes' }).plan, 'painatwork-protocol'));
it('CognitiveDemands', () => assertEq(Engine.CognitiveDemands({ t: 'yes' }).plan, 'cognitivedemands-protocol'));
it('SafetyClearance', () => assertEq(Engine.SafetyClearance({ t: 'yes' }).plan, 'safetyclearance-protocol'));
it('DisabilityEvaluation', () => assertEq(Engine.DisabilityEvaluation({ t: 'yes' }).plan, 'disabilityevaluation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
