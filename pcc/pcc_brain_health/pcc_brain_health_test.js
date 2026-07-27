// P3-DH pcc_brain_health unit tests
const Engine = require('./pcc_brain_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_brain_health engine tests:');
it('Neuroplasticity', () => assertEq(Engine.Neuroplasticity({ t: 'yes' }).plan, 'neuroplasticity-protocol'));
it('CognitiveReserve', () => assertEq(Engine.CognitiveReserve({ t: 'yes' }).plan, 'cognitivereserve-protocol'));
it('BrainNutrition', () => assertEq(Engine.BrainNutrition({ t: 'yes' }).plan, 'brainnutrition-protocol'));
it('SleepBrain', () => assertEq(Engine.SleepBrain({ t: 'yes' }).plan, 'sleepbrain-protocol'));
it('ExerciseBrain', () => assertEq(Engine.ExerciseBrain({ t: 'yes' }).plan, 'exercisebrain-protocol'));
it('ToxinBrain', () => assertEq(Engine.ToxinBrain({ t: 'yes' }).plan, 'toxinbrain-protocol'));
it('VascularBrain', () => assertEq(Engine.VascularBrain({ t: 'yes' }).plan, 'vascularbrain-protocol'));
it('MoodBrain', () => assertEq(Engine.MoodBrain({ t: 'yes' }).plan, 'moodbrain-protocol'));
it('SocialBrain', () => assertEq(Engine.SocialBrain({ t: 'yes' }).plan, 'socialbrain-protocol'));
it('BrainAging', () => assertEq(Engine.BrainAging({ t: 'yes' }).plan, 'brainaging-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
