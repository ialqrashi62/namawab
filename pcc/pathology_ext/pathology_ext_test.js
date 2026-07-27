// P3-BR pathology_ext unit tests
const Engine = require('./pathology_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pathology_ext engine tests:');
it('Biopsy', () => {
  const r = Engine.Biopsy({ type: 'tissue', site: 'skin' });
  assertEq(r.plan, 'shave-or-punch-and-eval');
});
it('Frozen', () => {
  const r = Engine.Frozen({ intraop: 'yes' });
  assertEq(r.plan, 'frozen-section-and-eval');
});
it('IHC', () => {
  const r = Engine.ImmunoHisto({ marker: 'ER', tissue: 'breast' });
  assertEq(r.plan, 'ER-PR-Her2-and-eval');
});
it('Molec', () => {
  const r = Engine.Molecular({ test: 'NGS', disease: 'cancer' });
  assertEq(r.plan, 'NGS-panel-and-treatment');
});
it('Cyto', () => {
  const r = Engine.Cyto({ type: 'FNA-thyroid' });
  assertEq(r.plan, 'Bethesda-and-eval');
});
it('Hemato', () => {
  const r = Engine.HematoPath({ test: 'leukemia' });
  assertEq(r.plan, 'flow-and-marrow-eval');
});
it('Surg', () => {
  const r = Engine.Surgical({ specimen: 'colon' });
  assertEq(r.plan, 'gross-and-margins');
});
it('Aut', () => {
  const r = Engine.Autopsy({ consent: 'yes' });
  assertEq(r.plan, 'full-autopsy-and-report');
});
it('Consult', () => {
  const r = Engine.Consult({ question: 'second-opinion' });
  assertEq(r.plan, 'review-and-typed-report');
});
it('MolDx', () => {
  const r = Engine.MolecularDx({ panel: 'pharmaco' });
  assertEq(r.plan, 'PGx-and-medication-adjust');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
