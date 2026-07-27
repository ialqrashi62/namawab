// P3-EQ pcc_pediatric_renal_ext unit tests
const Engine = require('./pcc_pediatric_renal_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_renal_ext engine tests:');
it('PediatricAKI', () => assertEq(Engine.PediatricAKI({ t: 'yes' }).plan, 'pediatricAKI-protocol'));
it('PediatricCKDEval', () => assertEq(Engine.PediatricCKDEval({ t: 'yes' }).plan, 'pediatricCKDEval-protocol'));
it('PediatricNS', () => assertEq(Engine.PediatricNS({ t: 'yes' }).plan, 'pediatricNS-protocol'));
it('PediatricHUS', () => assertEq(Engine.PediatricHUS({ t: 'yes' }).plan, 'pediatricHUS-protocol'));
it('PediatricRPGN', () => assertEq(Engine.PediatricRPGN({ t: 'yes' }).plan, 'pediatricRPGN-protocol'));
it('PediatricUTIExt', () => assertEq(Engine.PediatricUTIExt({ t: 'yes' }).plan, 'pediatricUTIExt-protocol'));
it('PediatricVUR', () => assertEq(Engine.PediatricVUR({ t: 'yes' }).plan, 'pediatricVUR-protocol'));
it('PediatricRenalTubularAcidosis', () => assertEq(Engine.PediatricRenalTubularAcidosis({ t: 'yes' }).plan, 'pediatricRenalTubularAcidosis-protocol'));
it('PediatricBartterSyndrome', () => assertEq(Engine.PediatricBartterSyndrome({ t: 'yes' }).plan, 'pediatricBartterSyndrome-protocol'));
it('PediatricGitelmanSyndrome', () => assertEq(Engine.PediatricGitelmanSyndrome({ t: 'yes' }).plan, 'pediatricGitelmanSyndrome-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
