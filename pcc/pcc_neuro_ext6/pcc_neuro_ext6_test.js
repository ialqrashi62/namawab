// P3-EO pcc_neuro_ext6 unit tests
const Engine = require('./pcc_neuro_ext6_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext6 engine tests:');
it('SpinaBifidaEval', () => assertEq(Engine.SpinaBifidaEval({ t: 'yes' }).plan, 'spinaBifidaEval-protocol'));
it('AnencephalyEval', () => assertEq(Engine.AnencephalyEval({ t: 'yes' }).plan, 'anencephalyEval-protocol'));
it('EncephaloceleEval', () => assertEq(Engine.EncephaloceleEval({ t: 'yes' }).plan, 'encephaloceleEval-protocol'));
it('HoloprosencephalyEval', () => assertEq(Engine.HoloprosencephalyEval({ t: 'yes' }).plan, 'holoprosencephalyEval-protocol'));
it('LissencephalyEval', () => assertEq(Engine.LissencephalyEval({ t: 'yes' }).plan, 'lissencephalyEval-protocol'));
it('PolymicrogyriaEval', () => assertEq(Engine.PolymicrogyriaEval({ t: 'yes' }).plan, 'polymicrogyriaEval-protocol'));
it('SchizencephalyEval', () => assertEq(Engine.SchizencephalyEval({ t: 'yes' }).plan, 'schizencephalyEval-protocol'));
it('PorencephalyEval', () => assertEq(Engine.PorencephalyEval({ t: 'yes' }).plan, 'porencephalyEval-protocol'));
it('HydranencephalyEval', () => assertEq(Engine.HydranencephalyEval({ t: 'yes' }).plan, 'hydranencephalyEval-protocol'));
it('AicardiSyndrome', () => assertEq(Engine.AicardiSyndrome({ t: 'yes' }).plan, 'aicardiSyndrome-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
