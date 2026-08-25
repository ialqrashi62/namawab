// filepath: tier102_surg_vascular_535_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aaa_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.aaa_size_cm, 'asc');
  ensureEnum(req.approach, 'app', ['open','endovascular','hybrid','other','unknown']);
  ensureBool(req.stent_graft, 'sg');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureBool(req.leak_endoleak, 'le');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function carotid_endarterectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.stenosis_pct, 'sp');
  ensureEnum(req.approach, 'app', ['open','endovascular','other','unknown']);
  ensureBool(req.shunt_used, 'su');
  ensureNum(req.complications, 'comp');
  ensureNum(req.stroke_risk, 'sr');
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function bypass_graft(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.graft_type, 'gt', ['vein','synthetic','composite','other','unknown']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.patency_pct, 'pp');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.ambulation, 'amb');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function varicose_veins(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.vein_type, 'vt', ['great_saphenous','small_saphenous','perforator','other','unknown']);
  ensureEnum(req.approach, 'app', ['open','endovenous','sclerotherapy','combination','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.recurrence, 'rec');
  ensureNum(req.symptom_relief, 'sr');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function dvt_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.dvt_location, 'dl', ['femoral','popliteal','iliac','ivc','calf','multiple','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['anticoagulation','thrombolysis','thrombectomy','catheter_directed','filter','combination','other','unknown']);
  ensureBool(req.catheter_directed, 'cd');
  ensureBool(req.filter_placement, 'fp');
  ensureNum(req.duration_months, 'dur');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { aaa_repair, carotid_endarterectomy, bypass_graft, varicose_veins, dvt_treatment }; }
module.exports = { funcs, ValidationError };
