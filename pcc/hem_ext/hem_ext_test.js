// P3-BM hem_ext unit tests
const Engine = require('./hem_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('hem_ext engine tests:');
it('Anemia', () => {
  const r = Engine.AnemiaWorkup({ mcv: 75, retic: 1, ferritin: 20 });
  assertEq(r.plan, 'iron-deficiency-and-treat-cause');
});
it('Sickle', () => {
  const r = Engine.SickleCell({ crisis: 'acute-chest', hgb: 6, trigger: 'none' });
  assertEq(r.plan, 'transfuse-and-antibiotics');
});
it('DVT', () => {
  const r = Engine.DVT({ wells: 4, dDimer: 'elevated' });
  assertEq(r.plan, 'anticoagulate-and-eval');
});
it('AC', () => {
  const r = Engine.AnticoagClinic({ drug: 'warfarin', inr: 2.5, indication: 'AF' });
  assertEq(r.plan, 'continue-and-monitor');
});
it('PlT', () => {
  const r = Engine.Thrombocytopenia({ plt: 15, bleeding: 'yes', cause: 'unknown' });
  assertEq(r.plan, 'transfuse-and-IVIG');
});
it('ANC', () => {
  const r = Engine.Neutropenia({ anc: 0.3, fever: 'yes', risk: 'low' });
  assertEq(r.plan, 'empiric-abx-and-admit');
});
it('Trans', () => {
  const r = Engine.Transfusion({ hgb: 6, symptom: 'yes', setting: 'ward' });
  assertEq(r.plan, 'transfuse-1-unit');
});
it('HC', () => {
  const r = Engine.Hypercoagulable({ event: 'recurrent', age: 35, family: 'no' });
  assertEq(r.plan, 'thrombophilia-workup-and-lifelong');
});
it('MM', () => {
  const r = Engine.Myeloma({ criteria: 'CRAB', calcium: 11, cr: 2.5 });
  assertEq(r.plan, 'urgent-eval-and-treatment');
});
it('Bleed', () => {
  const r = Engine.BleedingDiath({ ptt: 30, bleeding: 'yes', family: 'yes' });
  assertEq(r.plan, 'vWD-workup');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
