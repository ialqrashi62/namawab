// P3-EN pcc_pediatric_icu_ext unit tests
const Engine = require('./pcc_pediatric_icu_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_icu_ext engine tests:');
it('PediatricShock', () => assertEq(Engine.PediatricShock({ t: 'yes' }).plan, 'pediatricShock-protocol'));
it('PediatricARDS', () => assertEq(Engine.PediatricARDS({ t: 'yes' }).plan, 'pediatricARDS-protocol'));
it('PediatricSepsisBundle', () => assertEq(Engine.PediatricSepsisBundle({ t: 'yes' }).plan, 'pediatricSepsisBundle-protocol'));
it('PediatricStatusEpilepticus', () => assertEq(Engine.PediatricStatusEpilepticus({ t: 'yes' }).plan, 'pediatricStatusEpilepticus-protocol'));
it('PediatricHypertensiveEmergency', () => assertEq(Engine.PediatricHypertensiveEmergency({ t: 'yes' }).plan, 'pediatricHypertensiveEmergency-protocol'));
it('PediatricDKA', () => assertEq(Engine.PediatricDKA({ t: 'yes' }).plan, 'pediatricDKA-protocol'));
it('PediatricTraumaResuscitation', () => assertEq(Engine.PediatricTraumaResuscitation({ t: 'yes' }).plan, 'pediatricTraumaResuscitation-protocol'));
it('PediatricBurnMgmt', () => assertEq(Engine.PediatricBurnMgmt({ t: 'yes' }).plan, 'pediatricBurnMgmt-protocol'));
it('PediatricToxicology', () => assertEq(Engine.PediatricToxicology({ t: 'yes' }).plan, 'pediatricToxicology-protocol'));
it('PediatricPostCardiacArrest', () => assertEq(Engine.PediatricPostCardiacArrest({ t: 'yes' }).plan, 'pediatricPostCardiacArrest-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
