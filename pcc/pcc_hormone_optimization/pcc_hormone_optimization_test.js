// P3-DG pcc_hormone_optimization unit tests
const Engine = require('./pcc_hormone_optimization_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_hormone_optimization engine tests:');
it('TestosteroneBalance', () => assertEq(Engine.TestosteroneBalance({ t: 'yes' }).plan, 'testosteronebalance-protocol'));
it('EstrogenMetabolism', () => assertEq(Engine.EstrogenMetabolism({ t: 'yes' }).plan, 'estrogenmetabolism-protocol'));
it('ProgesteroneSupport', () => assertEq(Engine.ProgesteroneSupport({ t: 'yes' }).plan, 'progesteronesupport-protocol'));
it('CortisolRhythm', () => assertEq(Engine.CortisolRhythm({ t: 'yes' }).plan, 'cortisolrhythm-protocol'));
it('GrowthHormone', () => assertEq(Engine.GrowthHormone({ t: 'yes' }).plan, 'growthhormone-protocol'));
it('DHEAOptimization', () => assertEq(Engine.DHEAOptimization({ t: 'yes' }).plan, 'dheaoptimization-protocol'));
it('Pregnenolone', () => assertEq(Engine.Pregnenolone({ t: 'yes' }).plan, 'pregnenolone-protocol'));
it('MelatoninRhythm', () => assertEq(Engine.MelatoninRhythm({ t: 'yes' }).plan, 'melatoninrhythm-protocol'));
it('ThyroidHormone', () => assertEq(Engine.ThyroidHormone({ t: 'yes' }).plan, 'thyroidhormone-protocol'));
it('HormoneSafety', () => assertEq(Engine.HormoneSafety({ t: 'yes' }).plan, 'hormonesafety-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
