// filepath: tier103_lab_management_541_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function specimen_collection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.specimen_type, 'st', ['blood','urine','csf','stool','sputum','tissue','other','unknown']);
  ensureStr(req.collection_time, 'ct');
  ensureEnum(req.tube_type, 'tt', ['serum','plasma','edta','heparin','citrate','plain','other','unknown']);
  ensureNum(req.volume_ml, 'vm');
  ensureBool(req.patient_identification, 'pid');
  ensureNum(req.lab_errors, 'le');
  ensureStr(req.provider, 'pr');
  return { sid: req.specimen_id };
}
function critical_value(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.test_name, 'tn');
  ensureNum(req.value, 'val');
  ensureNum(req.critical_range, 'cr');
  ensureBool(req.acknowledged, 'ack');
  ensureNum(req.notification_time, 'nt');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function lab_quality(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.test_count, 'tc');
  ensureNum(req.error_rate_pct, 'er');
  ensureNum(req.qc_failures, 'qcf');
  ensureNum(req.specimen_rejections, 'sr');
  ensureNum(req.instrument_drift, 'id');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function turn_around_time(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric_id, 'mid');
  ensureStr(req.test_name, 'tn');
  ensureNum(req.tat_min, 'tm');
  ensureNum(req.target_tat, 'tt');
  ensureEnum(req.performance, 'pf', ['excellent','good','acceptable','poor','critical','other','unknown']);
  ensureNum(req.monthly_volume, 'mv');
  ensureStr(req.provider, 'pr');
  return { mid: req.metric_id };
}
function lab_error(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureEnum(req.error_type, 'et', ['pre_analytic','analytic','post_analytic','specimen','labeling','clerical','other','unknown']);
  ensureStr(req.specimen_id, 'si');
  ensureStr(req.error_description, 'ed');
  ensureEnum(req.discovered_by, 'db', ['lab','physician','nurse','patient','other','unknown']);
  ensureBool(req.corrected, 'corr');
  ensureEnum(req.patient_impact, 'pi', ['none','minor','moderate','major','catastrophic','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}

function funcs() { return { specimen_collection, critical_value, lab_quality, turn_around_time, lab_error }; }
module.exports = { funcs, ValidationError };
