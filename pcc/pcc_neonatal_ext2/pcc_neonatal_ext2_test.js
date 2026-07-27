// P3-CK pcc_neonatal_ext2 unit tests
const Engine = require('./pcc_neonatal_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_neonatal_ext2 engine tests:');
it('GA', () => assertEq(Engine.GestationAge({ w: 30 }).plan, 'very-preterm'));
it('AP', () => assertEq(Engine.APGAR({ s: 2 }).plan, 'severely-depressed'));
it('BW', () => assertEq(Engine.BirthWeight({ g: 1300 }).plan, 'VLBW'));
it('NS', () => assertEq(Engine.NewbornScreen({ t: 'pku' }).plan, 'PKU-screen'));
it('BF', () => assertEq(Engine.Breastfeed({ s: 'latch' }).plan, 'latch-support-needed'));
it('HB', () => assertEq(Engine.Hyperbilirubin({ t: 22 }).plan, 'exchange-transfusion-zone'));
it('Feed', () => assertEq(Engine.Feeding({ t: 'ng' }).plan, 'NG-feeding'));
it('DC', () => assertEq(Engine.DischargeChecklist({ c: 'complete' }).plan, 'discharge-ready'));
it('SE', () => assertEq(Engine.SepsisEval({ r: 'high' }).plan, 'full-sepsis-eval'));
it('CC', () => assertEq(Engine.CordCare({ t: 'chlorhexidine' }).plan, 'chlorhexidine-cord-care'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
