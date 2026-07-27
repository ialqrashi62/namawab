// P3-AT: Imaging-Molecular unit tests
const Engine = require('./imaging_molecular_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('imaging_molecular engine tests:');
it('PETCT', () => {
  const r = Engine.PETCTReporting({ suvMax: 6, lesionSize: 2 });
  assertEq(r.category, 'PET-positive-likely-malignancy');
});
it('Tracer', () => {
  const r = Engine.MolecularImagingTracer({ tracer: 'DOTATATE' });
  assertEq(r.pathway, 'Ga68-DOTATATE-neuroendocrine-tumor');
});
it('Deauville 4', () => {
  const r = Engine.DeauvilleScore({ residualLesionSUV: 5, mediastinalBloodPool: 2, liverBackground: 3 });
  assertEq(r.score, 'Deauville-4-residual-disease');
});
it('MIBG', () => {
  const r = Engine.MIBGAdrenal({ metanephrine: 300, mibgUptake: 'positive' });
  assertEq(r.diagnosis, 'pheochromocytoma-confirmed');
});
it('MRI SPECT', () => {
  const r = Engine.MRISPECTBrain({ perfusionPattern: 'posterior-deficit', amyloid: 'positive', tau: 'negative' });
  assertEq(r.pattern, 'Alzheimers-disease-pattern');
});
it('Bosniak', () => {
  const r = Engine.MRECist({ mriLesionType: 'minimally-complex', size: 2.5, enhancement: 'mild' });
  assertEq(r.category, 'Bosniak-II-minimally-complex');
});
it('PSMA', () => {
  const r = Engine.PSMAPETProstate({ psa: 25, suvMax: 12 });
  assertEq(r.interpretation, 'high-risk-metastatic-disease');
});
it('DOTATATE', () => {
  const r = Engine.DOTATATENET({ suvMax: 12, ki67: 1 });
  assertEq(r.dotatate, 'DOTATATE-strongly-positive-eligible-for-PRRT');
});
it('Brain PET', () => {
  const r = Engine.MolecularBrainPET({ indication: 'dementia', amyloid: 'positive', tau: 'positive' });
  assertEq(r.diagnosis, 'Alzheimers-disease-confirmed');
});
it('BioDose', () => {
  const r = Engine.ImagingBioDose({ modality: 'CT', ctdivol: 10 });
  assertEq(r.dose.includes('0.14'), true);
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
