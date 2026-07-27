// P3-CW pcc_allergy_immunology unit tests
const Engine = require('./pcc_allergy_immunology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_allergy_immunology engine tests:');
it('Ige', () => assertEq(Engine.Ige({ t: 'yes' }).plan, 'ige-protocol'));
it('SkinTest', () => assertEq(Engine.SkinTest({ t: 'yes' }).plan, 'skintest-protocol'));
it('Anaphylaxis', () => assertEq(Engine.Anaphylaxis({ t: 'yes' }).plan, 'anaphylaxis-protocol'));
it('Desensitization', () => assertEq(Engine.Desensitization({ t: 'yes' }).plan, 'desensitization-protocol'));
it('FoodAllergy', () => assertEq(Engine.FoodAllergy({ t: 'yes' }).plan, 'foodallergy-protocol'));
it('DrugAllergy', () => assertEq(Engine.DrugAllergy({ t: 'yes' }).plan, 'drugallergy-protocol'));
it('InsectAllergy', () => assertEq(Engine.InsectAllergy({ t: 'yes' }).plan, 'insectallergy-protocol'));
it('AsthmaAllergy', () => assertEq(Engine.AsthmaAllergy({ t: 'yes' }).plan, 'asthmaallergy-protocol'));
it('Immunodeficiency', () => assertEq(Engine.Immunodeficiency({ t: 'yes' }).plan, 'immunodeficiency-protocol'));
it('Biologic', () => assertEq(Engine.Biologic({ t: 'yes' }).plan, 'biologic-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
