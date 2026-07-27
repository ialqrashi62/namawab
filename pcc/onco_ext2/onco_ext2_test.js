// P3-BM onco_ext2 unit tests
const Engine = require('./onco_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('onco_ext2 engine tests:');
it('TNM', () => {
  const r = Engine.TNMStaging({ t: 1, n: 0, m: 0 });
  assertEq(r.plan, 'Stage-I-and-surgery');
});
it('Chemo', () => {
  const r = Engine.ChemoRegimen({ cancer: 'breast', stage: 'III' });
  assertEq(r.plan, 'AC-T-and-trastuzumab');
});
it('Response', () => {
  const r = Engine.TumorResponse({ pre: 10, post: 6 });
  assertEq(r.plan, 'partial-response-and-continue');
});
it('FN', () => {
  const r = Engine.FebrileNeutropenia({ temp: 39, anc: 0.3, risk: 'low' });
  assertEq(r.plan, 'empiric-pip-tazo-and-admit');
});
it('TLS', () => {
  const r = Engine.TumorLysis({ risk: 'high', k: 5, ua: 7 });
  assertEq(r.plan, 'aggressive-hydration-and-rasburicase');
});
it('Emerg', () => {
  const r = Engine.OncEmergency({ syndrome: 'SVC' });
  assertEq(r.plan, 'emergent-radiation-and-stent');
});
it('Surv', () => {
  const r = Engine.Survivorship({ years: 2, primary: 'breast' });
  assertEq(r.plan, 'surveillance-and-hormonal');
});
it('Trial', () => {
  const r = Engine.ClinicalTrial({ phase: 'I', line: 'first' });
  assertEq(r.plan, 'phase-I-eligible');
});
it('IO', () => {
  const r = Engine.Immunotherapy({ cancer: 'lung-NSCLC', pdl1: 60, indication: 'first-line' });
  assertEq(r.plan, 'pembrolizumab-monotherapy');
});
it('Targeted', () => {
  const r = Engine.TargetedTx({ mutation: 'EGFR-mut', cancer: 'lung-NSCLC' });
  assertEq(r.plan, 'osimertinib');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
