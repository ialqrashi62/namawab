// P3-DV pcc_transplant_ext2 unit tests
const Engine = require('./pcc_transplant_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_transplant_ext2 engine tests:');
it('ABOCompatibilityExtended', () => assertEq(Engine.ABOCompatibilityExtended({ t: 'yes' }).plan, 'aBOCompatibilityExtended-protocol'));
it('HLAtypingExtended', () => assertEq(Engine.HLAtypingExtended({ t: 'yes' }).plan, 'hLAtypingExtended-protocol'));
it('CrossmatchVirtual', () => assertEq(Engine.CrossmatchVirtual({ t: 'yes' }).plan, 'crossmatchVirtual-protocol'));
it('ImmunosuppressionProtocol', () => assertEq(Engine.ImmunosuppressionProtocol({ t: 'yes' }).plan, 'immunosuppressionProtocol-protocol'));
it('RejectionSurveillance', () => assertEq(Engine.RejectionSurveillance({ t: 'yes' }).plan, 'rejectionSurveillance-protocol'));
it('DonorRecipientMatching', () => assertEq(Engine.DonorRecipientMatching({ t: 'yes' }).plan, 'donorRecipientMatching-protocol'));
it('PostTransplantInfection', () => assertEq(Engine.PostTransplantInfection({ t: 'yes' }).plan, 'postTransplantInfection-protocol'));
it('GVHDProphylaxis', () => assertEq(Engine.GVHDProphylaxis({ t: 'yes' }).plan, 'gVHDProphylaxis-protocol'));
it('TransplantPharmacogenomics', () => assertEq(Engine.TransplantPharmacogenomics({ t: 'yes' }).plan, 'transplantPharmacogenomics-protocol'));
it('LongTermGraftSurvival', () => assertEq(Engine.LongTermGraftSurvival({ t: 'yes' }).plan, 'longTermGraftSurvival-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
