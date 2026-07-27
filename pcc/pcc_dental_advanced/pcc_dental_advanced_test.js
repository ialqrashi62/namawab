// P3-ED pcc_dental_advanced unit tests
const Engine = require('./pcc_dental_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_dental_advanced engine tests:');
it('ImpactedThirdMolarAssessment', () => assertEq(Engine.ImpactedThirdMolarAssessment({ t: 'yes' }).plan, 'impactedThirdMolarAssessment-protocol'));
it('DentalImplantCandidacy', () => assertEq(Engine.DentalImplantCandidacy({ t: 'yes' }).plan, 'dentalImplantCandidacy-protocol'));
it('OrthognathicSurgeryPlanning', () => assertEq(Engine.OrthognathicSurgeryPlanning({ t: 'yes' }).plan, 'orthognathicSurgeryPlanning-protocol'));
it('TemporomandibularDisorder', () => assertEq(Engine.TemporomandibularDisorder({ t: 'yes' }).plan, 'temporomandibularDisorder-protocol'));
it('OralCancerScreening', () => assertEq(Engine.OralCancerScreening({ t: 'yes' }).plan, 'oralCancerScreening-protocol'));
it('PeriodontalDiseaseStaging', () => assertEq(Engine.PeriodontalDiseaseStaging({ t: 'yes' }).plan, 'periodontalDiseaseStaging-protocol'));
it('EndodonticTreatmentPlan', () => assertEq(Engine.EndodonticTreatmentPlan({ t: 'yes' }).plan, 'endodonticTreatmentPlan-protocol'));
it('ProsthodonticRehabilitation', () => assertEq(Engine.ProsthodonticRehabilitation({ t: 'yes' }).plan, 'prosthodonticRehabilitation-protocol'));
it('PediatricDentalCaries', () => assertEq(Engine.PediatricDentalCaries({ t: 'yes' }).plan, 'pediatricDentalCaries-protocol'));
it('OralPathologyBiopsyIndication', () => assertEq(Engine.OralPathologyBiopsyIndication({ t: 'yes' }).plan, 'oralPathologyBiopsyIndication-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
