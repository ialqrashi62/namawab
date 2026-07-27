// P3-EL pcc_pediatric_behavior unit tests
const Engine = require('./pcc_pediatric_behavior_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_behavior engine tests:');
it('AutismSpectrumEval', () => assertEq(Engine.AutismSpectrumEval({ t: 'yes' }).plan, 'autismSpectrumEval-protocol'));
it('ADHDAssessment', () => assertEq(Engine.ADHDAssessment({ t: 'yes' }).plan, 'aDHDAssessment-protocol'));
it('PediatricAnxiety', () => assertEq(Engine.PediatricAnxiety({ t: 'yes' }).plan, 'pediatricAnxiety-protocol'));
it('PediatricDepression', () => assertEq(Engine.PediatricDepression({ t: 'yes' }).plan, 'pediatricDepression-protocol'));
it('PediatricOCD', () => assertEq(Engine.PediatricOCD({ t: 'yes' }).plan, 'pediatricOCD-protocol'));
it('PediatricBipolarEval', () => assertEq(Engine.PediatricBipolarEval({ t: 'yes' }).plan, 'pediatricBipolarEval-protocol'));
it('PediatricConductDisorder', () => assertEq(Engine.PediatricConductDisorder({ t: 'yes' }).plan, 'pediatricConductDisorder-protocol'));
it('PediatricOppositionalDefiant', () => assertEq(Engine.PediatricOppositionalDefiant({ t: 'yes' }).plan, 'pediatricOppositionalDefiant-protocol'));
it('PediatricTicDisorders', () => assertEq(Engine.PediatricTicDisorders({ t: 'yes' }).plan, 'pediatricTicDisorders-protocol'));
it('PediatricSelectiveMutism', () => assertEq(Engine.PediatricSelectiveMutism({ t: 'yes' }).plan, 'pediatricSelectiveMutism-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
