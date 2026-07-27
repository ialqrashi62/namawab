// P3-ET pcc_pediatric_endo_ext2 unit tests
const Engine = require('./pcc_pediatric_endo_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_endo_ext2 engine tests:');
it('PediatricPCOSEval', () => assertEq(Engine.PediatricPCOSEval({ t: 'yes' }).plan, 'pediatricPCOSEval-protocol'));
it('PediatricHirsutismEval', () => assertEq(Engine.PediatricHirsutismEval({ t: 'yes' }).plan, 'pediatricHirsutismEval-protocol'));
it('PediatricPrecociousPuberty', () => assertEq(Engine.PediatricPrecociousPuberty({ t: 'yes' }).plan, 'pediatricPrecociousPuberty-protocol'));
it('PediatricDelayedPubertyExt', () => assertEq(Engine.PediatricDelayedPubertyExt({ t: 'yes' }).plan, 'pediatricDelayedPubertyExt-protocol'));
it('PediatricGenderIdentityEval', () => assertEq(Engine.PediatricGenderIdentityEval({ t: 'yes' }).plan, 'pediatricGenderIdentityEval-protocol'));
it('PediatricAdrenalTumor', () => assertEq(Engine.PediatricAdrenalTumor({ t: 'yes' }).plan, 'pediatricAdrenalTumor-protocol'));
it('PediatricPituitaryTumor', () => assertEq(Engine.PediatricPituitaryTumor({ t: 'yes' }).plan, 'pediatricPituitaryTumor-protocol'));
it('PediatricThyroidNodule', () => assertEq(Engine.PediatricThyroidNodule({ t: 'yes' }).plan, 'pediatricThyroidNodule-protocol'));
it('PediatricParathyroidEval', () => assertEq(Engine.PediatricParathyroidEval({ t: 'yes' }).plan, 'pediatricParathyroidEval-protocol'));
it('PediatricBoneHealthEval', () => assertEq(Engine.PediatricBoneHealthEval({ t: 'yes' }).plan, 'pediatricBoneHealthEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
