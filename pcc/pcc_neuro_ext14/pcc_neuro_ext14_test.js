// pcc_neuro_ext14 unit test v3.113.0
const { MultipleSclerosisExt, NeuromyelitisOptica, MOGAntibodyDisease, AcuteDisseminatedEncephalomyelitis, TransverseMyelitisExt, OpticNeuritisExt, CerebellarAtaxiaExt, SpinocerebellarAtaxia, FriedreichAtaxia, HereditarySpasticParaparesis } = require('./pcc_neuro_ext14_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MultipleSclerosisExt()); passed++;
assert.ok(MultipleSclerosisExt({a:1})); passed++;
assert.ok(NeuromyelitisOptica()); passed++;
assert.ok(NeuromyelitisOptica({a:1})); passed++;
assert.ok(MOGAntibodyDisease()); passed++;
assert.ok(MOGAntibodyDisease({a:1})); passed++;
assert.ok(AcuteDisseminatedEncephalomyelitis()); passed++;
assert.ok(AcuteDisseminatedEncephalomyelitis({a:1})); passed++;
assert.ok(TransverseMyelitisExt()); passed++;
assert.ok(TransverseMyelitisExt({a:1})); passed++;
assert.ok(OpticNeuritisExt()); passed++;
assert.ok(OpticNeuritisExt({a:1})); passed++;
assert.ok(CerebellarAtaxiaExt()); passed++;
assert.ok(CerebellarAtaxiaExt({a:1})); passed++;
assert.ok(SpinocerebellarAtaxia()); passed++;
assert.ok(SpinocerebellarAtaxia({a:1})); passed++;
assert.ok(FriedreichAtaxia()); passed++;
assert.ok(FriedreichAtaxia({a:1})); passed++;
assert.ok(HereditarySpasticParaparesis()); passed++;
assert.ok(HereditarySpasticParaparesis({a:1})); passed++;

console.log('pcc_neuro_ext14 unit:', passed, 'passed');
