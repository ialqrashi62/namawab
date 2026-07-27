// pcc_pediatric_surg_ext9 unit test v3.119.0
const { PediatricNeonatalSurgery, PediatricCongenitalDiaphragmaticHernia, PediatricTracheoesophagealFistula, PediatricIntestinalAtresia, PediatricAnorectalMalformation, PediatricHirschsprungDisease, PediatricBiliaryAtresia, PediatricCholedochalCyst, PediatricPancreaticSurgery, PediatricHepaticResection } = require('./pcc_pediatric_surg_ext9_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricNeonatalSurgery()); passed++;
assert.ok(PediatricNeonatalSurgery({a:1})); passed++;
assert.ok(PediatricCongenitalDiaphragmaticHernia()); passed++;
assert.ok(PediatricCongenitalDiaphragmaticHernia({a:1})); passed++;
assert.ok(PediatricTracheoesophagealFistula()); passed++;
assert.ok(PediatricTracheoesophagealFistula({a:1})); passed++;
assert.ok(PediatricIntestinalAtresia()); passed++;
assert.ok(PediatricIntestinalAtresia({a:1})); passed++;
assert.ok(PediatricAnorectalMalformation()); passed++;
assert.ok(PediatricAnorectalMalformation({a:1})); passed++;
assert.ok(PediatricHirschsprungDisease()); passed++;
assert.ok(PediatricHirschsprungDisease({a:1})); passed++;
assert.ok(PediatricBiliaryAtresia()); passed++;
assert.ok(PediatricBiliaryAtresia({a:1})); passed++;
assert.ok(PediatricCholedochalCyst()); passed++;
assert.ok(PediatricCholedochalCyst({a:1})); passed++;
assert.ok(PediatricPancreaticSurgery()); passed++;
assert.ok(PediatricPancreaticSurgery({a:1})); passed++;
assert.ok(PediatricHepaticResection()); passed++;
assert.ok(PediatricHepaticResection({a:1})); passed++;

console.log('pcc_pediatric_surg_ext9 unit:', passed, 'passed');
