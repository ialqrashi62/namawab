// P3-CR pcc_surgical_checklist unit tests
const Engine = require('./pcc_surgical_checklist_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_surgical_checklist engine tests:');
it('Si', () => assertEq(Engine.SignIn({ c: 'yes' }).plan, 'sign-in-completed'));
it('To', () => assertEq(Engine.TimeOut({ c: 'completed' }).plan, 'timeout-completed'));
it('So', () => assertEq(Engine.SignOut({ c: 'completed' }).plan, 'signout-completed'));
it('SM', () => assertEq(Engine.SiteMark({ m: 'marked' }).plan, 'site-marked'));
it('AC', () => assertEq(Engine.AllergyCheck({ c: 'verified' }).plan, 'allergy-verified'));
it('AB', () => assertEq(Engine.AntibioConfirm({ c: 'given' }).plan, 'antibiotic-given'));
it('IC', () => assertEq(Engine.ImplantConfirm({ c: 'verified' }).plan, 'implant-verified'));
it('CF', () => assertEq(Engine.CountsFinal({ c: 'correct' }).plan, 'counts-correct'));
it('SC', () => assertEq(Engine.SpecimenConfirm({ c: 'labeled' }).plan, 'specimen-labeled'));
it('Re', () => assertEq(Engine.Recovery({ t: 'transferred' }).plan, 'transferred-to-PACU'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
