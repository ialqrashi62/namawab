// P3-CE pcc_research unit tests
const Engine = require('./pcc_research_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_research engine tests:');
it('Pro', () => assertEq(Engine.Protocol({ phase: 'III' }).plan, 'phase-III-RCT'));
it('Con', () => assertEq(Engine.Consent({ type: 'pediatric' }).plan, 'pediatric-assent'));
it('IRB', () => assertEq(Engine.IRB({ risk: 'greater' }).plan, 'full-board-review'));
it('Enr', () => assertEq(Engine.Enrollment({ target: 100 }).plan, 'medium-trial'));
it('Adv', () => assertEq(Engine.Adverse({ severity: 'life' }).plan, 'grade-4-AE-susar'));
it('Rand', () => assertEq(Engine.Randomization({ ratio: 'block' }).plan, 'block-randomization'));
it('Bio', () => assertEq(Engine.Biostats({ method: 'regress' }).plan, 'multivariable-regression'));
it('Pub', () => assertEq(Engine.Publication({ target: 'journal' }).plan, 'peer-review-journal'));
it('Fun', () => assertEq(Engine.Funding({ src: 'NIH' }).plan, 'federal-grant'));
it('Dat', () => assertEq(Engine.Dataset({ type: 'limited' }).plan, 'limited-dataset'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
