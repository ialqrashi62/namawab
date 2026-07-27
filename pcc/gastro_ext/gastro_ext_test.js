// P3-BN gastro_ext unit tests
const Engine = require('./gastro_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('gastro_ext engine tests:');
it('IBS', () => {
  const r = Engine.IBS({ subtype: 'diarrhea', alarm: 'no' });
  assertEq(r.plan, 'antispasmodic-and-loperamide');
});
it('IBD', () => {
  const r = Engine.IBD({ activity: 'moderate', location: 'colon' });
  assertEq(r.plan, 'biologic-and-5-ASA');
});
it('Lesion', () => {
  const r = Engine.LiverLesion({ size: 6, features: 'malignant' });
  assertEq(r.plan, 'multidisciplinary-and-resection');
});
it('Cirrh', () => {
  const r = Engine.Cirrhosis({ childPugh: 'B', meld: 13 });
  assertEq(r.plan, 'transplant-workup');
});
it('HepB', () => {
  const r = Engine.HepB({ hbeAg: 'positive', alt: 80, viralLoad: 1000 });
  assertEq(r.plan, 'antiviral-and-monitor');
});
it('HepC', () => {
  const r = Engine.HepC({ genotype: '1', fibrosis: 'F3' });
  assertEq(r.plan, 'DAA-and-treatment');
});
it('PUD', () => {
  const r = Engine.PUD({ hPylori: 'yes', bleed: 'no' });
  assertEq(r.plan, 'triple-therapy-and-PPI');
});
it('GERD', () => {
  const r = Engine.GERD({ alarm: 'no', response: 'partial' });
  assertEq(r.plan, 'step-up-PPI');
});
it('Panc', () => {
  const r = Engine.Pancreatitis({ severity: 'severe', cause: 'alcohol' });
  assertEq(r.plan, 'ICU-and-fluid-resuscitation');
});
it('CRC', () => {
  const r = Engine.ColonCancer({ stage: 'IV', msi: 'high' });
  assertEq(r.plan, 'immunotherapy');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
