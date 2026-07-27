// P3-CN pcc_hem_ext3 unit tests
const Engine = require('./pcc_hem_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_hem_ext3 engine tests:');
it('An', () => assertEq(Engine.Anemia({ hb: 6 }).plan, 'severe-anemia-transfuse'));
it('Tr', () => assertEq(Engine.Transfusion({ t: 'PRBC' }).plan, 'PRBC-transfusion'));
it('Co', () => assertEq(Engine.Coag({ inr: 5 }).plan, 'over-anticoagulated'));
it('Ma', () => assertEq(Engine.Marrow({ t: 'urgent' }).plan, 'urgent-biopsy'));
it('Mds', () => assertEq(Engine.Mds({ t: 'high-risk' }).plan, 'high-risk-MDS'));
it('Mpn', () => assertEq(Engine.Mpn({ t: 'PV' }).plan, 'polycythemia-vera'));
it('Ly', () => assertEq(Engine.Lymphoma({ t: 'HL' }).plan, 'Hodgkin-lymphoma'));
it('Le', () => assertEq(Engine.Leukemia({ t: 'AML' }).plan, 'AML-treatment'));
it('Tp', () => assertEq(Engine.Transplant({ t: 'allogeneic' }).plan, 'allogeneic-transplant'));
it('Ir', () => assertEq(Engine.Iron({ fer: 25 }).plan, 'iron-deficiency'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
