// filepath: tier100_obgyn_menopause_526_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function menopause_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.amenorrhea_months, 'amo');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.estradiol, 'e2');
  ensureNum(req.hot_flashes, 'hf');
  ensureNum(req.night_sweats, 'ns');
  ensureNum(req.sleep_disturbance, 'sld');
  ensureEnum(req.stage, 'st', ['perimenopause','menopause','postmenopause','surgical','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function hrt_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prescription_id, 'pid');
  ensureEnum(req.estrogen_type, 'et', ['conjugated','estradiol','esterified','transdermal','other','unknown','none']);
  ensureNum(req.dose_mg, 'dm');
  ensureBool(req.progesterone_added, 'pa');
  ensureEnum(req.route, 'rt', ['oral','transdermal','gel','cream','ring','other','unknown']);
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.contraindications, 'cont');
  ensureNum(req.side_effects, 'se');
  ensureStr(req.provider, 'pr');
  return { pid: req.prescription_id };
}
function urogynecology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.complaint, 'comp', ['stress_incontinence','urge_incontinence','mixed','prolapse','recurrent_uti','voiding_dysfunction','other','unknown','none']);
  ensureNum(req.parity, 'par');
  ensureNum(req.popq_stage, 'ps');
  ensureNum(req.pad_test, 'pt');
  ensureEnum(req.pelvic_floor_therapy, 'pft', ['done','in_progress','declined','pending','other','unknown','none']);
  ensureEnum(req.treatment, 'tx', ['observation','pt','pessary','surgery','medication','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function abnormal_uterine_bleeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.pattern, 'pat', ['menorrhagia','metrorrhagia','amenorrhea','oligomenorrhea','polymenorrhea','postmenopausal','other','unknown']);
  ensureNum(req.endometrial_thickness, 'et');
  ensureBool(req.fibroids, 'fib');
  ensureBool(req.polyp, 'pol');
  ensureEnum(req.treatment, 'tx', ['observation','hormonal','tranexamic','surgical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function endometriosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.dysmenorrhea, 'dys');
  ensureNum(req.dyspareunia, 'dysp');
  ensureNum(req.revised_asrm_score, 'ras');
  ensureBool(req.infertility, 'inf');
  ensureEnum(req.treatment, 'tx', ['nsaid','hormonal','surgery','combined','other','unknown','none']);
  ensureEnum(req.stage, 'st', ['1','2','3','4','unknown','other','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { menopause_assessment, hrt_therapy, urogynecology, abnormal_uterine_bleeding, endometriosis }; }
module.exports = { funcs, ValidationError };
