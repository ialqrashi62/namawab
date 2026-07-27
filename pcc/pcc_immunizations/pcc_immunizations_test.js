// P3-CU pcc_immunizations unit tests
const Engine = require('./pcc_immunizations_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_immunizations engine tests:');
it('Imm', () => assertEq(Engine.Immunization({ t: 'covid' }).plan, 'covid-vaccine'));
it('Sch', () => assertEq(Engine.Schedule({ a: 10 }).plan, 'pediatric-schedule'));
it('Cat', () => assertEq(Engine.Catchup({ t: 'needed' }).plan, 'catchup-needed'));
it('Alg', () => assertEq(Engine.AllergyToVaccine({ t: 'severe' }).plan, 'severe-vaccine-allergy'));
it('Cns', () => assertEq(Engine.Consent({ t: 'obtained' }).plan, 'vaccine-consent'));
it('Lot', () => assertEq(Engine.LotNumber({ t: 'recorded' }).plan, 'lot-recorded'));
it('Sit', () => assertEq(Engine.Site({ t: 'IM' }).plan, 'IM-deltoid'));
it('Adr', () => assertEq(Engine.Adrs({ t: 'severe' }).plan, 'severe-ADR'));
it('Prg', () => assertEq(Engine.Pregnancy({ t: 'pregnant' }).plan, 'pregnant-considerations'));
it('Tit', () => assertEq(Engine.Titer({ t: 'immune' }).plan, 'titer-immune'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
