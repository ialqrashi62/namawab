// filepath: tier58_research_ext_324_res_pub_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function manuscript_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.manuscript_id, 'mid');
  ensureEnum(req.journal, 'jr', ['nejm','lancet','jama','nature_medicine','bmj','annals','jci','plos_medicine']);
  ensureEnum(req.study_type, 'st', ['rct','observational_cohort','case_control','case_series','systematic_review','meta_analysis','basic_science']);
  ensureNum(req.cohort_size, 'cs');
  ensureStr(req.submission_date, 'sd');
  ensureEnum(req.status, 'st2', ['under_review','revision_required','accepted','rejected','in_press','published','withdrawn']);
  ensureStr(req.corresponding_author, 'ca');
  return { manuscript: req.manuscript_id };
}
function peer_review_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.manuscript_id, 'mid');
  ensureNum(req.review_round, 'rr');
  ensureNum(req.reviewers_count, 'rc');
  ensureEnum(req.decision, 'dec', ['accept','minor_revision','major_revision','reject','reject_resubmit']);
  ensureStr(req.revision_due_date, 'rdd');
  ensureBool(req.authors_responded, 'ar');
  return { decision: req.decision };
}
function abstract_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.conference, 'conf', ['asco_2026','esmo_2026','aha_2026','acc_2026','aad_2026','easl_2026','esicm_2026']);
  ensureStr(req.abstract_id, 'aid');
  ensureStr(req.submission_date, 'sd');
  ensureEnum(req.status, 'stat', ['accepted','rejected','pending','withdrawn']);
  ensureEnum(req.presentation_format, 'pf', ['poster','oral','plenary','poster_discussion','late_breaking']);
  ensureNum(req.authors_count, 'ac');
  return { abstract: req.abstract_id };
}
function poster_presentation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.conference, 'conf');
  ensureStr(req.poster_id, 'pid');
  ensureStr(req.presented_date, 'pd');
  ensureNum(req.attendees_engaged, 'ae');
  ensureBool(req.feedback_received, 'fr');
  ensureNum(req.follow_up_contacts, 'fuc');
  return { poster: req.poster_id };
}
function author_contribution(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.manuscript_id, 'mid');
  ensureNum(req.author_order, 'ao');
  ensureStr(req.contribution, 'c');
  ensureBool(req.criteric_acquisition, 'ca');
  ensureBool(req.final_approval, 'fa');
  return { author_order: req.author_order };
}

function funcs() { return { manuscript_submission, peer_review_status, abstract_submission, poster_presentation, author_contribution }; }
module.exports = { funcs, ValidationError };