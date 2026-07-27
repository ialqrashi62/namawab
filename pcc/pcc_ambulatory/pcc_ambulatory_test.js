// P3-CT pcc_ambulatory unit tests
const Engine = require('./pcc_ambulatory_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ambulatory engine tests:');
it('V', () => assertEq(Engine.VisitType({ t: 'annual' }).plan, 'annual-wellness'));
it('R', () => assertEq(Engine.Refill({ n: 3 }).plan, 'multi-refill'));
it('W', () => assertEq(Engine.Wellness({ t: 'complete' }).plan, 'wellness-complete'));
it('C', () => assertEq(Engine.ChronicCare({ t: 'controlled' }).plan, 'chronic-controlled'));
it('P', () => assertEq(Engine.Preventive({ t: 'cancer-screen' }).plan, 'cancer-screening'));
it('Im', () => assertEq(Engine.Immunization({ t: 'flu' }).plan, 'flu-vaccine'));
it('Hb', () => assertEq(Engine.HgbA1c({ v: 7 }).plan, 'A1c-controlled'));
it('Bp', () => assertEq(Engine.BpCheck({ s: 130 }).plan, 'stage-1-BP'));
it('Sm', () => assertEq(Engine.Smoking({ t: 'current' }).plan, 'smoking-cessation'));
it('Dr', () => assertEq(Engine.DrVisit({ t: 'follow-up' }).plan, 'follow-up-visit'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
