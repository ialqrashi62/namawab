// P3-EO pcc_pediatric_cardio_ext unit tests
const Engine = require('./pcc_pediatric_cardio_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_cardio_ext engine tests:');
it('PediatricCHF', () => assertEq(Engine.PediatricCHF({ t: 'yes' }).plan, 'pediatricCHF-protocol'));
it('PediatricArrhythmiaEval', () => assertEq(Engine.PediatricArrhythmiaEval({ t: 'yes' }).plan, 'pediatricArrhythmiaEval-protocol'));
it('PediatricHypertensionEval', () => assertEq(Engine.PediatricHypertensionEval({ t: 'yes' }).plan, 'pediatricHypertensionEval-protocol'));
it('PediatricLipidDisorder', () => assertEq(Engine.PediatricLipidDisorder({ t: 'yes' }).plan, 'pediatricLipidDisorder-protocol'));
it('PediatricKawasakiLongTerm', () => assertEq(Engine.PediatricKawasakiLongTerm({ t: 'yes' }).plan, 'pediatricKawasakiLongTerm-protocol'));
it('PediatricCardiomyopathy', () => assertEq(Engine.PediatricCardiomyopathy({ t: 'yes' }).plan, 'pediatricCardiomyopathy-protocol'));
it('PediatricHeartTransplant', () => assertEq(Engine.PediatricHeartTransplant({ t: 'yes' }).plan, 'pediatricHeartTransplant-protocol'));
it('PediatricFontan', () => assertEq(Engine.PediatricFontan({ t: 'yes' }).plan, 'pediatricFontan-protocol'));
it('PediatricTetralogy', () => assertEq(Engine.PediatricTetralogy({ t: 'yes' }).plan, 'pediatricTetralogy-protocol'));
it('PediatricVSD', () => assertEq(Engine.PediatricVSD({ t: 'yes' }).plan, 'pediatricVSD-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
