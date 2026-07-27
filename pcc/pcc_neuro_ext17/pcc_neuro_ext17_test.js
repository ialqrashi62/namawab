// pcc_neuro_ext17 unit test v3.116.0
const { SleepWakeDisordersExt, CircadianRhythmDisorder, NarcolepsyExt, IdiopathicHypersomnia, KleineLevinSyndrome, RestlessLegsSyndromeExt, PeriodicLimbMovement, REMBehaviorDisorder, SleepApneaExt, Parasomnias } = require('./pcc_neuro_ext17_engine');
const assert = require('assert');

let passed = 0;
assert.ok(SleepWakeDisordersExt()); passed++;
assert.ok(SleepWakeDisordersExt({a:1})); passed++;
assert.ok(CircadianRhythmDisorder()); passed++;
assert.ok(CircadianRhythmDisorder({a:1})); passed++;
assert.ok(NarcolepsyExt()); passed++;
assert.ok(NarcolepsyExt({a:1})); passed++;
assert.ok(IdiopathicHypersomnia()); passed++;
assert.ok(IdiopathicHypersomnia({a:1})); passed++;
assert.ok(KleineLevinSyndrome()); passed++;
assert.ok(KleineLevinSyndrome({a:1})); passed++;
assert.ok(RestlessLegsSyndromeExt()); passed++;
assert.ok(RestlessLegsSyndromeExt({a:1})); passed++;
assert.ok(PeriodicLimbMovement()); passed++;
assert.ok(PeriodicLimbMovement({a:1})); passed++;
assert.ok(REMBehaviorDisorder()); passed++;
assert.ok(REMBehaviorDisorder({a:1})); passed++;
assert.ok(SleepApneaExt()); passed++;
assert.ok(SleepApneaExt({a:1})); passed++;
assert.ok(Parasomnias()); passed++;
assert.ok(Parasomnias({a:1})); passed++;

console.log('pcc_neuro_ext17 unit:', passed, 'passed');
