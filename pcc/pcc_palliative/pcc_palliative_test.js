// P3-CV pcc_palliative unit tests
const Engine = require('./pcc_palliative_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_palliative engine tests:');
it('Sym', () => assertEq(Engine.Symptom({ t: 'pain' }).plan, 'palliative-pain'));
it('Perf', () => assertEq(Engine.Performance({ s: 40 }).plan, 'functional-impaired'));
it('Prg', () => assertEq(Engine.Prognosis({ m: 1 }).plan, 'prognosis-weeks'));
it('Gol', () => assertEq(Engine.Goals({ t: 'comfort' }).plan, 'comfort-care'));
it('Adv', () => assertEq(Engine.AdvanceCare({ t: 'dnr' }).plan, 'dnr-documented'));
it('Fam', () => assertEq(Engine.FamilyMeeting({ t: 'scheduled' }).plan, 'family-meeting-scheduled'));
it('Hos', () => assertEq(Engine.Hospice({ t: 'eligible' }).plan, 'hospice-eligible'));
it('Med', () => assertEq(Engine.Medication({ t: 'opioid' }).plan, 'opioid-protocol'));
it('Brk', () => assertEq(Engine.Breakthrough({ t: 'pain' }).plan, 'breakthrough-pain-plan'));
it('Spi', () => assertEq(Engine.Spiritual({ t: 'support' }).plan, 'spiritual-support'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
