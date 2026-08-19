// filepath: tier101_peds_development_532_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function developmental_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.fine_motor, 'fm');
  ensureNum(req.gross_motor, 'gm');
  ensureNum(req.language, 'lang');
  ensureNum(req.social, 'soc');
  ensureEnum(req.concerns, 'con', ['none','delayed','at_risk','regressed','other','unknown']);
  ensureEnum(req.screening, 'sc', ['asq','denver','mchat','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function autism_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.mchat_score, 'mchat');
  ensureEnum(req.eye_contact, 'ec', ['normal','reduced','poor','not_observed','other','unknown','none']);
  ensureNum(req.pointing, 'pt');
  ensureBool(req.repetitive_behavior, 'rb');
  ensureBool(req.sensory_concerns, 'sc');
  ensureEnum(req.referral, 'ref', ['developmental','autism_clinic','early_intervention','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function learning_disability(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.academic_score, 'as');
  ensureNum(req.iq_score, 'iq');
  ensureBool(req.reading_disability, 'rd');
  ensureBool(req.math_disability, 'md');
  ensureBool(req.iep, 'iep');
  ensureNum(req.accommodations, 'acc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function adhd_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.vanderbilt_score, 'vs');
  ensureNum(req.inattention, 'ina');
  ensureNum(req.hyperactivity, 'hyp');
  ensureNum(req.impulsivity, 'imp');
  ensureNum(req.school_performance, 'sp');
  ensureEnum(req.treatment, 'tx', ['behavioral','medication','combination','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function behavioral_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.behavior_count, 'bc');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other','none']);
  ensureBool(req.family_history, 'fh');
  ensureEnum(req.referral, 'ref', ['psychology','psychiatry','social_work','behavioral_therapy','none','other','unknown']);
  ensureEnum(req.therapy, 'th', ['cbt','play','family','aba','combination','none','other','unknown']);
  ensureNum(req.medication, 'med');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { developmental_screening, autism_screening, learning_disability, adhd_assessment, behavioral_assessment }; }
module.exports = { funcs, ValidationError };
