// filepath: tier127_dialysis_659_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hemodialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hd_id, 'hid');
  ensureNum(req.duration_hours, 'dh');
  ensureNum(req.ultrafiltration_ml, 'uf');
  ensureNum(req.dry_weight_kg, 'dw');
  ensureStr(req.provider, 'pr');
  return { hid: req.hd_id };
}
function peritoneal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pd_id, 'pid');
  ensureEnum(req.modality, 'md', ['capd','apd','ccpd','other','unknown']);
  ensureNum(req.dwell_volume_ml, 'dv');
  ensureNum(req.exchanges_per_day, 'epd');
  ensureStr(req.provider, 'pr');
  return { pid: req.pd_id };
}
function access_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.access_id, 'aid');
  ensureEnum(req.type, 'ty', ['avf','avg','catheter','other','unknown']);
  ensureNum(req.flow_rate_ml_min, 'fr');
  ensureBool(req.steal_syndrome, 'ss');
  ensureStr(req.provider, 'pr');
  return { aid: req.access_id };
}
function transplant_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.waitlist_days, 'wd');
  ensureEnum(req.status, 'st', ['active','inactive','listed','transplanted','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function ckd_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ckd_id, 'cid');
  ensureEnum(req.stage, 'st', ['1','2','3a','3b','4','5','other','unknown']);
  ensureNum(req.gfr, 'gfr');
  ensureNum(req.acr, 'acr');
  ensureStr(req.provider, 'pr');
  return { cid: req.ckd_id };
}

function funcs() { return { hemodialysis, peritoneal, access_monitoring, transplant_workup, ckd_followup }; }
module.exports = { funcs, ValidationError };