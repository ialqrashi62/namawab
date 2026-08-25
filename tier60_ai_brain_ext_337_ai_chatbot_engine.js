// filepath: tier60_ai_brain_ext_337_ai_chatbot_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_chatbot_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chat_session, 'cs');
  ensureStr(req.presenting, 'pres');
  ensureEnum(req.triage_level, 'tl', ['self_care','routine','urgent','emergent','low']);
  ensureStr(req.recommendation, 'rec');
  ensureBool(req.escalation_flag, 'ef');
  ensureEnum(req.language, 'lang', ['english','arabic','french','urdu','hindi','spanish','other']);
  return { triage: req.triage_level };
}
function patient_chatbot_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chat_session, 'cs');
  ensureStr(req.follow_up_topic, 'ft');
  ensureEnum(req.patient_response, 'pr', ['full','partial','none','refused','not_applicable']);
  ensureStr(req.intervention, 'int');
  ensureBool(req.escalation_flag, 'ef');
  return { topic: req.follow_up_topic };
}
function patient_chatbot_med_reminder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication, 'med');
  ensureStr(req.reminder_time, 'rt');
  ensureBool(req.patient_ack, 'pa');
  ensureBool(req.next_dose_ack, 'nda');
  ensureNum(req.missed_doses, 'md');
  ensureBool(req.side_effects_logged, 'sel');
  return { med: req.medication };
}
function patient_chatbot_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.topic, 'topic');
  ensureStr(req.materials_sent, 'ms');
  ensureBool(req.quiz_completed, 'qc');
  ensureNum(req.quiz_score, 'qs');
  ensureNum(req.patient_satisfaction, 'ps');
  return { topic: req.topic };
}
function patient_chatbot_feedback(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.csat_score, 'cs');
  ensureNum(req.nps_score, 'nps');
  ensureStr(req.feedback_text, 'ft');
  ensureBool(req.would_recommend, 'wr');
  ensureStr(req.improvement_areas, 'ia');
  return { csat: req.csat_score };
}

function funcs() { return { patient_chatbot_triage, patient_chatbot_followup, patient_chatbot_med_reminder, patient_chatbot_education, patient_chatbot_feedback }; }
module.exports = { funcs, ValidationError };