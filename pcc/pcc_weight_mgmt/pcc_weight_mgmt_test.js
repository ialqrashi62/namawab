// P3-CX pcc_weight_mgmt unit tests
const Engine = require('./pcc_weight_mgmt_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_weight_mgmt engine tests:');
it('Bmi', () => assertEq(Engine.Bmi({ t: 'yes' }).plan, 'bmi-protocol'));
it('ObesityClass', () => assertEq(Engine.ObesityClass({ t: 'yes' }).plan, 'obesityclass-protocol'));
it('BariatricReferral', () => assertEq(Engine.BariatricReferral({ t: 'yes' }).plan, 'bariatricreferral-protocol'));
it('DietPlan', () => assertEq(Engine.DietPlan({ t: 'yes' }).plan, 'dietplan-protocol'));
it('Exercise', () => assertEq(Engine.Exercise({ t: 'yes' }).plan, 'exercise-protocol'));
it('Comorbidity', () => assertEq(Engine.Comorbidity({ t: 'yes' }).plan, 'comorbidity-protocol'));
it('Medication', () => assertEq(Engine.Medication({ t: 'yes' }).plan, 'medication-protocol'));
it('FollowUp', () => assertEq(Engine.FollowUp({ t: 'yes' }).plan, 'followup-protocol'));
it('Goal', () => assertEq(Engine.Goal({ t: 'yes' }).plan, 'goal-protocol'));
it('SurgeryRisk', () => assertEq(Engine.SurgeryRisk({ t: 'yes' }).plan, 'surgeryrisk-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
