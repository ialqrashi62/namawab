// filepath: tier124_endoscopy_646_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function colonoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureEnum(req.prep_quality, 'pq', ['excellent','good','fair','poor','inadequate','other','unknown']);
  ensureNum(req.withdrawal_time_min, 'wtm');
  ensureNum(req.polyps_found, 'pf');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}
function egd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureStr(req.findings, 'fnd');
  ensureNum(req.biopsies_taken, 'bt');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}
function bronchoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureStr(req.lavage, 'lvg');
  ensureBool(req.bal_done, 'bd');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}
function cystoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureStr(req.bladder_appearance, 'ba');
  ensureNum(req.biopsies, 'bi');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}
function laparoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureEnum(req.procedure_type, 'pt', ['diagnostic','therapeutic','both','other','unknown']);
  ensureStr(req.findings, 'fnd');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}

function funcs() { return { colonoscopy, egd, bronchoscopy, cystoscopy, laparoscopy }; }
module.exports = { funcs, ValidationError };