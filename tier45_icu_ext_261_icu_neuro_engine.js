// filepath: tier45_icu_ext_261_icu_neuro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tbi_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gcs, 'gcs');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureNum(req.icp, 'icp');
  ensureStr(req.interventions, 'int');
  ensureEnum(req.monitoring, 'mon', ['continuous_icp','serial_exams','tcd','multimodal']);
  return { gcs: req.gcs, severity: req.severity };
}
function status_epilepticus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['convulsive','non_convulsive','focal','myoclonic','absence']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.first_line, 'fl');
  ensureStr(req.second_line, 'sl');
  ensureStr(req.third_line, 'tl');
  return { type: req.type, status: 'monitored' };
}
function icp_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.icp_baseline, 'icp_b');
  ensureNum(req.current_icp, 'icp_c');
  ensureNum(req.cpp, 'cpp');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.decompressive, 'decomp', ['not_needed','considered','planned','done']);
  return { current_icp: req.current_icp, cpp: req.cpp };
}
function subarachnoid_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.hunt_hess, 'hh');
  ensureNum(req.fisher, 'fish');
  ensureStr(req.aneurysm_location, 'loc');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.nimodipine_started, 'nim');
  ensureStr(req.monitoring, 'mon');
  return { hunt_hess: req.hunt_hess, nimodipine: req.nimodipine_started };
}
function stroke_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.nihss, 'nihss');
  ensureBool(req.thrombectomy, 'thromb');
  ensureNum(req.door_to_puncture_min, 'dtp');
  ensureStr(req.monitoring, 'mon');
  ensureStr(req.complications, 'comp');
  return { nihss: req.nihss, thrombectomy: req.thrombectomy };
}

function funcs() { return { tbi_icu, status_epilepticus, icp_management, subarachnoid_icu, stroke_icu }; }
module.exports = { funcs, ValidationError };