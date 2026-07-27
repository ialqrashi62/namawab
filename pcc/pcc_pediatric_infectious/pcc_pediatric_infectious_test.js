// P3-EJ pcc_pediatric_infectious unit tests
const Engine = require('./pcc_pediatric_infectious_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_infectious engine tests:');
it('PediatricMeningitisEval', () => assertEq(Engine.PediatricMeningitisEval({ t: 'yes' }).plan, 'pediatricMeningitisEval-protocol'));
it('PediatricSepsis', () => assertEq(Engine.PediatricSepsis({ t: 'yes' }).plan, 'pediatricSepsis-protocol'));
it('PediatricUTI', () => assertEq(Engine.PediatricUTI({ t: 'yes' }).plan, 'pediatricUTI-protocol'));
it('PediatricPneumoniaEval2', () => assertEq(Engine.PediatricPneumoniaEval2({ t: 'yes' }).plan, 'pediatricPneumoniaEval2-protocol'));
it('CongenitalInfections', () => assertEq(Engine.CongenitalInfections({ t: 'yes' }).plan, 'congenitalInfections-protocol'));
it('PediatricTB', () => assertEq(Engine.PediatricTB({ t: 'yes' }).plan, 'pediatricTB-protocol'));
it('PediatricHIV', () => assertEq(Engine.PediatricHIV({ t: 'yes' }).plan, 'pediatricHIV-protocol'));
it('PediatricInfluenza', () => assertEq(Engine.PediatricInfluenza({ t: 'yes' }).plan, 'pediatricInfluenza-protocol'));
it('PediatricSkinSoftTissue', () => assertEq(Engine.PediatricSkinSoftTissue({ t: 'yes' }).plan, 'pediatricSkinSoftTissue-protocol'));
it('PediatricGastroenteritis', () => assertEq(Engine.PediatricGastroenteritis({ t: 'yes' }).plan, 'pediatricGastroenteritis-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
