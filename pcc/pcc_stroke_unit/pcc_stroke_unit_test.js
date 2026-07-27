// P3-DS pcc_stroke_unit unit tests
const Engine = require('./pcc_stroke_unit_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_stroke_unit engine tests:');
it('NIHSS', () => assertEq(Engine.NIHSS({ t: 'yes' }).plan, 'nihss-protocol'));
it('DoorToNeedle', () => assertEq(Engine.DoorToNeedle({ t: 'yes' }).plan, 'doortoneedle-protocol'));
it('tPAContraindications', () => assertEq(Engine.tPAContraindications({ t: 'yes' }).plan, 'tpacontraindications-protocol'));
it('ICHScore', () => assertEq(Engine.ICHScore({ t: 'yes' }).plan, 'ichscore-protocol'));
it('ASPECTS', () => assertEq(Engine.ASPECTS({ t: 'yes' }).plan, 'aspects-protocol'));
it('ABCD2', () => assertEq(Engine.ABCD2({ t: 'yes' }).plan, 'abcd2-protocol'));
it('HASBLED', () => assertEq(Engine.HASBLED({ t: 'yes' }).plan, 'hasbled-protocol'));
it('StrokeSepsisBundle', () => assertEq(Engine.StrokeSepsisBundle({ t: 'yes' }).plan, 'strokesepsisbundle-protocol'));
it('DysphagiaScreen', () => assertEq(Engine.DysphagiaScreen({ t: 'yes' }).plan, 'dysphagiascreen-protocol'));
it('SecondaryPrevention', () => assertEq(Engine.SecondaryPrevention({ t: 'yes' }).plan, 'secondaryprevention-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
