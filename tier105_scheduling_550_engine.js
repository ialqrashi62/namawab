// filepath: tier105_scheduling_550_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function appointment_booking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.appointment_id, 'aid');
  ensureStr(req.provider_id, 'pid');
  ensureStr(req.appointment_date, 'ad');
  ensureEnum(req.type, 'tp', ['routine','urgent','follow_up','procedure','telehealth','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.status, 'st', ['scheduled','confirmed','arrived','completed','no_show','cancelled','rescheduled','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.appointment_id };
}
function resource_allocation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.resource_id, 'rid');
  ensureEnum(req.resource_type, 'rt', ['room','equipment','staff','bed','theater','imaging','other','unknown']);
  ensureStr(req.date, 'dt');
  ensureNum(req.utilization_pct, 'up');
  ensureNum(req.peak_hours, 'ph');
  ensureEnum(req.optimization, 'opt', ['optimal','under','over','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { rid: req.resource_id };
}
function waitlist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.waitlist_id, 'wid');
  ensureStr(req.referral, 'pd');
  ensureEnum(req.priority, 'pr', ['low','medium','high','urgent','other','unknown']);
  ensureNum(req.wait_days, 'wd');
  ensureEnum(req.status, 'st', ['active','scheduled','expired','removed','other','unknown']);
  ensureNum(req.position, 'pos');
  ensureStr(req.provider, 'pr');
  return { wid: req.waitlist_id };
}
function reminder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reminder_id, 'rid');
  ensureStr(req.appointment_id, 'aid');
  ensureEnum(req.channel, 'ch', ['sms','email','phone','app_push','other','unknown']);
  ensureNum(req.days_before, 'db');
  ensureBool(req.delivered, 'del');
  ensureEnum(req.response, 'resp', ['confirmed','reschedule','cancel','no_response','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.reminder_id };
}
function no_show(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureStr(req.appointment_id, 'aid');
  ensureNum(req.reasons_count, 'rc');
  ensureEnum(req.reason_category, 'rec', ['transportation','financial','forgot','work','family','illness','other','unknown']);
  ensureBool(req.rebooking, 'rb');
  ensureNum(req.follow_up_actions, 'fua');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { appointment_booking, resource_allocation, waitlist, reminder, no_show }; }
module.exports = { funcs, ValidationError };