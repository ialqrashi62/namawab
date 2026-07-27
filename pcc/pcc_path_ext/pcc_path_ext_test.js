// P3-CI pcc_path_ext unit tests
const Engine = require('./pcc_path_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_path_ext engine tests:');
it('SpT', () => assertEq(Engine.SpecimenType({ t: 'tissue' }).plan, 'tissue-path'));
it('Grs', () => assertEq(Engine.Grossing({ t: 'urgent' }).plan, 'intraoperative-frozen'));
it('Emb', () => assertEq(Engine.Embedding({ m: 'plastic' }).plan, 'plastic-embed'));
it('Stn', () => assertEq(Engine.Stain({ t: 'IHC' }).plan, 'immunohistochemistry'));
it('Diag', () => assertEq(Engine.Diagnosis({ m: 'malignant' }).plan, 'malignant-diagnosis'));
it('Mar', () => assertEq(Engine.Margin({ s: 'positive' }).plan, 'positive-margin-re-excision'));
it('Stg', () => assertEq(Engine.Stage({ n: 3 }).plan, 'high-stage'));
it('Grd', () => assertEq(Engine.Grade({ g: 4 }).plan, 'high-grade'));
it('TNM', () => assertEq(Engine.Tnm({ s: 'IV' }).plan, 'TNM-Stage-IV'));
it('Mol', () => assertEq(Engine.Molecular({ t: 'NGS' }).plan, 'NGS-panel'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
