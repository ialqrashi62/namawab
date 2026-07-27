// P3-DG pcc_adrenal_health unit tests
const Engine = require('./pcc_adrenal_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_adrenal_health engine tests:');
it('CortisolCurve', () => assertEq(Engine.CortisolCurve({ t: 'yes' }).plan, 'cortisolcurve-protocol'));
it('DHEASLevel', () => assertEq(Engine.DHEASLevel({ t: 'yes' }).plan, 'dheaslevel-protocol'));
it('AdrenalFatigue', () => assertEq(Engine.AdrenalFatigue({ t: 'yes' }).plan, 'adrenalfatigue-protocol'));
it('StressResponse', () => assertEq(Engine.StressResponse({ t: 'yes' }).plan, 'stressresponse-protocol'));
it('HPAAxis', () => assertEq(Engine.HPAAxis({ t: 'yes' }).plan, 'hpaaxis-protocol'));
it('AldosteroneBalance', () => assertEq(Engine.AldosteroneBalance({ t: 'yes' }).plan, 'aldosteronebalance-protocol'));
it('SaltCraving', () => assertEq(Engine.SaltCraving({ t: 'yes' }).plan, 'saltcraving-protocol'));
it('MorningCortisol', () => assertEq(Engine.MorningCortisol({ t: 'yes' }).plan, 'morningcortisol-protocol'));
it('ACTHStimulation', () => assertEq(Engine.ACTHStimulation({ t: 'yes' }).plan, 'acthstimulation-protocol'));
it('AdrenalCrisis', () => assertEq(Engine.AdrenalCrisis({ t: 'yes' }).plan, 'adrenalcrisis-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
