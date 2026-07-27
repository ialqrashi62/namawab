// P3-CM pcc_endo_ext3 unit tests
const Engine = require('./pcc_endo_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_endo_ext3 engine tests:');
it('DMT', () => assertEq(Engine.DmType({ t: 'T1DM' }).plan, 'T1DM-insulin'));
it('A1c', () => assertEq(Engine.A1c({ v: 11 }).plan, 'A1c-very-poor'));
it('Thy', () => assertEq(Engine.Thyroid({ t: 'hyperthyroid' }).plan, 'hyperthyroid-methimazole'));
it('Ca', () => assertEq(Engine.Calcium({ v: 13 }).plan, 'severe-hypercalcemia'));
it('Adr', () => assertEq(Engine.Adrenal({ t: 'cushings' }).plan, 'cushings-workup'));
it('Pit', () => assertEq(Engine.Pituitary({ t: 'prolactinoma' }).plan, 'prolactinoma'));
it('Ost', () => assertEq(Engine.Osteo({ t: -3 }).plan, 'osteoporosis'));
it('PCO', () => assertEq(Engine.Pcos({ t: 'confirmed' }).plan, 'PCOS-management'));
it('DKA', () => assertEq(Engine.Dka({ t: 'severe' }).plan, 'severe-DKA-ICU'));
it('Lip', () => assertEq(Engine.Lipid({ ldl: 200 }).plan, 'severe-hypercholesterolemia'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
