// filepath: tier58_research_ext_327_res_ethics_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function irb_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.irb_number, 'irb');
  ensureStr(req.study, 'study');
  ensureEnum(req.risk_level, 'rl', ['minimal','greater_than_minimal','significant_risk','expedited_review']);
  ensureEnum(req.review_type, 'rt', ['full_board','expedited','exempt','convened_review']);
  ensureEnum(req.approval_status, 'as', ['approved','pending','revisions_required','rejected','deferred']);
  ensureStr(req.approval_date, 'ad');
  ensureStr(req.expiration_date, 'ed');
  return { irb: req.irb_number };
}
function irb_amendment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.irb_number, 'irb');
  ensureNum(req.amendment_number, 'an');
  ensureEnum(req.amendment_type, 'at', ['protocol_modification','consent_change','investigator_change','site_change','other']);
  ensureStr(req.changes_summary, 'cs');
  ensureEnum(req.approval_status, 'as', ['approved','pending','revisions_required','rejected']);
  ensureStr(req.approval_date, 'ad');
  ensureStr(req.implementation_date, 'id');
  return { amendment: req.amendment_number };
}
function irb_continuing_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.irb_number, 'irb');
  ensureStr(req.reporting_period, 'rp');
  ensureNum(req.enrolled_total, 'et');
  ensureNum(req.sae_count, 'sc');
  ensureNum(req.protocol_deviations, 'pd');
  ensureEnum(req.status, 'stat', ['approved','pending','revisions_required','terminated']);
  ensureStr(req.next_review_due, 'nrd');
  return { enrolled: req.enrolled_total };
}
function consent_form_revision(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.irb_number, 'irb');
  ensureNum(req.version, 'v');
  ensureStr(req.revision_reason, 'rr');
  ensureStr(req.changes_summary, 'cs');
  ensureNum(req.translation_languages.length, 'tl_len');
  ensureBool(req.reconsent_required, 'rc');
  ensureEnum(req.approval_status, 'as', ['approved','pending','revisions_required']);
  return { version: req.version };
}
function subject_withdrawal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.irb_number, 'irb');
  ensureStr(req.subject_id, 'sid');
  ensureEnum(req.withdrawal_reason, 'wr', ['patient_choice','adverse_event','lost_to_followup','investigator_decision','protocol_violation','death']);
  ensureBool(req.data_to_be_retained, 'dbr');
  ensureBool(req.samples_to_be_destroyed, 'sbd');
  ensureBool(req.documented_in_chart, 'dic');
  ensureBool(req.reported_to_irb, 'rirb');
  return { subject: req.subject_id };
}

function funcs() { return { irb_submission, irb_amendment, irb_continuing_review, consent_form_revision, subject_withdrawal }; }
module.exports = { funcs, ValidationError };