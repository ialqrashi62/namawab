// filepath: tier100_obgyn_reproductive_527_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function contraception_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.parity, 'par');
  ensureEnum(req.preference, 'pref', ['hormonal','barrier','iud','permanent','natural','emergency','other','unknown','none']);
  ensureNum(req.contraindications, 'cont');
  ensureBool(req.smoking, 'sm');
  ensureBool(req.medical_conditions, 'mc');
  ensureEnum(req.method_chosen, 'mc2', ['combined_oc','progestin_only','iud_copper','iud_levonorgestrel','implant','injection','condom','diaphragm','sterilization','natural_family_planning','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function iud_insertion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.iud_type, 'it', ['copper','levonorgestrel','other','unknown']);
  ensureNum(req.insertion_difficulty, 'id');
  ensureNum(req.timing, 'tim');
  ensureBool(req.successful, 'suc');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function sti_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.chlamydia, 'chl');
  ensureBool(req.gonorrhea, 'gon');
  ensureBool(req.syphilis, 'syp');
  ensureBool(req.hiv_tested, 'hiv');
  ensureBool(req.hpv_tested, 'hpv');
  ensureBool(req.hepatitis_b, 'hbv');
  ensureEnum(req.trichomonas, 'tri', ['positive','negative','pending','not_done','other','unknown']);
  ensureNum(req.partners_treated, 'pt');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pelvic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.location, 'loc', ['central','right','left','bilateral','diffuse','other','unknown']);
  ensureNum(req.cyclic, 'cyc');
  ensureBool(req.dyspareunia, 'dp');
  ensureEnum(req.imaging, 'img', ['ultrasound','mri','ct','none','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['observation','nsaid','hormonal','surgical','referral','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function gyne_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.procedure_type, 'pt', ['hysterectomy','oophorectomy','myomectomy','hysteroscopy','laparoscopy','cystectomy','prolapse_repair','continence','other','unknown']);
  ensureEnum(req.approach, 'app', ['open','laparoscopic','robotic','vaginal','hysteroscopic','other','unknown']);
  ensureNum(req.ebl_ml, 'ebl');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.specimen_pathology, 'sp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { contraception_counseling, iud_insertion, sti_screening, pelvic_pain, gyne_surgery }; }
module.exports = { funcs, ValidationError };
