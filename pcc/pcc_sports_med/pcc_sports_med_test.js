// P3-CV pcc_sports_med unit tests
const Engine = require('./pcc_sports_med_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_sports_med engine tests:');
it('Inj', () => assertEq(Engine.Injury({ t: 'acl' }).plan, 'acl-evaluation'));
it('Rtp', () => assertEq(Engine.ReturnToPlay({ s: 70 }).plan, 'rtp-pending'));
it('Con', () => assertEq(Engine.Concussion({ t: 'grade1' }).plan, 'concussion-grade1'));
it('Car', () => assertEq(Engine.CardiacScreen({ t: 'risk' }).plan, 'cardiac-risk-refer'));
it('Hyd', () => assertEq(Engine.Hydration({ t: 'low' }).plan, 'hydration-protocol'));
it('Hea', () => assertEq(Engine.Heat({ t: 'exhaustion' }).plan, 'heat-exhaustion-protocol'));
it('Ovr', () => assertEq(Engine.Overuse({ t: 'stress' }).plan, 'stress-injury-rest'));
it('Dop', () => assertEq(Engine.Doping({ t: 'suspected' }).plan, 'anti-doping-referral'));
it('Nut', () => assertEq(Engine.Nutrition({ t: 'deficit' }).plan, 'sports-nutrition-plan'));
it('Img', () => assertEq(Engine.Imaging({ t: 'mri' }).plan, 'mri-indicated'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
