// P3-CB pcc_analytics unit tests
const Engine = require('./pcc_analytics_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_analytics engine tests:');
it('Agg', () => {
  const r = Engine.Aggregate({ type: 'sum' });
  assertEq(r.plan, 'agg-sum');
});
it('Group', () => {
  const r = Engine.Group({ field: 'tenant' });
  assertEq(r.plan, 'group-by-tenant');
});
it('Trend', () => {
  const r = Engine.Trend({ days: 400 });
  assertEq(r.plan, 'trend-yearly');
});
it('Anom', () => {
  const r = Engine.Anomaly({ score: 4 });
  assertEq(r.plan, 'anomaly-high');
});
it('Cohort', () => {
  const r = Engine.Cohort({ size: 200 });
  assertEq(r.plan, 'cohort-large');
});
it('Fun', () => {
  const r = Engine.Funnel({ step: 6 });
  assertEq(r.plan, 'funnel-bottom');
});
it('Ret', () => {
  const r = Engine.Retention({ days: 100 });
  assertEq(r.plan, 'high-retention');
});
it('Conv', () => {
  const r = Engine.Conversion({ rate: 85 });
  assertEq(r.plan, 'high-conversion');
});
it('KPI', () => {
  const r = Engine.KPI({ target: 100, actual: 110 });
  assertEq(r.plan, 'kpi-met');
});
it('Rep', () => {
  const r = Engine.Report({ type: 'monthly' });
  assertEq(r.plan, 'report-monthly');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
