// P3-CS pcc_code_blue unit tests
const Engine = require('./pcc_code_blue_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_code_blue engine tests:');
it('Cf', () => assertEq(Engine.Confirm({ t: 'pulseless' }).plan, 'pulseless-VF-VT'));
it('Cpr', () => assertEq(Engine.Cpr({ q: 'good' }).plan, 'high-quality-CPR'));
it('Def', () => assertEq(Engine.Defib({ t: 'shockable' }).plan, 'shockable-rhythm'));
it('Epi', () => assertEq(Engine.Epi({ m: '1mg' }).plan, 'epinephrine-1mg'));
it('Ami', () => assertEq(Engine.Amio({ d: '300' }).plan, 'amiodarone-300mg'));
it('Ai', () => assertEq(Engine.Airway({ t: 'intubated' }).plan, 'intubated-Airway'));
it('Rh', () => assertEq(Engine.Rhythm({ r: 'asystole' }).plan, 'asystole-continued-CPR'));
it('Rosc', () => assertEq(Engine.Rosc({ t: 'achieved' }).plan, 'ROSC-achieved'));
it('Eti', () => assertEq(Engine.Etiology({ t: 'HsTs' }).plan, 'HsTs-workup'));
it('Te', () => assertEq(Engine.Termination({ t: 'asystole' }).plan, 'asystole-termination'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
