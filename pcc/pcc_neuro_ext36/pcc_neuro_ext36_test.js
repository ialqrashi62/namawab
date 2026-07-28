// pcc_neuro_ext36 unit test v3.135.0
const { SleepWalkingExt2, SleepEatingDisorder, SleepTextingDisorder, SleepDrinkingDisorder, ExplodingHeadSyndromeExt, HypnicJerksExt, SleepBruxismExt, NocturnalLegCramps, RestlessLegSyndromeExt, PeriodicLimbMovementsExt2 } = require('./pcc_neuro_ext36_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SleepWalkingExt2()); passed++;
assert.ok(SleepWalkingExt2({a:1})); passed++;
assert.ok(SleepEatingDisorder()); passed++;
assert.ok(SleepEatingDisorder({a:1})); passed++;
assert.ok(SleepTextingDisorder()); passed++;
assert.ok(SleepTextingDisorder({a:1})); passed++;
assert.ok(SleepDrinkingDisorder()); passed++;
assert.ok(SleepDrinkingDisorder({a:1})); passed++;
assert.ok(ExplodingHeadSyndromeExt()); passed++;
assert.ok(ExplodingHeadSyndromeExt({a:1})); passed++;
assert.ok(HypnicJerksExt()); passed++;
assert.ok(HypnicJerksExt({a:1})); passed++;
assert.ok(SleepBruxismExt()); passed++;
assert.ok(SleepBruxismExt({a:1})); passed++;
assert.ok(NocturnalLegCramps()); passed++;
assert.ok(NocturnalLegCramps({a:1})); passed++;
assert.ok(RestlessLegSyndromeExt()); passed++;
assert.ok(RestlessLegSyndromeExt({a:1})); passed++;
assert.ok(PeriodicLimbMovementsExt2()); passed++;
assert.ok(PeriodicLimbMovementsExt2({a:1})); passed++;

console.log('pcc_neuro_ext36 unit:', passed, 'passed');
