// P3-EJ pcc_pediatric_derm_ext unit tests
const Engine = require('./pcc_pediatric_derm_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_derm_ext engine tests:');
it('PediatricEczema', () => assertEq(Engine.PediatricEczema({ t: 'yes' }).plan, 'pediatricEczema-protocol'));
it('PediatricPsoriasis', () => assertEq(Engine.PediatricPsoriasis({ t: 'yes' }).plan, 'pediatricPsoriasis-protocol'));
it('PediatricAcne', () => assertEq(Engine.PediatricAcne({ t: 'yes' }).plan, 'pediatricAcne-protocol'));
it('PediatricHemangioma', () => assertEq(Engine.PediatricHemangioma({ t: 'yes' }).plan, 'pediatricHemangioma-protocol'));
it('PediatricMolluscum', () => assertEq(Engine.PediatricMolluscum({ t: 'yes' }).plan, 'pediatricMolluscum-protocol'));
it('PediatricWarts', () => assertEq(Engine.PediatricWarts({ t: 'yes' }).plan, 'pediatricWarts-protocol'));
it('PediatricBirthmarks', () => assertEq(Engine.PediatricBirthmarks({ t: 'yes' }).plan, 'pediatricBirthmarks-protocol'));
it('PediatricDrugRash', () => assertEq(Engine.PediatricDrugRash({ t: 'yes' }).plan, 'pediatricDrugRash-protocol'));
it('PediatricHairDisorders', () => assertEq(Engine.PediatricHairDisorders({ t: 'yes' }).plan, 'pediatricHairDisorders-protocol'));
it('PediatricNailDisorders', () => assertEq(Engine.PediatricNailDisorders({ t: 'yes' }).plan, 'pediatricNailDisorders-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
