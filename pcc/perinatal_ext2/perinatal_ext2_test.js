// P3-BJ perinatal_ext2 unit tests
const Engine = require('./perinatal_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('perinatal_ext2 engine tests:');
it('PE', () => {
  const r = Engine.PreeclampsiaSevere({ sbp: 170, plt: 80, ast: 80, creat: 1.2, ga: 32 });
  assertEq(r.plan, 'severe-PE-and-magnesium-and-delivery-if-stable');
});
it('FGR', () => {
  const r = Engine.FGR({ efwCentile: 5, doppler: 'absent', ga: 30 });
  assertEq(r.plan, 'severe-FGR-and-urgent-delivery');
});
it('GDM', () => {
  const r = Engine.GDM({ fasting: 100, postPrandial: 145, a1c: 5.5 });
  assertEq(r.plan, 'GDM-and-medical-nutrition-and-monitor');
});
it('PTL', () => {
  const r = Engine.PretermLabor({ ga: 30, cx: 5, contractions: 'regular', ffn: 'negative' });
  assertEq(r.plan, 'tocolysis-and-antenatal-steroids');
});
it('PPROM', () => {
  const r = Engine.PPROM({ ga: 30, infection: 'no', latency: 0 });
  assertEq(r.plan, 'antibiotics-and-antenatal-steroids-and-monitor');
});
it('Twin', () => {
  const r = Engine.MultipleGestation({ twins: 'yes', ttts: 'yes', ga: 30 });
  assertEq(r.plan, 'TTTS-and-laser-eval');
});
it('Anemia', () => {
  const r = Engine.AnemiaPregnancy({ hgb: 9, mcv: 85, iron: 'low' });
  assertEq(r.plan, 'iron-IV-and-recheck');
});
it('PPH', () => {
  const r = Engine.PostpartumHemorrhage({ ebl: 800, cause: 'atony', stable: 'yes' });
  assertEq(r.plan, 'uterotonics-and-bakri');
});
it('CX', () => {
  const r = Engine.CervicalInsufficiency({ ga: 18, cxLength: 8, prior: 'yes' });
  assertEq(r.plan, 'cerclage-and-monitor');
});
it('RH', () => {
  const r = Engine.RHisoimmunization({ antibody: 'negative', titer: 0, ga: 30 });
  assertEq(r.plan, 'anti-D-at-28w-and-rogam');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
