// filepath: tier122_telehealth_636_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function virtual_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.visit_type, 'vt', ['video','phone','asynchronous','store_and_forward','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.connection_quality, 'cq');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function remote_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reading_id, 'rid');
  ensureEnum(req.device_type, 'dt', ['bp_cuff','glucose_meter','pulse_ox','scale','thermometer','ecg','other','unknown']);
  ensureNum(req.value, 'val');
  ensureStr(req.timestamp, 'ts');
  ensureStr(req.provider, 'pr');
  return { rid: req.reading_id };
}
function tele_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.intensivist_id, 'iid');
  ensureEnum(req.alert_level, 'al', ['green','yellow','orange','red','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function tele_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureStr(req.specialist_id, 'spid');
  ensureStr(req.reason, 'rsn');
  ensureEnum(req.urgency, 'urg', ['routine','urgent','emergent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}
function digital_therapeutic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dtx_id, 'did');
  ensureStr(req.app, 'app');
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.sessions_completed, 'sc');
  ensureStr(req.provider, 'pr');
  return { did: req.dtx_id };
}

function funcs() { return { virtual_visit, remote_monitoring, tele_icu, tele_consult, digital_therapeutic }; }
module.exports = { funcs, ValidationError };