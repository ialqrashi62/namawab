// P3-CK pcc_psych_ext3 unit tests
const Engine = require('./pcc_psych_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_psych_ext3 engine tests:');
it('Sc', () => assertEq(Engine.Screening({ t: 'PHQ9' }).plan, 'PHQ9-screen'));
it('Rk', () => assertEq(Engine.Risk({ t: 'suicide' }).plan, 'suicide-risk-eval'));
it('Dep', () => assertEq(Engine.Depression({ p: 22 }).plan, 'severe-depression'));
it('Anx', () => assertEq(Engine.Anxiety({ g: 18 }).plan, 'severe-anxiety'));
it('Sub', () => assertEq(Engine.Substance({ t: 'opioid' }).plan, 'opioid-detox'));
it('Psy', () => assertEq(Engine.Psychosis({ s: 'positive-symptoms' }).plan, 'psychosis-active'));
it('Bp', () => assertEq(Engine.Bipolar({ m: 'manic' }).plan, 'manic-episode'));
it('Med', () => assertEq(Engine.MedMgmt({ t: 'lithium' }).plan, 'lithium-monitoring'));
it('Th', () => assertEq(Engine.Therapy({ t: 'CBT' }).plan, 'CBT-referral'));
it('Res', () => assertEq(Engine.Restraint({ t: 'violent' }).plan, 'violent-restraint-protocol'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
