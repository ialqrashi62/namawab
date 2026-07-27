// P3-EC pcc_pediatric_cardiology unit tests
const Engine = require('./pcc_pediatric_cardiology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_cardiology engine tests:');
it('CongenitalHeartDiseaseAssessment', () => assertEq(Engine.CongenitalHeartDiseaseAssessment({ t: 'yes' }).plan, 'congenitalHeartDiseaseAssessment-protocol'));
it('PediatricECGInterpretation', () => assertEq(Engine.PediatricECGInterpretation({ t: 'yes' }).plan, 'pediatricECGInterpretation-protocol'));
it('KawasakiDiseaseManagement', () => assertEq(Engine.KawasakiDiseaseManagement({ t: 'yes' }).plan, 'kawasakiDiseaseManagement-protocol'));
it('PediatricEchocardiography', () => assertEq(Engine.PediatricEchocardiography({ t: 'yes' }).plan, 'pediatricEchocardiography-protocol'));
it('PediatricHeartFailure', () => assertEq(Engine.PediatricHeartFailure({ t: 'yes' }).plan, 'pediatricHeartFailure-protocol'));
it('TetralogyOfFallot', () => assertEq(Engine.TetralogyOfFallot({ t: 'yes' }).plan, 'tetralogyOfFallot-protocol'));
it('VSDManagement', () => assertEq(Engine.VSDManagement({ t: 'yes' }).plan, 'vSDManagement-protocol'));
it('AtrialSeptalDefectClosure', () => assertEq(Engine.AtrialSeptalDefectClosure({ t: 'yes' }).plan, 'atrialSeptalDefectClosure-protocol'));
it('PediatricArrhythmia', () => assertEq(Engine.PediatricArrhythmia({ t: 'yes' }).plan, 'pediatricArrhythmia-protocol'));
it('FontanCirculationManagement', () => assertEq(Engine.FontanCirculationManagement({ t: 'yes' }).plan, 'fontanCirculationManagement-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
