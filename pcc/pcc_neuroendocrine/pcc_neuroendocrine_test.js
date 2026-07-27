// P3-EE pcc_neuroendocrine unit tests
const Engine = require('./pcc_neuroendocrine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuroendocrine engine tests:');
it('PituitaryAdenomaWorkup', () => assertEq(Engine.PituitaryAdenomaWorkup({ t: 'yes' }).plan, 'pituitaryAdenomaWorkup-protocol'));
it('CushingSyndromeDiagnosis', () => assertEq(Engine.CushingSyndromeDiagnosis({ t: 'yes' }).plan, 'cushingSyndromeDiagnosis-protocol'));
it('AddisonDiseaseCrisis', () => assertEq(Engine.AddisonDiseaseCrisis({ t: 'yes' }).plan, 'addisonDiseaseCrisis-protocol'));
it('AcromegalyManagement', () => assertEq(Engine.AcromegalyManagement({ t: 'yes' }).plan, 'acromegalyManagement-protocol'));
it('ProlactinomaTreatment', () => assertEq(Engine.ProlactinomaTreatment({ t: 'yes' }).plan, 'prolactinomaTreatment-protocol'));
it('HypopituitarismEvaluation', () => assertEq(Engine.HypopituitarismEvaluation({ t: 'yes' }).plan, 'hypopituitarismEvaluation-protocol'));
it('PheochromocytomaWorkup', () => assertEq(Engine.PheochromocytomaWorkup({ t: 'yes' }).plan, 'pheochromocytomaWorkup-protocol'));
it('MultipleEndocrineNeoplasia', () => assertEq(Engine.MultipleEndocrineNeoplasia({ t: 'yes' }).plan, 'multipleEndocrineNeoplasia-protocol'));
it('CarcinoidSyndrome', () => assertEq(Engine.CarcinoidSyndrome({ t: 'yes' }).plan, 'carcinoidSyndrome-protocol'));
it('HypothalamicHamartoma', () => assertEq(Engine.HypothalamicHamartoma({ t: 'yes' }).plan, 'hypothalamicHamartoma-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
