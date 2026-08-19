// filepath: tier105_administrative_553_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function document_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.document_id, 'did');
  ensureEnum(req.doc_type, 'dt', ['consent','advance_directive','insurance_card','id','lab_result','imaging','other','unknown']);
  ensureStr(req.upload_date, 'ud');
  ensureNum(req.size_kb, 'sz');
  ensureBool(req.indexed, 'idx');
  ensureEnum(req.retention, 'ret', ['1_year','3_years','7_years','10_years','permanent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.document_id };
}
function correspondence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.letter_id, 'lid');
  ensureEnum(req.letter_type, 'lt', ['referral','follow_up','consult','results','discharge','insurance','other','unknown']);
  ensureStr(req.recipient, 'rcp');
  ensureEnum(req.delivery_method, 'dm', ['mail','email','fax','portal','hand_delivery','other','unknown']);
  ensureNum(req.delivery_days, 'dd');
  ensureBool(req.acknowledgment, 'ack');
  ensureStr(req.provider, 'pr');
  return { lid: req.letter_id };
}
function task_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.task_id, 'tid');
  ensureStr(req.assignee, 'asg');
  ensureEnum(req.priority, 'pr', ['low','medium','high','critical','other','unknown']);
  ensureNum(req.due_hours, 'dh');
  ensureEnum(req.status, 'st', ['pending','in_progress','completed','escalated','cancelled','other','unknown']);
  ensureNum(req.completion_hours, 'ch');
  ensureStr(req.provider, 'pr');
  return { tid: req.task_id };
}
function inbox_message(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.message_id, 'mid');
  ensureStr(req.sender, 'snd');
  ensureEnum(req.subject, 'sb', ['clinical','administrative','billing','lab','radiology','consult','other','unknown']);
  ensureNum(req.priority_score, 'ps');
  ensureNum(req.response_hours, 'rh');
  ensureBool(req.read_receipt, 'rr');
  ensureStr(req.provider, 'pr');
  return { mid: req.message_id };
}
function notification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.notification_id, 'nid');
  ensureEnum(req.event_type, 'et', ['lab_result','appointment','medication','alert','discharge','admission','other','unknown']);
  ensureEnum(req.delivery, 'dl', ['sms','email','phone','push','portal','other','unknown']);
  ensureBool(req.delivered, 'del');
  ensureNum(req.delivery_seconds, 'ds');
  ensureBool(req.read, 'rd');
  ensureStr(req.provider, 'pr');
  return { nid: req.notification_id };
}

function funcs() { return { document_management, correspondence, task_management, inbox_message, notification }; }
module.exports = { funcs, ValidationError };