// P3-CR pcc_safety unit tests
const Engine = require('./pcc_safety_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_safety engine tests:');
it('Fl', () => assertEq(Engine.Fall({ t: 'event' }).plan, 'fall-event'));
it('Rst', () => assertEq(Engine.Restraint({ t: 'violent' }).plan, 'violent-restraint'));
it('Sui', () => assertEq(Engine.Suicide({ t: 'high-risk' }).plan, 'suicide-high-risk'));
it('Elo', () => assertEq(Engine.Elopement({ t: 'high-risk' }).plan, 'elopement-risk'));
it('Mis', () => assertEq(Engine.Mislabel({ t: 'detected' }).plan, 'specimen-mislabel'));
it('WP', () => assertEq(Engine.WrongPt({ t: 'event' }).plan, 'wrong-patient-event'));
it('Fr', () => assertEq(Engine.Fire({ t: 'high-risk' }).plan, 'fire-risk'));
it('Rad', () => assertEq(Engine.Radiation({ t: 'high' }).plan, 'radiation-high-dose'));
it('Sha', () => assertEq(Engine.Sharps({ t: 'injury' }).plan, 'sharps-injury'));
it('Hz', () => assertEq(Engine.Hazard({ t: 'chemical' }).plan, 'chemical-hazard'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
