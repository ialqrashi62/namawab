// P3-ET pcc_pediatric_neuro_surg_ext unit tests
const Engine = require('./pcc_pediatric_neuro_surg_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro_surg_ext engine tests:');
it('PediatricSelectiveDorsalRhizotomy', () => assertEq(Engine.PediatricSelectiveDorsalRhizotomy({ t: 'yes' }).plan, 'pediatricSelectiveDorsalRhizotomy-protocol'));
it('PediatricIntrathecalBaclofen', () => assertEq(Engine.PediatricIntrathecalBaclofen({ t: 'yes' }).plan, 'pediatricIntrathecalBaclofen-protocol'));
it('PediatricVagalNerveStimulator', () => assertEq(Engine.PediatricVagalNerveStimulator({ t: 'yes' }).plan, 'pediatricVagalNerveStimulator-protocol'));
it('PediatricDeepBrainStimulation', () => assertEq(Engine.PediatricDeepBrainStimulation({ t: 'yes' }).plan, 'pediatricDeepBrainStimulation-protocol'));
it('PediatricSpinalFusionSurg', () => assertEq(Engine.PediatricSpinalFusionSurg({ t: 'yes' }).plan, 'pediatricSpinalFusionSurg-protocol'));
it('PediatricTetheredCordRelease', () => assertEq(Engine.PediatricTetheredCordRelease({ t: 'yes' }).plan, 'pediatricTetheredCordRelease-protocol'));
it('PediatricScoliosisSurg', () => assertEq(Engine.PediatricScoliosisSurg({ t: 'yes' }).plan, 'pediatricScoliosisSurg-protocol'));
it('PediatricCraniectomy', () => assertEq(Engine.PediatricCraniectomy({ t: 'yes' }).plan, 'pediatricCraniectomy-protocol'));
it('PediatricSkullBaseSurg', () => assertEq(Engine.PediatricSkullBaseSurg({ t: 'yes' }).plan, 'pediatricSkullBaseSurg-protocol'));
it('PediatricEndoscopicThirdVentriculostomy', () => assertEq(Engine.PediatricEndoscopicThirdVentriculostomy({ t: 'yes' }).plan, 'pediatricEndoscopicThirdVentriculostomy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
