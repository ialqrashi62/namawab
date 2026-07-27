// P3-DZ pcc_thoracic_oncology unit tests
const Engine = require('./pcc_thoracic_oncology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_thoracic_oncology engine tests:');
it('LungCancerStaging', () => assertEq(Engine.LungCancerStaging({ t: 'yes' }).plan, 'lungCancerStaging-protocol'));
it('MediastinalMassWorkup', () => assertEq(Engine.MediastinalMassWorkup({ t: 'yes' }).plan, 'mediastinalMassWorkup-protocol'));
it('MesotheliomaManagement', () => assertEq(Engine.MesotheliomaManagement({ t: 'yes' }).plan, 'mesotheliomaManagement-protocol'));
it('SuperiorSulcusTumor', () => assertEq(Engine.SuperiorSulcusTumor({ t: 'yes' }).plan, 'superiorSulcusTumor-protocol'));
it('TrachealTumorResection', () => assertEq(Engine.TrachealTumorResection({ t: 'yes' }).plan, 'trachealTumorResection-protocol'));
it('ChestWallTumorReconstruction', () => assertEq(Engine.ChestWallTumorReconstruction({ t: 'yes' }).plan, 'chestWallTumorReconstruction-protocol'));
it('PancoastTumorProtocol', () => assertEq(Engine.PancoastTumorProtocol({ t: 'yes' }).plan, 'pancoastTumorProtocol-protocol'));
it('EndobronchialTumorStent', () => assertEq(Engine.EndobronchialTumorStent({ t: 'yes' }).plan, 'endobronchialTumorStent-protocol'));
it('ThymomaStaging', () => assertEq(Engine.ThymomaStaging({ t: 'yes' }).plan, 'thymomaStaging-protocol'));
it('LungMetastasectomy', () => assertEq(Engine.LungMetastasectomy({ t: 'yes' }).plan, 'lungMetastasectomy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
