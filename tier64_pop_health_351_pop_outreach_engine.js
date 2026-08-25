// filepath: tier64_pop_health_351_pop_outreach_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function outreach_call(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_to_contact, 'ptc');
  ensureEnum(req.channel, 'chan', ['phone','sms','email','patient_portal','mail','in_person','video']);
  ensureStr(req.agent, 'agent');
  ensureEnum(req.outcome, 'out', ['spoke_appointment','spoke_no_commit','voicemail','no_answer','wrong_number','declined','callback_scheduled']);
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.callback_scheduled, 'cs');
  ensureStr(req.notes, 'notes');
  return { outcome: req.outcome };
}
function outreach_message(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_to_contact, 'ptc');
  ensureEnum(req.channel, 'chan', ['phone','sms','email','patient_portal','mail','in_person','video']);
  ensureStr(req.message, 'msg');
  ensureBool(req.response_received, 'rr');
  ensureStr(req.patient_response, 'pres');
  ensureBool(req.opt_out, 'oo');
  ensureStr(req.delivered_timestamp, 'dt');
  return { msg: req.message };
}
function outreach_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_to_contact, 'ptc');
  ensureEnum(req.visit_type, 'vt', ['home_visit','community_event','pcp_visit','specialist_visit','mobile_clinic','school_clinic','workplace_clinic']);
  ensureStr(req.visit_date, 'vd');
  ensureBool(req.completed, 'comp');
  ensureStr(req.provider, 'prov');
  ensureStr(req.barriers, 'barr');
  ensureStr(req.notes, 'notes');
  return { type: req.visit_type };
}
function outreach_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_to_contact, 'ptc');
  ensureStr(req.topic, 'topic');
  ensureStr(req.materials, 'mat');
  ensureStr(req.language, 'lang');
  ensureEnum(req.reading_level, 'rl', ['pre_k','k_2','grade_3_5','grade_6','grade_6_8','grade_7','grade_8','grade_9_12','college','professional']);
  ensureNum(req.quiz_score, 'qs');
  ensureNum(req.engagement_pct, 'ep');
  return { topic: req.topic };
}
function outreach_reminder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_to_contact, 'ptc');
  ensureEnum(req.reminder_type, 'rt', ['appointment','medication','lab_test','imaging','annual_checkup','flu_shot','procedure','specialist']);
  ensureStr(req.appointment_date, 'ad');
  ensureNum(req.lead_time_days, 'ltd');
  ensureEnum(req.delivery_method, 'dm', ['sms','email','phone','patient_portal','mail','push_notification']);
  ensureBool(req.confirmed, 'cnf');
  ensureStr(req.response_action, 'ract');
  return { type: req.reminder_type };
}

function funcs() { return { outreach_call, outreach_message, outreach_visit, outreach_education, outreach_reminder }; }
module.exports = { funcs, ValidationError };