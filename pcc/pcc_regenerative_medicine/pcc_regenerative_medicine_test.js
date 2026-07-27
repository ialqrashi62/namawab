// P3-DB pcc_regenerative_medicine unit tests
const Engine = require('./pcc_regenerative_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_regenerative_medicine engine tests:');
it('StemCellTherapy', () => assertEq(Engine.StemCellTherapy({ t: 'yes' }).plan, 'stemcelltherapy-protocol'));
it('PRPInjection', () => assertEq(Engine.PRPInjection({ t: 'yes' }).plan, 'prpinjection-protocol'));
it('ExosomeTherapy', () => assertEq(Engine.ExosomeTherapy({ t: 'yes' }).plan, 'exosometherapy-protocol'));
it('CartilageRegeneration', () => assertEq(Engine.CartilageRegeneration({ t: 'yes' }).plan, 'cartilageregeneration-protocol'));
it('TissueEngineering', () => assertEq(Engine.TissueEngineering({ t: 'yes' }).plan, 'tissueengineering-protocol'));
it('CellularReprogramming', () => assertEq(Engine.CellularReprogramming({ t: 'yes' }).plan, 'cellularreprogramming-protocol'));
it('GeneEditing', () => assertEq(Engine.GeneEditing({ t: 'yes' }).plan, 'geneediting-protocol'));
it('ImmuneReset', () => assertEq(Engine.ImmuneReset({ t: 'yes' }).plan, 'immunereset-protocol'));
it('WoundRegeneration', () => assertEq(Engine.WoundRegeneration({ t: 'yes' }).plan, 'woundregeneration-protocol'));
it('AntiAging', () => assertEq(Engine.AntiAging({ t: 'yes' }).plan, 'antiaging-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
