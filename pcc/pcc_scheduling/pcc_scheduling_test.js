// P3-CF pcc_scheduling unit tests
const Engine = require('./pcc_scheduling_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_scheduling engine tests:');
it('Sch', () => assertEq(Engine.Schedule({ type: 'consult' }).plan, 'consult-30min'));
it('Slt', () => assertEq(Engine.Slot({ dur: 60 }).plan, 'extended-slot'));
it('WL', () => assertEq(Engine.Waitlist({ days: 30 }).plan, 'long-waitlist'));
it('Rem', () => assertEq(Engine.Reminder({ ch: 'sms' }).plan, 'SMS-reminder'));
it('Bk', () => assertEq(Engine.Booking({ urgency: 'urgent' }).plan, 'urgent-slot'));
it('Cnc', () => assertEq(Engine.Cancel({ reason: 'late' }).plan, 'late-cancel-fee'));
it('Rsc', () => assertEq(Engine.Reschedule({ cnt: 3 }).plan, 'frequent-reschedule'));
it('Cap', () => assertEq(Engine.Capacity({ util: 90 }).plan, 'overbooked'));
it('Res', () => assertEq(Engine.Resource({ type: 'or' }).plan, 'OR-block'));
it('Tpl', () => assertEq(Engine.Template({ spec: 'cardio' }).plan, 'cardiology-template'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
