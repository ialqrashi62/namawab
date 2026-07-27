// P3-DL pcc_nutrition_support unit tests
const Engine = require('./pcc_nutrition_support_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_nutrition_support engine tests:');
it('CaloricTarget', () => assertEq(Engine.CaloricTarget({ t: 'yes' }).plan, 'calorictarget-protocol'));
it('ProteinRequirement', () => assertEq(Engine.ProteinRequirement({ t: 'yes' }).plan, 'proteinrequirement-protocol'));
it('EnteralAccess', () => assertEq(Engine.EnteralAccess({ t: 'yes' }).plan, 'enteralaccess-protocol'));
it('ParenteralIndication', () => assertEq(Engine.ParenteralIndication({ t: 'yes' }).plan, 'parenteralindication-protocol'));
it('RefeedingRisk', () => assertEq(Engine.RefeedingRisk({ t: 'yes' }).plan, 'refeedingrisk-protocol'));
it('GlycemicControlNutrition', () => assertEq(Engine.GlycemicControlNutrition({ t: 'yes' }).plan, 'glycemiccontrolnutrition-protocol'));
it('Immunonutrition', () => assertEq(Engine.Immunonutrition({ t: 'yes' }).plan, 'immunonutrition-protocol'));
it('FluidBalance', () => assertEq(Engine.FluidBalance({ t: 'yes' }).plan, 'fluidbalance-protocol'));
it('MicronutrientRepletion', () => assertEq(Engine.MicronutrientRepletion({ t: 'yes' }).plan, 'micronutrientrepletion-protocol'));
it('NutritionOutcome', () => assertEq(Engine.NutritionOutcome({ t: 'yes' }).plan, 'nutritionoutcome-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
