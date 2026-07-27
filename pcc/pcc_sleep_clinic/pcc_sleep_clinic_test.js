// P3-DX pcc_sleep_clinic unit tests
const Engine = require('./pcc_sleep_clinic_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sleep_clinic engine tests:');
it('PolysomnographyInterpretation', () => assertEq(Engine.PolysomnographyInterpretation({ t: 'yes' }).plan, 'polysomnographyInterpretation-protocol'));
it('OSAHSeverityStratification', () => assertEq(Engine.OSAHSeverityStratification({ t: 'yes' }).plan, 'oSAHSeverityStratification-protocol'));
it('CPAPTitrationProtocol', () => assertEq(Engine.CPAPTitrationProtocol({ t: 'yes' }).plan, 'cPAPTitrationProtocol-protocol'));
it('BiPAPIndication', () => assertEq(Engine.BiPAPIndication({ t: 'yes' }).plan, 'biPAPIndication-protocol'));
it('InsomniaCBTProtocol', () => assertEq(Engine.InsomniaCBTProtocol({ t: 'yes' }).plan, 'insomniaCBTProtocol-protocol'));
it('RestlessLegSyndrome', () => assertEq(Engine.RestlessLegSyndrome({ t: 'yes' }).plan, 'restlessLegSyndrome-protocol'));
it('NarcolepsyDiagnosis', () => assertEq(Engine.NarcolepsyDiagnosis({ t: 'yes' }).plan, 'narcolepsyDiagnosis-protocol'));
it('CircadianRhythmDisorder', () => assertEq(Engine.CircadianRhythmDisorder({ t: 'yes' }).plan, 'circadianRhythmDisorder-protocol'));
it('ParasomniaEvaluation', () => assertEq(Engine.ParasomniaEvaluation({ t: 'yes' }).plan, 'parasomniaEvaluation-protocol'));
it('SleepHygieneEducation', () => assertEq(Engine.SleepHygieneEducation({ t: 'yes' }).plan, 'sleepHygieneEducation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
