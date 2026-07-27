// P3-DZ pcc_breast_imaging unit tests
const Engine = require('./pcc_breast_imaging_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_breast_imaging engine tests:');
it('BIRADSCategorization', () => assertEq(Engine.BIRADSCategorization({ t: 'yes' }).plan, 'bIRADSCategorization-protocol'));
it('MammogramRecallProtocol', () => assertEq(Engine.MammogramRecallProtocol({ t: 'yes' }).plan, 'mammogramRecallProtocol-protocol'));
it('BreastUSIndication', () => assertEq(Engine.BreastUSIndication({ t: 'yes' }).plan, 'breastUSIndication-protocol'));
it('BreastMRIHighRisk', () => assertEq(Engine.BreastMRIHighRisk({ t: 'yes' }).plan, 'breastMRIHighRisk-protocol'));
it('TomosynthesisInterpretation', () => assertEq(Engine.TomosynthesisInterpretation({ t: 'yes' }).plan, 'tomosynthesisInterpretation-protocol'));
it('DuctalCarcinomaInSitu', () => assertEq(Engine.DuctalCarcinomaInSitu({ t: 'yes' }).plan, 'ductalCarcinomaInSitu-protocol'));
it('AtypiaManagement', () => assertEq(Engine.AtypiaManagement({ t: 'yes' }).plan, 'atypiaManagement-protocol'));
it('BreastLesionBiopsyIndication', () => assertEq(Engine.BreastLesionBiopsyIndication({ t: 'yes' }).plan, 'breastLesionBiopsyIndication-protocol'));
it('ImplantRuptureImaging', () => assertEq(Engine.ImplantRuptureImaging({ t: 'yes' }).plan, 'implantRuptureImaging-protocol'));
it('MaleBreastImaging', () => assertEq(Engine.MaleBreastImaging({ t: 'yes' }).plan, 'maleBreastImaging-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
