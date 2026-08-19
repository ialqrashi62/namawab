// filepath: tier130_therapy_669_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pt_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pt_id, 'pid');
  ensureNum(req.minutes, 'mt');
  ensureNum(req.exercises, 'ex');
  ensureBool(req.home_program_reviewed, 'hpr');
  ensureStr(req.provider, 'pr');
  return { pid: req.pt_id };
}
function ot_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ot_id, 'oid');
  ensureNum(req.minutes, 'mt');
  ensureEnum(req.focus, 'foc', ['adl','fine_motor','cognitive','feeding','other','unknown']);
  ensureNum(req.progress_score, 'ps');
  ensureStr(req.provider, 'pr');
  return { oid: req.ot_id };
}
function st_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.st_id, 'sid');
  ensureNum(req.minutes, 'mt');
  ensureEnum(req.target, 'tgt', ['swallow','speech','language','voice','cognitive','other','unknown']);
  ensureBool(req.diet_upgrade, 'du');
  ensureStr(req.provider, 'pr');
  return { sid: req.st_id };
}
function rt_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rt_id, 'rid');
  ensureNum(req.minutes, 'mt');
  ensureEnum(req.modality, 'mod', ['chest_pt','incentive_spiro','neb','cpap','other','unknown']);
  ensureBool(req.symptom_relief, 'sr');
  ensureStr(req.provider, 'pr');
  return { rid: req.rt_id };
}
function dialysis_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.d_id, 'did');
  ensureNum(req.duration_hours, 'dh');
  ensureNum(req.ultrafiltration_ml, 'uf');
  ensureBool(req.access_functioning, 'af');
  ensureStr(req.provider, 'pr');
  return { did: req.d_id };
}

function funcs() { return { pt_session, ot_session, st_session, rt_session, dialysis_session }; }
module.exports = { funcs, ValidationError };