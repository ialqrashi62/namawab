// filepath: tier80_ent_ext_427_ent_pediatric_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function otitis_media(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.ear, 'ear', ['right','left','bilateral','unknown']);
  ensureEnum(req.type, 't', ['acute','recurrent','chronic','serous','other','unknown']);
  ensureBool(req.tympanostomy_tubes_placed, 'ttp');
  ensureBool(req.antibiotics, 'abx');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureNum(req.episodes_per_year, 'epy');
  ensureBool(req.hearing_loss, 'hl');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function myringotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureBool(req.tubes_placed, 'tp');
  ensureStr(req.tube_type, 'tt');
  ensureEnum(req.anesthesia, 'an', ['mask','iv','general','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','tube_otorrhea','early_tube_extrusion','persistent_perforation','other']);
  ensureBool(req.tonsillectomy_done, 'td');
  ensureBool(req.adenoidectomy_done, 'adx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function adenoidectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureNum(req.age_years, 'ay');
  ensureBool(req.combined_with_tonsillectomy, 'cwt');
  ensureEnum(req.indication, 'ind', ['obstruction','recurrent_infection','chronic_effusion','osa','other','unknown']);
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','voice_change','nasopharyngeal_stenosis','other']);
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.discharge_plan, 'dp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function newborn_hearing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.screening_age_days, 'sad');
  ensureEnum(req.screening_type, 'st', ['abr','oae','both','other','unknown']);
  ensureEnum(req.screening_result, 'sr', ['pass','refer','incomplete','pending','unknown']);
  ensureBool(req.unilateral_refer, 'ur');
  ensureBool(req.bilateral_refer, 'br');
  ensureBool(req.followup_needed, 'fu');
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function congenital_neck_mass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.type, 't', ['branchial_cleft','thyroglossal_duct','cystic_hygroma','dermoid','hemangioma','lymphatic_malformation','other','unknown']);
  ensureNum(req.mass_size_cm, 'ms');
  ensureEnum(req.location, 'loc', ['midline','lateral','posterior','supraclavicular','other','unknown']);
  ensureBool(req.infectious_episodes, 'ie');
  ensureBool(req.surgical_planned, 'splan');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { otitis_media, myringotomy, adenoidectomy, newborn_hearing, congenital_neck_mass }; }
module.exports = { funcs, ValidationError };