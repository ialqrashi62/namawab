// P3-EQ pcc_neuro_ext8 unit tests
const Engine = require('./pcc_neuro_ext8_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext8 engine tests:');
it('AcuteFlaccidMyelitis', () => assertEq(Engine.AcuteFlaccidMyelitis({ t: 'yes' }).plan, 'acuteFlaccidMyelitis-protocol'));
it('TransverseMyelitisEval', () => assertEq(Engine.TransverseMyelitisEval({ t: 'yes' }).plan, 'transverseMyelitisEval-protocol'));
it('NeuromyelitisOpticaExt', () => assertEq(Engine.NeuromyelitisOpticaExt({ t: 'yes' }).plan, 'neuromyelitisOpticaExt-protocol'));
it('OpticNeuritisEval', () => assertEq(Engine.OpticNeuritisEval({ t: 'yes' }).plan, 'opticNeuritisEval-protocol'));
it('ConusMedullarisSyndrome', () => assertEq(Engine.ConusMedullarisSyndrome({ t: 'yes' }).plan, 'conusMedullarisSyndrome-protocol'));
it('CaudaEquinaEval', () => assertEq(Engine.CaudaEquinaEval({ t: 'yes' }).plan, 'caudaEquinaEval-protocol'));
it('SyringomyeliaEval', () => assertEq(Engine.SyringomyeliaEval({ t: 'yes' }).plan, 'syringomyeliaEval-protocol'));
it('TetheredCordSyndrome', () => assertEq(Engine.TetheredCordSyndrome({ t: 'yes' }).plan, 'tetheredCordSyndrome-protocol'));
it('DiastematomyeliaEval', () => assertEq(Engine.DiastematomyeliaEval({ t: 'yes' }).plan, 'diastematomyeliaEval-protocol'));
it('SpinalDuralAVFistula', () => assertEq(Engine.SpinalDuralAVFistula({ t: 'yes' }).plan, 'spinalDuralAVFistula-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
