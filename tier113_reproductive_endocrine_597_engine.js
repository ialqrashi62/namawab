// filepath: tier113_reproductive_endocrine_597_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pcos(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureBool(req.menstrual_irregular, 'mi');
  ensureNum(req.hirsutism_score, 'hs');
  ensureBool(req.obesity, 'ob');
  ensureNum(req.ovary_volume_ml, 'ovm');
  ensureEnum(req.diagnosis, 'dx', ['pcos','not_pcos','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function amenorrhea(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureStr(req.last_period, 'lp');
  ensureNum(req.amenorrhea_months, 'am');
  ensureEnum(req.workup, 'wu', ['initiated','completed','pending','other','unknown']);
  ensureEnum(req.diagnosis, 'dx', ['pregnancy','menopause','hypothalamic','hyperprolactinemia','pcos','premature_ovarian_failure','workup_pending','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hirsutism(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.hirsutism_score, 'hs');
  ensureEnum(req.androgens, 'an', ['normal','elevated','markedly_elevated','other','unknown']);
  ensureEnum(req.ferritin, 'frt', ['normal','low','high','other','unknown']);
  ensureEnum(req.thyroid, 'thy', ['normal','abnormal','pending','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['spironolactone','finasteride','eflornithine','laser','combination','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function menopause_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.estradiol, 'es');
  ensureStr(req.symptoms, 'sym');
  ensureEnum(req.bone_density, 'bd', ['normal','osteopenia','osteoporosis','unknown','other']);
  ensureEnum(req.treatment, 'tx', ['hrt_consider','non_hormonal','lifestyle','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function androgen_excess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.testosterone, 'ts', ['normal','elevated','high','other','unknown']);
  ensureEnum(req.dheas, 'dheas', ['normal','elevated','high','other','unknown']);
  ensureEnum(req.ultrasound, 'us', ['normal','pcos_pattern','adrenal_mass','other','unknown']);
  ensureEnum(req.diagnosis, 'dx', ['pcos','androgen_secreting_tumor','congenital_adrenal_hyperplasia','cushings','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { pcos, amenorrhea, hirsutism, menopause_eval, androgen_excess }; }
module.exports = { funcs, ValidationError };