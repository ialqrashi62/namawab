// pcc_neuro_ext47 unit test v3.146.0
const { VertebrobasilarInsufficiencyExt, BasilarArteryThrombosisExt, PosteriorFossaStrokeExt, CerebellarStrokeExt, LateralMedullarySyndromeExt, MedialMedullarySyndromeExt, LateralPonsSyndromeExt, LockedInSyndromeExt, TopOfBasilarSyndromeExt, SubclavianStealSyndromeExt } = require('./pcc_neuro_ext47_engine');
const assert = require('assert');

let passed = 0;
assert.ok(VertebrobasilarInsufficiencyExt()); passed++;
assert.ok(VertebrobasilarInsufficiencyExt({a:1})); passed++;
assert.ok(BasilarArteryThrombosisExt()); passed++;
assert.ok(BasilarArteryThrombosisExt({a:1})); passed++;
assert.ok(PosteriorFossaStrokeExt()); passed++;
assert.ok(PosteriorFossaStrokeExt({a:1})); passed++;
assert.ok(CerebellarStrokeExt()); passed++;
assert.ok(CerebellarStrokeExt({a:1})); passed++;
assert.ok(LateralMedullarySyndromeExt()); passed++;
assert.ok(LateralMedullarySyndromeExt({a:1})); passed++;
assert.ok(MedialMedullarySyndromeExt()); passed++;
assert.ok(MedialMedullarySyndromeExt({a:1})); passed++;
assert.ok(LateralPonsSyndromeExt()); passed++;
assert.ok(LateralPonsSyndromeExt({a:1})); passed++;
assert.ok(LockedInSyndromeExt()); passed++;
assert.ok(LockedInSyndromeExt({a:1})); passed++;
assert.ok(TopOfBasilarSyndromeExt()); passed++;
assert.ok(TopOfBasilarSyndromeExt({a:1})); passed++;
assert.ok(SubclavianStealSyndromeExt()); passed++;
assert.ok(SubclavianStealSyndromeExt({a:1})); passed++;

console.log('pcc_neuro_ext47 unit:', passed, 'passed');
