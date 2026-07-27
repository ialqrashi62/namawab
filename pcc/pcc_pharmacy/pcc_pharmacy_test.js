// P3-CG pcc_pharmacy unit tests
const Engine = require('./pcc_pharmacy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_pharmacy engine tests:');
it('Disp', () => assertEq(Engine.Dispense({ days: 30 }).plan, '30-day-supply'));
it('Int', () => assertEq(Engine.Interaction({ level: 'major' }).plan, 'contraindicated'));
it('All', () => assertEq(Engine.Allergy({ sev: 'anaphylaxis' }).plan, 'absolute-contraindication'));
it('Dose', () => assertEq(Engine.DoseCheck({ crcl: 20 }).plan, 'renal-dose-reduce'));
it('Ref', () => assertEq(Engine.Refill({ cnt: 5 }).plan, '5-refills'));
it('Comp', () => assertEq(Engine.Compounding({ sterile: 'sterile' }).plan, 'sterile-compounding-ISO5'));
it('Nar', () => assertEq(Engine.Narcotic({ sched: 'II' }).plan, 'CII-no-refill'));
it('IV', () => assertEq(Engine.IVAdmixture({ type: 'TPN' }).plan, 'TPN-compound'));
it('For', () => assertEq(Engine.Formulary({ status: 'non-formulary' }).plan, 'non-formulary-PA-required'));
it('Cou', () => assertEq(Engine.Counseling({ lang: 'limited' }).plan, 'interpreter-required'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
