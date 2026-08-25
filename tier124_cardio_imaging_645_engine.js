// filepath: tier124_cardio_imaging_645_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echo_complete(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.echo_id, 'eid');
  ensureNum(req.ef_pct, 'ef');
  ensureEnum(req.wall_motion, 'wm', ['normal','hypokinesis','akinesis','dyskinesis','other','unknown']);
  ensureEnum(req.valves, 'vlv', ['normal','mild','moderate','severe','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.echo_id };
}
function stress_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stress_id, 'sid');
  ensureEnum(req.protocol, 'prt', ['treadmill','pharmacologic','echo_stress','nuclear_stress','other','unknown']);
  ensureNum(req.mets, 'mets');
  ensureBool(req.ischemia, 'isch');
  ensureStr(req.provider, 'pr');
  return { sid: req.stress_id };
}
function cardiac_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cmri_id, 'cid');
  ensureNum(req.ef_pct, 'ef');
  ensureBool(req.scar_present, 'sp');
  ensureStr(req.provider, 'pr');
  return { cid: req.cmri_id };
}
function holter(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.holter_id, 'hid');
  ensureNum(req.duration_hours, 'dh');
  ensureNum(req.min_hr, 'min');
  ensureNum(req.max_hr, 'max');
  ensureNum(req.afib_burden_pct, 'afb');
  ensureStr(req.provider, 'pr');
  return { hid: req.holter_id };
}
function event_monitor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureNum(req.symptoms_documented, 'sd');
  ensureBool(req.correlated, 'corr');
  ensureStr(req.provider, 'pr');
  return { eid: req.event_id };
}

function funcs() { return { echo_complete, stress_test, cardiac_mri, holter, event_monitor }; }
module.exports = { funcs, ValidationError };