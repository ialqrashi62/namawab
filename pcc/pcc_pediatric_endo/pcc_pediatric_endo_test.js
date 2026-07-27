// P3-EG pcc_pediatric_endo unit tests
const Engine = require('./pcc_pediatric_endo_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_endo engine tests:');
it('PediatricDiabetesType1', () => assertEq(Engine.PediatricDiabetesType1({ t: 'yes' }).plan, 'pediatricDiabetesType1-protocol'));
it('PediatricThyroidDisease', () => assertEq(Engine.PediatricThyroidDisease({ t: 'yes' }).plan, 'pediatricThyroidDisease-protocol'));
it('CongenitalAdrenalHyperplasia', () => assertEq(Engine.CongenitalAdrenalHyperplasia({ t: 'yes' }).plan, 'congenitalAdrenalHyperplasia-protocol'));
it('PediatricGrowthDisorder', () => assertEq(Engine.PediatricGrowthDisorder({ t: 'yes' }).plan, 'pediatricGrowthDisorder-protocol'));
it('PediatricPubertyDisorders', () => assertEq(Engine.PediatricPubertyDisorders({ t: 'yes' }).plan, 'pediatricPubertyDisorders-protocol'));
it('PediatricObesityEndocrine', () => assertEq(Engine.PediatricObesityEndocrine({ t: 'yes' }).plan, 'pediatricObesityEndocrine-protocol'));
it('PediatricBoneDisease', () => assertEq(Engine.PediatricBoneDisease({ t: 'yes' }).plan, 'pediatricBoneDisease-protocol'));
it('PediatricPituitaryDisorders', () => assertEq(Engine.PediatricPituitaryDisorders({ t: 'yes' }).plan, 'pediatricPituitaryDisorders-protocol'));
it('PediatricLipidDisorders', () => assertEq(Engine.PediatricLipidDisorders({ t: 'yes' }).plan, 'pediatricLipidDisorders-protocol'));
it('NeonatalThyroidScreening', () => assertEq(Engine.NeonatalThyroidScreening({ t: 'yes' }).plan, 'neonatalThyroidScreening-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
