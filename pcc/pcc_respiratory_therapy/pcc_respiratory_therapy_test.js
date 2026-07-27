// P3-DK pcc_respiratory_therapy unit tests
const Engine = require('./pcc_respiratory_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_respiratory_therapy engine tests:');
it('AerosolTherapy', () => assertEq(Engine.AerosolTherapy({ t: 'yes' }).plan, 'aerosoltherapy-protocol'));
it('MechanicalVentilationWean', () => assertEq(Engine.MechanicalVentilationWean({ t: 'yes' }).plan, 'mechanicalventilationwean-protocol'));
it('NonInvasiveVentilation', () => assertEq(Engine.NonInvasiveVentilation({ t: 'yes' }).plan, 'noninvasiveventilation-protocol'));
it('HighFlowNasalCannula', () => assertEq(Engine.HighFlowNasalCannula({ t: 'yes' }).plan, 'highflownasalcannula-protocol'));
it('ArterialBloodGasInterpret', () => assertEq(Engine.ArterialBloodGasInterpret({ t: 'yes' }).plan, 'arterialbloodgasinterpret-protocol'));
it('BronchoscopyPrep', () => assertEq(Engine.BronchoscopyPrep({ t: 'yes' }).plan, 'bronchoscopyprep-protocol'));
it('SputumInduction', () => assertEq(Engine.SputumInduction({ t: 'yes' }).plan, 'sputuminduction-protocol'));
it('PulmonaryFunctionTestPrep', () => assertEq(Engine.PulmonaryFunctionTestPrep({ t: 'yes' }).plan, 'pulmonaryfunctiontestprep-protocol'));
it('OxygenConservingDevice', () => assertEq(Engine.OxygenConservingDevice({ t: 'yes' }).plan, 'oxygenconservingdevice-protocol'));
it('RespiratoryEmergencyBag', () => assertEq(Engine.RespiratoryEmergencyBag({ t: 'yes' }).plan, 'respiratoryemergencybag-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
