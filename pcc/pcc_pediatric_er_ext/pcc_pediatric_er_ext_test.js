// P3-EN pcc_pediatric_er_ext unit tests
const Engine = require('./pcc_pediatric_er_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_er_ext engine tests:');
it('PediatricRespiratoryDistress', () => assertEq(Engine.PediatricRespiratoryDistress({ t: 'yes' }).plan, 'pediatricRespiratoryDistress-protocol'));
it('PediatricAsthmaExacerbation', () => assertEq(Engine.PediatricAsthmaExacerbation({ t: 'yes' }).plan, 'pediatricAsthmaExacerbation-protocol'));
it('PediatricAnaphylaxis', () => assertEq(Engine.PediatricAnaphylaxis({ t: 'yes' }).plan, 'pediatricAnaphylaxis-protocol'));
it('PediatricDehydration', () => assertEq(Engine.PediatricDehydration({ t: 'yes' }).plan, 'pediatricDehydration-protocol'));
it('PediatricApnea', () => assertEq(Engine.PediatricApnea({ t: 'yes' }).plan, 'pediatricApnea-protocol'));
it('PediatricBradycardia', () => assertEq(Engine.PediatricBradycardia({ t: 'yes' }).plan, 'pediatricBradycardia-protocol'));
it('PediatricTachycardia', () => assertEq(Engine.PediatricTachycardia({ t: 'yes' }).plan, 'pediatricTachycardia-protocol'));
it('PediatricAlteredMental', () => assertEq(Engine.PediatricAlteredMental({ t: 'yes' }).plan, 'pediatricAlteredMental-protocol'));
it('PediatricPoisoning', () => assertEq(Engine.PediatricPoisoning({ t: 'yes' }).plan, 'pediatricPoisoning-protocol'));
it('PediatricForeignBody', () => assertEq(Engine.PediatricForeignBody({ t: 'yes' }).plan, 'pediatricForeignBody-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
