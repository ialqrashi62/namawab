// filepath: tier43_surgery_ext_249_ortho_surg_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function arthroplasty(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.joint, 'jt', ['hip','knee','shoulder','ankle','elbow']);
  ensureStr(req.approach, 'ap');
  ensureStr(req.prosthesis, 'pros');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.ebl, 'ebl');
  ensureNum(req.length_of_stay_days, 'los');
  return { joint: req.joint, prosthesis: req.prosthesis };
}
function fracture_fixation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bone, 'bone');
  ensureEnum(req.fracture_type, 'fx', ['simple','comminuted','open','pathologic','segmental']);
  ensureEnum(req.fixation, 'fix', ['plate_screw','intramedullary_nail','external_fixator','k_wires','traction']);
  ensureNum(req.op_time_min, 'op');
  ensureEnum(req.weight_bearing, 'wb', ['none','toe_touch','partial','full']);
  return { bone: req.bone, fixation: req.fixation };
}
function spinal_fusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.level, 'lvl');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'ap', ['plif','tlif','alif','xlif','posterior']);
  ensureNum(req.levels_fused, 'lvls');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.ebl, 'ebl');
  return { level: req.level, approach: req.approach, levels_fused: req.levels_fused };
}
function arthroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.joint, 'jt', ['knee','shoulder','hip','ankle','wrist','elbow']);
  ensureStr(req.procedure, 'proc');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.recovery_weeks, 'rec');
  return { joint: req.joint, procedure: req.procedure };
}
function amputation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.level, 'lvl', ['toe','transmetatarsal','below_knee','above_knee','through_knee','hip_disarticulation','transhumeral','above_elbow','below_elbow','fingers']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.op_time_min, 'op');
  ensureBool(req.prosthesis_planned, 'pros');
  ensureNum(req.rehab_weeks, 'rehab');
  return { level: req.level, prosthesis_planned: req.prosthesis_planned };
}

function funcs() { return { arthroplasty, fracture_fixation, spinal_fusion, arthroscopy, amputation }; }
module.exports = { funcs, ValidationError };