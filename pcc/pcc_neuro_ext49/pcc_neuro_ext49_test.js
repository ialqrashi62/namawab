// pcc_neuro_ext49 unit test v3.148.0
const { AutonomicDysreflexiaExt, OrthostaticHypotensionExt, PosturalOrthostaticTachycardiaExt, NeurocardiogenicSyncopeExt, CarotidSinusHypersensitivityExt, TiltTableSyncopeExt, PureAutonomicFailureExt, MultipleSystemAtrophyAutonomicExt, DysautonomiaExt, FamilialDysautonomiaExt } = require('./pcc_neuro_ext49_engine');
const assert = require('assert');

let passed = 0;
assert.ok(AutonomicDysreflexiaExt()); passed++;
assert.ok(AutonomicDysreflexiaExt({a:1})); passed++;
assert.ok(OrthostaticHypotensionExt()); passed++;
assert.ok(OrthostaticHypotensionExt({a:1})); passed++;
assert.ok(PosturalOrthostaticTachycardiaExt()); passed++;
assert.ok(PosturalOrthostaticTachycardiaExt({a:1})); passed++;
assert.ok(NeurocardiogenicSyncopeExt()); passed++;
assert.ok(NeurocardiogenicSyncopeExt({a:1})); passed++;
assert.ok(CarotidSinusHypersensitivityExt()); passed++;
assert.ok(CarotidSinusHypersensitivityExt({a:1})); passed++;
assert.ok(TiltTableSyncopeExt()); passed++;
assert.ok(TiltTableSyncopeExt({a:1})); passed++;
assert.ok(PureAutonomicFailureExt()); passed++;
assert.ok(PureAutonomicFailureExt({a:1})); passed++;
assert.ok(MultipleSystemAtrophyAutonomicExt()); passed++;
assert.ok(MultipleSystemAtrophyAutonomicExt({a:1})); passed++;
assert.ok(DysautonomiaExt()); passed++;
assert.ok(DysautonomiaExt({a:1})); passed++;
assert.ok(FamilialDysautonomiaExt()); passed++;
assert.ok(FamilialDysautonomiaExt({a:1})); passed++;

console.log('pcc_neuro_ext49 unit:', passed, 'passed');
