// P3-CP pcc_pall_ext3 unit tests
const Engine = require('./pcc_pall_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_pall_ext3 engine tests:');
it('Pn', () => assertEq(Engine.PainMng({ n: 8 }).plan, 'severe-pain-mixed'));
it('Dy', () => assertEq(Engine.Dyspnea({ t: 'refractory' }).plan, 'refractory-dyspnea-morphine'));
it('Na', () => assertEq(Engine.Nausea({ s: 'refractory' }).plan, 'refractory-ponv-mixed'));
it('Cn', () => assertEq(Engine.Constipation({ t: 'opioid' }).plan, 'opioid-bowel'));
it('Dl', () => assertEq(Engine.Delirium({ t: 'terminal' }).plan, 'terminal-restlessness'));
it('Ax', () => assertEq(Engine.Anxietyp({ t: 'existential' }).plan, 'existential-distress'));
it('Hs', () => assertEq(Engine.Hospice({ t: 'eligible' }).plan, 'hospice-eligibility'));
it('Ad', () => assertEq(Engine.Advance({ t: 'DNR' }).plan, 'DNR-ocumented'));
it('Fm', () => assertEq(Engine.Family({ t: 'goals' }).plan, 'goals-of-care-meeting'));
it('Gr', () => assertEq(Engine.Grief({ t: 'anticipatory' }).plan, 'anticipatory-grief'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
