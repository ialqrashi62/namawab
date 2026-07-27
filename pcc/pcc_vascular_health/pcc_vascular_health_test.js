// P3-DI pcc_vascular_health unit tests
const Engine = require('./pcc_vascular_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_vascular_health engine tests:');
it('VenousInsufficiency', () => assertEq(Engine.VenousInsufficiency({ t: 'yes' }).plan, 'venousinsufficiency-protocol'));
it('PeripheralArtery', () => assertEq(Engine.PeripheralArtery({ t: 'yes' }).plan, 'peripheralartery-protocol'));
it('AorticHealth', () => assertEq(Engine.AorticHealth({ t: 'yes' }).plan, 'aortichealth-protocol'));
it('Microcirculation', () => assertEq(Engine.Microcirculation({ t: 'yes' }).plan, 'microcirculation-protocol'));
it('VascularInflammation', () => assertEq(Engine.VascularInflammation({ t: 'yes' }).plan, 'vascularinflammation-protocol'));
it('EndothelialRepair', () => assertEq(Engine.EndothelialRepair({ t: 'yes' }).plan, 'endothelialrepair-protocol'));
it('CompressionTherapy', () => assertEq(Engine.CompressionTherapy({ t: 'yes' }).plan, 'compressiontherapy-protocol'));
it('VascularScreening', () => assertEq(Engine.VascularScreening({ t: 'yes' }).plan, 'vascularscreening-protocol'));
it('ClotRisk', () => assertEq(Engine.ClotRisk({ t: 'yes' }).plan, 'clotrisk-protocol'));
it('VascularSurgeryPrep', () => assertEq(Engine.VascularSurgeryPrep({ t: 'yes' }).plan, 'vascularsurgeryprep-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
