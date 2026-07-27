// P3-CQ pcc_diet_nutr unit tests
const Engine = require('./pcc_diet_nutr_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_diet_nutr engine tests:');
it('Bmi', () => assertEq(Engine.Bmi({ v: 42 }).plan, 'class-III-obese'));
it('Tpn', () => assertEq(Engine.Tpn({ t: 'initiating' }).plan, 'TPN-initiating'));
it('Diet', () => assertEq(Engine.Diet({ t: 'cardiac' }).plan, 'cardiac-diet'));
it('Tbe', () => assertEq(Engine.Tube({ t: 'NG' }).plan, 'NG-feeding'));
it('Sup', () => assertEq(Engine.Supplement({ t: 'PO' }).plan, 'PO-supplement'));
it('Mal', () => assertEq(Engine.Malnutrition({ t: 'severe' }).plan, 'severe-malnutrition'));
it('Int', () => assertEq(Engine.Intolerance({ t: 'lactose' }).plan, 'lactose-intolerance'));
it('Asp', () => assertEq(Engine.Aspiration({ t: 'high-risk' }).plan, 'aspiration-risk'));
it('Ref', () => assertEq(Engine.Refeeding({ t: 'high-risk' }).plan, 'refeeding-syndrome-risk'));
it('Alg', () => assertEq(Engine.Allerg({ t: 'milk' }).plan, 'milk-allergy'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
