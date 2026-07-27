// P3-AS: Radiology-Ext unit tests
const Engine = require('./radiology_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('radiology_ext engine tests:');
it('CT midline', () => {
  const r = Engine.CTHeadInterpretation({ midlineShift: 7 });
  assertEq(r.finding, 'significant-midline-shift-neurosurgical-emergent');
});
it('MRI safety', () => {
  const r = Engine.MRISafety({ device: 'pacemaker' });
  assertEq(r.safe, 'MRI-conditional-or-contraindicated');
});
it('Contrast severe', () => {
  const r = Engine.ContrastReaction({ severity: 'severe', symptoms: 'anaphylaxis' });
  assertEq(r.pathway, 'severe-contrast-reaction-treat-and-avoid-future');
});
it('BIRADS 4C', () => {
  const r = Engine.MammographyBIRADS({ calcifications: 'pleomorphic' });
  assertEq(r.category, 'BIRADS-4C-high-suspicion-biopsy');
});
it('CTPA', () => {
  const r = Engine.CTPulmonaryAngiogram({ indication: 'PE-suspected' });
  assertEq(r.interpretation, 'high-sensitivity-CTPA-for-PE');
});
it('PET high', () => {
  const r = Engine.PETCTInterpretation({ suvMax: 6, size: 2 });
  assertEq(r.interpretation, 'highly-suspicious-malignancy');
});
it('MRI stroke', () => {
  const r = Engine.MRIBrainIndication({ indication: 'stroke', gcs: 5 });
  assertEq(r.pathway, 'acute-stroke-CT-first-not-MRI');
});
it('FAST pericardial', () => {
  const r = Engine.UltrasoundFAST({ pericardial: 'yes' });
  assertEq(r.finding, 'pericardial-effusion-emergent');
});
it('XR lobar', () => {
  const r = Engine.XRayChest({ consolidation: 'lobar' });
  assertEq(r.finding, 'lobar-pneumonia');
});
it('Consent high', () => {
  const r = Engine.ProcedureConsent({ procedure: 'surgery', riskLevel: 'high' });
  assertEq(r.requirement, 'informed-consent-attending-and-witness');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
