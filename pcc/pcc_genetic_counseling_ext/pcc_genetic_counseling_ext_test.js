// P3-EA pcc_genetic_counseling_ext unit tests
const Engine = require('./pcc_genetic_counseling_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_genetic_counseling_ext engine tests:');
it('HereditaryCancerSyndromeAssessment', () => assertEq(Engine.HereditaryCancerSyndromeAssessment({ t: 'yes' }).plan, 'hereditaryCancerSyndromeAssessment-protocol'));
it('BRCA1BRCA2RiskModel', () => assertEq(Engine.BRCA1BRCA2RiskModel({ t: 'yes' }).plan, 'bRCA1BRCA2RiskModel-protocol'));
it('LynchSyndromeScreen', () => assertEq(Engine.LynchSyndromeScreen({ t: 'yes' }).plan, 'lynchSyndromeScreen-protocol'));
it('FamilialHypercholesterolemia', () => assertEq(Engine.FamilialHypercholesterolemia({ t: 'yes' }).plan, 'familialHypercholesterolemia-protocol'));
it('PrenatalGeneticScreening', () => assertEq(Engine.PrenatalGeneticScreening({ t: 'yes' }).plan, 'prenatalGeneticScreening-protocol'));
it('PreImplantationCounseling', () => assertEq(Engine.PreImplantationCounseling({ t: 'yes' }).plan, 'preImplantationCounseling-protocol'));
it('PharmacogenomicInterpretation', () => assertEq(Engine.PharmacogenomicInterpretation({ t: 'yes' }).plan, 'pharmacogenomicInterpretation-protocol'));
it('CascadeFamilyScreening', () => assertEq(Engine.CascadeFamilyScreening({ t: 'yes' }).plan, 'cascadeFamilyScreening-protocol'));
it('VariantReclassification', () => assertEq(Engine.VariantReclassification({ t: 'yes' }).plan, 'variantReclassification-protocol'));
it('ReproductiveGeneticOptions', () => assertEq(Engine.ReproductiveGeneticOptions({ t: 'yes' }).plan, 'reproductiveGeneticOptions-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
