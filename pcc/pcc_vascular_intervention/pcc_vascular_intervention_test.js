// P3-DX pcc_vascular_intervention unit tests
const Engine = require('./pcc_vascular_intervention_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_vascular_intervention engine tests:');
it('CarotidStentPlacement', () => assertEq(Engine.CarotidStentPlacement({ t: 'yes' }).plan, 'carotidStentPlacement-protocol'));
it('AAAEndovascularRepair', () => assertEq(Engine.AAAEndovascularRepair({ t: 'yes' }).plan, 'aAAEndovascularRepair-protocol'));
it('PeripheralAngioplasty', () => assertEq(Engine.PeripheralAngioplasty({ t: 'yes' }).plan, 'peripheralAngioplasty-protocol'));
it('DVTThrombolysis', () => assertEq(Engine.DVTThrombolysis({ t: 'yes' }).plan, 'dVTThrombolysis-protocol'));
it('VaricoseVeinAblation', () => assertEq(Engine.VaricoseVeinAblation({ t: 'yes' }).plan, 'varicoseVeinAblation-protocol'));
it('AVMEmbolization', () => assertEq(Engine.AVMEmbolization({ t: 'yes' }).plan, 'aVMEmbolization-protocol'));
it('RenalArteryStenting', () => assertEq(Engine.RenalArteryStenting({ t: 'yes' }).plan, 'renalArteryStenting-protocol'));
it('MesentericIschemiaIntervention', () => assertEq(Engine.MesentericIschemiaIntervention({ t: 'yes' }).plan, 'mesentericIschemiaIntervention-protocol'));
it('ClaudicationRevascularization', () => assertEq(Engine.ClaudicationRevascularization({ t: 'yes' }).plan, 'claudicationRevascularization-protocol'));
it('VascularTraumaControl', () => assertEq(Engine.VascularTraumaControl({ t: 'yes' }).plan, 'vascularTraumaControl-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
