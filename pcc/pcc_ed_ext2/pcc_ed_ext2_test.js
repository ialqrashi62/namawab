// P3-CJ pcc_ed_ext2 unit tests
const Engine = require('./pcc_ed_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ed_ext2 engine tests:');
it('Tri', () => assertEq(Engine.Triage({ level: 1 }).plan, 'resus-bay'));
it('Trm', () => assertEq(Engine.TraumaTeam({ m: 'penetrating' }).plan, 'trauma-team-OR'));
it('FR', () => assertEq(Engine.FastTrack({ ac: 5 }).plan, 'fast-track'));
it('Pft', () => assertEq(Engine.PatientFlow({ w: 30 }).plan, 'within-30min'));
it('Cmp', () => assertEq(Engine.Complaint({ c: 'chest-pain' }).plan, 'chest-pain-pathway'));
it('Rsi', () => assertEq(Engine.RSI({ i: 'intubation' }).plan, 'RSI-protocol'));
it('Ppd', () => assertEq(Engine.PainProtocol({ p: 8 }).plan, 'severe-pain-IV'));
it('Dtr', () => assertEq(Engine.Discharge({ d: 'simple' }).plan, 'discharge-home'));
it('Adm', () => assertEq(Engine.Admit({ sp: 'icu' }).plan, 'ICU-admit'));
it('Br', () => assertEq(Engine.Briefing({ t: 'shift' }).plan, 'shift-briefing'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
