// P3-ER pcc_neuro_ext9 unit tests
const Engine = require('./pcc_neuro_ext9_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext9 engine tests:');
it('AdultPHIEval', () => assertEq(Engine.AdultPHIEval({ t: 'yes' }).plan, 'adultPHIEval-protocol'));
it('PediatricPHIEval', () => assertEq(Engine.PediatricPHIEval({ t: 'yes' }).plan, 'pediatricPHIEval-protocol'));
it('NeurocysticercosisEval', () => assertEq(Engine.NeurocysticercosisEval({ t: 'yes' }).plan, 'neurocysticercosisEval-protocol'));
it('CerebralToxoplasmosis', () => assertEq(Engine.CerebralToxoplasmosis({ t: 'yes' }).plan, 'cerebralToxoplasmosis-protocol'));
it('CerebralMalaria', () => assertEq(Engine.CerebralMalaria({ t: 'yes' }).plan, 'cerebralMalaria-protocol'));
it('BrainAbscessEval', () => assertEq(Engine.BrainAbscessEval({ t: 'yes' }).plan, 'brainAbscessEval-protocol'));
it('SubduralEmpyemaEval', () => assertEq(Engine.SubduralEmpyemaEval({ t: 'yes' }).plan, 'subduralEmpyemaEval-protocol'));
it('EpiduralAbscessEval', () => assertEq(Engine.EpiduralAbscessEval({ t: 'yes' }).plan, 'epiduralAbscessEval-protocol'));
it('VentriculitisEval', () => assertEq(Engine.VentriculitisEval({ t: 'yes' }).plan, 'ventriculitisEval-protocol'));
it('CNSLymphomaEval', () => assertEq(Engine.CNSLymphomaEval({ t: 'yes' }).plan, 'cNSLymphomaEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
