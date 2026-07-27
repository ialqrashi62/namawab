// P3-DR pcc_maternal_fetal_advanced unit tests
const Engine = require('./pcc_maternal_fetal_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_maternal_fetal_advanced engine tests:');
it('FetalGrowthRestriction', () => assertEq(Engine.FetalGrowthRestriction({ t: 'yes' }).plan, 'fetalgrowthrestriction-protocol'));
it('TwinTwinTransfusion', () => assertEq(Engine.TwinTwinTransfusion({ t: 'yes' }).plan, 'twintwintransfusion-protocol'));
it('FetalAnemia', () => assertEq(Engine.FetalAnemia({ t: 'yes' }).plan, 'fetalanemia-protocol'));
it('FetalArrhythmia', () => assertEq(Engine.FetalArrhythmia({ t: 'yes' }).plan, 'fetalarrhythmia-protocol'));
it('CongenitalInfections', () => assertEq(Engine.CongenitalInfections({ t: 'yes' }).plan, 'congenitalinfections-protocol'));
it('RedCellAlloimmunization', () => assertEq(Engine.RedCellAlloimmunization({ t: 'yes' }).plan, 'redcellalloimmunization-protocol'));
it('PretermLaborTocolysis', () => assertEq(Engine.PretermLaborTocolysis({ t: 'yes' }).plan, 'pretermlabortocolysis-protocol'));
it('CervicalInsufficiency', () => assertEq(Engine.CervicalInsufficiency({ t: 'yes' }).plan, 'cervicalinsufficiency-protocol'));
it('MaternalCardiacDisease', () => assertEq(Engine.MaternalCardiacDisease({ t: 'yes' }).plan, 'maternalcardiacdisease-protocol'));
it('MaternalRenalDisease', () => assertEq(Engine.MaternalRenalDisease({ t: 'yes' }).plan, 'maternalrenaldisease-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
