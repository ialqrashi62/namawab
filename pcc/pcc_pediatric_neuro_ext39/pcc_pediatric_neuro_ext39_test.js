// pcc_pediatric_neuro_ext39 unit test v3.149.0
const { PediatricMetabolicDisorderExt3, PediatricMitochondrialDiseaseExt, PediatricLysosomalStorageExt, PediatricPeroxisomalDisorderExt, PediatricAminoAcidDisorderExt, PediatricOrganicAcidemiaExt, PediatricUreaCycleDisorderExt, PediatricFattyAcidOxidationExt, PediatricGlycogenStorageExt, PediatricPurineDisorderExt } = require('./pcc_pediatric_neuro_ext39_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricMetabolicDisorderExt3()); passed++;
assert.ok(PediatricMetabolicDisorderExt3({a:1})); passed++;
assert.ok(PediatricMitochondrialDiseaseExt()); passed++;
assert.ok(PediatricMitochondrialDiseaseExt({a:1})); passed++;
assert.ok(PediatricLysosomalStorageExt()); passed++;
assert.ok(PediatricLysosomalStorageExt({a:1})); passed++;
assert.ok(PediatricPeroxisomalDisorderExt()); passed++;
assert.ok(PediatricPeroxisomalDisorderExt({a:1})); passed++;
assert.ok(PediatricAminoAcidDisorderExt()); passed++;
assert.ok(PediatricAminoAcidDisorderExt({a:1})); passed++;
assert.ok(PediatricOrganicAcidemiaExt()); passed++;
assert.ok(PediatricOrganicAcidemiaExt({a:1})); passed++;
assert.ok(PediatricUreaCycleDisorderExt()); passed++;
assert.ok(PediatricUreaCycleDisorderExt({a:1})); passed++;
assert.ok(PediatricFattyAcidOxidationExt()); passed++;
assert.ok(PediatricFattyAcidOxidationExt({a:1})); passed++;
assert.ok(PediatricGlycogenStorageExt()); passed++;
assert.ok(PediatricGlycogenStorageExt({a:1})); passed++;
assert.ok(PediatricPurineDisorderExt()); passed++;
assert.ok(PediatricPurineDisorderExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext39 unit:', passed, 'passed');
