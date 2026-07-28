// pcc_neuro_ext50 unit test v3.149.0
const { MeningiomaExt, AnaplasticMeningiomaExt, HemangioblastomaExt, HemangiopericytomaExt, PrimaryCNSLymphomaExt, CNSLymphomaExt, GermCellTumorExt, PineoblastomaExt, PituitaryAdenomaExt, PituitaryApoplexyExt } = require('./pcc_neuro_ext50_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MeningiomaExt()); passed++;
assert.ok(MeningiomaExt({a:1})); passed++;
assert.ok(AnaplasticMeningiomaExt()); passed++;
assert.ok(AnaplasticMeningiomaExt({a:1})); passed++;
assert.ok(HemangioblastomaExt()); passed++;
assert.ok(HemangioblastomaExt({a:1})); passed++;
assert.ok(HemangiopericytomaExt()); passed++;
assert.ok(HemangiopericytomaExt({a:1})); passed++;
assert.ok(PrimaryCNSLymphomaExt()); passed++;
assert.ok(PrimaryCNSLymphomaExt({a:1})); passed++;
assert.ok(CNSLymphomaExt()); passed++;
assert.ok(CNSLymphomaExt({a:1})); passed++;
assert.ok(GermCellTumorExt()); passed++;
assert.ok(GermCellTumorExt({a:1})); passed++;
assert.ok(PineoblastomaExt()); passed++;
assert.ok(PineoblastomaExt({a:1})); passed++;
assert.ok(PituitaryAdenomaExt()); passed++;
assert.ok(PituitaryAdenomaExt({a:1})); passed++;
assert.ok(PituitaryApoplexyExt()); passed++;
assert.ok(PituitaryApoplexyExt({a:1})); passed++;

console.log('pcc_neuro_ext50 unit:', passed, 'passed');
