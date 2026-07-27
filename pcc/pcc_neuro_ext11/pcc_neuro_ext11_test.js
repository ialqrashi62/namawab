// P3-ET pcc_neuro_ext11 unit tests
const Engine = require('./pcc_neuro_ext11_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext11 engine tests:');
it('DemyelinatingPolyneuropathy', () => assertEq(Engine.DemyelinatingPolyneuropathy({ t: 'yes' }).plan, 'demyelinatingPolyneuropathy-protocol'));
it('CIDPExtEval', () => assertEq(Engine.CIDPExtEval({ t: 'yes' }).plan, 'cIDPExtEval-protocol'));
it('GBSVariantEval', () => assertEq(Engine.GBSVariantEval({ t: 'yes' }).plan, 'gBSVariantEval-protocol'));
it('MillerFisherSyndrome', () => assertEq(Engine.MillerFisherSyndrome({ t: 'yes' }).plan, 'millerFisherSyndrome-protocol'));
it('BickerstaffBrainstemEncephalitis', () => assertEq(Engine.BickerstaffBrainstemEncephalitis({ t: 'yes' }).plan, 'bickerstaffBrainstemEncephalitis-protocol'));
it('AMANEval', () => assertEq(Engine.AMANEval({ t: 'yes' }).plan, 'aMANEval-protocol'));
it('SensoryCIDPEval', () => assertEq(Engine.SensoryCIDPEval({ t: 'yes' }).plan, 'sensoryCIDPEval-protocol'));
it('MotorCIDPEval', () => assertEq(Engine.MotorCIDPEval({ t: 'yes' }).plan, 'motorCIDPEval-protocol'));
it('AutonomicNeuropathyEval', () => assertEq(Engine.AutonomicNeuropathyEval({ t: 'yes' }).plan, 'autonomicNeuropathyEval-protocol'));
it('SmallFiberNeuropathyEval', () => assertEq(Engine.SmallFiberNeuropathyEval({ t: 'yes' }).plan, 'smallFiberNeuropathyEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
