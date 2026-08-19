// filepath: tier99_rehab_521_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.fugl_meyer, 'fm');
  ensureNum(req.modified_ashworth, 'ma');
  ensureNum(req.balance_score, 'bs');
  ensureNum(req.gait_speed, 'gs');
  ensureBool(req.occupational_therapy, 'ot');
  ensureBool(req.speech_therapy, 'st');
  ensureNum(req.weeks_in_rehab, 'wir');
  ensureEnum(req.discharge, 'dis', ['home','inpatient','outpatient','snf','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cardiac_rehab_phase2(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.weeks_completed, 'wc');
  ensureNum(req.mets_achieved, 'mets');
  ensureNum(req.exercise_minutes, 'exm');
  ensureNum(req.bp_resting, 'bpr');
  ensureNum(req.hr_max, 'hrm');
  ensureNum(req.compliance, 'cmp');
  ensureNum(req.psych_score, 'psy');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pulmonary_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.six_min_walk, '6mw');
  ensureNum(req.dyspnea_borg, 'db');
  ensureNum(req.fev1_improvement, 'fevi');
  ensureNum(req.exercise_capacity, 'ec');
  ensureNum(req.quality_of_life, 'qol');
  ensureNum(req.adherence, 'adh');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function joint_replacement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.joint, 'joint', ['hip','knee','shoulder','ankle','elbow','other','unknown']);
  ensureNum(req.days_postop, 'dp');
  ensureNum(req.range_of_motion, 'rom');
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.walking_distance, 'wd');
  ensureNum(req.satisfaction_score, 'ss');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function amputee_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.level, 'lvl', ['transmetatarsal','below_knee','above_knee','upper_extremity','other','unknown']);
  ensureNum(req.days_post_amp, 'dpa');
  ensureBool(req.prosthesis_fit, 'pf');
  ensureNum(req.gait_training_hours, 'gth');
  ensureNum(req.fim_score, 'fim');
  ensureNum(req.pain_phantom, 'pp');
  ensureNum(req.mobility_score, 'ms');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { stroke_rehab, cardiac_rehab_phase2, pulmonary_rehab, joint_replacement, amputee_rehab }; }
module.exports = { funcs, ValidationError };
