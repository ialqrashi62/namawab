// P3-EA pcc_interventional_radiology unit tests
const Engine = require('./pcc_interventional_radiology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_interventional_radiology engine tests:');
it('TIPSProcedure', () => assertEq(Engine.TIPSProcedure({ t: 'yes' }).plan, 'tIPSProcedure-protocol'));
it('ChemoembolizationHCC', () => assertEq(Engine.ChemoembolizationHCC({ t: 'yes' }).plan, 'chemoembolizationHCC-protocol'));
it('UterineFibroidEmbolization', () => assertEq(Engine.UterineFibroidEmbolization({ t: 'yes' }).plan, 'uterineFibroidEmbolization-protocol'));
it('VertebroplastyKyphoplasty', () => assertEq(Engine.VertebroplastyKyphoplasty({ t: 'yes' }).plan, 'vertebroplastyKyphoplasty-protocol'));
it('BiliaryDrainagePTBD', () => assertEq(Engine.BiliaryDrainagePTBD({ t: 'yes' }).plan, 'biliaryDrainagePTBD-protocol'));
it('GastrostomyTubePlacement', () => assertEq(Engine.GastrostomyTubePlacement({ t: 'yes' }).plan, 'gastrostomyTubePlacement-protocol'));
it('ThrombolysisDVT', () => assertEq(Engine.ThrombolysisDVT({ t: 'yes' }).plan, 'thrombolysisDVT-protocol'));
it('AorticStentGraft', () => assertEq(Engine.AorticStentGraft({ t: 'yes' }).plan, 'aorticStentGraft-protocol'));
it('CryoablationTumor', () => assertEq(Engine.CryoablationTumor({ t: 'yes' }).plan, 'cryoablationTumor-protocol'));
it('RadiofrequencyAblationLiver', () => assertEq(Engine.RadiofrequencyAblationLiver({ t: 'yes' }).plan, 'radiofrequencyAblationLiver-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
