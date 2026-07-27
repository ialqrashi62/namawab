// P3-CR pcc_handoff unit tests
const Engine = require('./pcc_handoff_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_handoff engine tests:');
it('Ip', () => assertEq(Engine.Ipass({ t: 'completed' }).plan, 'IPASS-handoff-completed'));
it('Sbr', () => assertEq(Engine.Sbar({ t: 'used' }).plan, 'SBAR-handoff-used'));
it('Sh', () => assertEq(Engine.Shift({ t: 'change' }).plan, 'shift-change-handoff'));
it('Dc', () => assertEq(Engine.Discharge({ t: 'completed' }).plan, 'discharge-handoff-completed'));
it('Ic', () => assertEq(Engine.Icu({ t: 'completed' }).plan, 'ICU-admission-handoff'));
it('Or', () => assertEq(Engine.Or({ t: 'completed' }).plan, 'OR-handoff-completed'));
it('Er', () => assertEq(Engine.Er({ t: 'completed' }).plan, 'ER-handoff-completed'));
it('An', () => assertEq(Engine.Anesthesia({ t: 'completed' }).plan, 'anesthesia-handoff'));
it('Pr', () => assertEq(Engine.Primary({ t: 'called' }).plan, 'primary-paged'));
it('Rc', () => assertEq(Engine.Receiving({ t: 'accepted' }).plan, 'receiving-team-accepted'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
