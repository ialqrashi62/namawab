// P3-EP pcc_pediatric_endo_ext unit tests
const Engine = require('./pcc_pediatric_endo_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_endo_ext engine tests:');
it('PediatricType2Diabetes', () => assertEq(Engine.PediatricType2Diabetes({ t: 'yes' }).plan, 'pediatricType2Diabetes-protocol'));
it('PediatricMODY', () => assertEq(Engine.PediatricMODY({ t: 'yes' }).plan, 'pediatricMODY-protocol'));
it('PediatricNeonatalDiabetes', () => assertEq(Engine.PediatricNeonatalDiabetes({ t: 'yes' }).plan, 'pediatricNeonatalDiabetes-protocol'));
it('PediatricHypothyroidism', () => assertEq(Engine.PediatricHypothyroidism({ t: 'yes' }).plan, 'pediatricHypothyroidism-protocol'));
it('PediatricHyperthyroidism', () => assertEq(Engine.PediatricHyperthyroidism({ t: 'yes' }).plan, 'pediatricHyperthyroidism-protocol'));
it('PediatricThyroidCancer', () => assertEq(Engine.PediatricThyroidCancer({ t: 'yes' }).plan, 'pediatricThyroidCancer-protocol'));
it('PediatricAdrenalInsufficiency', () => assertEq(Engine.PediatricAdrenalInsufficiency({ t: 'yes' }).plan, 'pediatricAdrenalInsufficiency-protocol'));
it('PediatricCushingSyndrome', () => assertEq(Engine.PediatricCushingSyndrome({ t: 'yes' }).plan, 'pediatricCushingSyndrome-protocol'));
it('PediatricHypogonadism', () => assertEq(Engine.PediatricHypogonadism({ t: 'yes' }).plan, 'pediatricHypogonadism-protocol'));
it('PediatricDelayedPuberty', () => assertEq(Engine.PediatricDelayedPuberty({ t: 'yes' }).plan, 'pediatricDelayedPuberty-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
