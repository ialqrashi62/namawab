// filepath: tier119_security_627_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function incident_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureEnum(req.incident_type, 'it', ['theft','assault','vandalism','trespassing','medical_device','other','unknown']);
  ensureEnum(req.severity, 'sev', ['low','medium','high','critical','other','unknown']);
  ensureStr(req.location, 'loc');
  ensureBool(req.police_called, 'pc');
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}
function visitor_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visitor_id, 'vid');
  ensureStr(req.visitor_name, 'vn');
  ensureNum(req.id_verified, 'idv');
  ensureBool(req.badge_issued, 'bi');
  ensureEnum(req.access_level, 'al', ['standard','restricted','unit_only','no_access','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visitor_id };
}
function access_control_log(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.log_id, 'lid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.door_id, 'did');
  ensureEnum(req.access_granted, 'ag', ['granted','denied','restricted','other','unknown']);
  ensureStr(req.timestamp, 'ts');
  ensureStr(req.provider, 'pr');
  return { lid: req.log_id };
}
function surveillance_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.camera_id, 'cid');
  ensureEnum(req.alert_type, 'at', ['loitering','unauthorized_access','aggression','other','unknown']);
  ensureBool(req.acknowledged, 'ack');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function code_silver(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureStr(req.activator, 'act');
  ensureNum(req.response_time_sec, 'rts');
  ensureEnum(req.outcome, 'oc', ['contained','resolved','escalated','ongoing','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.event_id };
}

function funcs() { return { incident_report, visitor_management, access_control_log, surveillance_alert, code_silver }; }
module.exports = { funcs, ValidationError };