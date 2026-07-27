// pcc_pediatric_surg_ext14 unit test v3.124.0
const { PediatricENTExt2, PediatricAdenoidectomyExt, PediatricTonsillectomyExt, PediatricMyringotomy, PediatricTympanostomyExt, PediatricSeptoplasty, PediatricRhinoplasty, PediatricSinusSurgery, PediatricTracheostomy, PediatricLaryngoscopy } = require('./pcc_pediatric_surg_ext14_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricENTExt2()); passed++;
assert.ok(PediatricENTExt2({a:1})); passed++;
assert.ok(PediatricAdenoidectomyExt()); passed++;
assert.ok(PediatricAdenoidectomyExt({a:1})); passed++;
assert.ok(PediatricTonsillectomyExt()); passed++;
assert.ok(PediatricTonsillectomyExt({a:1})); passed++;
assert.ok(PediatricMyringotomy()); passed++;
assert.ok(PediatricMyringotomy({a:1})); passed++;
assert.ok(PediatricTympanostomyExt()); passed++;
assert.ok(PediatricTympanostomyExt({a:1})); passed++;
assert.ok(PediatricSeptoplasty()); passed++;
assert.ok(PediatricSeptoplasty({a:1})); passed++;
assert.ok(PediatricRhinoplasty()); passed++;
assert.ok(PediatricRhinoplasty({a:1})); passed++;
assert.ok(PediatricSinusSurgery()); passed++;
assert.ok(PediatricSinusSurgery({a:1})); passed++;
assert.ok(PediatricTracheostomy()); passed++;
assert.ok(PediatricTracheostomy({a:1})); passed++;
assert.ok(PediatricLaryngoscopy()); passed++;
assert.ok(PediatricLaryngoscopy({a:1})); passed++;

console.log('pcc_pediatric_surg_ext14 unit:', passed, 'passed');
