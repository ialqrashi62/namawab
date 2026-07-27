// P3-DX pcc_minimally_invasive_surgery unit tests
const Engine = require('./pcc_minimally_invasive_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_minimally_invasive_surgery engine tests:');
it('LaparoscopicCholecystectomy', () => assertEq(Engine.LaparoscopicCholecystectomy({ t: 'yes' }).plan, 'laparoscopicCholecystectomy-protocol'));
it('RoboticProstatectomyIndication', () => assertEq(Engine.RoboticProstatectomyIndication({ t: 'yes' }).plan, 'roboticProstatectomyIndication-protocol'));
it('LaparoscopicHerniaRepair', () => assertEq(Engine.LaparoscopicHerniaRepair({ t: 'yes' }).plan, 'laparoscopicHerniaRepair-protocol'));
it('ThoracoscopicLobectomy', () => assertEq(Engine.ThoracoscopicLobectomy({ t: 'yes' }).plan, 'thoracoscopicLobectomy-protocol'));
it('EndoscopicSinusSurgery', () => assertEq(Engine.EndoscopicSinusSurgery({ t: 'yes' }).plan, 'endoscopicSinusSurgery-protocol'));
it('LaparoscopicColonResection', () => assertEq(Engine.LaparoscopicColonResection({ t: 'yes' }).plan, 'laparoscopicColonResection-protocol'));
it('RoboticHysterectomy', () => assertEq(Engine.RoboticHysterectomy({ t: 'yes' }).plan, 'roboticHysterectomy-protocol'));
it('NOTESProcedureSelection', () => assertEq(Engine.NOTESProcedureSelection({ t: 'yes' }).plan, 'nOTESProcedureSelection-protocol'));
it('LaparoscopicNephrectomy', () => assertEq(Engine.LaparoscopicNephrectomy({ t: 'yes' }).plan, 'laparoscopicNephrectomy-protocol'));
it('MISPatientSelectionCriteria', () => assertEq(Engine.MISPatientSelectionCriteria({ t: 'yes' }).plan, 'mISPatientSelectionCriteria-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
