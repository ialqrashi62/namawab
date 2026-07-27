// P3-CL pcc_cardio_ext4 unit tests
const Engine = require('./pcc_cardio_ext4_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_cardio_ext4 engine tests:');
it('RS', () => assertEq(Engine.RiskStratification({ r: 150 }).plan, 'very-high-risk'));
it('ACS', () => assertEq(Engine.ACS({ t: 'STEMI' }).plan, 'STEMI-activation'));
it('HF', () => assertEq(Engine.HeartFailure({ nyha: 4 }).plan, 'NYHA-IV-severe'));
it('Arr', () => assertEq(Engine.Arrhythmia({ t: 'VT' }).plan, 'ventricular-tachycardia'));
it('Val', () => assertEq(Engine.Valvular({ t: 'AS' }).plan, 'aortic-stenosis'));
it('HTN', () => assertEq(Engine.Hypertension({ sbp: 200 }).plan, 'hypertensive-crisis'));
it('Lip', () => assertEq(Engine.Lipid({ ldl: 200 }).plan, 'severe-hypercholesterolemia'));
it('AC', () => assertEq(Engine.Anticoag({ t: 'warfarin' }).plan, 'warfarin-INR-monitor'));
it('CV', () => assertEq(Engine.Cardioversion({ t: 'electrical' }).plan, 'electrical-cardioversion'));
it('Ech', () => assertEq(Engine.Echo({ ef: 25 }).plan, 'HFrEF'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
