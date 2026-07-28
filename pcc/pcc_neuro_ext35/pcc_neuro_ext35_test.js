// pcc_neuro_ext35 unit test v3.134.0
const { SleepDisorderExt3, ObstructiveSleepApnea, CentralSleepApnea, MixedSleepApnea, SleepHypoventilation, ObesityHypoventilation, PeriodicLimbMovementExt, REMBehaviorDisorderExt, SleepParalysis, SleepTalking } = require('./pcc_neuro_ext35_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SleepDisorderExt3()); passed++;
assert.ok(SleepDisorderExt3({a:1})); passed++;
assert.ok(ObstructiveSleepApnea()); passed++;
assert.ok(ObstructiveSleepApnea({a:1})); passed++;
assert.ok(CentralSleepApnea()); passed++;
assert.ok(CentralSleepApnea({a:1})); passed++;
assert.ok(MixedSleepApnea()); passed++;
assert.ok(MixedSleepApnea({a:1})); passed++;
assert.ok(SleepHypoventilation()); passed++;
assert.ok(SleepHypoventilation({a:1})); passed++;
assert.ok(ObesityHypoventilation()); passed++;
assert.ok(ObesityHypoventilation({a:1})); passed++;
assert.ok(PeriodicLimbMovementExt()); passed++;
assert.ok(PeriodicLimbMovementExt({a:1})); passed++;
assert.ok(REMBehaviorDisorderExt()); passed++;
assert.ok(REMBehaviorDisorderExt({a:1})); passed++;
assert.ok(SleepParalysis()); passed++;
assert.ok(SleepParalysis({a:1})); passed++;
assert.ok(SleepTalking()); passed++;
assert.ok(SleepTalking({a:1})); passed++;

console.log('pcc_neuro_ext35 unit:', passed, 'passed');
