// pcc_pediatric_neuro_ext35 unit test v3.145.0
const { PediatricEliminationDisorderExt, PediatricEnuresisExt, PediatricEncopresisExt, PediatricFunctionalUrinaryRetention, PediatricFunctionalConstipationExt, PediatricToiletRefusal, PediatricStoolWithholdingExt, PediatricNightmaresExt, PediatricNightTerrorsExt, PediatricSleepwalkingExt } = require('./pcc_pediatric_neuro_ext35_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricEliminationDisorderExt()); passed++;
assert.ok(PediatricEliminationDisorderExt({a:1})); passed++;
assert.ok(PediatricEnuresisExt()); passed++;
assert.ok(PediatricEnuresisExt({a:1})); passed++;
assert.ok(PediatricEncopresisExt()); passed++;
assert.ok(PediatricEncopresisExt({a:1})); passed++;
assert.ok(PediatricFunctionalUrinaryRetention()); passed++;
assert.ok(PediatricFunctionalUrinaryRetention({a:1})); passed++;
assert.ok(PediatricFunctionalConstipationExt()); passed++;
assert.ok(PediatricFunctionalConstipationExt({a:1})); passed++;
assert.ok(PediatricToiletRefusal()); passed++;
assert.ok(PediatricToiletRefusal({a:1})); passed++;
assert.ok(PediatricStoolWithholdingExt()); passed++;
assert.ok(PediatricStoolWithholdingExt({a:1})); passed++;
assert.ok(PediatricNightmaresExt()); passed++;
assert.ok(PediatricNightmaresExt({a:1})); passed++;
assert.ok(PediatricNightTerrorsExt()); passed++;
assert.ok(PediatricNightTerrorsExt({a:1})); passed++;
assert.ok(PediatricSleepwalkingExt()); passed++;
assert.ok(PediatricSleepwalkingExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext35 unit:', passed, 'passed');
