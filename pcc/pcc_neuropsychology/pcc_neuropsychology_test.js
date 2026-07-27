// P3-EF pcc_neuropsychology unit tests
const Engine = require('./pcc_neuropsychology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuropsychology engine tests:');
it('NeuropsychologicalAssessment', () => assertEq(Engine.NeuropsychologicalAssessment({ t: 'yes' }).plan, 'neuropsychologicalAssessment-protocol'));
it('CognitiveRehabilitationPlan', () => assertEq(Engine.CognitiveRehabilitationPlan({ t: 'yes' }).plan, 'cognitiveRehabilitationPlan-protocol'));
it('DementiaDifferential', () => assertEq(Engine.DementiaDifferential({ t: 'yes' }).plan, 'dementiaDifferential-protocol'));
it('TraumaticBrainInjuryEval', () => assertEq(Engine.TraumaticBrainInjuryEval({ t: 'yes' }).plan, 'traumaticBrainInjuryEval-protocol'));
it('ADHDAdultAssessment', () => assertEq(Engine.ADHDAdultAssessment({ t: 'yes' }).plan, 'aDHDAdultAssessment-protocol'));
it('AutismSpectrumEval', () => assertEq(Engine.AutismSpectrumEval({ t: 'yes' }).plan, 'autismSpectrumEval-protocol'));
it('LearningDisorderEval', () => assertEq(Engine.LearningDisorderEval({ t: 'yes' }).plan, 'learningDisorderEval-protocol'));
it('ExecutiveFunctionAssessment', () => assertEq(Engine.ExecutiveFunctionAssessment({ t: 'yes' }).plan, 'executiveFunctionAssessment-protocol'));
it('MemoryDisorderEval', () => assertEq(Engine.MemoryDisorderEval({ t: 'yes' }).plan, 'memoryDisorderEval-protocol'));
it('NeuropsychiatricSyndrome', () => assertEq(Engine.NeuropsychiatricSyndrome({ t: 'yes' }).plan, 'neuropsychiatricSyndrome-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
