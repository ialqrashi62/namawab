// P3-CF pcc_scheduling_engine v3.44.0
'use strict';
function Schedule(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'open-slot';
  if (type === 'consult') plan = 'consult-30min';
  else if (type === 'followup') plan = 'followup-15min';
  else if (type === 'procedure') plan = 'procedure-block';
  return { plan, type };
}
function Slot(input) {
  const i = input || {};
  const dur = Number(i.dur ?? 0);
  let plan = 'standard-slot';
  if (dur >= 60) plan = 'extended-slot';
  else if (dur >= 30) plan = 'standard-slot';
  else if (dur > 0) plan = 'short-slot';
  return { plan, dur };
}
function Waitlist(input) {
  const i = input || {};
  const days = Number(i.days ?? 0);
  let plan = 'normal';
  if (days >= 30) plan = 'long-waitlist';
  else if (days >= 14) plan = 'moderate-waitlist';
  else if (days > 0) plan = 'short-waitlist';
  return { plan, days };
}
function Reminder(input) {
  const i = input || {};
  const ch = String(i.ch || '');
  let plan = 'email-only';
  if (ch === 'sms') plan = 'SMS-reminder';
  else if (ch === 'voice') plan = 'voice-call';
  else if (ch === 'multi') plan = 'multi-channel-reminder';
  return { plan, ch };
}
function Booking(input) {
  const i = input || {};
  const u = String(i.urgency || '');
  let plan = 'routine-booking';
  if (u === 'urgent') plan = 'urgent-slot';
  else if (u === 'emergent') plan = 'same-day-emergent';
  else if (u === 'priority') plan = 'priority-slot';
  return { plan, u };
}
function Cancel(input) {
  const i = input || {};
  const reason = String(i.reason || '');
  let plan = 'no-fee-cancel';
  if (reason === 'late') plan = 'late-cancel-fee';
  else if (reason === 'no-show') plan = 'no-show-fee';
  return { plan, reason };
}
function Reschedule(input) {
  const i = input || {};
  const cnt = Number(i.cnt ?? 0);
  let plan = 'first-reschedule';
  if (cnt >= 3) plan = 'frequent-reschedule';
  else if (cnt >= 1) plan = 'repeat-reschedule';
  return { plan, cnt };
}
function Capacity(input) {
  const i = input || {};
  const util = Number(i.util ?? 0);
  let plan = 'low-util';
  if (util >= 90) plan = 'overbooked';
  else if (util >= 75) plan = 'high-util';
  else if (util >= 50) plan = 'optimal-util';
  return { plan, util };
}
function Resource(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'room-standard';
  if (type === 'or') plan = 'OR-block';
  else if (type === 'imaging') plan = 'imaging-suite';
  else if (type === 'exam') plan = 'exam-room';
  return { plan, type };
}
function Template(input) {
  const i = input || {};
  const spec = String(i.spec || '');
  let plan = 'general-template';
  if (spec === 'cardio') plan = 'cardiology-template';
  else if (spec === 'onc') plan = 'oncology-template';
  return { plan, spec };
}
module.exports = {
  Schedule, Slot, Waitlist, Reminder, Booking, Cancel, Reschedule, Capacity, Resource, Template
};
