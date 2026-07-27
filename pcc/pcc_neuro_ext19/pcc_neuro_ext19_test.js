// pcc_neuro_ext19 unit test v3.118.0
const { SpinalCordInjuryExt, CervicalSpinalCordInjury, ThoracicSpinalCordInjury, LumbarSpinalCordInjury, CaudaEquinaSyndrome, ConusMedullarisSyndrome, SpinalCordCompression, SpinalEpiduralAbscess, SpinalCordTumorExt, SyringomyeliaExt } = require('./pcc_neuro_ext19_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SpinalCordInjuryExt()); passed++;
assert.ok(SpinalCordInjuryExt({a:1})); passed++;
assert.ok(CervicalSpinalCordInjury()); passed++;
assert.ok(CervicalSpinalCordInjury({a:1})); passed++;
assert.ok(ThoracicSpinalCordInjury()); passed++;
assert.ok(ThoracicSpinalCordInjury({a:1})); passed++;
assert.ok(LumbarSpinalCordInjury()); passed++;
assert.ok(LumbarSpinalCordInjury({a:1})); passed++;
assert.ok(CaudaEquinaSyndrome()); passed++;
assert.ok(CaudaEquinaSyndrome({a:1})); passed++;
assert.ok(ConusMedullarisSyndrome()); passed++;
assert.ok(ConusMedullarisSyndrome({a:1})); passed++;
assert.ok(SpinalCordCompression()); passed++;
assert.ok(SpinalCordCompression({a:1})); passed++;
assert.ok(SpinalEpiduralAbscess()); passed++;
assert.ok(SpinalEpiduralAbscess({a:1})); passed++;
assert.ok(SpinalCordTumorExt()); passed++;
assert.ok(SpinalCordTumorExt({a:1})); passed++;
assert.ok(SyringomyeliaExt()); passed++;
assert.ok(SyringomyeliaExt({a:1})); passed++;

console.log('pcc_neuro_ext19 unit:', passed, 'passed');
