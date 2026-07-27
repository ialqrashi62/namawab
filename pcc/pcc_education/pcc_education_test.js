// P3-CE pcc_education unit tests
const Engine = require('./pcc_education_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_education engine tests:');
it('Cur', () => assertEq(Engine.Curriculum({ year: 5 }).plan, 'PGY-5-advanced'));
it('Rot', () => assertEq(Engine.Rotation({ spec: 'icu' }).plan, 'ICU-rotation'));
it('Sim', () => assertEq(Engine.Simulation({ type: 'code' }).plan, 'code-blue-simulation'));
it('Eva', () => assertEq(Engine.Eval({ score: 90 }).plan, 'exceeds-expectations'));
it('Lec', () => assertEq(Engine.Lecture({ dur: 60 }).plan, 'full-lecture'));
it('Bed', () => assertEq(Engine.Bedside({ setting: 'or' }).plan, 'or-handoff'));
it('Cer', () => assertEq(Engine.Cert({ t: 'ACLS' }).plan, 'ACLS-recert'));
it('Fel', () => assertEq(Engine.Fellow({ yr: 3 }).plan, 'senior-fellow'));
it('CEU', () => assertEq(Engine.CEU({ credits: 30 }).plan, 'full-CEU-cycle'));
it('Exa', () => assertEq(Engine.Exam({ type: 'OSCE' }).plan, 'OSCE-stations'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
