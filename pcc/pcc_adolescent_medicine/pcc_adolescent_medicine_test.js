// P3-EE pcc_adolescent_medicine unit tests
const Engine = require('./pcc_adolescent_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_adolescent_medicine engine tests:');
it('EatingDisorderAssessment', () => assertEq(Engine.EatingDisorderAssessment({ t: 'yes' }).plan, 'eatingDisorderAssessment-protocol'));
it('AdolescentDepressionScreen', () => assertEq(Engine.AdolescentDepressionScreen({ t: 'yes' }).plan, 'adolescentDepressionScreen-protocol'));
it('PubertyDisorders', () => assertEq(Engine.PubertyDisorders({ t: 'yes' }).plan, 'pubertyDisorders-protocol'));
it('AdolescentSubstanceUse', () => assertEq(Engine.AdolescentSubstanceUse({ t: 'yes' }).plan, 'adolescentSubstanceUse-protocol'));
it('AdolescentSexualHealth', () => assertEq(Engine.AdolescentSexualHealth({ t: 'yes' }).plan, 'adolescentSexualHealth-protocol'));
it('AdolescentImmunizations', () => assertEq(Engine.AdolescentImmunizations({ t: 'yes' }).plan, 'adolescentImmunizations-protocol'));
it('AdolescentObesity', () => assertEq(Engine.AdolescentObesity({ t: 'yes' }).plan, 'adolescentObesity-protocol'));
it('AdolescentRiskBehavior', () => assertEq(Engine.AdolescentRiskBehavior({ t: 'yes' }).plan, 'adolescentRiskBehavior-protocol'));
it('TransitionToAdultCare', () => assertEq(Engine.TransitionToAdultCare({ t: 'yes' }).plan, 'transitionToAdultCare-protocol'));
it('AdolescentGynecology', () => assertEq(Engine.AdolescentGynecology({ t: 'yes' }).plan, 'adolescentGynecology-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
