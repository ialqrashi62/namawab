// filepath: tier59_telemedicine_328_tele_visit_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tele_consult_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['initial','follow_up','urgent','specialist','multidisciplinary','pre_op','post_op']);
  ensureEnum(req.platform, 'pl', ['zoom_healthcare','doxy_me','teladoc','simplepractice','whatsapp','facetime','institutional_platform']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.chief_complaint, 'cc');
  ensureBool(req.consent_verbal, 'cv');
  ensureEnum(req.camera_audio, 'ca', ['excellent','good','fair','poor']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { platform: req.platform, duration: req.duration_min };
}
function tele_consult_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['initial','follow_up','urgent','specialist','multidisciplinary','pre_op','post_op']);
  ensureStr(req.platform, 'pl');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.topic, 'topic');
  ensureBool(req.adherence_assessed, 'aa');
  ensureStr(req.side_effects, 'se');
  ensureStr(req.plan, 'plan');
  return { topic: req.topic };
}
function tele_urgent_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['initial','follow_up','urgent','urgent_same_day','specialist','multidisciplinary','pre_op','post_op']);
  ensureStr(req.platform, 'pl');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.presenting_concern, 'pc');
  ensureEnum(req.disposition, 'disp', ['referred_to_ed_immediately','urgent_clinic_referral','continued_home_care','advised_911','schedule_in_person_urgent','schedule_followup']);
  ensureBool(req.escalation_documented, 'esc');
  return { disposition: req.disposition };
}
function tele_specialist_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_to, 'rt');
  ensureStr(req.reason, 'reason');
  ensureNum(req.expected_wait_days, 'wd');
  ensureStr(req.pre_visit_questionnaire, 'pvq');
  ensureBool(req.records_reviewed, 'rr');
  ensureStr(req.plan, 'plan');
  return { referral_to: req.referral_to };
}
function tele_multidisciplinary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['tumor_board','case_conference','quality_review','morbidity_mortality','grand_rounds','journal_club']);
  ensureNum(req.participants.length, 'pl_len');
  ensureEnum(req.case_complexity, 'cc', ['low','moderate','high','very_high']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.follow_up_plan, 'fup');
  return { type: req.type };
}

function funcs() { return { tele_consult_initial, tele_consult_followup, tele_urgent_consult, tele_specialist_referral, tele_multidisciplinary }; }
module.exports = { funcs, ValidationError };