// filepath: tier82_obgyn_ext_436_obgyn_labor_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function labor_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.cervical_dilation_cm, 'cd');
  ensureNum(req.cervical_effacement_pct, 'ce');
  ensureNum(req.fetal_heart_rate, 'fhr');
  ensureEnum(req.contractions, 'cx', ['none','mild','moderate','strong','unknown']);
  ensureBool(req.rom_present, 'rp');
  ensureNum(req.epidural_given, 'eg');
  ensureBool(req.gbs_status_known, 'gs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function labor_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cervical_dilation_cm, 'cd');
  ensureEnum(req.stage, 'stage', ['latent','active','second','third','fourth','unknown']);
  ensureNum(req.contraction_frequency_min, 'cf');
  ensureNum(req.fetal_heart_rate, 'fhr');
  ensureNum(req.fetal_variability, 'fv');
  ensureEnum(req.category, 'cat', ['cat1','cat2','cat3','unknown']);
  ensureBool(req.oxytocin_running, 'or');
  ensureNum(req.iu_pressure, 'iup');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function vaginal_delivery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.delivery_type, 'dty');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.labor_induction, 'li', ['spontaneous','induced','augmented','scheduled','unknown']);
  ensureEnum(req.anesthesia, 'an', ['epidural','spinal','general','local','combined','none','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.perineal_laceration, 'pl', ['first','second','third','fourth','intact','unknown','other']);
  ensureNum(req.blood_loss_ml, 'bl');
  ensureEnum(req.complications, 'comp', ['none','postpartum_hemorrhage','shoulder_dystocia','retained_placenta','perineal_tear','other']);
  ensureBool(req.skin_to_skin, 'sts');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function cesarean_section(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.c_section_type, 'ct', ['primary','repeat','emergency','elective','urgent','unknown']);
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.anesthesia, 'an', ['spinal','epidural','general','combined','other']);
  ensureEnum(req.indication, 'ind', ['fetal_distress','malpresentation','placenta_previa','placental_abruption','failure_to_progress','multiple_gestation','cpd','previous_cs','elective','macrosomia','other']);
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','uterine_injury','organ_injury','thrombosis','other']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function postpartum_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.postpartum_day, 'pd');
  ensureEnum(req.mode_of_delivery, 'mod', ['vaginal','c_section','vacuum','forceps','unknown']);
  ensureBool(req.breastfeeding, 'bf');
  ensureEnum(req.lochia, 'loc', ['normal','heavy','foul_smelling','clots','none','unknown']);
  ensureNum(req.postpartum_depression_score, 'pds');
  ensureBool(req.episiotomy_healed, 'eh');
  ensureNum(req.fundal_height, 'fh');
  ensureStr(req.follow_up_plan, 'fup');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { labor_admission, labor_monitoring, vaginal_delivery, cesarean_section, postpartum_care }; }
module.exports = { funcs, ValidationError };