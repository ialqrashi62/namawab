// P3-ER pcc_pediatric_gi_ext2 unit tests
const Engine = require('./pcc_pediatric_gi_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_gi_ext2 engine tests:');
it('PediatricGERDEvalExt', () => assertEq(Engine.PediatricGERDEvalExt({ t: 'yes' }).plan, 'pediatricGERDEvalExt-protocol'));
it('PediatricEosinophilicEsophagitis', () => assertEq(Engine.PediatricEosinophilicEsophagitis({ t: 'yes' }).plan, 'pediatricEosinophilicEsophagitis-protocol'));
it('PediatricCeliacExt', () => assertEq(Engine.PediatricCeliacExt({ t: 'yes' }).plan, 'pediatricCeliacExt-protocol'));
it('PediatricIBDExt', () => assertEq(Engine.PediatricIBDExt({ t: 'yes' }).plan, 'pediatricIBDExt-protocol'));
it('PediatricHirschsprungExt', () => assertEq(Engine.PediatricHirschsprungExt({ t: 'yes' }).plan, 'pediatricHirschsprungExt-protocol'));
it('PediatricPyloricStenosisExt', () => assertEq(Engine.PediatricPyloricStenosisExt({ t: 'yes' }).plan, 'pediatricPyloricStenosisExt-protocol'));
it('PediatricIntussusceptionExt', () => assertEq(Engine.PediatricIntussusceptionExt({ t: 'yes' }).plan, 'pediatricIntussusceptionExt-protocol'));
it('PediatricHepatologyExt', () => assertEq(Engine.PediatricHepatologyExt({ t: 'yes' }).plan, 'pediatricHepatologyExt-protocol'));
it('PediatricPancreatitisExt', () => assertEq(Engine.PediatricPancreatitisExt({ t: 'yes' }).plan, 'pediatricPancreatitisExt-protocol'));
it('PediatricLiverDiseaseExt', () => assertEq(Engine.PediatricLiverDiseaseExt({ t: 'yes' }).plan, 'pediatricLiverDiseaseExt-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
