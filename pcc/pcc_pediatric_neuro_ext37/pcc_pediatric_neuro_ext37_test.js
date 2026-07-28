// pcc_pediatric_neuro_ext37 unit test v3.147.0
const { PediatricHeadacheDisorderExt, PediatricMigraineWithAuraExt, PediatricMigraineWithoutAuraExt, PediatricHemiplegicMigraineExt, PediatricBasilarMigraineExt, PediatricConfusionalMigraineExt, PediatricOphthalmoplegicMigraineExt, PediatricVestibularMigraineExt, PediatricAbdominalMigraineExt, PediatricCyclicVomitingExt } = require('./pcc_pediatric_neuro_ext37_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricHeadacheDisorderExt()); passed++;
assert.ok(PediatricHeadacheDisorderExt({a:1})); passed++;
assert.ok(PediatricMigraineWithAuraExt()); passed++;
assert.ok(PediatricMigraineWithAuraExt({a:1})); passed++;
assert.ok(PediatricMigraineWithoutAuraExt()); passed++;
assert.ok(PediatricMigraineWithoutAuraExt({a:1})); passed++;
assert.ok(PediatricHemiplegicMigraineExt()); passed++;
assert.ok(PediatricHemiplegicMigraineExt({a:1})); passed++;
assert.ok(PediatricBasilarMigraineExt()); passed++;
assert.ok(PediatricBasilarMigraineExt({a:1})); passed++;
assert.ok(PediatricConfusionalMigraineExt()); passed++;
assert.ok(PediatricConfusionalMigraineExt({a:1})); passed++;
assert.ok(PediatricOphthalmoplegicMigraineExt()); passed++;
assert.ok(PediatricOphthalmoplegicMigraineExt({a:1})); passed++;
assert.ok(PediatricVestibularMigraineExt()); passed++;
assert.ok(PediatricVestibularMigraineExt({a:1})); passed++;
assert.ok(PediatricAbdominalMigraineExt()); passed++;
assert.ok(PediatricAbdominalMigraineExt({a:1})); passed++;
assert.ok(PediatricCyclicVomitingExt()); passed++;
assert.ok(PediatricCyclicVomitingExt({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext37 unit:', passed, 'passed');
