// P3-CL pcc_derma_ext3 unit tests
const Engine = require('./pcc_derma_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_derma_ext3 engine tests:');
it('Ls', () => assertEq(Engine.Lesion({ t: 'suspicious' }).plan, 'suspicious-biopsy'));
it('Rsh', () => assertEq(Engine.Rash({ t: 'urticaria' }).plan, 'urticaria-treatment'));
it('Brn', () => assertEq(Engine.Burn({ tbsa: 25 }).plan, 'major-burn-center'));
it('Mel', () => assertEq(Engine.Melanoma({ s: 'T4' }).plan, 'melanoma-T4'));
it('Pso', () => assertEq(Engine.Psoriasis({ s: 25 }).plan, 'severe-psoriasis'));
it('Acn', () => assertEq(Engine.Acne({ s: 'severe' }).plan, 'severe-acne-isotretinoin'));
it('Ulc', () => assertEq(Engine.Ulcer({ t: 'venous' }).plan, 'venous-stasis-ulcer'));
it('Mhs', () => assertEq(Engine.Mohs({ t: 'yes' }).plan, 'Mohs-surgery'));
it('Drm', () => assertEq(Engine.Dermoscopy({ t: 'malignant' }).plan, 'suspicious-dermoscopy'));
it('Ptc', () => assertEq(Engine.Patch({ t: 'positive' }).plan, 'positive-allergen'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
