// filepath: tier79_ophth_ext_419_ophth_retina_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diabetic_retinopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.hba1c, 'a1c');
  ensureEnum(req.dr_grade, 'dr', ['none','mild_npdR','moderate_npdR','severe_npdR','pdr','unknown','other']);
  ensureBool(req.macular_edema, 'me');
  ensureNum(req.cmt_central, 'cmt');
  ensureBool(req.oct_done, 'oct');
  ensureBool(req.fundus_photo, 'fp');
  ensureBool(req.anti_vegf_planned, 'av');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function amd_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.amd_type, 'at', ['dry','wet','cst','mixed','geographic_atrophy','pcv','unknown','other']);
  ensureNum(req.cmt_central, 'cmt');
  ensureBool(req.intravitreal_avastin, 'iava');
  ensureBool(req.intravitreal_lucentis, 'iall');
  ensureBool(req.intravitreal_eylea, 'iaey');
  ensureBool(req.intravitreal_izervay, 'iaiz');
  ensureNum(req.cnt_va, 'cntva');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureNum(req.injection_number, 'inj');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function retinal_detachment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['rhegmatogenous','tractional','exudative','combined','macular_hole','other','unknown']);
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureBool(req.macula_off, 'mo');
  ensureBool(req.vitreous_hemorrhage, 'vh');
  ensureNum(req.va, 'va');
  ensureEnum(req.treatment, 'tx', ['vitrectomy','scleral_buckle','pneumatic_retinopexy','laser','observation','combined','other','unknown']);
  ensureBool(req.surgery_planned, 'splan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function intravitreal_injection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.medication, 'med', ['avastin','lucentis','eylea','izervay','syfovre','triamcinolone','other','unknown']);
  ensureNum(req.dose_mg, 'dose');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.injection_number, 'inj');
  ensureEnum(req.complications, 'comp', ['none','endophthalmitis','retinal_detachment','ioh','vitreous_hemorrhage','uveitis','other']);
  ensureNum(req.va_pre, 'vap');
  ensureNum(req.va_post, 'vag');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function oct_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.cmt_central, 'cmt');
  ensureBool(req.subretinal_fluid, 'srf');
  ensureBool(req.intraretinal_fluid, 'irf');
  ensureBool(req.epiretinal_membrane, 'erm');
  ensureBool(req.macular_hole, 'mh');
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.image_quality, 'iq');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}

function funcs() { return { diabetic_retinopathy, amd_management, retinal_detachment, intravitreal_injection, oct_scan }; }
module.exports = { funcs, ValidationError };