// P3-DY pcc_hepato_pancreatic_surgery unit tests
const Engine = require('./pcc_hepato_pancreatic_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_hepato_pancreatic_surgery engine tests:');
it('WhippleIndication', () => assertEq(Engine.WhippleIndication({ t: 'yes' }).plan, 'whippleIndication-protocol'));
it('LiverResectionHCC', () => assertEq(Engine.LiverResectionHCC({ t: 'yes' }).plan, 'liverResectionHCC-protocol'));
it('PancreaticCancerStaging', () => assertEq(Engine.PancreaticCancerStaging({ t: 'yes' }).plan, 'pancreaticCancerStaging-protocol'));
it('CholangiocarcinomaSurgery', () => assertEq(Engine.CholangiocarcinomaSurgery({ t: 'yes' }).plan, 'cholangiocarcinomaSurgery-protocol'));
it('BiliaryReconstruction', () => assertEq(Engine.BiliaryReconstruction({ t: 'yes' }).plan, 'biliaryReconstruction-protocol'));
it('LiverTransplantHCC', () => assertEq(Engine.LiverTransplantHCC({ t: 'yes' }).plan, 'liverTransplantHCC-protocol'));
it('PancreaticNecrosectomy', () => assertEq(Engine.PancreaticNecrosectomy({ t: 'yes' }).plan, 'pancreaticNecrosectomy-protocol'));
it('DistalPancreatectomy', () => assertEq(Engine.DistalPancreatectomy({ t: 'yes' }).plan, 'distalPancreatectomy-protocol'));
it('HepaticCystFenestration', () => assertEq(Engine.HepaticCystFenestration({ t: 'yes' }).plan, 'hepaticCystFenestration-protocol'));
it('PortalHypertensionShunt', () => assertEq(Engine.PortalHypertensionShunt({ t: 'yes' }).plan, 'portalHypertensionShunt-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
