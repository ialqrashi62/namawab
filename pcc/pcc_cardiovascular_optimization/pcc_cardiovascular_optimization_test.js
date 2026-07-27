// P3-DI pcc_cardiovascular_optimization unit tests
const Engine = require('./pcc_cardiovascular_optimization_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_cardiovascular_optimization engine tests:');
it('EndothelialFunction', () => assertEq(Engine.EndothelialFunction({ t: 'yes' }).plan, 'endothelialfunction-protocol'));
it('LipidOptimization', () => assertEq(Engine.LipidOptimization({ t: 'yes' }).plan, 'lipidoptimization-protocol'));
it('BloodPressurePattern', () => assertEq(Engine.BloodPressurePattern({ t: 'yes' }).plan, 'bloodpressurepattern-protocol'));
it('HeartRateVariability', () => assertEq(Engine.HeartRateVariability({ t: 'yes' }).plan, 'heartratevariability-protocol'));
it('CardiacRehabAdvanced', () => assertEq(Engine.CardiacRehabAdvanced({ t: 'yes' }).plan, 'cardiacrehabadvanced-protocol'));
it('VascularStiffness', () => assertEq(Engine.VascularStiffness({ t: 'yes' }).plan, 'vascularstiffness-protocol'));
it('CoronaryRisk', () => assertEq(Engine.CoronaryRisk({ t: 'yes' }).plan, 'coronaryrisk-protocol'));
it('StrokePrevention', () => assertEq(Engine.StrokePrevention({ t: 'yes' }).plan, 'strokeprevention-protocol'));
it('CardiacNutrition', () => assertEq(Engine.CardiacNutrition({ t: 'yes' }).plan, 'cardiacnutrition-protocol'));
it('ExercisePrescription', () => assertEq(Engine.ExercisePrescription({ t: 'yes' }).plan, 'exerciseprescription-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
