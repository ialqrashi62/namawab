// filepath: tier81_uro_ext_432_uro_andrology_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function erectile_dysfunction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.iief_score, 'iief');
  ensureBool(req.diabetes, 'dm');
  ensureBool(req.cardiovascular_disease, 'cv');
  ensureBool(req.hypertension, 'htn');
  ensureNum(req.testosterone_total, 't');
  ensureNum(req.psa_if_indicated, 'psa');
  ensureEnum(req.treatment, 'tx', ['lifestyle','pde5','intracavernosal','vacuum','implant','combination','observation','other','unknown']);
  ensureBool(req.counseling_referral, 'cr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function infertility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.lh, 'lh');
  ensureNum(req.testosterone_total, 't');
  ensureNum(req.sperm_count_million_ml, 'sc');
  ensureEnum(req.motility, 'mot', ['normal','reduced','absent','unknown','other']);
  ensureEnum(req.morphology, 'morph', ['normal','reduced','abnormal','unknown','other']);
  ensureBool(req.varicocele, 'var');
  ensureBool(req.referred_repro, 'rr');
  ensureStr(req.partner_evaluation, 'pe');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function peyronie_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.phase, 'ph', ['acute','chronic','stable','unknown','other']);
  ensureNum(req.curvature_degrees, 'cd');
  ensureNum(req.ede_degree, 'ed');
  ensureBool(req.painful, 'pn');
  ensureNum(req.plaque_size_cm, 'ps');
  ensureBool(req.peyronie_affects_intercourse, 'pai');
  ensureEnum(req.treatment, 'tx', ['observation','vitamin_e','potaba','xmpt','collagenase','traction','surgery','combination','other','unknown']);
  ensureBool(req.surgical_referral, 'sr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function vasectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.technique, 'tech', ['conventional','no_needle','no_scalpel','open','other','unknown']);
  ensureEnum(req.anesthesia, 'an', ['local','iv_sedation','general','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.episodes_complications, 'comp_count');
  ensureEnum(req.complications, 'comp', ['none','hematoma','infection','granuloma','recanalization','chronic_pain','other']);
  ensureBool(req.sem_analysis_planned, 'sap');
  ensureNum(req.sem_analysis_weeks, 'saw');
  ensureBool(req.counseling_complete, 'cc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function vasectomy_reversal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureNum(req.time_since_vasectomy_years, 'tsy');
  ensureEnum(req.technique, 'tech', ['vv','va','vasoepididymostomy','combined','other','unknown']);
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.patency_rate_expected, 'pre');
  ensureBool(req.sperm_present_3mo, 'sp3');
  ensureStr(req.complications, 'comp_str');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureBool(req.pregnancy_achieved, 'pach');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}

function funcs() { return { erectile_dysfunction, infertility, peyronie_disease, vasectomy, vasectomy_reversal }; }
module.exports = { funcs, ValidationError };