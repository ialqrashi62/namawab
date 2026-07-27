// P3-CV pcc_pain_mgmt unit tests
const Engine = require('./pcc_pain_mgmt_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_pain_mgmt engine tests:');
it('Nrs', () => assertEq(Engine.Nrs({ s: 8 }).plan, 'pain-severe'));
it('Risk', () => assertEq(Engine.OpioidRisk({ t: 'high' }).plan, 'risk-high-monitor'));
it('Adj', () => assertEq(Engine.Adjuvant({ t: 'neuropathic' }).plan, 'gabapentinoid-adjuvant'));
it('Brk', () => assertEq(Engine.Breakthrough({ t: 'yes' }).plan, 'rescue-dose-plan'));
it('Bow', () => assertEq(Engine.Bowel({ t: 'constipation' }).plan, 'opioid-constipation-protocol'));
it('Sed', () => assertEq(Engine.Sedation({ t: 'yes' }).plan, 'sedation-monitor'));
it('Nau', () => assertEq(Engine.Nausea({ t: 'yes' }).plan, 'antiemetic-protocol'));
it('Itc', () => assertEq(Engine.Itch({ t: 'yes' }).plan, 'antipruritic-protocol'));
it('Res', () => assertEq(Engine.Respiratory({ t: 'depressed' }).plan, 'respiratory-depression-watch'));
it('Uri', () => assertEq(Engine.Urinary({ t: 'retention' }).plan, 'urinary-retention-protocol'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
