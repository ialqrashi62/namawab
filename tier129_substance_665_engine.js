// filepath: tier129_substance_665_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function audit_c(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureNum(req.score, 'sc');
  ensureEnum(req.risk, 'risk', ['low','hazardous','harmful','dependent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.audit_id };
}
function dast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dast_id, 'did');
  ensureNum(req.score, 'sc');
  ensureEnum(req.severity, 'sev', ['none','low','moderate','substantial','severe','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.dast_id };
}
function detox(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.detox_id, 'did');
  ensureEnum(req.substance, 'sub', ['alcohol','opioid','benzo','cocaine','meth','polysubstance','other','unknown']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','other','unknown']);
  ensureNum(req.days_since_last_use, 'dslu');
  ensureStr(req.provider, 'pr');
  return { did: req.detox_id };
}
function naloxone(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nal_id, 'nid');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.minutes_to_response, 'mtr');
  ensureBool(req.reversal, 'rev');
  ensureStr(req.provider, 'pr');
  return { nid: req.nal_id };
}
function rehab_enroll(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.re_id, 'rid');
  ensureEnum(req.program_type, 'pt', ['inpatient','outpatient','iop','mat','other','unknown']);
  ensureNum(req.length_of_stay_days, 'los');
  ensureBool(req.completed, 'cmp');
  ensureStr(req.provider, 'pr');
  return { rid: req.re_id };
}

function funcs() { return { audit_c, dast, detox, naloxone, rehab_enroll }; }
module.exports = { funcs, ValidationError };