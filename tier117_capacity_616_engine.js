// filepath: tier117_capacity_616_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bed_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assignment_id, 'aid');
  ensureEnum(req.unit, 'unit', ['med_surg','icu','ed','ob','peds','or','other','unknown']);
  ensureEnum(req.bed_type, 'bt', ['standard','telemetry','bariatric','isolation','negative_pressure','other','unknown']);
  ensureNum(req.los_days, 'los');
  ensureEnum(req.cleaning_status, 'cs', ['clean','in_progress','pending','dirty','ready','other','unknown']);
  ensureEnum(req.status, 'st', ['occupied','available','reserved','discharged','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assignment_id };
}
function staff_scheduling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.shift_id, 'sid');
  ensureStr(req.role, 'role');
  ensureNum(req.staff_count, 'sc');
  ensureNum(req.shift_hours, 'sh');
  ensureEnum(req.coverage, 'cov', ['full','partial','minimal','short','other','unknown']);
  ensureNum(req.overtime_hours, 'oh');
  ensureStr(req.provider, 'pr');
  return { sid: req.shift_id };
}
function equipment_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.equipment_id, 'eid');
  ensureStr(req.equipment_type, 'et');
  ensureStr(req.location, 'loc');
  ensureEnum(req.status, 'st', ['in_use','available','maintenance','broken','other','unknown']);
  ensureNum(req.last_pm_days, 'lpmd');
  ensureStr(req.provider, 'pr');
  return { eid: req.equipment_id };
}
function room_utilization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.room_id, 'rid');
  ensureNum(req.utilization_pct, 'up');
  ensureNum(req.hours_used, 'hu');
  ensureNum(req.hours_available, 'ha');
  ensureEnum(req.peak_period, 'pp', ['morning','afternoon','evening','night','all_day','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.room_id };
}
function resource_allocation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.allocation_id, 'aid');
  ensureStr(req.resource, 'res');
  ensureNum(req.requested, 'req');
  ensureNum(req.allocated, 'alc');
  ensureEnum(req.priority, 'pr', ['high','medium','low','routine','other','unknown']);
  ensureNum(req.fulfill_rate, 'fr');
  ensureStr(req.provider, 'pr');
  return { aid: req.allocation_id };
}

function funcs() { return { bed_management, staff_scheduling, equipment_tracking, room_utilization, resource_allocation }; }
module.exports = { funcs, ValidationError };