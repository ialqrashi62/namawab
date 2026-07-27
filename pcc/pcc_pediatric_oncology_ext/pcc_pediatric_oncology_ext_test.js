// P3-ES pcc_pediatric_oncology_ext unit tests
const Engine = require('./pcc_pediatric_oncology_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_oncology_ext engine tests:');
it('PediatricALLRelapse', () => assertEq(Engine.PediatricALLRelapse({ t: 'yes' }).plan, 'pediatricALLRelapse-protocol'));
it('PediatricAMLExt', () => assertEq(Engine.PediatricAMLExt({ t: 'yes' }).plan, 'pediatricAMLExt-protocol'));
it('PediatricCML', () => assertEq(Engine.PediatricCML({ t: 'yes' }).plan, 'pediatricCML-protocol'));
it('PediatricMDS', () => assertEq(Engine.PediatricMDS({ t: 'yes' }).plan, 'pediatricMDS-protocol'));
it('PediatricJMML', () => assertEq(Engine.PediatricJMML({ t: 'yes' }).plan, 'pediatricJMML-protocol'));
it('PediatricBurkittLymphoma', () => assertEq(Engine.PediatricBurkittLymphoma({ t: 'yes' }).plan, 'pediatricBurkittLymphoma-protocol'));
it('PediatricHodgkinLymphoma', () => assertEq(Engine.PediatricHodgkinLymphoma({ t: 'yes' }).plan, 'pediatricHodgkinLymphoma-protocol'));
it('PediatricNHL', () => assertEq(Engine.PediatricNHL({ t: 'yes' }).plan, 'pediatricNHL-protocol'));
it('PediatricBrainstemGlioma', () => assertEq(Engine.PediatricBrainstemGlioma({ t: 'yes' }).plan, 'pediatricBrainstemGlioma-protocol'));
it('PediatricMedulloblastoma', () => assertEq(Engine.PediatricMedulloblastoma({ t: 'yes' }).plan, 'pediatricMedulloblastoma-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
