// P3-BY sleep_ext2 unit tests
const Engine = require('./sleep_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('sleep_ext2 engine tests:');
it('Ins', () => {
  const r = Engine.Insomnia({ chronic: 'yes' });
  assertEq(r.plan, 'CBT-I-and-eval');
});
it('OSA', () => {
  const r = Engine.OSA({ ahi: 35 });
  assertEq(r.plan, 'CPAP-and-FU');
});
it('RLS', () => {
  const r = Engine.RLS({ ferritin: 30 });
  assertEq(r.plan, 'iron-and-eval');
});
it('Nar', () => {
  const r = Engine.Narcolepsy({ cataplexy: 'yes' });
  assertEq(r.plan, 'modafinil-and-eval');
});
it('Para', () => {
  const r = Engine.Parasomnia({ type: 'REM' });
  assertEq(r.plan, 'clonazepam-and-eval');
});
it('Cir', () => {
  const r = Engine.Circadian({ phase: 'delayed' });
  assertEq(r.plan, 'light-and-melatonin');
});
it('CPAP', () => {
  const r = Engine.CPAP({ adherence: 5 });
  assertEq(r.plan, 'continue-and-FU');
});
it('Day', () => {
  const r = Engine.Daytime({ cause: 'narcolepsy' });
  assertEq(r.plan, 'modafinil-and-eval');
});
it('Pedi', () => {
  const r = Engine.Pediatric({ issue: 'apnea' });
  assertEq(r.plan, 'tonsillectomy-and-eval');
});
it('Stdy', () => {
  const r = Engine.SleepStudy({ type: 'PSG' });
  assertEq(r.plan, 'PSG-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
