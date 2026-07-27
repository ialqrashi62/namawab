// P3-EC pcc_psychogeriatrics unit tests
const Engine = require('./pcc_psychogeriatrics_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_psychogeriatrics engine tests:');
it('DementiaAssessment', () => assertEq(Engine.DementiaAssessment({ t: 'yes' }).plan, 'dementiaAssessment-protocol'));
it('AlzheimerDiseaseStaging', () => assertEq(Engine.AlzheimerDiseaseStaging({ t: 'yes' }).plan, 'alzheimerDiseaseStaging-protocol'));
it('LewyBodyDementia', () => assertEq(Engine.LewyBodyDementia({ t: 'yes' }).plan, 'lewyBodyDementia-protocol'));
it('VascularDementia', () => assertEq(Engine.VascularDementia({ t: 'yes' }).plan, 'vascularDementia-protocol'));
it('BehavioralPsychiatricSymptomsDementia', () => assertEq(Engine.BehavioralPsychiatricSymptomsDementia({ t: 'yes' }).plan, 'behavioralPsychiatricSymptomsDementia-protocol'));
it('AntipsychoticInElderly', () => assertEq(Engine.AntipsychoticInElderly({ t: 'yes' }).plan, 'antipsychoticInElderly-protocol'));
it('DepressionInElderly', () => assertEq(Engine.DepressionInElderly({ t: 'yes' }).plan, 'depressionInElderly-protocol'));
it('FallsRiskDementia', () => assertEq(Engine.FallsRiskDementia({ t: 'yes' }).plan, 'fallsRiskDementia-protocol'));
it('CaregiverBurnout', () => assertEq(Engine.CaregiverBurnout({ t: 'yes' }).plan, 'caregiverBurnout-protocol'));
it('CapacityAssessment', () => assertEq(Engine.CapacityAssessment({ t: 'yes' }).plan, 'capacityAssessment-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
