// P3-BZ id_ext2 unit tests
const Engine = require('./id_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('id_ext2 engine tests:');
it('UTI', () => {
  const r = Engine.UTI({ complicated: 'no' });
  assertEq(r.plan, 'nitro-and-oral-ABx');
});
it('Pneu', () => {
  const r = Engine.Pneumonia({ severity: 'severe' });
  assertEq(r.plan, 'ICU-and-IV-ABx');
});
it('SSTI', () => {
  const r = Engine.SSTI({ mrsa: 'yes' });
  assertEq(r.plan, 'vanco-and-eval');
});
it('Cdif', () => {
  const r = Engine.Cdiff({ severe: 'yes' });
  assertEq(r.plan, 'oral-vanco-and-eval');
});
it('Sep', () => {
  const r = Engine.Sepsis({ source: 'unknown', shock: 'yes' });
  assertEq(r.plan, 'norepi-and-1hr-bundle');
});
it('HIV', () => {
  const r = Engine.HIV({ cd4: 200, start: 'no' });
  assertEq(r.plan, 'ART-and-prophylaxis');
});
it('TB', () => {
  const r = Engine.TB({ active: 'yes' });
  assertEq(r.plan, 'RIPE-and-eval');
});
it('HBV', () => {
  const r = Engine.HepB({ chronic: 'yes' });
  assertEq(r.plan, 'antiviral-and-monitor');
});
it('HCV', () => {
  const r = Engine.HepC({ detectable: 'yes' });
  assertEq(r.plan, 'DAA-and-eval');
});
it('Flu', () => {
  const r = Engine.Influenza({ onset: 1 });
  assertEq(r.plan, 'oseltamivir-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
