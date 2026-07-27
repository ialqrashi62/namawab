// P3-EB pcc_plastic_surgery_ext unit tests
const Engine = require('./pcc_plastic_surgery_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_plastic_surgery_ext engine tests:');
it('BreastReconstructionSelection', () => assertEq(Engine.BreastReconstructionSelection({ t: 'yes' }).plan, 'breastReconstructionSelection-protocol'));
it('BurnReconstructionTiming', () => assertEq(Engine.BurnReconstructionTiming({ t: 'yes' }).plan, 'burnReconstructionTiming-protocol'));
it('CleftLipRepairTiming', () => assertEq(Engine.CleftLipRepairTiming({ t: 'yes' }).plan, 'cleftLipRepairTiming-protocol'));
it('CleftPalateRepair', () => assertEq(Engine.CleftPalateRepair({ t: 'yes' }).plan, 'cleftPalateRepair-protocol'));
it('CraniosynostosisSurgery', () => assertEq(Engine.CraniosynostosisSurgery({ t: 'yes' }).plan, 'craniosynostosisSurgery-protocol'));
it('HandReplantationDecision', () => assertEq(Engine.HandReplantationDecision({ t: 'yes' }).plan, 'handReplantationDecision-protocol'));
it('MicrosurgeryFreeFlap', () => assertEq(Engine.MicrosurgeryFreeFlap({ t: 'yes' }).plan, 'microsurgeryFreeFlap-protocol'));
it('ScarRevisionIndication', () => assertEq(Engine.ScarRevisionIndication({ t: 'yes' }).plan, 'scarRevisionIndication-protocol'));
it('SkinCancerReconstruction', () => assertEq(Engine.SkinCancerReconstruction({ t: 'yes' }).plan, 'skinCancerReconstruction-protocol'));
it('GenderAffirmingSurgery', () => assertEq(Engine.GenderAffirmingSurgery({ t: 'yes' }).plan, 'genderAffirmingSurgery-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
