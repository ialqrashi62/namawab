// filepath: tier107_nursing_assess_561_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vital_signs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.temperature_c, 'temp');
  ensureNum(req.heart_rate, 'hr');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.oxygen_saturation, 'spo2');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pain_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.scale, 'sc', ['numeric','faces','flacc','visual_analog','behavioral','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureEnum(req.location, 'lc', ['head','chest','abdomen','back','limbs','multiple','other','unknown']);
  ensureEnum(req.character, 'ch', ['sharp','dull','burning','aching','cramping','shooting','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function fall_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.morse_fall_score, 'mfs');
  ensureNum(req.age, 'age');
  ensureNum(req.history_of_falling, 'hof');
  ensureBool(req.ambulatory_aid, 'aa');
  ensureBool(req.iv_heparin, 'ivh');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function braden_scale(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.sensory_perception, 'sp');
  ensureNum(req.moisture, 'mo');
  ensureNum(req.activity, 'act');
  ensureNum(req.mobility, 'mob');
  ensureNum(req.nutrition, 'nut');
  ensureNum(req.friction_shear, 'fs');
  ensureEnum(req.risk_level, 'rl', ['no_risk','low','moderate','high','severe','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function nursing_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.diagnosis_id, 'did');
  ensureEnum(req.category, 'cat', ['pain','impaired_skin','fall_risk','infection','nutrition','activity','cognitive','other','unknown']);
  ensureEnum(req.priority, 'pr', ['low','medium','high','urgent','other','unknown']);
  ensureStr(req.nursing_intervention, 'ni');
  ensureNum(req.expected_outcome_score, 'eos');
  ensureEnum(req.status, 'st', ['active','resolved','ongoing','modified','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.diagnosis_id };
}

function funcs() { return { vital_signs, pain_assessment, fall_risk, braden_scale, nursing_diagnosis }; }
module.exports = { funcs, ValidationError };