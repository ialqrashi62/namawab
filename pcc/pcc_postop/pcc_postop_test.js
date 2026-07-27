// P3-CH pcc_postop unit tests
const Engine = require('./pcc_postop_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_postop engine tests:');
it('Pcu', () => assertEq(Engine.Pacu({ ald: 7 }).plan, 'PACU-discharge-ready'));
it('Pan', () => assertEq(Engine.Pain({ n: 8 }).plan, 'severe-pain-multimodal'));
it('Nau', () => assertEq(Engine.Nausea({ s: 'severe' }).plan, 'severe-ponv-protocol'));
it('Die', () => assertEq(Engine.Diet({ d: 'clear' }).plan, 'clear-liquids'));
it('Act', () => assertEq(Engine.Activity({ a: 'ambulate' }).plan, 'ambulate-today'));
it('Dvt', () => assertEq(Engine.Dvt({ r: 'high' }).plan, 'extended-LMWH'));
it('Wnd', () => assertEq(Engine.Wound({ s: 'dehiscence' }).plan, 'wound-dehiscence-OR'));
it('Drn', () => assertEq(Engine.Drain({ ml: 150 }).plan, 'high-output-drain'));
it('Dis', () => assertEq(Engine.Discharge({ d: 1 }).plan, 'discharge-today'));
it('FU', () => assertEq(Engine.FollowUp({ days: 14 }).plan, '2-week-followup'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
