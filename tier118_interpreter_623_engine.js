// filepath: tier118_interpreter_623_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function interpreter_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.request_id, 'rid');
  ensureEnum(req.language, 'lng', ['arabic','english','french','urdu','spanish','mandarin','hindi','other','unknown']);
  ensureEnum(req.service_type, 'st', ['in_person','phone','video','family_member','staff','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { rid: req.request_id };
}
function translation_document(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.translation_id, 'tid');
  ensureStr(req.document_type, 'dt');
  ensureEnum(req.target_language, 'tl', ['arabic','english','french','urdu','other','unknown']);
  ensureBool(req.patient_received_copy, 'prc');
  ensureStr(req.provider, 'pr');
  return { tid: req.translation_id };
}
function health_literacy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.reading_level, 'rl');
  ensureNum(req.comprehension_score, 'cs');
  ensureBool(req.teach_back_passed, 'tbp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cultural_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cultural_background, 'cb', ['arab','south_asian','east_asian','african','european','hispanic','middle_eastern','other','unknown']);
  ensureStr(req.beliefs_relevant, 'br');
  ensureBool(req.care_plan_adjusted, 'cpa');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function patient_navigator(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nav_id, 'nid');
  ensureStr(req.navigator_id, 'navid');
  ensureNum(req.barriers_identified, 'bi');
  ensureNum(req.referrals_made, 'rm');
  ensureEnum(req.outcome, 'oc', ['navigated','partial','declined','lost_to_followup','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { nid: req.nav_id };
}

function funcs() { return { interpreter_request, translation_document, health_literacy, cultural_assessment, patient_navigator }; }
module.exports = { funcs, ValidationError };