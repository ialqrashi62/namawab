// P3-CD pcc_imaging unit tests
const Engine = require('./pcc_imaging_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_imaging engine tests:');
it('Mod', () => {
  const r = Engine.Modality({ type: 'CT' });
  assertEq(r.plan, 'CT-scan');
});
it('Ind', () => {
  const r = Engine.Indication({ ind: 'PE' });
  assertEq(r.plan, 'CTPA');
});
it('Con', () => {
  const r = Engine.Contrast({ type: 'iodinated', gfr: 80 });
  assertEq(r.plan, 'iodinated-contrast');
});
it('Dose', () => {
  const r = Engine.Dose({ ctdi: 25 });
  assertEq(r.plan, 'high-dose');
});
it('Pro', () => {
  const r = Engine.Protocol({ body: 'head' });
  assertEq(r.plan, 'head-protocol');
});
it('Urg', () => {
  const r = Engine.Urgency({ level: 'stat' });
  assertEq(r.plan, 'stat-protocol');
});
it('Q', () => {
  const r = Engine.Quality({ score: 95 });
  assertEq(r.plan, 'excellent-quality');
});
it('Comp', () => {
  const r = Engine.Comparison({ prior: 'yes' });
  assertEq(r.plan, 'compare-prior');
});
it('FU', () => {
  const r = Engine.FollowUp({ finding: 'worrisome' });
  assertEq(r.plan, 'short-FU');
});
it('Rep', () => {
  const r = Engine.Report({ level: 'critical' });
  assertEq(r.plan, 'critical-findings');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
