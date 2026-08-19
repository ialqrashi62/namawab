// filepath: tier82_obgyn_ext_434_obgyn_gyne_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function menstrual_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.disorder_type, 'dt', ['amenorrhea','oligomenorrhea','menorrhagia','metrorrhagia','dysmenorrhea','pmdd','pcod_related','other','unknown']);
  ensureNum(req.cycle_length_days, 'cld');
  ensureNum(req.flow_duration_days, 'fdd');
  ensureBool(req.hirsutism, 'hir');
  ensureNum(req.bmi, 'bmi');
  ensureEnum(req.imaging_done, 'im', ['none','us','mri','ct','pet','other']);
  ensureBool(req.hormonal_workup, 'hw');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function infertility_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.amh, 'amh');
  ensureNum(req.fsh_day3, 'fsh');
  ensureNum(req.cycle_length_days, 'cld');
  ensureBool(req.partner_evaluation, 'pe');
  ensureEnum(req.tubal_patency, 'tp', ['bilateral_patent','unilateral','bilateral_blocked','unknown','not_tested','other']);
  ensureNum(req.duration_infertility_years, 'diy');
  ensureEnum(req.management, 'mg', ['expectant','ovulation_induction','iui','ivf','icsi','donor','surrogacy','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function contraception_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.parity, 'par');
  ensureBool(req.smoker, 'smo');
  ensureBool(req.hypertension, 'htn');
  ensureBool(req.diabetes, 'dm');
  ensureEnum(req.method, 'm', ['combined_pill','progestin_only','injection','implant','iud_copper','iud_levonorgestrel','patch','ring','barrier','natural','sterilization','emergency','none','other']);
  ensureStr(req.counseling, 'cou');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function menopause(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.estradiol, 'e2');
  ensureEnum(req.stage, 'stage', ['perimenopausal','early_menopause','menopause','late_menopause','postmenopausal','unknown']);
  ensureBool(req.vasomotor_symptoms, 'vs');
  ensureBool(req.bone_density_test, 'bdt');
  ensureStr(req.hrt_status, 'hrt');
  ensureEnum(req.bone_density_score, 'bds', ['normal','osteopenia','osteoporosis','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function pelvic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.cyclic, 'cyc');
  ensureStr(req.associated_symptoms, 'as');
  ensureBool(req.imaging_done, 'id');
  ensureEnum(req.impression, 'imp', ['endometriosis','adenomyosis','pcod','fibroids','pid','ovarian_cyst','functional_cyst','bowel_related','bladder_related','musculoskeletal','idiopathic','unknown','other']);
  ensureEnum(req.management, 'mg', ['observation','nsaids','hormonal','surgery','physiotherapy','psychological','combination','other','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { menstrual_disorder, infertility_eval, contraception_counseling, menopause, pelvic_pain }; }
module.exports = { funcs, ValidationError };