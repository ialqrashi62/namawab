// P3-CS pcc_stroke_path unit tests
const Engine = require('./pcc_stroke_path_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_stroke_path engine tests:');
it('Ni', () => assertEq(Engine.Nihss({ s: 18 }).plan, 'severe-stroke'));
it('Im', () => assertEq(Engine.Imaging({ t: 'CT' }).plan, 'CT-stat'));
it('Tp', () => assertEq(Engine.Tpa({ t: 'eligible' }).plan, 'tPA-eligible'));
it('Th', () => assertEq(Engine.Thrombectomy({ t: 'LVO' }).plan, 'LVO-thrombectomy'));
it('Co', () => assertEq(Engine.Consent({ t: 'obtained' }).plan, 'consent-obtained'));
it('Bp', () => assertEq(Engine.BpTarget({ sbp: 200 }).plan, 'BP-allowed-elevated'));
it('Ni2', () => assertEq(Engine.NihssFollowup({ s: 3 }).plan, 'improved-NIHSS'));
it('Ho', () => assertEq(Engine.Hemorrhage({ t: 'symptomatic' }).plan, 'symptomatic-ICH'));
it('SW', () => assertEq(Engine.Swallow({ t: 'failed' }).plan, 'failed-swallow-screen'));
it('Tr', () => assertEq(Engine.Transfer({ t: 'ICU' }).plan, 'ICU-transfer'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
