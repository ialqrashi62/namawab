// filepath: tier63_px_348_px_satis_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_complaint_resolution(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.complaint_id, 'ci');
  ensureEnum(req.category, 'cat', ['wait_time','staff_attitude','clinical_quality','billing','communication','environment','privacy','access','discharge','medication']);
  ensureEnum(req.severity, 'sev', ['low','moderate','high','critical']);
  ensureEnum(req.resolution_method, 'rm', ['phone_callback','in_person_meeting','written_apology','follow_up_visit','policy_review','refund','waiver','peer_review']);
  ensureNum(req.resolution_days, 'rd');
  ensureBool(req.patient_satisfied, 'ps');
  ensureStr(req.closed_date, 'cd');
  return { resolution: req.resolution_method };
}
function patient_satisfaction_survey(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.encounter_id, 'ei');
  ensureNum(req.overall_score, 'os');
  ensureNum(req.cleanliness, 'cl');
  ensureNum(req.staff_courtesy, 'sc');
  ensureNum(req.communication, 'comm');
  ensureNum(req.wait_time, 'wt');
  ensureNum(req.recommend_likelihood, 'rl');
  ensureStr(req.completed_date, 'cd');
  return { overall: req.overall_score };
}
function patient_testimonial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.permission_granted, 'pg');
  ensureEnum(req.channel, 'ch', ['website','social_media','video','review_board','newsletter','brochure','television','radio']);
  ensureStr(req.content, 'content');
  ensureStr(req.story_summary, 'ss');
  ensureBool(req.image_use, 'iu');
  ensureStr(req.publication_date, 'pd');
  return { story: req.story_summary };
}
function patient_loyalty(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.nps_score, 'nps');
  ensureNum(req.years_as_patient, 'yap');
  ensureNum(req.visits_per_year, 'vpy');
  ensureNum(req.referrals_made, 'rm');
  ensureStr(req.reason_for_loyalty, 'rfl');
  ensureEnum(req.retention_risk, 'rr', ['low','moderate','high','very_high','churning']);
  return { nps: req.nps_score };
}
function patient_advocacy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.advocate_id, 'ai');
  ensureEnum(req.type, 'typ', ['ombudsman','patient_council','ethics_consult','legal_aid','social_work','case_management','peer_support']);
  ensureNum(req.issues_addressed, 'ia');
  ensureStr(req.resolution, 'res');
  ensureStr(req.recommended_action, 'ra');
  ensureStr(req.closed_date, 'cd');
  return { type: req.type };
}

function funcs() { return { patient_complaint_resolution, patient_satisfaction_survey, patient_testimonial, patient_loyalty, patient_advocacy }; }
module.exports = { funcs, ValidationError };