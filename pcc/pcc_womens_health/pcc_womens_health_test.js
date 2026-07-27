// P3-CU pcc_womens_health unit tests
const Engine = require('./pcc_womens_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_womens_health engine tests:');
it('Prg', () => assertEq(Engine.Pregnancy({ w: 38 }).plan, 'term'));
it('Con', () => assertEq(Engine.Contraception({ t: 'IUD' }).plan, 'IUD-insertion'));
it('Men', () => assertEq(Engine.Menopause({ t: 'post' }).plan, 'post-menopause'));
it('Pco', () => assertEq(Engine.Pcos({ t: 'confirmed' }).plan, 'PCOS-confirmed'));
it('End', () => assertEq(Engine.Endometriosis({ t: 'confirmed' }).plan, 'endometriosis-confirmed'));
it('In', () => assertEq(Engine.Infertility({ t: 'eval' }).plan, 'infertility-eval'));
it('Po', () => assertEq(Engine.Postpartum({ d: 10 }).plan, 'early-postpartum'));
it('St', () => assertEq(Engine.Sti({ t: 'positive' }).plan, 'STI-positive'));
it('Dv', () => assertEq(Engine.Domestic({ t: 'concern' }).plan, 'DV-concern'));
it('Vag', () => assertEq(Engine.Vaginitis({ t: 'recurrent' }).plan, 'recurrent-vaginitis'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
