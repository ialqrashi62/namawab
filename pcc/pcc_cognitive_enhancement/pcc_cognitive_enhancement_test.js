// P3-DH pcc_cognitive_enhancement unit tests
const Engine = require('./pcc_cognitive_enhancement_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_cognitive_enhancement engine tests:');
it('MemoryTraining', () => assertEq(Engine.MemoryTraining({ t: 'yes' }).plan, 'memorytraining-protocol'));
it('AttentionFocus', () => assertEq(Engine.AttentionFocus({ t: 'yes' }).plan, 'attentionfocus-protocol'));
it('ProcessingSpeed', () => assertEq(Engine.ProcessingSpeed({ t: 'yes' }).plan, 'processingspeed-protocol'));
it('ExecutiveFunction', () => assertEq(Engine.ExecutiveFunction({ t: 'yes' }).plan, 'executivefunction-protocol'));
it('LearningStrategy', () => assertEq(Engine.LearningStrategy({ t: 'yes' }).plan, 'learningstrategy-protocol'));
it('Nootropics', () => assertEq(Engine.Nootropics({ t: 'yes' }).plan, 'nootropics-protocol'));
it('DualTask', () => assertEq(Engine.DualTask({ t: 'yes' }).plan, 'dualtask-protocol'));
it('CognitiveLoad', () => assertEq(Engine.CognitiveLoad({ t: 'yes' }).plan, 'cognitiveload-protocol'));
it('SkillAcquisition', () => assertEq(Engine.SkillAcquisition({ t: 'yes' }).plan, 'skillacquisition-protocol'));
it('PeakCognition', () => assertEq(Engine.PeakCognition({ t: 'yes' }).plan, 'peakcognition-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
