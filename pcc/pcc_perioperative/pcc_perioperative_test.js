// P3-CH pcc_perioperative unit tests
const Engine = require('./pcc_perioperative_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_perioperative engine tests:');
it('Pre', () => assertEq(Engine.PreopEval({ asa: 'IV' }).plan, 'ASA-IV-complex-preop'));
it('NPO', () => assertEq(Engine.Npo({ t: 'clear' }).plan, 'clear-liquids-2hr'));
it('Meds', () => assertEq(Engine.Meds({ m: 'hold-anticoag' }).plan, 'hold-anticoag'));
it('Hnd', () => assertEq(Engine.Handoff({ t: 'timeout' }).plan, 'surgical-timeout'));
it('SI', () => assertEq(Engine.SignIn({ c: 'yes' }).plan, 'sign-in-confirmed'));
it('TO', () => assertEq(Engine.TimeOut({ c: 'yes' }).plan, 'timeout-completed'));
it('SO', () => assertEq(Engine.SignOut({ c: 'yes' }).plan, 'signout-completed'));
it('Sk', () => assertEq(Engine.SkinPrep({ t: 'iodine' }).plan, 'iodophor-prep'));
it('Nr', () => assertEq(Engine.Normothermia({ c: 35.5 }).plan, 'hypothermic-rewarm'));
it('EBL', () => assertEq(Engine.Ebl({ ml: 1200 }).plan, 'massive-EBL-protocol'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
