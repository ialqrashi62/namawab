// filepath: tier107_allied_health_565_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function physical_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['therapeutic_exercise','manual_therapy','gait_training','balance_training','mobility','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.intensity, 'int', ['light','moderate','vigorous','other','unknown']);
  ensureNum(req.exercises, 'ex');
  ensureEnum(req.progress, 'pr', ['improving','plateau','regressing','stable','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function occupational_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['adl_training','fine_motor','cognitive','sensory','home_safety','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.goal, 'gl');
  ensureNum(req.progress, 'pr');
  ensureNum(req.goal_met_pct, 'gmp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function speech_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['swallowing_therapy','cognitive_communication','voice','language','articulation','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.diet_level, 'dl', ['thin','nectar_thick','honey_thick','pudding_thick','npo','other','unknown']);
  ensureNum(req.swallow_score, 'ss');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function respiratory_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['nebulizer','inhaler','cpap','bipap','chest_physiotherapy','other','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.response, 'resp', ['improved','no_change','worsened','other','unknown']);
  ensureNum(req.peak_flow, 'pf');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function dietary_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureNum(req.caloric_needs, 'cn');
  ensureNum(req.protein_needs_g, 'png');
  ensureEnum(req.diet, 'dt', ['regular','cardiac','diabetic','renal','low_sodium','pureed','npo','other','unknown']);
  ensureStr(req.education, 'ed');
  ensureEnum(req.appetite, 'ap', ['good','fair','poor','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}

function funcs() { return { physical_therapy, occupational_therapy, speech_therapy, respiratory_therapy, dietary_consult }; }
module.exports = { funcs, ValidationError };