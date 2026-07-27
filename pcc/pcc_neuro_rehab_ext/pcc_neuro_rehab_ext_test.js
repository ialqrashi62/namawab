// P3-DW pcc_neuro_rehab_ext unit tests
const Engine = require('./pcc_neuro_rehab_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_rehab_ext engine tests:');
it('StrokeNeuroplasticityProtocol', () => assertEq(Engine.StrokeNeuroplasticityProtocol({ t: 'yes' }).plan, 'strokeNeuroplasticityProtocol-protocol'));
it('ConstraintInducedMovement', () => assertEq(Engine.ConstraintInducedMovement({ t: 'yes' }).plan, 'constraintInducedMovement-protocol'));
it('VestibularRehabStroke', () => assertEq(Engine.VestibularRehabStroke({ t: 'yes' }).plan, 'vestibularRehabStroke-protocol'));
it('SpasticityManagementITB', () => assertEq(Engine.SpasticityManagementITB({ t: 'yes' }).plan, 'spasticityManagementITB-protocol'));
it('DysphagiaSwallowTherapy', () => assertEq(Engine.DysphagiaSwallowTherapy({ t: 'yes' }).plan, 'dysphagiaSwallowTherapy-protocol'));
it('CognitiveRehabTraumatic', () => assertEq(Engine.CognitiveRehabTraumatic({ t: 'yes' }).plan, 'cognitiveRehabTraumatic-protocol'));
it('AphasiaLanguageTherapy', () => assertEq(Engine.AphasiaLanguageTherapy({ t: 'yes' }).plan, 'aphasiaLanguageTherapy-protocol'));
it('SpinalCordInjuryRehab', () => assertEq(Engine.SpinalCordInjuryRehab({ t: 'yes' }).plan, 'spinalCordInjuryRehab-protocol'));
it('WheelchairMobilityPrescription', () => assertEq(Engine.WheelchairMobilityPrescription({ t: 'yes' }).plan, 'wheelchairMobilityPrescription-protocol'));
it('NeuroRehabGoalSetting', () => assertEq(Engine.NeuroRehabGoalSetting({ t: 'yes' }).plan, 'neuroRehabGoalSetting-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
