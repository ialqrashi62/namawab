// filepath: tier78_ortho_ext_414_ortho_joint_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function joint_replacement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.joint, 'j', ['hip','knee','shoulder','ankle','elbow','wrist','other']);
  ensureEnum(req.approach, 'ap', ['anterior','posterior','lateral','medial','anterolateral','postero_lateral','mini_inc','robotic','other']);
  ensureStr(req.implant, 'imp');
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureStr(req.bone_quality, 'bq');
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','dvt','pe','dislocation','fracture','nerve_injury','other']);
  ensureStr(req.discharge_destination, 'dd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function arthroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'j', ['knee','shoulder','hip','ankle','wrist','elbow','other']);
  ensureStr(req.findings, 'find');
  ensureStr(req.procedures_performed, 'pp');
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','nerve_injury','instrument_breakage','other']);
  ensureNum(req.weight_bearing, 'wb');
  ensureStr(req.rehab_plan, 'rp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function joint_injection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'j', ['knee','shoulder','hip','ankle','wrist','elbow','other']);
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dose');
  ensureBool(req.guided_imaging, 'gi');
  ensureEnum(req.indication, 'ind', ['oa','ra','pain','effusion','crystal','frozen','bursitis','tendinopathy','other']);
  ensureNum(req.response_weeks, 'rw');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function joint_aspiration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'j', ['knee','shoulder','hip','ankle','wrist','elbow','other']);
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.fluid_appearance, 'fa');
  ensureBool(req.cell_count_ordered, 'cco');
  ensureBool(req.culture_ordered, 'co');
  ensureBool(req.crystal_analysis, 'ca');
  ensureEnum(req.finding, 'find', ['effusion','hemarthrosis','septic','gout','pseudogout','non_inflammatory','inflammatory','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function joint_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.joint, 'j', ['hip','knee','shoulder','ankle','elbow','wrist','other']);
  ensureNum(req.range_of_motion_deg, 'rom');
  ensureNum(req.pain_score, 'ps');
  ensureBool(req.crepitus, 'crep');
  ensureBool(req.effusion, 'eff');
  ensureStr(req.function_score, 'fs');
  ensureStr(req.impression, 'imp');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { joint_replacement, arthroscopy, joint_injection, joint_aspiration, joint_clinic }; }
module.exports = { funcs, ValidationError };