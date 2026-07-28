// pcc_neuro_ext44 unit test v3.143.0
const { SpinocerebellarAtaxiaExt, FriedreichAtaxiaExt, AtaxiaTelangiectasiaExt, EpisodicAtaxiaExt, CerebellarDegenerationExt, OlivopontocerebellarAtrophyExt, DentatorubralPallidoluysianExt, MachadoJosephExt, IdiopathicCerebellarAtaxiaExt, CerebellitisExt } = require('./pcc_neuro_ext44_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SpinocerebellarAtaxiaExt()); passed++;
assert.ok(SpinocerebellarAtaxiaExt({a:1})); passed++;
assert.ok(FriedreichAtaxiaExt()); passed++;
assert.ok(FriedreichAtaxiaExt({a:1})); passed++;
assert.ok(AtaxiaTelangiectasiaExt()); passed++;
assert.ok(AtaxiaTelangiectasiaExt({a:1})); passed++;
assert.ok(EpisodicAtaxiaExt()); passed++;
assert.ok(EpisodicAtaxiaExt({a:1})); passed++;
assert.ok(CerebellarDegenerationExt()); passed++;
assert.ok(CerebellarDegenerationExt({a:1})); passed++;
assert.ok(OlivopontocerebellarAtrophyExt()); passed++;
assert.ok(OlivopontocerebellarAtrophyExt({a:1})); passed++;
assert.ok(DentatorubralPallidoluysianExt()); passed++;
assert.ok(DentatorubralPallidoluysianExt({a:1})); passed++;
assert.ok(MachadoJosephExt()); passed++;
assert.ok(MachadoJosephExt({a:1})); passed++;
assert.ok(IdiopathicCerebellarAtaxiaExt()); passed++;
assert.ok(IdiopathicCerebellarAtaxiaExt({a:1})); passed++;
assert.ok(CerebellitisExt()); passed++;
assert.ok(CerebellitisExt({a:1})); passed++;

console.log('pcc_neuro_ext44 unit:', passed, 'passed');
