// P3-EM pcc_pediatric_surg_ext unit tests
const Engine = require('./pcc_pediatric_surg_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surg_ext engine tests:');
it('PediatricLaparoscopic', () => assertEq(Engine.PediatricLaparoscopic({ t: 'yes' }).plan, 'pediatricLaparoscopic-protocol'));
it('PediatricRoboticSurg', () => assertEq(Engine.PediatricRoboticSurg({ t: 'yes' }).plan, 'pediatricRoboticSurg-protocol'));
it('PediatricEndoscopic', () => assertEq(Engine.PediatricEndoscopic({ t: 'yes' }).plan, 'pediatricEndoscopic-protocol'));
it('PediatricFetalSurg', () => assertEq(Engine.PediatricFetalSurg({ t: 'yes' }).plan, 'pediatricFetalSurg-protocol'));
it('PediatricMinimallyInvasive', () => assertEq(Engine.PediatricMinimallyInvasive({ t: 'yes' }).plan, 'pediatricMinimallyInvasive-protocol'));
it('PediatricDaySurg', () => assertEq(Engine.PediatricDaySurg({ t: 'yes' }).plan, 'pediatricDaySurg-protocol'));
it('PediatricAmbulatorySurg', () => assertEq(Engine.PediatricAmbulatorySurg({ t: 'yes' }).plan, 'pediatricAmbulatorySurg-protocol'));
it('PediatricSameDayDischarge', () => assertEq(Engine.PediatricSameDayDischarge({ t: 'yes' }).plan, 'pediatricSameDayDischarge-protocol'));
it('PediatricPreOpEval', () => assertEq(Engine.PediatricPreOpEval({ t: 'yes' }).plan, 'pediatricPreOpEval-protocol'));
it('PediatricPostOpCare', () => assertEq(Engine.PediatricPostOpCare({ t: 'yes' }).plan, 'pediatricPostOpCare-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
