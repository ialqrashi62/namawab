// P3-ES pcc_neuro_ext10 unit tests
const Engine = require('./pcc_neuro_ext10_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext10 engine tests:');
it('CerebellarAtaxiaEval', () => assertEq(Engine.CerebellarAtaxiaEval({ t: 'yes' }).plan, 'cerebellarAtaxiaEval-protocol'));
it('SpinocerebellarDegeneration', () => assertEq(Engine.SpinocerebellarDegeneration({ t: 'yes' }).plan, 'spinocerebellarDegeneration-protocol'));
it('OlivopontocerebellarAtrophy', () => assertEq(Engine.OlivopontocerebellarAtrophy({ t: 'yes' }).plan, 'olivopontocerebellarAtrophy-protocol'));
it('DentatorubralPallidoluysianAtrophy', () => assertEq(Engine.DentatorubralPallidoluysianAtrophy({ t: 'yes' }).plan, 'dentatorubralPallidoluysianAtrophy-protocol'));
it('FriedreichAtaxiaExt', () => assertEq(Engine.FriedreichAtaxiaExt({ t: 'yes' }).plan, 'friedreichAtaxiaExt-protocol'));
it('AtaxiaTelangiectasiaExt', () => assertEq(Engine.AtaxiaTelangiectasiaExt({ t: 'yes' }).plan, 'ataxiaTelangiectasiaExt-protocol'));
it('CerebrotendinousXanthomatosis', () => assertEq(Engine.CerebrotendinousXanthomatosis({ t: 'yes' }).plan, 'cerebrotendinousXanthomatosis-protocol'));
it('NiemannPickDisease', () => assertEq(Engine.NiemannPickDisease({ t: 'yes' }).plan, 'niemannPickDisease-protocol'));
it('GaucherDiseaseType2', () => assertEq(Engine.GaucherDiseaseType2({ t: 'yes' }).plan, 'gaucherDiseaseType2-protocol'));
it('MetachromaticLeukodystrophyExt', () => assertEq(Engine.MetachromaticLeukodystrophyExt({ t: 'yes' }).plan, 'metachromaticLeukodystrophyExt-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
