// P3-DR pcc_gynecology_advanced unit tests
const Engine = require('./pcc_gynecology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_gynecology_advanced engine tests:');
it('OvarianCancerAdvanced', () => assertEq(Engine.OvarianCancerAdvanced({ t: 'yes' }).plan, 'ovariancanceradvanced-protocol'));
it('EndometrialCancer', () => assertEq(Engine.EndometrialCancer({ t: 'yes' }).plan, 'endometrialcancer-protocol'));
it('CervicalCancerAdvanced', () => assertEq(Engine.CervicalCancerAdvanced({ t: 'yes' }).plan, 'cervicalcanceradvanced-protocol'));
it('UterineFibroidsRefractory', () => assertEq(Engine.UterineFibroidsRefractory({ t: 'yes' }).plan, 'uterinefibroidsrefractory-protocol'));
it('EndometriosisAdvanced', () => assertEq(Engine.EndometriosisAdvanced({ t: 'yes' }).plan, 'endometriosisadvanced-protocol'));
it('PCOSRefractory', () => assertEq(Engine.PCOSRefractory({ t: 'yes' }).plan, 'pcosrefractory-protocol'));
it('PelvicInflammatoryDisease', () => assertEq(Engine.PelvicInflammatoryDisease({ t: 'yes' }).plan, 'pelvicinflammatorydisease-protocol'));
it('VulvodyniaAdvanced', () => assertEq(Engine.VulvodyniaAdvanced({ t: 'yes' }).plan, 'vulvodyniaadvanced-protocol'));
it('GynecologicSurgeryRisk', () => assertEq(Engine.GynecologicSurgeryRisk({ t: 'yes' }).plan, 'gynecologicsurgeryrisk-protocol'));
it('FertilityPreservation', () => assertEq(Engine.FertilityPreservation({ t: 'yes' }).plan, 'fertilitypreservation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
