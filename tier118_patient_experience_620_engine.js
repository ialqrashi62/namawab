// filepath: tier118_patient_experience_620_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_feedback(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.feedback_id, 'fid');
  ensureStr(req.feedback_type, 'ft');
  ensureNum(req.satisfaction_score, 'ss');
  ensureNum(req.nps_score, 'nps');
  ensureStr(req.comments, 'com');
  ensureBool(req.follow_up_required, 'fur');
  ensureStr(req.provider, 'pr');
  return { fid: req.feedback_id };
}
function complaint_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.complaint_id, 'cid');
  ensureStr(req.complaint_category, 'cc');
  ensureEnum(req.severity, 'sev', ['low','medium','high','critical','other','unknown']);
  ensureStr(req.description, 'desc');
  ensureEnum(req.status, 'st', ['open','investigating','resolved','closed','escalated','other','unknown']);
  ensureNum(req.resolution_days, 'rd');
  ensureStr(req.provider, 'pr');
  return { cid: req.complaint_id };
}
function patient_advocate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.advocate_id, 'aid');
  ensureStr(req.concern_type, 'ct');
  ensureStr(req.advocate_name, 'an');
  ensureNum(req.contact_duration_min, 'cdm');
  ensureBool(req.issue_resolved, 'ir');
  ensureEnum(req.referral_made, 'rm', ['social_work','chaplain','financial','legal','clinical','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.advocate_id };
}
function patient_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.education_id, 'eid');
  ensureStr(req.topic, 'top');
  ensureEnum(req.method, 'meth', ['verbal','written','video','demonstration','digital','other','unknown']);
  ensureBool(req.comprehension_verified, 'cv');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { eid: req.education_id };
}
function family_communication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.comm_id, 'cmid');
  ensureStr(req.family_member_id, 'fmi');
  ensureEnum(req.relationship, 'rel', ['spouse','parent','child','sibling','guardian','other','unknown']);
  ensureStr(req.update_type, 'ut');
  ensureBool(req.consent_documented, 'cd');
  ensureStr(req.provider, 'pr');
  return { cmid: req.comm_id };
}

function funcs() { return { patient_feedback, complaint_tracking, patient_advocate, patient_education, family_communication }; }
module.exports = { funcs, ValidationError };