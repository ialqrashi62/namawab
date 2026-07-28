// pcc_neuro_ext37 unit test v3.136.0
const { CataplexyExt, SleepOnsetREM, HypnagogicHallucinationsExt, HypnopompicHallucinations, SleepParalysisExt2, REMIntrusionExt, StatusDissociatusExt, SleepRelatedHallucinations, NightmareDisorderExt, IsolatedSleepParalysis } = require('./pcc_neuro_ext37_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CataplexyExt()); passed++;
assert.ok(CataplexyExt({a:1})); passed++;
assert.ok(SleepOnsetREM()); passed++;
assert.ok(SleepOnsetREM({a:1})); passed++;
assert.ok(HypnagogicHallucinationsExt()); passed++;
assert.ok(HypnagogicHallucinationsExt({a:1})); passed++;
assert.ok(HypnopompicHallucinations()); passed++;
assert.ok(HypnopompicHallucinations({a:1})); passed++;
assert.ok(SleepParalysisExt2()); passed++;
assert.ok(SleepParalysisExt2({a:1})); passed++;
assert.ok(REMIntrusionExt()); passed++;
assert.ok(REMIntrusionExt({a:1})); passed++;
assert.ok(StatusDissociatusExt()); passed++;
assert.ok(StatusDissociatusExt({a:1})); passed++;
assert.ok(SleepRelatedHallucinations()); passed++;
assert.ok(SleepRelatedHallucinations({a:1})); passed++;
assert.ok(NightmareDisorderExt()); passed++;
assert.ok(NightmareDisorderExt({a:1})); passed++;
assert.ok(IsolatedSleepParalysis()); passed++;
assert.ok(IsolatedSleepParalysis({a:1})); passed++;

console.log('pcc_neuro_ext37 unit:', passed, 'passed');
