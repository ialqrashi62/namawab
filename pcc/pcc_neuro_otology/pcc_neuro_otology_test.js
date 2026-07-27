// P3-ED pcc_neuro_otology unit tests
const Engine = require('./pcc_neuro_otology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_otology engine tests:');
it('VestibularMigraineAssessment', () => assertEq(Engine.VestibularMigraineAssessment({ t: 'yes' }).plan, 'vestibularMigraineAssessment-protocol'));
it('MeniereDiseaseManagement', () => assertEq(Engine.MeniereDiseaseManagement({ t: 'yes' }).plan, 'meniereDiseaseManagement-protocol'));
it('BPPVCanalithRepositioning', () => assertEq(Engine.BPPVCanalithRepositioning({ t: 'yes' }).plan, 'bPPVCanalithRepositioning-protocol'));
it('AcousticNeuromaScreening', () => assertEq(Engine.AcousticNeuromaScreening({ t: 'yes' }).plan, 'acousticNeuromaScreening-protocol'));
it('SuddenHearingLossProtocol', () => assertEq(Engine.SuddenHearingLossProtocol({ t: 'yes' }).plan, 'suddenHearingLossProtocol-protocol'));
it('TinnitusAssessment', () => assertEq(Engine.TinnitusAssessment({ t: 'yes' }).plan, 'tinnitusAssessment-protocol'));
it('OtotoxicityMonitoring', () => assertEq(Engine.OtotoxicityMonitoring({ t: 'yes' }).plan, 'ototoxicityMonitoring-protocol'));
it('CochlearImplantCandidacy', () => assertEq(Engine.CochlearImplantCandidacy({ t: 'yes' }).plan, 'cochlearImplantCandidacy-protocol'));
it('SuperiorCanalDehiscence', () => assertEq(Engine.SuperiorCanalDehiscence({ t: 'yes' }).plan, 'superiorCanalDehiscence-protocol'));
it('AutoimmuneInnerEarDisease', () => assertEq(Engine.AutoimmuneInnerEarDisease({ t: 'yes' }).plan, 'autoimmuneInnerEarDisease-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
