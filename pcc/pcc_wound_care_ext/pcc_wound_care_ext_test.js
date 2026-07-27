// P3-CY pcc_wound_care_ext unit tests
const Engine = require('./pcc_wound_care_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_wound_care_ext engine tests:');
it('WoundAssessment', () => assertEq(Engine.WoundAssessment({ t: 'yes' }).plan, 'woundassessment-protocol'));
it('Debridement', () => assertEq(Engine.Debridement({ t: 'yes' }).plan, 'debridement-protocol'));
it('InfectionControl', () => assertEq(Engine.InfectionControl({ t: 'yes' }).plan, 'infectioncontrol-protocol'));
it('Dressing', () => assertEq(Engine.Dressing({ t: 'yes' }).plan, 'dressing-protocol'));
it('PressureInjury', () => assertEq(Engine.PressureInjury({ t: 'yes' }).plan, 'pressureinjury-protocol'));
it('DiabeticFoot', () => assertEq(Engine.DiabeticFoot({ t: 'yes' }).plan, 'diabeticfoot-protocol'));
it('VacTherapy', () => assertEq(Engine.VacTherapy({ t: 'yes' }).plan, 'vactherapy-protocol'));
it('HealingScore', () => assertEq(Engine.HealingScore({ t: 'yes' }).plan, 'healingscore-protocol'));
it('NutritionWound', () => assertEq(Engine.NutritionWound({ t: 'yes' }).plan, 'nutritionwound-protocol'));
it('ScarManagement', () => assertEq(Engine.ScarManagement({ t: 'yes' }).plan, 'scarmanagement-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
