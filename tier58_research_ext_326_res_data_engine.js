// filepath: tier58_research_ext_326_res_data_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function data_collection_form(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.form_id, 'fid');
  ensureStr(req.study, 'study');
  ensureNum(req.fields_total, 'ft');
  ensureNum(req.fields_completed, 'fc');
  ensureNum(req.completion_pct, 'cp');
  ensureBool(req.verified, 'ver');
  ensureStr(req.signed_by, 'sb');
  return { completion: req.completion_pct };
}
function data_quality_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study, 'study');
  ensureNum(req.queries_open, 'qo');
  ensureNum(req.queries_resolved, 'qr');
  ensureNum(req.resolution_rate_pct, 'rr');
  ensureEnum(req.audit_findings, 'af', ['none','minor','major','critical','resolved']);
  ensureStr(req.next_review_date, 'nrd');
  return { open: req.queries_open };
}
function interim_analysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study, 'study');
  ensureNum(req.enrolled_target, 'et');
  ensureNum(req.enrolled_current, 'ec');
  ensureEnum(req.safety_review, 'sr', ['planned','completed','ongoing']);
  ensureEnum(req.efficacy_interim, 'ei', ['planned','completed','not_planned','stopped_early_futility','stopped_early_efficacy']);
  ensureStr(req.dsmb_meeting_date, 'dsmb');
  ensureEnum(req.recommendation, 'rec', ['continue','modify_protocol','stop_safety','stop_futility','stop_efficacy']);
  return { enrolled: req.enrolled_current };
}
function data_lock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study, 'study');
  ensureEnum(req.lock_type, 'lt', ['interim','final','snapshot_for_dsmb','snapshot_for_ia']);
  ensureEnum(req.database_clean_status, 'dcs', ['in_progress','completed','pending_review']);
  ensureBool(req.queries_resolved, 'qr');
  ensureBool(req.signatures_collected, 'sc');
  ensureStr(req.lock_date, 'ld');
  ensureBool(req.unlock_allowed, 'ua');
  return { lock_type: req.lock_type };
}
function database_lock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study, 'study');
  ensureEnum(req.lock_type, 'lt', ['interim','final','snapshot_for_dsmb','snapshot_for_ia']);
  ensureEnum(req.database_clean_status, 'dcs', ['in_progress','completed','pending_review']);
  ensureEnum(req.statistical_analysis_plan, 'sap', ['draft','final','amended','locked']);
  ensureBool(req.signatures_collected, 'sc');
  ensureStr(req.lock_date, 'ld');
  ensureBool(req.unlock_allowed, 'ua');
  return { lock_type: req.lock_type };
}

function funcs() { return { data_collection_form, data_quality_review, interim_analysis, data_lock, database_lock }; }
module.exports = { funcs, ValidationError };