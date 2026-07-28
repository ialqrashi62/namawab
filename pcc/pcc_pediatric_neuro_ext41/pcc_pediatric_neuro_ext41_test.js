// pcc_pediatric_neuro_ext41 unit test v3.151.0
const { PediatricDemyelinatingExt, PediatricMSAdultLikeExt, PediatricMOGADExt, PediatricNMOSDExt, PediatricADEMEpiExt, PediatricOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricClinicallyIsolatedSyndromeExt, PediatricRadiologicallyIsolatedExt, PediatricMyelinOligodendrocyteExt } = require('./pcc_pediatric_neuro_ext41_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricDemyelinatingExt()); passed++;
assert.ok(PediatricDemyelinatingExt({a:1})); passed++;
assert.ok(PediatricMSAdultLikeExt()); passed++;
assert.ok(PediatricMSAdultLikeExt({a:1})); passed++;
assert.ok(PediatricMOGADExt()); passed++;
assert.ok(PediatricMOGADExt({a:1})); passed++;
assert.ok(PediatricNMOSDExt()); passed++;
assert.ok(PediatricNMOSDExt({a:1})); passed++;
assert.ok(PediatricADEMEpiExt()); passed++;
assert.ok(PediatricADEMEpiExt({a:1})); passed++;
assert.ok(PediatricOpticNeuritisExt()); passed++;
assert.ok(PediatricOpticNeuritisExt({a:1})); passed++;
assert.ok(PediatricTransverseMyelitisExt()); passed++;
assert.ok(PediatricTransverseMyelitisExt({a:1})); passed++;
assert.ok(PediatricClinicallyIsolatedSyndromeExt()); passed++;
assert.ok(PediatricClinicallyIsolatedSyndromeExt({a:1})); passed++;
assert.ok(PediatricRadiologicallyIsolatedExt()); passed++;
assert.ok(PediatricRadiologicallyIsolatedExt({a:1})); passed++;
assert.ok(PediatricMyelinOligodendrocyteExt()); passed++;
assert.ok(PediatricMyelinOligodendrocyteExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext41 unit:', passed, 'passed');
