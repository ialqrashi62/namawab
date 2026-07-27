// P3-DA pcc_integrative_medicine unit tests
const Engine = require('./pcc_integrative_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_integrative_medicine engine tests:');
it('HolisticAssessment', () => assertEq(Engine.HolisticAssessment({ t: 'yes' }).plan, 'holisticassessment-protocol'));
it('MindBody', () => assertEq(Engine.MindBody({ t: 'yes' }).plan, 'mindbody-protocol'));
it('Acupuncture', () => assertEq(Engine.Acupuncture({ t: 'yes' }).plan, 'acupuncture-protocol'));
it('HerbalMedicine', () => assertEq(Engine.HerbalMedicine({ t: 'yes' }).plan, 'herbalmedicine-protocol'));
it('NutritionTherapy', () => assertEq(Engine.NutritionTherapy({ t: 'yes' }).plan, 'nutritiontherapy-protocol'));
it('YogaTherapy', () => assertEq(Engine.YogaTherapy({ t: 'yes' }).plan, 'yogatherapy-protocol'));
it('StressReduction', () => assertEq(Engine.StressReduction({ t: 'yes' }).plan, 'stressreduction-protocol'));
it('SleepOptimization', () => assertEq(Engine.SleepOptimization({ t: 'yes' }).plan, 'sleepoptimization-protocol'));
it('DetoxProtocol', () => assertEq(Engine.DetoxProtocol({ t: 'yes' }).plan, 'detoxprotocol-protocol'));
it('IntegrativeOncology', () => assertEq(Engine.IntegrativeOncology({ t: 'yes' }).plan, 'integrativeoncology-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
