// P3-EC pcc_hand_surgery unit tests
const Engine = require('./pcc_hand_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_hand_surgery engine tests:');
it('CarpalTunnelRelease', () => assertEq(Engine.CarpalTunnelRelease({ t: 'yes' }).plan, 'carpalTunnelRelease-protocol'));
it('TriggerFingerRelease', () => assertEq(Engine.TriggerFingerRelease({ t: 'yes' }).plan, 'triggerFingerRelease-protocol'));
it('DupuytrenContracture', () => assertEq(Engine.DupuytrenContracture({ t: 'yes' }).plan, 'dupuytrenContracture-protocol'));
it('DeQuervainRelease', () => assertEq(Engine.DeQuervainRelease({ t: 'yes' }).plan, 'deQuervainRelease-protocol'));
it('TendonRepairZone', () => assertEq(Engine.TendonRepairZone({ t: 'yes' }).plan, 'tendonRepairZone-protocol'));
it('NerveRepairIndications', () => assertEq(Engine.NerveRepairIndications({ t: 'yes' }).plan, 'nerveRepairIndications-protocol'));
it('FractureReductionHand', () => assertEq(Engine.FractureReductionHand({ t: 'yes' }).plan, 'fractureReductionHand-protocol'));
it('ReplantationDecision', () => assertEq(Engine.ReplantationDecision({ t: 'yes' }).plan, 'replantationDecision-protocol'));
it('CongenitalHandDifference', () => assertEq(Engine.CongenitalHandDifference({ t: 'yes' }).plan, 'congenitalHandDifference-protocol'));
it('WristArthroscopyIndication', () => assertEq(Engine.WristArthroscopyIndication({ t: 'yes' }).plan, 'wristArthroscopyIndication-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
