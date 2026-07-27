// P3-EQ pcc_pediatric_pulm_ext unit tests
const Engine = require('./pcc_pediatric_pulm_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_pulm_ext engine tests:');
it('PediatricBronchopulmonaryDysplasia', () => assertEq(Engine.PediatricBronchopulmonaryDysplasia({ t: 'yes' }).plan, 'pediatricBronchopulmonaryDysplasia-protocol'));
it('PediatricPulmonaryHypertensionExt', () => assertEq(Engine.PediatricPulmonaryHypertensionExt({ t: 'yes' }).plan, 'pediatricPulmonaryHypertensionExt-protocol'));
it('PediatricInterstitialLungDisease', () => assertEq(Engine.PediatricInterstitialLungDisease({ t: 'yes' }).plan, 'pediatricInterstitialLungDisease-protocol'));
it('PediatricBronchiectasis', () => assertEq(Engine.PediatricBronchiectasis({ t: 'yes' }).plan, 'pediatricBronchiectasis-protocol'));
it('PediatricPlasticBronchitis', () => assertEq(Engine.PediatricPlasticBronchitis({ t: 'yes' }).plan, 'pediatricPlasticBronchitis-protocol'));
it('PediatricPulmonaryAlveolarProteinosis', () => assertEq(Engine.PediatricPulmonaryAlveolarProteinosis({ t: 'yes' }).plan, 'pediatricPulmonaryAlveolarProteinosis-protocol'));
it('PediatricSurfactantDysfunction', () => assertEq(Engine.PediatricSurfactantDysfunction({ t: 'yes' }).plan, 'pediatricSurfactantDysfunction-protocol'));
it('PediatricPulmonaryHemosiderosis', () => assertEq(Engine.PediatricPulmonaryHemosiderosis({ t: 'yes' }).plan, 'pediatricPulmonaryHemosiderosis-protocol'));
it('PediatricChILD', () => assertEq(Engine.PediatricChILD({ t: 'yes' }).plan, 'pediatricChILD-protocol'));
it('PediatricLungTransplant', () => assertEq(Engine.PediatricLungTransplant({ t: 'yes' }).plan, 'pediatricLungTransplant-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
