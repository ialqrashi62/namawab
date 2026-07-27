// P3-EA pcc_wound_care_advanced unit tests
const Engine = require('./pcc_wound_care_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_wound_care_advanced engine tests:');
it('DiabeticFootUlcerStaging', () => assertEq(Engine.DiabeticFootUlcerStaging({ t: 'yes' }).plan, 'diabeticFootUlcerStaging-protocol'));
it('PressureInjuryStaging', () => assertEq(Engine.PressureInjuryStaging({ t: 'yes' }).plan, 'pressureInjuryStaging-protocol'));
it('VenousLegUlcerCompression', () => assertEq(Engine.VenousLegUlcerCompression({ t: 'yes' }).plan, 'venousLegUlcerCompression-protocol'));
it('ArterialWoundAssessment', () => assertEq(Engine.ArterialWoundAssessment({ t: 'yes' }).plan, 'arterialWoundAssessment-protocol'));
it('WoundBiofilmManagement', () => assertEq(Engine.WoundBiofilmManagement({ t: 'yes' }).plan, 'woundBiofilmManagement-protocol'));
it('NegativePressureWoundTherapy', () => assertEq(Engine.NegativePressureWoundTherapy({ t: 'yes' }).plan, 'negativePressureWoundTherapy-protocol'));
it('HyperbaricOxygenIndication', () => assertEq(Engine.HyperbaricOxygenIndication({ t: 'yes' }).plan, 'hyperbaricOxygenIndication-protocol'));
it('SkinGraftSelection', () => assertEq(Engine.SkinGraftSelection({ t: 'yes' }).plan, 'skinGraftSelection-protocol'));
it('FlapCoverageDecision', () => assertEq(Engine.FlapCoverageDecision({ t: 'yes' }).plan, 'flapCoverageDecision-protocol'));
it('WoundCareNutritionProtocol', () => assertEq(Engine.WoundCareNutritionProtocol({ t: 'yes' }).plan, 'woundCareNutritionProtocol-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
