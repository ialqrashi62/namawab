// P3-DP pcc_allergy_advanced unit tests
const Engine = require('./pcc_allergy_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_allergy_advanced engine tests:');
it('AnaphylaxisAdvanced', () => assertEq(Engine.AnaphylaxisAdvanced({ t: 'yes' }).plan, 'anaphylaxisadvanced-protocol'));
it('DrugAllergyDelabeling', () => assertEq(Engine.DrugAllergyDelabeling({ t: 'yes' }).plan, 'drugallergydelabeling-protocol'));
it('FoodAllergyOralImmunotherapy', () => assertEq(Engine.FoodAllergyOralImmunotherapy({ t: 'yes' }).plan, 'foodallergyoralimmunotherapy-protocol'));
it('VenomImmunotherapy', () => assertEq(Engine.VenomImmunotherapy({ t: 'yes' }).plan, 'venomimmunotherapy-protocol'));
it('AllergicBronchopulmonaryAspergillosis', () => assertEq(Engine.AllergicBronchopulmonaryAspergillosis({ t: 'yes' }).plan, 'allergicbronchopulmonaryaspergillosis-protocol'));
it('EosinophilicGranulomatosis', () => assertEq(Engine.EosinophilicGranulomatosis({ t: 'yes' }).plan, 'eosinophilicgranulomatosis-protocol'));
it('MastCellActivation', () => assertEq(Engine.MastCellActivation({ t: 'yes' }).plan, 'mastcellactivation-protocol'));
it('ChronicUrticariaRefractory', () => assertEq(Engine.ChronicUrticariaRefractory({ t: 'yes' }).plan, 'chronicurticariarefractory-protocol'));
it('AllergicRhinoconjunctivitisAdvanced', () => assertEq(Engine.AllergicRhinoconjunctivitisAdvanced({ t: 'yes' }).plan, 'allergicrhinoconjunctivitisadvanced-protocol'));
it('ContactDermatitisAdvanced', () => assertEq(Engine.ContactDermatitisAdvanced({ t: 'yes' }).plan, 'contactdermatitisadvanced-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
