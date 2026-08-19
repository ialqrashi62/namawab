// filepath: tier104_research_548_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function research_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.protocol_id, 'pid');
  ensureStr(req.title, 'title');
  ensureEnum(req.study_type, 'st', ['rct','observational','case_report','retrospective','meta_analysis','phase_1','phase_2','phase_3','phase_4','other','unknown']);
  ensureNum(req.sample_size_target, 'sst');
  ensureBool(req.ethics_approved, 'ea');
  ensureNum(req.consent_rate, 'cr');
  ensureEnum(req.status, 'sts', ['design','recruiting','active','suspended','completed','terminated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.protocol_id };
}
function clinical_trial_enrollment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enrollment_id, 'eid');
  ensureStr(req.protocol_id, 'prt');
  ensureBool(req.eligibility, 'elg');
  ensureNum(req.consent_signed, 'cs');
  ensureEnum(req.status, 'sts', ['screening','enrolled','active','completed','withdrew','screen_failure','other','unknown']);
  ensureNum(req.adverse_events, 'ae');
  ensureNum(req.compliance_pct, 'cp');
  ensureStr(req.provider, 'pr');
  return { eid: req.enrollment_id };
}
function data_collection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.collection_id, 'cid');
  ensureNum(req.data_points_collected, 'dpc');
  ensureNum(req.missing_data_pct, 'mdp');
  ensureNum(req.quality_score, 'qs');
  ensureNum(req.completed_months, 'cm');
  ensureNum(req.queries_resolved, 'qr');
  ensureNum(req.database_locked, 'dbl');
  ensureStr(req.provider, 'pr');
  return { cid: req.collection_id };
}
function manuscript_prep(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.manuscript_id, 'mid');
  ensureStr(req.title, 'title');
  ensureEnum(req.status, 'sts', ['concept','drafting','internal_review','submitted','revision','accepted','published','rejected','other','unknown']);
  ensureNum(req.words, 'words');
  ensureNum(req.tables_figures, 'tf');
  ensureNum(req.references, 'refs');
  ensureNum(req.target_journal, 'tj');
  ensureStr(req.provider, 'pr');
  return { mid: req.manuscript_id };
}
function irb_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.submission_id, 'sid');
  ensureStr(req.study_title, 'st');
  ensureNum(req.review_type, 'rt');
  ensureNum(req.approval_weeks, 'aw');
  ensureBool(req.approved, 'appr');
  ensureNum(req.revisions_count, 'rc');
  ensureEnum(req.continuing_review, 'cr', ['pending','approved','rejected','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.submission_id };
}

function funcs() { return { research_protocol, clinical_trial_enrollment, data_collection, manuscript_prep, irb_submission }; }
module.exports = { funcs, ValidationError };
