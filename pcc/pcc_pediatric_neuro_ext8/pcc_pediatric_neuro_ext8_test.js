// pcc_pediatric_neuro_ext8 unit test v3.118.0
const { PediatricAutismSpectrum, PediatricAspergerSyndrome, PediatricPervasiveDevelopmental, PediatricRettSyndrome, PediatricChildhoodDisintegrative, PediatricADHD, PediatricTouretteSyndrome, PediatricOCD, PediatricAnxietyDisorder, PediatricConductDisorder } = require('./pcc_pediatric_neuro_ext8_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricAutismSpectrum()); passed++;
assert.ok(PediatricAutismSpectrum({a:1})); passed++;
assert.ok(PediatricAspergerSyndrome()); passed++;
assert.ok(PediatricAspergerSyndrome({a:1})); passed++;
assert.ok(PediatricPervasiveDevelopmental()); passed++;
assert.ok(PediatricPervasiveDevelopmental({a:1})); passed++;
assert.ok(PediatricRettSyndrome()); passed++;
assert.ok(PediatricRettSyndrome({a:1})); passed++;
assert.ok(PediatricChildhoodDisintegrative()); passed++;
assert.ok(PediatricChildhoodDisintegrative({a:1})); passed++;
assert.ok(PediatricADHD()); passed++;
assert.ok(PediatricADHD({a:1})); passed++;
assert.ok(PediatricTouretteSyndrome()); passed++;
assert.ok(PediatricTouretteSyndrome({a:1})); passed++;
assert.ok(PediatricOCD()); passed++;
assert.ok(PediatricOCD({a:1})); passed++;
assert.ok(PediatricAnxietyDisorder()); passed++;
assert.ok(PediatricAnxietyDisorder({a:1})); passed++;
assert.ok(PediatricConductDisorder()); passed++;
assert.ok(PediatricConductDisorder({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext8 unit:', passed, 'passed');
