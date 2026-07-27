// P3-EK pcc_pediatric_surg_subspec unit tests
const Engine = require('./pcc_pediatric_surg_subspec_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surg_subspec engine tests:');
it('PediatricHepatobiliarySurg', () => assertEq(Engine.PediatricHepatobiliarySurg({ t: 'yes' }).plan, 'pediatricHepatobiliarySurg-protocol'));
it('PediatricThoracicSurg', () => assertEq(Engine.PediatricThoracicSurg({ t: 'yes' }).plan, 'pediatricThoracicSurg-protocol'));
it('PediatricUrologicSurg', () => assertEq(Engine.PediatricUrologicSurg({ t: 'yes' }).plan, 'pediatricUrologicSurg-protocol'));
it('PediatricColorectalSurg', () => assertEq(Engine.PediatricColorectalSurg({ t: 'yes' }).plan, 'pediatricColorectalSurg-protocol'));
it('PediatricENT', () => assertEq(Engine.PediatricENT({ t: 'yes' }).plan, 'pediatricENT-protocol'));
it('PediatricOphthalmicSurg', () => assertEq(Engine.PediatricOphthalmicSurg({ t: 'yes' }).plan, 'pediatricOphthalmicSurg-protocol'));
it('PediatricPlasticRecon', () => assertEq(Engine.PediatricPlasticRecon({ t: 'yes' }).plan, 'pediatricPlasticRecon-protocol'));
it('PediatricBariatricSurg', () => assertEq(Engine.PediatricBariatricSurg({ t: 'yes' }).plan, 'pediatricBariatricSurg-protocol'));
it('PediatricTransplantSurg', () => assertEq(Engine.PediatricTransplantSurg({ t: 'yes' }).plan, 'pediatricTransplantSurg-protocol'));
it('PediatricTraumaSurg', () => assertEq(Engine.PediatricTraumaSurg({ t: 'yes' }).plan, 'pediatricTraumaSurg-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
