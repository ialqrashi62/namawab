// P3-DB pcc_metabolic_surgery unit tests
const Engine = require('./pcc_metabolic_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_metabolic_surgery engine tests:');
it('BariatricRisk', () => assertEq(Engine.BariatricRisk({ t: 'yes' }).plan, 'bariatricrisk-protocol'));
it('ProcedureSelection', () => assertEq(Engine.ProcedureSelection({ t: 'yes' }).plan, 'procedureselection-protocol'));
it('NutritionalDeficiency', () => assertEq(Engine.NutritionalDeficiency({ t: 'yes' }).plan, 'nutritionaldeficiency-protocol'));
it('DumpingSyndrome', () => assertEq(Engine.DumpingSyndrome({ t: 'yes' }).plan, 'dumpingsyndrome-protocol'));
it('WeightRecurrence', () => assertEq(Engine.WeightRecurrence({ t: 'yes' }).plan, 'weightrecurrence-protocol'));
it('DiabetesRemission', () => assertEq(Engine.DiabetesRemission({ t: 'yes' }).plan, 'diabetesremission-protocol'));
it('MetabolicMonitoring', () => assertEq(Engine.MetabolicMonitoring({ t: 'yes' }).plan, 'metabolicmonitoring-protocol'));
it('PreopOptimization', () => assertEq(Engine.PreopOptimization({ t: 'yes' }).plan, 'preopoptimization-protocol'));
it('PostopDiet', () => assertEq(Engine.PostopDiet({ t: 'yes' }).plan, 'postopdiet-protocol'));
it('LongTermFollowUp', () => assertEq(Engine.LongTermFollowUp({ t: 'yes' }).plan, 'longtermfollowup-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
