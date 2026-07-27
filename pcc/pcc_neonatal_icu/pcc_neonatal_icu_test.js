// P3-DU pcc_neonatal_icu unit tests
const Engine = require('./pcc_neonatal_icu_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neonatal_icu engine tests:');
it('NICUAdmissionCriteria', () => assertEq(Engine.NICUAdmissionCriteria({ t: 'yes' }).plan, 'nICUAdmissionCriteria-protocol'));
it('ThermoregulationProtocol', () => assertEq(Engine.ThermoregulationProtocol({ t: 'yes' }).plan, 'thermoregulationProtocol-protocol'));
it('NeonatalVentilation', () => assertEq(Engine.NeonatalVentilation({ t: 'yes' }).plan, 'neonatalVentilation-protocol'));
it('TPNNeonatal', () => assertEq(Engine.TPNNeonatal({ t: 'yes' }).plan, 'tPNNeonatal-protocol'));
it('NeonatalSepsisKaiser', () => assertEq(Engine.NeonatalSepsisKaiser({ t: 'yes' }).plan, 'neonatalSepsisKaiser-protocol'));
it('BronchopulmonaryDysplasia', () => assertEq(Engine.BronchopulmonaryDysplasia({ t: 'yes' }).plan, 'bronchopulmonaryDysplasia-protocol'));
it('IVHPremature', () => assertEq(Engine.IVHPremature({ t: 'yes' }).plan, 'iVHPremature-protocol'));
it('ROPExamSchedule', () => assertEq(Engine.ROPExamSchedule({ t: 'yes' }).plan, 'rOPExamSchedule-protocol'));
it('NeonatalSeizureWorkup', () => assertEq(Engine.NeonatalSeizureWorkup({ t: 'yes' }).plan, 'neonatalSeizureWorkup-protocol'));
it('CongenitalHeartDuctus', () => assertEq(Engine.CongenitalHeartDuctus({ t: 'yes' }).plan, 'congenitalHeartDuctus-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
