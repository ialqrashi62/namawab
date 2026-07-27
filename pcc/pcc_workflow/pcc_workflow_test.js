// P3-CB pcc_workflow unit tests
const Engine = require('./pcc_workflow_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_workflow engine tests:');
it('State', () => {
  const r = Engine.State({ state: 'pending' });
  assertEq(r.plan, 'awaiting-approval');
});
it('Trans', () => {
  const r = Engine.Transition({ from: 'pending', to: 'approved' });
  assertEq(r.plan, 'valid-transition');
});
it('Assign', () => {
  const r = Engine.Assignment({ role: 'doctor' });
  assertEq(r.plan, 'assign-to-doctor');
});
it('Esc', () => {
  const r = Engine.Escalation({ level: 'critical' });
  assertEq(r.plan, 'escalate-immediate');
});
it('Notif', () => {
  const r = Engine.Notify({ channel: 'sms' });
  assertEq(r.plan, 'send-sms');
});
it('Appr', () => {
  const r = Engine.Approval({ level: 'dual' });
  assertEq(r.plan, 'dual-approval');
});
it('Sched', () => {
  const r = Engine.Schedule({ type: 'recurring' });
  assertEq(r.plan, 'cron-schedule');
});
it('Que', () => {
  const r = Engine.Queue({ priority: 'urgent' });
  assertEq(r.plan, 'queue-front');
});
it('Time', () => {
  const r = Engine.Timeout({ hours: 0.5 });
  assertEq(r.plan, 'expire-soon');
});
it('Batch', () => {
  const r = Engine.Batch({ count: 200 });
  assertEq(r.plan, 'batch-large');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
