// filepath: tier118_volunteer_services_621_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function volunteer_assignment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assignment_id, 'aid');
  ensureStr(req.volunteer_id, 'vid');
  ensureStr(req.task, 'tsk');
  ensureStr(req.location, 'loc');
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.completed, 'cmp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assignment_id };
}
function volunteer_hours(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hours_id, 'hid');
  ensureStr(req.volunteer_id, 'vid');
  ensureStr(req.shift_date, 'sd');
  ensureNum(req.hours_logged, 'hl');
  ensureStr(req.department, 'dept');
  ensureStr(req.provider, 'pr');
  return { hid: req.hours_id };
}
function gift_shop(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transaction_id, 'tid');
  ensureStr(req.item, 'itm');
  ensureNum(req.amount_dollars, 'amt');
  ensureEnum(req.payment_method, 'pm', ['cash','card','complimentary','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.transaction_id };
}
function chaplain_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.chaplain_id, 'cid');
  ensureEnum(req.faith_tradition, 'fr', ['christian','muslim','jewish','hindu','buddhist','interfaith','none','other','unknown']);
  ensureStr(req.visit_type, 'vt');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function wayfinding_assist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assist_id, 'asid');
  ensureStr(req.from_location, 'fl');
  ensureStr(req.to_location, 'tl');
  ensureEnum(req.assistance_type, 'at', ['wheelchair','walker','escort','directions','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { asid: req.assist_id };
}

function funcs() { return { volunteer_assignment, volunteer_hours, gift_shop, chaplain_visit, wayfinding_assist }; }
module.exports = { funcs, ValidationError };