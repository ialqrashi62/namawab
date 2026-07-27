// P3-DH pcc_mental_resilience unit tests
const Engine = require('./pcc_mental_resilience_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_mental_resilience engine tests:');
it('StressInoculation', () => assertEq(Engine.StressInoculation({ t: 'yes' }).plan, 'stressinoculation-protocol'));
it('EmotionRegulation', () => assertEq(Engine.EmotionRegulation({ t: 'yes' }).plan, 'emotionregulation-protocol'));
it('GritScale', () => assertEq(Engine.GritScale({ t: 'yes' }).plan, 'gritscale-protocol'));
it('BurnoutRecovery', () => assertEq(Engine.BurnoutRecovery({ t: 'yes' }).plan, 'burnoutrecovery-protocol'));
it('TraumaResilience', () => assertEq(Engine.TraumaResilience({ t: 'yes' }).plan, 'traumaresilience-protocol'));
it('MindfulnessResilience', () => assertEq(Engine.MindfulnessResilience({ t: 'yes' }).plan, 'mindfulnessresilience-protocol'));
it('SocialSupport', () => assertEq(Engine.SocialSupport({ t: 'yes' }).plan, 'socialsupport-protocol'));
it('PurposeResilience', () => assertEq(Engine.PurposeResilience({ t: 'yes' }).plan, 'purposeresilience-protocol'));
it('Adaptability', () => assertEq(Engine.Adaptability({ t: 'yes' }).plan, 'adaptability-protocol'));
it('RecoveryPlan', () => assertEq(Engine.RecoveryPlan({ t: 'yes' }).plan, 'recoveryplan-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
