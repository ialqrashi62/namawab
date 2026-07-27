// P3-DS pcc_cath_lab_specialized unit tests
const Engine = require('./pcc_cath_lab_specialized_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_cath_lab_specialized engine tests:');
it('CTOScoreJCTO', () => assertEq(Engine.CTOScoreJCTO({ t: 'yes' }).plan, 'ctoscorejcto-protocol'));
it('SyntaxScore', () => assertEq(Engine.SyntaxScore({ t: 'yes' }).plan, 'syntaxscore-protocol'));
it('CalciumScoreIVUS', () => assertEq(Engine.CalciumScoreIVUS({ t: 'yes' }).plan, 'calciumscoreivus-protocol'));
it('FFRiFRAnalysis', () => assertEq(Engine.FFRiFRAnalysis({ t: 'yes' }).plan, 'ffrifranalysis-protocol'));
it('BifurcationMedina', () => assertEq(Engine.BifurcationMedina({ t: 'yes' }).plan, 'bifurcationmedina-protocol'));
it('PerforationEllis', () => assertEq(Engine.PerforationEllis({ t: 'yes' }).plan, 'perforationellis-protocol'));
it('RotablationBurr', () => assertEq(Engine.RotablationBurr({ t: 'yes' }).plan, 'rotablationburr-protocol'));
it('IVLDelivery', () => assertEq(Engine.IVLDelivery({ t: 'yes' }).plan, 'ivldelivery-protocol'));
it('NoReflowPredict', () => assertEq(Engine.NoReflowPredict({ t: 'yes' }).plan, 'noreflowpredict-protocol'));
it('CoronaryDissectionType', () => assertEq(Engine.CoronaryDissectionType({ t: 'yes' }).plan, 'coronarydissectiontype-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
