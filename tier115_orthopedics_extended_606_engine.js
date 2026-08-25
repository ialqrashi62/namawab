// filepath: tier115_orthopedics_extended_606_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function joint_replacement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'jt', ['hip','knee','shoulder','ankle','elbow','wrist','other','unknown']);
  ensureEnum(req.prosthesis, 'pr', ['cementless','cemented','hybrid','reverse','other','unknown']);
  ensureEnum(req.approach, 'app', ['anterior','posterior','lateral','minimally_invasive','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureEnum(req.outcome, 'out', ['successful','complications','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function arthroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'jt', ['knee','shoulder','hip','ankle','wrist','elbow','other','unknown']);
  ensureEnum(req.type, 'tp', ['diagnostic','therapeutic','both','other','unknown']);
  ensureStr(req.findings, 'fd');
  ensureEnum(req.treatment, 'tx', ['none','meniscectomy','debridement','synovectomy','repair','reconstruction','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.outcome, 'out', ['successful','partial','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function fracture_fixation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.fracture_type, 'ft');
  ensureStr(req.location, 'loc');
  ensureEnum(req.fixation, 'fx', ['plate_screw','intramedullary_nail','external_fixator','screw','wire','other','unknown']);
  ensureNum(req.healing_weeks, 'hw');
  ensureEnum(req.weight_bearing_status, 'wbs', ['non','partial','full','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function spinal_decompression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.level, 'lvl');
  ensureEnum(req.approach, 'app', ['posterior','anterior','lateral','minimally_invasive','other','unknown']);
  ensureBool(req.discectomy, 'dct');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.outcome, 'out', ['successful','partial','failed','other','unknown']);
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function ligament_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'jt', ['knee','ankle','shoulder','wrist','other','unknown']);
  ensureStr(req.ligament, 'lig');
  ensureEnum(req.graft, 'grf', ['autograft','allograft','synthetic','primary_repair','other','unknown']);
  ensureEnum(req.technique, 'tech', ['arthroscopic','open','minimally_invasive','other','unknown']);
  ensureEnum(req.outcome, 'out', ['successful','failed','other','unknown']);
  ensureNum(req.rehab_weeks, 'rw');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { joint_replacement, arthroscopy, fracture_fixation, spinal_decompression, ligament_repair }; }
module.exports = { funcs, ValidationError };