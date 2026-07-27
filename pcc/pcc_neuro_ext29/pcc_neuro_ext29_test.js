// pcc_neuro_ext29 unit test v3.128.0
const { CognitiveDisorderExt, MildCognitiveImpairment, VascularCognitiveImpairment, FrontotemporalDementiaExt, PrimaryProgressiveAphasia, PosteriorCorticalAtrophy, DementiaWithLewyBodiesExt, AlzheimersDisease, CreutzfeldtJakobDisease, NormalPressureHydrocephalus } = require('./pcc_neuro_ext29_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CognitiveDisorderExt()); passed++;
assert.ok(CognitiveDisorderExt({a:1})); passed++;
assert.ok(MildCognitiveImpairment()); passed++;
assert.ok(MildCognitiveImpairment({a:1})); passed++;
assert.ok(VascularCognitiveImpairment()); passed++;
assert.ok(VascularCognitiveImpairment({a:1})); passed++;
assert.ok(FrontotemporalDementiaExt()); passed++;
assert.ok(FrontotemporalDementiaExt({a:1})); passed++;
assert.ok(PrimaryProgressiveAphasia()); passed++;
assert.ok(PrimaryProgressiveAphasia({a:1})); passed++;
assert.ok(PosteriorCorticalAtrophy()); passed++;
assert.ok(PosteriorCorticalAtrophy({a:1})); passed++;
assert.ok(DementiaWithLewyBodiesExt()); passed++;
assert.ok(DementiaWithLewyBodiesExt({a:1})); passed++;
assert.ok(AlzheimersDisease()); passed++;
assert.ok(AlzheimersDisease({a:1})); passed++;
assert.ok(CreutzfeldtJakobDisease()); passed++;
assert.ok(CreutzfeldtJakobDisease({a:1})); passed++;
assert.ok(NormalPressureHydrocephalus()); passed++;
assert.ok(NormalPressureHydrocephalus({a:1})); passed++;

console.log('pcc_neuro_ext29 unit:', passed, 'passed');
