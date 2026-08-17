// filepath: tier61_ops_ext_338_ops_facility_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function facility_maintenance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.work_order, 'wo');
  ensureStr(req.area, 'area');
  ensureEnum(req.priority, 'pri', ['low','medium','high','urgent','emergency']);
  ensureStr(req.technician, 'tech');
  ensureNum(req.est_hours, 'eh');
  ensureBool(req.safety_check, 'sc');
  ensureStr(req.completion_notes, 'cn');
  return { wo: req.work_order };
}
function housekeeping(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.room_id, 'rid');
  ensureEnum(req.clean_type, 'ct', ['daily','terminal_discharge','isolation','post_op','spill_clean','terminal_evs']);
  ensureStr(req.staff, 'staff');
  ensureNum(req.inspection_score, 'is');
  ensureBool(req.adherence_protocol, 'ap');
  ensureStr(req.chemicals_used, 'cu');
  ensureBool(req.linen_change, 'lc');
  return { room: req.room_id };
}
function security_log(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.event_type, 'et', ['badge_access','incident','suspicious_activity','visitor_signin','panic_alarm','unauthorized_access','loitering']);
  ensureEnum(req.severity, 'sev', ['info','low','moderate','high','critical']);
  ensureStr(req.location, 'loc');
  ensureStr(req.responder, 'resp');
  ensureStr(req.action_taken, 'at');
  ensureBool(req.video_reviewed, 'vr');
  return { event: req.event_type };
}
function utility_mgmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.utility, 'ut', ['electricity','water','gas','steam','medical_gas','compressed_air','vacuum']);
  ensureNum(req.meter_reading, 'mr');
  ensureEnum(req.unit, 'unit', ['kwh','m3','therms','liters','cubic_feet','bar']);
  ensureBool(req.anomaly_detected, 'ad');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.cost_estimate, 'ce');
  return { utility: req.utility };
}
function parking_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vehicle_plate, 'vp');
  ensureEnum(req.area, 'area', ['staff_lot','patient_lot','visitor_lot','emergency_bay','loading_dock','helipad','valet']);
  ensureNum(req.duration_hours, 'dh');
  ensureBool(req.access_granted, 'ag');
  ensureEnum(req.payment_method, 'pm', ['employee_badge','paid_cash','card','free','permit','mobile_app']);
  ensureBool(req.special_permit, 'sp');
  return { plate: req.vehicle_plate };
}

function funcs() { return { facility_maintenance, housekeeping, security_log, utility_mgmt, parking_access }; }
module.exports = { funcs, ValidationError };