// pcc_neuro_ext16 unit test v3.115.0
const { BellsPalsyExt, TrigeminalNeuralgiaExt, HemifacialSpasm, GlossopharyngealNeuralgia, OccipitalNeuralgia, ClusterHeadacheExt, MigraineVariants, CervicogenicHeadache, TensionHeadacheExt, MedicationOveruseHeadache } = require('./pcc_neuro_ext16_engine');
const assert = require('assert');

let passed = 0;
assert.ok(BellsPalsyExt()); passed++;
assert.ok(BellsPalsyExt({a:1})); passed++;
assert.ok(TrigeminalNeuralgiaExt()); passed++;
assert.ok(TrigeminalNeuralgiaExt({a:1})); passed++;
assert.ok(HemifacialSpasm()); passed++;
assert.ok(HemifacialSpasm({a:1})); passed++;
assert.ok(GlossopharyngealNeuralgia()); passed++;
assert.ok(GlossopharyngealNeuralgia({a:1})); passed++;
assert.ok(OccipitalNeuralgia()); passed++;
assert.ok(OccipitalNeuralgia({a:1})); passed++;
assert.ok(ClusterHeadacheExt()); passed++;
assert.ok(ClusterHeadacheExt({a:1})); passed++;
assert.ok(MigraineVariants()); passed++;
assert.ok(MigraineVariants({a:1})); passed++;
assert.ok(CervicogenicHeadache()); passed++;
assert.ok(CervicogenicHeadache({a:1})); passed++;
assert.ok(TensionHeadacheExt()); passed++;
assert.ok(TensionHeadacheExt({a:1})); passed++;
assert.ok(MedicationOveruseHeadache()); passed++;
assert.ok(MedicationOveruseHeadache({a:1})); passed++;

console.log('pcc_neuro_ext16 unit:', passed, 'passed');
