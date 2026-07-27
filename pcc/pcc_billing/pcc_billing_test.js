// P3-CF pcc_billing unit tests
const Engine = require('./pcc_billing_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_billing engine tests:');
it('Bill', () => assertEq(Engine.Billing({ cpt: '99213' }).plan, 'EM-code'));
it('Chg', () => assertEq(Engine.Charge({ amt: 1500 }).plan, 'high-dollar-charge'));
it('Ins', () => assertEq(Engine.Insurance({ type: 'medicare' }).plan, 'medicare-claim'));
it('Disc', () => assertEq(Engine.Discount({ pct: 60 }).plan, 'charity-care'));
it('Pay', () => assertEq(Engine.Payment({ method: 'card' }).plan, 'card-payment'));
it('Ref', () => assertEq(Engine.Refund({ reason: 'overcharge' }).plan, 'overcharge-refund'));
it('Stmt', () => assertEq(Engine.Statement({ fy: 'annual' }).plan, 'annual-summary'));
it('Den', () => assertEq(Engine.Denial({ code: 'CO-97' }).plan, 'bundled-services'));
it('Rec', () => assertEq(Engine.Reclaim({ days: 90 }).plan, 'collections'));
it('Tax', () => assertEq(Engine.Tax({ rate: 0.20 }).plan, 'high-tax-region'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
