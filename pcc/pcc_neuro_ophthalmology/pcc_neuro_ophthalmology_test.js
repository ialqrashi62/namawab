// P3-DZ pcc_neuro_ophthalmology unit tests
const Engine = require('./pcc_neuro_ophthalmology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ophthalmology engine tests:');
it('PapilledemaEvaluation', () => assertEq(Engine.PapilledemaEvaluation({ t: 'yes' }).plan, 'papilledemaEvaluation-protocol'));
it('OpticNeuritisWorkup', () => assertEq(Engine.OpticNeuritisWorkup({ t: 'yes' }).plan, 'opticNeuritisWorkup-protocol'));
it('AnteriorIschemicOpticNeuropathy', () => assertEq(Engine.AnteriorIschemicOpticNeuropathy({ t: 'yes' }).plan, 'anteriorIschemicOpticNeuropathy-protocol'));
it('HomonymousHemianopiaLocalization', () => assertEq(Engine.HomonymousHemianopiaLocalization({ t: 'yes' }).plan, 'homonymousHemianopiaLocalization-protocol'));
it('CranialNervePalsy', () => assertEq(Engine.CranialNervePalsy({ t: 'yes' }).plan, 'cranialNervePalsy-protocol'));
it('PupilAssessmentNeuro', () => assertEq(Engine.PupilAssessmentNeuro({ t: 'yes' }).plan, 'pupilAssessmentNeuro-protocol'));
it('VisualFieldDefectInterpretation', () => assertEq(Engine.VisualFieldDefectInterpretation({ t: 'yes' }).plan, 'visualFieldDefectInterpretation-protocol'));
it('OcularMotorAssessment', () => assertEq(Engine.OcularMotorAssessment({ t: 'yes' }).plan, 'ocularMotorAssessment-protocol'));
it('NystagmusLocalization', () => assertEq(Engine.NystagmusLocalization({ t: 'yes' }).plan, 'nystagmusLocalization-protocol'));
it('TransientMonocularVisionLoss', () => assertEq(Engine.TransientMonocularVisionLoss({ t: 'yes' }).plan, 'transientMonocularVisionLoss-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
