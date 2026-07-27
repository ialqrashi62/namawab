// P3-CX pcc_addiction_med unit tests
const Engine = require('./pcc_addiction_med_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_addiction_med engine tests:');
it('Audit', () => assertEq(Engine.Audit({ t: 'yes' }).plan, 'audit-protocol'));
it('Dast', () => assertEq(Engine.Dast({ t: 'yes' }).plan, 'dast-protocol'));
it('Cage', () => assertEq(Engine.Cage({ t: 'yes' }).plan, 'cage-protocol'));
it('Motivation', () => assertEq(Engine.Motivation({ t: 'yes' }).plan, 'motivation-protocol'));
it('Withdrawal', () => assertEq(Engine.Withdrawal({ t: 'yes' }).plan, 'withdrawal-protocol'));
it('MatOpioid', () => assertEq(Engine.MatOpioid({ t: 'yes' }).plan, 'matopioid-protocol'));
it('MatAlcohol', () => assertEq(Engine.MatAlcohol({ t: 'yes' }).plan, 'matalcohol-protocol'));
it('Overdose', () => assertEq(Engine.Overdose({ t: 'yes' }).plan, 'overdose-protocol'));
it('HarmReduction', () => assertEq(Engine.HarmReduction({ t: 'yes' }).plan, 'harmreduction-protocol'));
it('RelapsePlan', () => assertEq(Engine.RelapsePlan({ t: 'yes' }).plan, 'relapseplan-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
