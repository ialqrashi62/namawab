// P3-DF pcc_allergy_precision unit tests
const Engine = require('./pcc_allergy_precision_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_allergy_precision engine tests:');
it('AllergenComponent', () => assertEq(Engine.AllergenComponent({ t: 'yes' }).plan, 'allergencomponent-protocol'));
it('CrossReactivity', () => assertEq(Engine.CrossReactivity({ t: 'yes' }).plan, 'crossreactivity-protocol'));
it('OralAllergy', () => assertEq(Engine.OralAllergy({ t: 'yes' }).plan, 'oralallergy-protocol'));
it('DrugAllergyGenetics', () => assertEq(Engine.DrugAllergyGenetics({ t: 'yes' }).plan, 'drugallergygenetics-protocol'));
it('VenomAllergy', () => assertEq(Engine.VenomAllergy({ t: 'yes' }).plan, 'venomallergy-protocol'));
it('AtopicDermatitis', () => assertEq(Engine.AtopicDermatitis({ t: 'yes' }).plan, 'atopicdermatitis-protocol'));
it('AllergicRhinitis', () => assertEq(Engine.AllergicRhinitis({ t: 'yes' }).plan, 'allergicrhinitis-protocol'));
it('AsthmaAllergy', () => assertEq(Engine.AsthmaAllergy({ t: 'yes' }).plan, 'asthmaallergy-protocol'));
it('FoodChallenge', () => assertEq(Engine.FoodChallenge({ t: 'yes' }).plan, 'foodchallenge-protocol'));
it('Desensitization', () => assertEq(Engine.Desensitization({ t: 'yes' }).plan, 'desensitization-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
