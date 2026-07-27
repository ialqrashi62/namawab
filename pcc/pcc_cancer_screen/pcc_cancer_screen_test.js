// P3-CU pcc_cancer_screen unit tests
const Engine = require('./pcc_cancer_screen_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_cancer_screen engine tests:');
it('B', () => assertEq(Engine.Breast({ t: 'overdue' }).plan, 'mammo-overdue'));
it('C', () => assertEq(Engine.Colon({ t: 'overdue' }).plan, 'colon-overdue'));
it('Cv', () => assertEq(Engine.Cervix({ t: 'overdue' }).plan, 'pap-overdue'));
it('Pr', () => assertEq(Engine.Prostate({ t: 'elevated' }).plan, 'elevated-PSA'));
it('L', () => assertEq(Engine.Lung({ t: 'eligible' }).plan, 'LDCT-eligible'));
it('S', () => assertEq(Engine.Skin({ t: 'suspicious' }).plan, 'suspicious-skin'));
it('O', () => assertEq(Engine.Ovarian({ t: 'high-risk' }).plan, 'high-risk-ovarian'));
it('H', () => assertEq(Engine.Hpv({ t: 'positive' }).plan, 'HPV-positive'));
it('Sm', () => assertEq(Engine.Smear({ t: 'abnormal' }).plan, 'abnormal-smear'));
it('Rc', () => assertEq(Engine.Recall({ d: 30 }).plan, 'recall-soon'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
