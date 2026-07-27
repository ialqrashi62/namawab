// P3-CG pcc_oncology_ext unit tests
const Engine = require('./pcc_oncology_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_oncology_ext engine tests:');
it('Reg', () => assertEq(Engine.Regimen({ t: 'CHOP' }).plan, 'CHOP-lymphoma'));
it('Cyc', () => assertEq(Engine.Cycle({ n: 7 }).plan, 'mid-treatment'));
it('Tox', () => assertEq(Engine.Toxicity({ g: 4 }).plan, 'G4-life-threatening'));
it('Res', () => assertEq(Engine.Response({ r: 'CR' }).plan, 'complete-response'));
it('DR', () => assertEq(Engine.DoseReduction({ pct: 60 }).plan, 'major-reduction'));
it('Hol', () => assertEq(Engine.HoldReason({ t: 'counts' }).plan, 'hold-for-counts'));
it('Bio', () => assertEq(Engine.Biomarker({ m: 'PDL1' }).plan, 'PDL1-IO-eligible'));
it('Sur', () => assertEq(Engine.Survivorship({ yr: 6 }).plan, 'long-term-survivorship'));
it('TB', () => assertEq(Engine.TumorBoard({ pres: 'yes' }).plan, 'tumor-board-reviewed'));
it('Pal', () => assertEq(Engine.Palliative({ d: 'yes' }).plan, 'palliative-referral'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
