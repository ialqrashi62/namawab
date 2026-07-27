// pcc_neuro_ext25 unit test v3.124.0
const { CerebellarDisorderExt, CerebellarDegeneration, ParaneoplasticCerebellar, ToxicCerebellarSyndrome, AlcoholicCerebellar, CerebellarStroke, CerebellarTumorExt, FlocculonodularSyndrome, CerebellarCognitiveAffective, MachadoJosephDisease } = require('./pcc_neuro_ext25_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CerebellarDisorderExt()); passed++;
assert.ok(CerebellarDisorderExt({a:1})); passed++;
assert.ok(CerebellarDegeneration()); passed++;
assert.ok(CerebellarDegeneration({a:1})); passed++;
assert.ok(ParaneoplasticCerebellar()); passed++;
assert.ok(ParaneoplasticCerebellar({a:1})); passed++;
assert.ok(ToxicCerebellarSyndrome()); passed++;
assert.ok(ToxicCerebellarSyndrome({a:1})); passed++;
assert.ok(AlcoholicCerebellar()); passed++;
assert.ok(AlcoholicCerebellar({a:1})); passed++;
assert.ok(CerebellarStroke()); passed++;
assert.ok(CerebellarStroke({a:1})); passed++;
assert.ok(CerebellarTumorExt()); passed++;
assert.ok(CerebellarTumorExt({a:1})); passed++;
assert.ok(FlocculonodularSyndrome()); passed++;
assert.ok(FlocculonodularSyndrome({a:1})); passed++;
assert.ok(CerebellarCognitiveAffective()); passed++;
assert.ok(CerebellarCognitiveAffective({a:1})); passed++;
assert.ok(MachadoJosephDisease()); passed++;
assert.ok(MachadoJosephDisease({a:1})); passed++;

console.log('pcc_neuro_ext25 unit:', passed, 'passed');
