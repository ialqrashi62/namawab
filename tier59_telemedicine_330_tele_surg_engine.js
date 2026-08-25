// filepath: tier59_telemedicine_330_tele_surg_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tele_surgical_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specialty, 'spec');
  ensureStr(req.reason, 'reason');
  ensureStr(req.images_reviewed, 'ir');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.patient_choice, 'pc', ['proceed_with_in_person','proceed_tele','decline_surgery','seek_second_opinion','monitor_only']);
  ensureStr(req.timeline, 'tl');
  return { specialty: req.specialty };
}
function remote_surgical_mentoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure, 'proc');
  ensureStr(req.mentor_location, 'ml');
  ensureStr(req.mentee_location, 'mel');
  ensureNum(req.latency_ms, 'lat');
  ensureEnum(req.audio_video_quality, 'avq', ['excellent','good','fair','poor']);
  ensureStr(req.outcome, 'out');
  ensureNum(req.case_duration_min, 'cd');
  return { procedure: req.procedure };
}
function tele_pre_op_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_planned, 'sp');
  ensureNum(req.asa_class, 'asa');
  ensureStr(req.cardiac_clearance, 'cc');
  ensureStr(req.pre_op_tests, 'pot');
  ensureStr(req.anesthesia_plan, 'ap');
  ensureBool(req.patient_questions_addressed, 'pqa');
  ensureEnum(req.consent, 'cs', ['pending_in_person','completed_tele','completed_in_person','declined','unable_to_assess']);
  return { surgery: req.surgery_planned };
}
function tele_post_op_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure, 'proc');
  ensureNum(req.post_op_day, 'pod');
  ensureStr(req.wound_inspected, 'wi');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.complications, 'comp');
  ensureBool(req.diet_advanced, 'da');
  ensureEnum(req.return_to_activity, 'rt', ['planned','partial','not_yet','fully_resumed']);
  return { procedure: req.procedure };
}
function tele_pathology_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen, 'spec');
  ensureStr(req.pathologist_location, 'pl');
  ensureStr(req.slides_reviewed, 'sr');
  ensureStr(req.diagnosis, 'dx');
  ensureEnum(req.second_opinion, 'so', ['not_required','requested','obtained','pending']);
  ensureStr(req.sign_out_pathologist, 'sop');
  return { specimen: req.specimen };
}

function funcs() { return { tele_surgical_consult, remote_surgical_mentoring, tele_pre_op_assessment, tele_post_op_followup, tele_pathology_review }; }
module.exports = { funcs, ValidationError };