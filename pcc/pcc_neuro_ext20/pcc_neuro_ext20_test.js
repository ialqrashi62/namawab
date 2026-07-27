// pcc_neuro_ext20 unit test v3.119.0
const { CerebrovascularDiseaseExt, IntracranialAneurysmExt, ArteriovenousMalformation, CavernousMalformation, MoyamoyaDisease, SubarachnoidHemorrhageExt, IntracerebralHemorrhage, SubduralHematomaExt, EpiduralHematomaExt, VenousSinusThrombosis } = require('./pcc_neuro_ext20_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CerebrovascularDiseaseExt()); passed++;
assert.ok(CerebrovascularDiseaseExt({a:1})); passed++;
assert.ok(IntracranialAneurysmExt()); passed++;
assert.ok(IntracranialAneurysmExt({a:1})); passed++;
assert.ok(ArteriovenousMalformation()); passed++;
assert.ok(ArteriovenousMalformation({a:1})); passed++;
assert.ok(CavernousMalformation()); passed++;
assert.ok(CavernousMalformation({a:1})); passed++;
assert.ok(MoyamoyaDisease()); passed++;
assert.ok(MoyamoyaDisease({a:1})); passed++;
assert.ok(SubarachnoidHemorrhageExt()); passed++;
assert.ok(SubarachnoidHemorrhageExt({a:1})); passed++;
assert.ok(IntracerebralHemorrhage()); passed++;
assert.ok(IntracerebralHemorrhage({a:1})); passed++;
assert.ok(SubduralHematomaExt()); passed++;
assert.ok(SubduralHematomaExt({a:1})); passed++;
assert.ok(EpiduralHematomaExt()); passed++;
assert.ok(EpiduralHematomaExt({a:1})); passed++;
assert.ok(VenousSinusThrombosis()); passed++;
assert.ok(VenousSinusThrombosis({a:1})); passed++;

console.log('pcc_neuro_ext20 unit:', passed, 'passed');
