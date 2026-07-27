// pcc_pediatric_surg_ext20 unit test v3.130.0
const { PediatricSpineSurgeryExt, PediatricScoliosisCorrection, PediatricSpinalFusion, PediatricVertebralTethering, PediatricMagneticallyControlledGrowingRod, PediatricGrowingRod, PediatricSpinalDeformity, PediatricKyphosisCorrection, PediatricLordosisCorrection, PediatricSpondylolisthesis } = require('./pcc_pediatric_surg_ext20_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricSpineSurgeryExt()); passed++;
assert.ok(PediatricSpineSurgeryExt({a:1})); passed++;
assert.ok(PediatricScoliosisCorrection()); passed++;
assert.ok(PediatricScoliosisCorrection({a:1})); passed++;
assert.ok(PediatricSpinalFusion()); passed++;
assert.ok(PediatricSpinalFusion({a:1})); passed++;
assert.ok(PediatricVertebralTethering()); passed++;
assert.ok(PediatricVertebralTethering({a:1})); passed++;
assert.ok(PediatricMagneticallyControlledGrowingRod()); passed++;
assert.ok(PediatricMagneticallyControlledGrowingRod({a:1})); passed++;
assert.ok(PediatricGrowingRod()); passed++;
assert.ok(PediatricGrowingRod({a:1})); passed++;
assert.ok(PediatricSpinalDeformity()); passed++;
assert.ok(PediatricSpinalDeformity({a:1})); passed++;
assert.ok(PediatricKyphosisCorrection()); passed++;
assert.ok(PediatricKyphosisCorrection({a:1})); passed++;
assert.ok(PediatricLordosisCorrection()); passed++;
assert.ok(PediatricLordosisCorrection({a:1})); passed++;
assert.ok(PediatricSpondylolisthesis()); passed++;
assert.ok(PediatricSpondylolisthesis({a:1})); passed++;

console.log('pcc_pediatric_surg_ext20 unit:', passed, 'passed');
