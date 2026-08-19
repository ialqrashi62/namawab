// filepath: tier122_rpm_639_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function rpm_enrollment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enroll_id, 'eid');
  ensureStr(req.condition, 'cond');
  ensureStr(req.device_kit, 'dk');
  ensureStr(req.start_date, 'sd');
  ensureStr(req.provider, 'pr');
  return { eid: req.enroll_id };
}
function reading_outlier(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.outlier_id, 'oid');
  ensureStr(req.reading_id, 'rid');
  ensureEnum(req.deviation, 'dev', ['mild','moderate','severe','critical','other','unknown']);
  ensureBool(req.clinician_reviewed, 'cr');
  ensureStr(req.provider, 'pr');
  return { oid: req.outlier_id };
}
function med_adherence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.adh_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.doses_taken, 'dt');
  ensureStr(req.provider, 'pr');
  return { aid: req.adh_id };
}
function care_pathway(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.path_id, 'pid');
  ensureStr(req.pathway_name, 'pn');
  ensureNum(req.completion_pct, 'cp');
  ensureNum(req.steps_completed, 'sc');
  ensureStr(req.provider, 'pr');
  return { pid: req.path_id };
}
function coaching(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sess_id, 'sid');
  ensureStr(req.coach_id, 'cid');
  ensureEnum(req.topic, 'top', ['nutrition','exercise','smoking','stress','sleep','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { sid: req.sess_id };
}

function funcs() { return { rpm_enrollment, reading_outlier, med_adherence, care_pathway, coaching }; }
module.exports = { funcs, ValidationError };