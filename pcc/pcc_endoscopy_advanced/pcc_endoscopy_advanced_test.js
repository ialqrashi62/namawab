// P3-DO pcc_endoscopy_advanced unit tests
const Engine = require('./pcc_endoscopy_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_endoscopy_advanced engine tests:');
it('ColonoscopyScreeningAdvanced', () => assertEq(Engine.ColonoscopyScreeningAdvanced({ t: 'yes' }).plan, 'colonoscopyscreeningadvanced-protocol'));
it('PolypectomyRisk', () => assertEq(Engine.PolypectomyRisk({ t: 'yes' }).plan, 'polypectomyrisk-protocol'));
it('ERCPIndication', () => assertEq(Engine.ERCPIndication({ t: 'yes' }).plan, 'ercpindication-protocol'));
it('EUSIndication', () => assertEq(Engine.EUSIndication({ t: 'yes' }).plan, 'eusindication-protocol'));
it('EndoscopicHemostasis', () => assertEq(Engine.EndoscopicHemostasis({ t: 'yes' }).plan, 'endoscopichemostasis-protocol'));
it('PEGPlacement', () => assertEq(Engine.PEGPlacement({ t: 'yes' }).plan, 'pegplacement-protocol'));
it('EndoscopicDilation', () => assertEq(Engine.EndoscopicDilation({ t: 'yes' }).plan, 'endoscopicdilation-protocol'));
it('EndoscopicResection', () => assertEq(Engine.EndoscopicResection({ t: 'yes' }).plan, 'endoscopicresection-protocol'));
it('CapsuleEndoscopy', () => assertEq(Engine.CapsuleEndoscopy({ t: 'yes' }).plan, 'capsuleendoscopy-protocol'));
it('EndoscopySedationRisk', () => assertEq(Engine.EndoscopySedationRisk({ t: 'yes' }).plan, 'endoscopysedationrisk-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
