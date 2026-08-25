// filepath: tier130_surg_sched_670_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function block_time(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bt_id, 'bid');
  ensureStr(req.room, 'rm');
  ensureStr(req.date, 'dt');
  ensureStr(req.surgeon_id, 'sid');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { bid: req.bt_id };
}
function pre_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pa_id, 'pid');
  ensureBool(req.consent_signed, 'cs');
  ensureBool(req.preop_clearance, 'pc');
  ensureBool(req.npo_status, 'npo');
  ensureStr(req.provider, 'pr');
  return { pid: req.pa_id };
}
function booking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.book_id, 'bid');
  ensureEnum(req.priority, 'pri', ['elective','urgent','emergent','other','unknown']);
  ensureStr(req.surgeon_id, 'sid');
  ensureStr(req.scheduled_date, 'sd');
  ensureStr(req.provider, 'pr');
  return { bid: req.book_id };
}
function booking_cancel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancel_id, 'cid');
  ensureStr(req.book_id, 'bid');
  ensureEnum(req.reason, 'rs', ['patient_request','clinical','equipment','staffing','no_show','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cancel_id };
}
function or_utilization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.util_id, 'uid');
  ensureStr(req.room, 'rm');
  ensureNum(req.cases_completed, 'cc');
  ensureNum(req.idle_minutes, 'idle');
  ensureStr(req.provider, 'pr');
  return { uid: req.util_id };
}

function funcs() { return { block_time, pre_admission, booking, booking_cancel, or_utilization }; }
module.exports = { funcs, ValidationError };