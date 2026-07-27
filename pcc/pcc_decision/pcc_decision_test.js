// P3-CC pcc_decision unit tests
const Engine = require('./pcc_decision_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_decision engine tests:');
it('Triage', () => {
  const r = Engine.Triage({ level: 1 });
  assertEq(r.plan, 'resus-immediate');
});
it('Risk', () => {
  const r = Engine.Risk({ score: 90 });
  assertEq(r.plan, 'high-risk');
});
it('Rec', () => {
  const r = Engine.Recommendation({ conf: 0.95 });
  assertEq(r.plan, 'strong-recommend');
});
it('Diff', () => {
  const r = Engine.Differential({ top: 'urgent' });
  assertEq(r.plan, 'rule-out-emergency');
});
it('Path', () => {
  const r = Engine.Path({ step: 6 });
  assertEq(r.plan, 'long-path');
});
it('Sev', () => {
  const r = Engine.Severity({ sev: 'severe' });
  assertEq(r.plan, 'urgent-care');
});
it('Out', () => {
  const r = Engine.Outcome({ prob: 0.9 });
  assertEq(r.plan, 'likely-favorable');
});
it('FU', () => {
  const r = Engine.FollowUp({ urgency: '24h' });
  assertEq(r.plan, 'follow-up-24h');
});
it('Test', () => {
  const r = Engine.Test({ type: 'imaging' });
  assertEq(r.plan, 'order-imaging');
});
it('Ther', () => {
  const r = Engine.Therapy({ type: 'surgical' });
  assertEq(r.plan, 'schedule-surgery');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
