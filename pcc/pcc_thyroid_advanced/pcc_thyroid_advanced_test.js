// P3-DG pcc_thyroid_advanced unit tests
const Engine = require('./pcc_thyroid_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_thyroid_advanced engine tests:');
it('TSHPattern', () => assertEq(Engine.TSHPattern({ t: 'yes' }).plan, 'tshpattern-protocol'));
it('FreeT3T4', () => assertEq(Engine.FreeT3T4({ t: 'yes' }).plan, 'freet3t4-protocol'));
it('ReverseT3', () => assertEq(Engine.ReverseT3({ t: 'yes' }).plan, 'reverset3-protocol'));
it('ThyroidAntibodies', () => assertEq(Engine.ThyroidAntibodies({ t: 'yes' }).plan, 'thyroidantibodies-protocol'));
it('IodineStatus', () => assertEq(Engine.IodineStatus({ t: 'yes' }).plan, 'iodinestatus-protocol'));
it('SeleniumSupport', () => assertEq(Engine.SeleniumSupport({ t: 'yes' }).plan, 'seleniumsupport-protocol'));
it('Hashimotos', () => assertEq(Engine.Hashimotos({ t: 'yes' }).plan, 'hashimotos-protocol'));
it('Graves', () => assertEq(Engine.Graves({ t: 'yes' }).plan, 'graves-protocol'));
it('ThyroidNodule', () => assertEq(Engine.ThyroidNodule({ t: 'yes' }).plan, 'thyroidnodule-protocol'));
it('PostpartumThyroid', () => assertEq(Engine.PostpartumThyroid({ t: 'yes' }).plan, 'postpartumthyroid-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
