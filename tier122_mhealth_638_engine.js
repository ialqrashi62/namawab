// filepath: tier122_mhealth_638_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_app(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.app_id, 'aid');
  ensureStr(req.app_name, 'an');
  ensureNum(req.last_active_days, 'lad');
  ensureNum(req.login_count, 'lc');
  ensureStr(req.provider, 'pr');
  return { aid: req.app_id };
}
function secure_message(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.msg_id, 'mid');
  ensureStr(req.recipient_id, 'rid');
  ensureEnum(req.priority, 'pri', ['low','normal','high','urgent','other','unknown']);
  ensureStr(req.subject, 'sub');
  ensureStr(req.provider, 'pr');
  return { mid: req.msg_id };
}
function patient_education_video(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.video_id, 'vid');
  ensureStr(req.topic, 'top');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.viewed_pct, 'vp');
  ensureStr(req.provider, 'pr');
  return { vid: req.video_id };
}
function symptom_tracker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.entry_id, 'eid');
  ensureStr(req.symptom, 'sym');
  ensureNum(req.severity, 'sev');
  ensureStr(req.date, 'dt');
  ensureStr(req.provider, 'pr');
  return { eid: req.entry_id };
}
function ai_chatbot(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.intent, 'int');
  ensureNum(req.turns, 'turns');
  ensureBool(req.escalated, 'esc');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}

function funcs() { return { patient_app, secure_message, patient_education_video, symptom_tracker, ai_chatbot }; }
module.exports = { funcs, ValidationError };