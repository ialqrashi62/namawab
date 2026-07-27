// P3-CG pcc_dialysis unit tests
const Engine = require('./pcc_dialysis_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_dialysis engine tests:');
it('Acc', () => assertEq(Engine.Access({ type: 'AVF' }).plan, 'AV-fistula-preferred'));
it('Tre', () => assertEq(Engine.Treatment({ t: 'PD' }).plan, 'peritoneal-dialysis'));
it('Clr', () => assertEq(Engine.Clearance({ ktv: 1.5 }).plan, 'adequate-clearance'));
it('DW', () => assertEq(Engine.DryWeight({ over: 4 }).plan, 'above-dry-weight'));
it('UF', () => assertEq(Engine.Ultrafiltration({ rate: 14 }).plan, 'excessive-uf-risk'));
it('Hep', () => assertEq(Engine.Heparin({ t: 'bolus' }).plan, 'heparin-bolus'));
it('Sod', () => assertEq(Engine.Sodium({ conc: 142 }).plan, 'high-sodium-dialysate'));
it('Bic', () => assertEq(Engine.Bicarbonate({ level: 40 }).plan, 'high-bicarb'));
it('Reu', () => assertEq(Engine.Reuse({ cnt: 16 }).plan, 'reuse-limit'));
it('Kt', () => assertEq(Engine.KtV({ v: 1.3 }).plan, 'adequate-Kt-V'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
