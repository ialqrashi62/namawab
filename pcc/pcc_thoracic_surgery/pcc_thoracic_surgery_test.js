// P3-DK pcc_thoracic_surgery unit tests
const Engine = require('./pcc_thoracic_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_thoracic_surgery engine tests:');
it('ThoracotomyRisk', () => assertEq(Engine.ThoracotomyRisk({ t: 'yes' }).plan, 'thoracotomyrisk-protocol'));
it('VatsEligibility', () => assertEq(Engine.VatsEligibility({ t: 'yes' }).plan, 'vatseligibility-protocol'));
it('LobectomyAssessment', () => assertEq(Engine.LobectomyAssessment({ t: 'yes' }).plan, 'lobectomyassessment-protocol'));
it('ChestTubeProtocol', () => assertEq(Engine.ChestTubeProtocol({ t: 'yes' }).plan, 'chesttubeprotocol-protocol'));
it('PneumothoraxManagement', () => assertEq(Engine.PneumothoraxManagement({ t: 'yes' }).plan, 'pneumothoraxmanagement-protocol'));
it('PleuralEffusionPlan', () => assertEq(Engine.PleuralEffusionPlan({ t: 'yes' }).plan, 'pleuraleffusionplan-protocol'));
it('MediastinalMassWorkup', () => assertEq(Engine.MediastinalMassWorkup({ t: 'yes' }).plan, 'mediastinalmassworkup-protocol'));
it('ThoracicTraumaTriage', () => assertEq(Engine.ThoracicTraumaTriage({ t: 'yes' }).plan, 'thoracictraumatriage-protocol'));
it('EsophagealSurgeryPrep', () => assertEq(Engine.EsophagealSurgeryPrep({ t: 'yes' }).plan, 'esophagealsurgeryprep-protocol'));
it('PostThoracotomyCare', () => assertEq(Engine.PostThoracotomyCare({ t: 'yes' }).plan, 'postthoracotomycare-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
