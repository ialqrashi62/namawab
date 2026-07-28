// pcc_neuro_ext43 unit test v3.142.0
const { AdultHydrocephalusExt, NormalPressureHydrocephalusExt, CommunicatingHydrocephalusExt, NonCommunicatingHydrocephalusExt, ArrestedHydrocephalusExt, ExVacuoDilatationExt, CSFLeakExt, IntracranialHypotensionExt, PseudotumorCerebriExt2, CSFVenousFistulaExt } = require('./pcc_neuro_ext43_engine');
const assert = require('assert');

let passed = 0;
assert.ok(AdultHydrocephalusExt()); passed++;
assert.ok(AdultHydrocephalusExt({a:1})); passed++;
assert.ok(NormalPressureHydrocephalusExt()); passed++;
assert.ok(NormalPressureHydrocephalusExt({a:1})); passed++;
assert.ok(CommunicatingHydrocephalusExt()); passed++;
assert.ok(CommunicatingHydrocephalusExt({a:1})); passed++;
assert.ok(NonCommunicatingHydrocephalusExt()); passed++;
assert.ok(NonCommunicatingHydrocephalusExt({a:1})); passed++;
assert.ok(ArrestedHydrocephalusExt()); passed++;
assert.ok(ArrestedHydrocephalusExt({a:1})); passed++;
assert.ok(ExVacuoDilatationExt()); passed++;
assert.ok(ExVacuoDilatationExt({a:1})); passed++;
assert.ok(CSFLeakExt()); passed++;
assert.ok(CSFLeakExt({a:1})); passed++;
assert.ok(IntracranialHypotensionExt()); passed++;
assert.ok(IntracranialHypotensionExt({a:1})); passed++;
assert.ok(PseudotumorCerebriExt2()); passed++;
assert.ok(PseudotumorCerebriExt2({a:1})); passed++;
assert.ok(CSFVenousFistulaExt()); passed++;
assert.ok(CSFVenousFistulaExt({a:1})); passed++;

console.log('pcc_neuro_ext43 unit:', passed, 'passed');
