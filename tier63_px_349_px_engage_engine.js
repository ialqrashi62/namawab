// filepath: tier63_px_349_px_engage_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_engagement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.engagement_score, 'es');
  ensureNum(req.portal_logins_per_month, 'lpm');
  ensureNum(req.appointment_compliance_pct, 'acp');
  ensureNum(req.medication_adherence_pct, 'map');
  ensureNum(req.education_modules_completed, 'emc');
  ensureEnum(req.risk_for_disengagement, 'rfd', ['low','moderate','high','very_high','disengaged']);
  return { score: req.engagement_score };
}
function patient_community(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.community_id, 'ci');
  ensureStr(req.joined_date, 'jd');
  ensureNum(req.posts, 'posts');
  ensureNum(req.replies, 'replies');
  ensureNum(req.peer_support_given, 'psg');
  ensureNum(req.peer_support_received, 'psr');
  ensureBool(req.moderator_role, 'mr');
  return { community: req.community_id };
}
function patient_education_enrollment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pi');
  ensureStr(req.start_date, 'sd');
  ensureNum(req.modules_completed, 'mc');
  ensureNum(req.total_modules, 'tm');
  ensureNum(req.quiz_average, 'qa');
  ensureBool(req.certificate_issued, 'ci');
  ensureEnum(req.engagement, 'eng', ['high','moderate','low','stalled','quit','declined']);
  return { program: req.program_id };
}
function patient_workshop(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workshop_id, 'wi');
  ensureNum(req.duration_hours, 'dh');
  ensureBool(req.attended, 'att');
  ensureNum(req.post_workshop_survey, 'pws');
  ensureBool(req.follow_up_call, 'fuc');
  ensureStr(req.behavior_changes, 'bc');
  ensureBool(req.recommend_to_others, 'rto');
  return { workshop: req.workshop_id };
}
function patient_app_feature_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.opened_app_30d, 'oa30');
  ensureNum(req.booked_appointment, 'ba');
  ensureNum(req.viewed_labs, 'vl');
  ensureNum(req.sent_message, 'sm');
  ensureNum(req.refilled_request, 'rr');
  ensureNum(req.paid_bill, 'pb');
  ensureNum(req.feature_utilization_score, 'fus');
  return { score: req.feature_utilization_score };
}

function funcs() { return { patient_engagement, patient_community, patient_education_enrollment, patient_workshop, patient_app_feature_use }; }
module.exports = { funcs, ValidationError };