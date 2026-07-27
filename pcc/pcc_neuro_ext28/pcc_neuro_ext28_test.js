// pcc_neuro_ext28 unit test v3.127.0
const { AutonomicDisorderExt, AutonomicNeuropathy, PureAutonomicFailure, MultipleSystemAtrophyAutonomic, OrthostaticHypotension, PosturalTachycardiaSyndrome, NeurocardiogenicSyncope, CarotidSinusHypersensitivity, AutonomicDysreflexia, BaroreflexFailure } = require('./pcc_neuro_ext28_engine');
const assert = require('assert');

let passed = 0;
assert.ok(AutonomicDisorderExt()); passed++;
assert.ok(AutonomicDisorderExt({a:1})); passed++;
assert.ok(AutonomicNeuropathy()); passed++;
assert.ok(AutonomicNeuropathy({a:1})); passed++;
assert.ok(PureAutonomicFailure()); passed++;
assert.ok(PureAutonomicFailure({a:1})); passed++;
assert.ok(MultipleSystemAtrophyAutonomic()); passed++;
assert.ok(MultipleSystemAtrophyAutonomic({a:1})); passed++;
assert.ok(OrthostaticHypotension()); passed++;
assert.ok(OrthostaticHypotension({a:1})); passed++;
assert.ok(PosturalTachycardiaSyndrome()); passed++;
assert.ok(PosturalTachycardiaSyndrome({a:1})); passed++;
assert.ok(NeurocardiogenicSyncope()); passed++;
assert.ok(NeurocardiogenicSyncope({a:1})); passed++;
assert.ok(CarotidSinusHypersensitivity()); passed++;
assert.ok(CarotidSinusHypersensitivity({a:1})); passed++;
assert.ok(AutonomicDysreflexia()); passed++;
assert.ok(AutonomicDysreflexia({a:1})); passed++;
assert.ok(BaroreflexFailure()); passed++;
assert.ok(BaroreflexFailure({a:1})); passed++;

console.log('pcc_neuro_ext28 unit:', passed, 'passed');
