// P3-EN pcc_neuro_ext5 unit tests
const Engine = require('./pcc_neuro_ext5_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext5 engine tests:');
it('NeurofibromatosisEval', () => assertEq(Engine.NeurofibromatosisEval({ t: 'yes' }).plan, 'neurofibromatosisEval-protocol'));
it('TuberousSclerosisComplex', () => assertEq(Engine.TuberousSclerosisComplex({ t: 'yes' }).plan, 'tuberousSclerosisComplex-protocol'));
it('SturgeWeberSyndrome', () => assertEq(Engine.SturgeWeberSyndrome({ t: 'yes' }).plan, 'sturgeWeberSyndrome-protocol'));
it('AtaxiaTelangiectasia', () => assertEq(Engine.AtaxiaTelangiectasia({ t: 'yes' }).plan, 'ataxiaTelangiectasia-protocol'));
it('VonHippelLindau', () => assertEq(Engine.VonHippelLindau({ t: 'yes' }).plan, 'vonHippelLindau-protocol'));
it('HuntingtonDisease', () => assertEq(Engine.HuntingtonDisease({ t: 'yes' }).plan, 'huntingtonDisease-protocol'));
it('SpinocerebellarAtaxia', () => assertEq(Engine.SpinocerebellarAtaxia({ t: 'yes' }).plan, 'spinocerebellarAtaxia-protocol'));
it('FriedreichAtaxia', () => assertEq(Engine.FriedreichAtaxia({ t: 'yes' }).plan, 'friedreichAtaxia-protocol'));
it('WilsonDisease', () => assertEq(Engine.WilsonDisease({ t: 'yes' }).plan, 'wilsonDisease-protocol'));
it('PantothenateKinase', () => assertEq(Engine.PantothenateKinase({ t: 'yes' }).plan, 'pantothenateKinase-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
