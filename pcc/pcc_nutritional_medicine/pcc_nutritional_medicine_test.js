// P3-DE pcc_nutritional_medicine unit tests
const Engine = require('./pcc_nutritional_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_nutritional_medicine engine tests:');
it('MacronutrientBalance', () => assertEq(Engine.MacronutrientBalance({ t: 'yes' }).plan, 'macronutrientbalance-protocol'));
it('MicronutrientStatus', () => assertEq(Engine.MicronutrientStatus({ t: 'yes' }).plan, 'micronutrientstatus-protocol'));
it('TherapeuticDiet', () => assertEq(Engine.TherapeuticDiet({ t: 'yes' }).plan, 'therapeuticdiet-protocol'));
it('EnteralNutrition', () => assertEq(Engine.EnteralNutrition({ t: 'yes' }).plan, 'enteralnutrition-protocol'));
it('ParenteralNutrition', () => assertEq(Engine.ParenteralNutrition({ t: 'yes' }).plan, 'parenteralnutrition-protocol'));
it('MalnutritionScreen', () => assertEq(Engine.MalnutritionScreen({ t: 'yes' }).plan, 'malnutritionscreen-protocol'));
it('FoodAllergy', () => assertEq(Engine.FoodAllergy({ t: 'yes' }).plan, 'foodallergy-protocol'));
it('EatingDisorder', () => assertEq(Engine.EatingDisorder({ t: 'yes' }).plan, 'eatingdisorder-protocol'));
it('SportsNutrition', () => assertEq(Engine.SportsNutrition({ t: 'yes' }).plan, 'sportsnutrition-protocol'));
it('CancerNutrition', () => assertEq(Engine.CancerNutrition({ t: 'yes' }).plan, 'cancernutrition-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
