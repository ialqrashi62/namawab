// P3-CJ pcc_icu_ext3 unit tests
const Engine = require('./pcc_icu_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_icu_ext3 engine tests:');
it('Ven', () => assertEq(Engine.Ventilation({ mode: 'PRVC' }).plan, 'PRVC-lung-protective'));
it('Sed', () => assertEq(Engine.Sedation({ r: 0 }).plan, 'light-sedation-RASS-0'));
it('Drg', () => assertEq(Engine.Drivers({ g: 2 }).plan, 'gcs-2-worse'));
it('Nu', () => assertEq(Engine.Nutrition({ r: 'trophic' }).plan, 'trophic-feeds'));
it('Trn', () => assertEq(Engine.Transport({ ty: 'CT' }).plan, 'CT-transport-stable'));
it('Br', () => assertEq(Engine.Braden({ s: 10 }).plan, 'high-pressure-injury-risk'));
it('HAp', () => assertEq(Engine.HandHygiene({ c: '100' }).plan, 'full-compliance'));
it('Dis', () => assertEq(Engine.Discharge({ ha: 'stable' }).plan, 'ICU-discharge-ready'));
it('Dly', () => assertEq(Engine.DailyGoals({ c: 'set' }).plan, 'daily-goals-set'));
it('Rqr', () => assertEq(Engine.Requiring({ i: 'intubation' }).plan, 'intubation-bundle'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
