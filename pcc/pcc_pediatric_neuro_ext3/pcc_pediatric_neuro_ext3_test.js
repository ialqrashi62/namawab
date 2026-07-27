// pcc_pediatric_neuro_ext3 unit test v3.113.0
const { PediatricMigraine, PediatricTensionHeadache, PediatricClusterHeadache, PediatricIdiopathicIntracranialHypertension, PediatricCerebralVenousThrombosis, PediatricStrokeExt, PediatricMoyamoyaExt, PediatricArterialDissection, PediatricVasculitis, PediatricNeurofibromatosisType1 } = require('./pcc_pediatric_neuro_ext3_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricMigraine()); passed++;
assert.ok(PediatricMigraine({a:1})); passed++;
assert.ok(PediatricTensionHeadache()); passed++;
assert.ok(PediatricTensionHeadache({a:1})); passed++;
assert.ok(PediatricClusterHeadache()); passed++;
assert.ok(PediatricClusterHeadache({a:1})); passed++;
assert.ok(PediatricIdiopathicIntracranialHypertension()); passed++;
assert.ok(PediatricIdiopathicIntracranialHypertension({a:1})); passed++;
assert.ok(PediatricCerebralVenousThrombosis()); passed++;
assert.ok(PediatricCerebralVenousThrombosis({a:1})); passed++;
assert.ok(PediatricStrokeExt()); passed++;
assert.ok(PediatricStrokeExt({a:1})); passed++;
assert.ok(PediatricMoyamoyaExt()); passed++;
assert.ok(PediatricMoyamoyaExt({a:1})); passed++;
assert.ok(PediatricArterialDissection()); passed++;
assert.ok(PediatricArterialDissection({a:1})); passed++;
assert.ok(PediatricVasculitis()); passed++;
assert.ok(PediatricVasculitis({a:1})); passed++;
assert.ok(PediatricNeurofibromatosisType1()); passed++;
assert.ok(PediatricNeurofibromatosisType1({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext3 unit:', passed, 'passed');
