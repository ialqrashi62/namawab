// pcc_neuro_ext60 unit test v3.159.0
const { HydrocephalusNormalPressureExt, HydrocephalusCommunicatingExt, HydrocephalusNonCommunicatingExt, ArrestedHydrocephalusExt, LongstandingOvertVenticulomegalyExt, ExternalHydrocephalusExt, HydrocephalusExVacuoExt, BenignExternalHydrocephalusExt, IdiopathicIntracranialHypertensionExt, CSFLeakSyndromeExt } = require('./pcc_neuro_ext60_engine');
const assert = require('assert');

let passed = 0;
assert.ok(HydrocephalusNormalPressureExt()); passed++;
assert.ok(HydrocephalusNormalPressureExt({a:1})); passed++;
assert.ok(HydrocephalusCommunicatingExt()); passed++;
assert.ok(HydrocephalusCommunicatingExt({a:1})); passed++;
assert.ok(HydrocephalusNonCommunicatingExt()); passed++;
assert.ok(HydrocephalusNonCommunicatingExt({a:1})); passed++;
assert.ok(ArrestedHydrocephalusExt()); passed++;
assert.ok(ArrestedHydrocephalusExt({a:1})); passed++;
assert.ok(LongstandingOvertVenticulomegalyExt()); passed++;
assert.ok(LongstandingOvertVenticulomegalyExt({a:1})); passed++;
assert.ok(ExternalHydrocephalusExt()); passed++;
assert.ok(ExternalHydrocephalusExt({a:1})); passed++;
assert.ok(HydrocephalusExVacuoExt()); passed++;
assert.ok(HydrocephalusExVacuoExt({a:1})); passed++;
assert.ok(BenignExternalHydrocephalusExt()); passed++;
assert.ok(BenignExternalHydrocephalusExt({a:1})); passed++;
assert.ok(IdiopathicIntracranialHypertensionExt()); passed++;
assert.ok(IdiopathicIntracranialHypertensionExt({a:1})); passed++;
assert.ok(CSFLeakSyndromeExt()); passed++;
assert.ok(CSFLeakSyndromeExt({a:1})); passed++;

console.log('pcc_neuro_ext60 unit:', passed, 'passed');
