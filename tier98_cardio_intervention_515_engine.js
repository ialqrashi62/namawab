// filepath: tier98_cardio_intervention_515_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pci(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['stemi','nstemi','unstable_angina','stable_angina','other','unknown']);
  ensureNum(req.lesions_treated, 'lt');
  ensureNum(req.stents_placed, 'sp');
  ensureNum(req.contrast_volume_ml, 'cv');
  ensureNum(req.fluoroscopy_time, 'ft');
  ensureEnum(req.approach, 'app', ['radial','femoral','brachial','other','unknown']);
  ensureEnum(req.complications, 'comp', ['none','dissection','perforation','stent_thrombosis','bleeding','death','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function cabg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.age, 'age');
  ensureNum(req.euro_score, 'es');
  ensureNum(req.grafts, 'gft');
  ensureBool(req.pump_use, 'pu');
  ensureNum(req.bypass_time, 'bt');
  ensureNum(req.icu_days, 'icd');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function device_implant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.device_type, 'dt', ['single_chamber','dual_chamber','biventricular','icd','leadless','loop_recorder','other','unknown']);
  ensureNum(req.ef, 'ef');
  ensureNum(req.fluoroscopy_time, 'ft');
  ensureNum(req.hospital_days, 'hd');
  ensureBool(req.complications, 'comp');
  ensureNum(req.thresholds, 'thr');
  ensureNum(req.sensing, 'sn');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function ablation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['afib','aflutter','svt','vt','wpw','avnrt','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.fluoroscopy_time, 'ft');
  ensureBool(req.successful, 'suc');
  ensureNum(req.recurrence_3mo, 'r3m');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function tavr(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.sts_score, 'sts');
  ensureNum(req.age, 'age');
  ensureEnum(req.approach, 'app', ['transfemoral','transapical','transaortic','subclavian','other','unknown']);
  ensureEnum(req.valve_type, 'vt', ['balloon_expandable','self_expanding','mechanical','other','unknown']);
  ensureNum(req.gradient_post, 'gp');
  ensureBool(req.paravalvular_leak, 'pvl');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { pci, cabg, device_implant, ablation, tavr }; }
module.exports = { funcs, ValidationError };
