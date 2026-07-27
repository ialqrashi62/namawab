// pcc_neuro_ext18 unit test v3.117.0
const { BrainTumorExt, GlioblastomaMultiformeExt, MeningiomaExt, PituitaryAdenomaExt, AcousticNeuromaExt, MetastaticBrainTumor, PrimaryCNSLymphoma, MedulloblastomaAdult, EpendymomaAdult, OligodendrogliomaExt } = require('./pcc_neuro_ext18_engine');
const assert = require('assert');

let passed = 0;
assert.ok(BrainTumorExt()); passed++;
assert.ok(BrainTumorExt({a:1})); passed++;
assert.ok(GlioblastomaMultiformeExt()); passed++;
assert.ok(GlioblastomaMultiformeExt({a:1})); passed++;
assert.ok(MeningiomaExt()); passed++;
assert.ok(MeningiomaExt({a:1})); passed++;
assert.ok(PituitaryAdenomaExt()); passed++;
assert.ok(PituitaryAdenomaExt({a:1})); passed++;
assert.ok(AcousticNeuromaExt()); passed++;
assert.ok(AcousticNeuromaExt({a:1})); passed++;
assert.ok(MetastaticBrainTumor()); passed++;
assert.ok(MetastaticBrainTumor({a:1})); passed++;
assert.ok(PrimaryCNSLymphoma()); passed++;
assert.ok(PrimaryCNSLymphoma({a:1})); passed++;
assert.ok(MedulloblastomaAdult()); passed++;
assert.ok(MedulloblastomaAdult({a:1})); passed++;
assert.ok(EpendymomaAdult()); passed++;
assert.ok(EpendymomaAdult({a:1})); passed++;
assert.ok(OligodendrogliomaExt()); passed++;
assert.ok(OligodendrogliomaExt({a:1})); passed++;

console.log('pcc_neuro_ext18 unit:', passed, 'passed');
