// filepath: tier92_autoimmune_487_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function autoimmune_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ana_titer, 'ana');
  ensureBool(req.anti_dsdna, 'add');
  ensureBool(req.anti_smith, 'asm');
  ensureBool(req.anti_rnp, 'arnp');
  ensureBool(req.anti_ro, 'aro');
  ensureBool(req.anti_la, 'ala');
  ensureNum(req.c3, 'c3');
  ensureNum(req.c4, 'c4');
  ensureBool(req.diagnosis_confirmed, 'dc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function lupus_disease_activity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.sledai_score, 'sledai');
  ensureNum(req.bilag_score, 'bilag');
  ensureNum(req.das28_score, 'das28');
  ensureBool(req.renal_involvement, 'ri');
  ensureBool(req.cns_involvement, 'cns');
  ensureEnum(req.flare_type, 'ft', ['mild','moderate','severe','no_flare','other','unknown']);
  ensureNum(req.prednisone_dose, 'pdn');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function autoimmune_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.tender_joints, 'tj');
  ensureNum(req.swollen_joints, 'sj');
  ensureNum(req.das28_esr, 'das28e');
  ensureNum(req.das28_crp, 'das28c');
  ensureNum(req.crp, 'crp');
  ensureNum(req.esr, 'esr');
  ensureBool(req.radiographic_progression, 'rxp');
  ensureNum(req.haq_score, 'haq');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function vasculitis_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.vasculitis_type, 'vt', ['gca','takayasu','anca_associated','polyarteritis','iga_vasculitis','cryoglobulinemia','behcet','other','unknown','none']);
  ensureNum(req.bv_as_score, 'bvas');
  ensureNum(req.anca_titer, 'anca');
  ensureNum(req.crp, 'crp');
  ensureBool(req.organ_involvement, 'oi');
  ensureNum(req.prednisone_dose, 'pdn');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function connective_tissue(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.diagnosis, 'dx', ['sle','ssc','sjogren','dermatomyositis','polymyositis','mctd','overlap','undifferentiated','other','unknown','none']);
  ensureNum(req.skin_score, 'ss');
  ensureNum(req.joint_count, 'jc');
  ensureNum(req.muscle_score, 'ms');
  ensureNum(req.pulmonary_involvement, 'pi');
  ensureNum(req.renal_involvement, 'ri');
  ensureNum(req.cardiac_involvement, 'ci');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { autoimmune_assessment, lupus_disease_activity, autoimmune_arthritis, vasculitis_assessment, connective_tissue }; }
module.exports = { funcs, ValidationError };

