// filepath: tier132_pulm_677_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pft(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pft_id, 'pid');
  ensureNum(req.fev1, 'fev1');
  ensureNum(req.fvc, 'fvc');
  ensureNum(req.fev1_fvc, 'ratio');
  ensureEnum(req.interpretation, 'it', ['normal','obstructive','restrictive','mixed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.pft_id };
}
function sleep_study(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sleep_id, 'sid');
  ensureNum(req.ahi, 'ahi');
  ensureNum(req.min_spo2, 'min');
  ensureEnum(req.severity, 'sev', ['none','mild','moderate','severe','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.sleep_id };
}
function vent_weaning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vent_id, 'vid');
  ensureNum(req.minute_ventilation, 'mv');
  ensureNum(req.rsbi, 'rsbi');
  ensureBool(req.success, 'suc');
  ensureStr(req.provider, 'pr');
  return { vid: req.vent_id };
}
function tb_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tb_id, 'tid');
  ensureEnum(req.test, 'tst', ['ppd','igra','cxr','sputum','other','unknown']);
  ensureEnum(req.result, 'res', ['positive','negative','indeterminate','other','unknown']);
  ensureBool(req.treatment_started, 'ts');
  ensureStr(req.provider, 'pr');
  return { tid: req.tb_id };
}
function oxygen_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ox_id, 'oid');
  ensureNum(req.flow_lpm, 'fl');
  ensureEnum(req.device, 'dev', ['nasal_cannula','simple_mask','non_rebreather','high_flow','cpap','bipap','other','unknown']);
  ensureNum(req.spo2_target, 'st');
  ensureStr(req.provider, 'pr');
  return { oid: req.ox_id };
}

function funcs() { return { pft, sleep_study, vent_weaning, tb_screening, oxygen_therapy }; }
module.exports = { funcs, ValidationError };