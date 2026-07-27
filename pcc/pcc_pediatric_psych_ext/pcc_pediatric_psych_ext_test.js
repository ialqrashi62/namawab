// P3-EO pcc_pediatric_psych_ext unit tests
const Engine = require('./pcc_pediatric_psych_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_psych_ext engine tests:');
it('PediatricSchizophreniaEval', () => assertEq(Engine.PediatricSchizophreniaEval({ t: 'yes' }).plan, 'pediatricSchizophreniaEval-protocol'));
it('PediatricPsychosisEarly', () => assertEq(Engine.PediatricPsychosisEarly({ t: 'yes' }).plan, 'pediatricPsychosisEarly-protocol'));
it('PediatricCatatonia', () => assertEq(Engine.PediatricCatatonia({ t: 'yes' }).plan, 'pediatricCatatonia-protocol'));
it('PediatricDissociativeDisorder', () => assertEq(Engine.PediatricDissociativeDisorder({ t: 'yes' }).plan, 'pediatricDissociativeDisorder-protocol'));
it('PediatricEatingDisorderExt', () => assertEq(Engine.PediatricEatingDisorderExt({ t: 'yes' }).plan, 'pediatricEatingDisorderExt-protocol'));
it('PediatricGenderDysphoria', () => assertEq(Engine.PediatricGenderDysphoria({ t: 'yes' }).plan, 'pediatricGenderDysphoria-protocol'));
it('PediatricSelfHarm', () => assertEq(Engine.PediatricSelfHarm({ t: 'yes' }).plan, 'pediatricSelfHarm-protocol'));
it('PediatricSuicideRisk', () => assertEq(Engine.PediatricSuicideRisk({ t: 'yes' }).plan, 'pediatricSuicideRisk-protocol'));
it('PediatricCrisisEval', () => assertEq(Engine.PediatricCrisisEval({ t: 'yes' }).plan, 'pediatricCrisisEval-protocol'));
it('PediatricPsychEval', () => assertEq(Engine.PediatricPsychEval({ t: 'yes' }).plan, 'pediatricPsychEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
