// P3-EU pcc_pediatric_psych_ext2 unit tests
const Engine = require('./pcc_pediatric_psych_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_psych_ext2 engine tests:');
it('PediatricASDManagement', () => assertEq(Engine.PediatricASDManagement({ t: 'yes' }).plan, 'pediatricASDManagement-protocol'));
it('PediatricADHDManagement', () => assertEq(Engine.PediatricADHDManagement({ t: 'yes' }).plan, 'pediatricADHDManagement-protocol'));
it('PediatricAnxietyManagement', () => assertEq(Engine.PediatricAnxietyManagement({ t: 'yes' }).plan, 'pediatricAnxietyManagement-protocol'));
it('PediatricDepressionManagement', () => assertEq(Engine.PediatricDepressionManagement({ t: 'yes' }).plan, 'pediatricDepressionManagement-protocol'));
it('PediatricOCDManagement', () => assertEq(Engine.PediatricOCDManagement({ t: 'yes' }).plan, 'pediatricOCDManagement-protocol'));
it('PediatricBipolarManagement', () => assertEq(Engine.PediatricBipolarManagement({ t: 'yes' }).plan, 'pediatricBipolarManagement-protocol'));
it('PediatricTraumaTherapy', () => assertEq(Engine.PediatricTraumaTherapy({ t: 'yes' }).plan, 'pediatricTraumaTherapy-protocol'));
it('PediatricDBTEval', () => assertEq(Engine.PediatricDBTEval({ t: 'yes' }).plan, 'pediatricDBTEval-protocol'));
it('PediatricFamilyTherapy', () => assertEq(Engine.PediatricFamilyTherapy({ t: 'yes' }).plan, 'pediatricFamilyTherapy-protocol'));
it('PediatricGroupTherapy', () => assertEq(Engine.PediatricGroupTherapy({ t: 'yes' }).plan, 'pediatricGroupTherapy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
