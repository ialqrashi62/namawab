// filepath: tier154_oms_728_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['wisdom_teeth','impacted_canines','facial_trauma','fracture_mandible','fracture_maxilla','fracture_zygoma','fracture_orbital','TMJ_disorder','cleft_lip','cleft_palate','oral_cancer','salivary_tumor','cyst','tumor','biopsy','dental_implant','orthognathic','reconstruction','sleep_apnea_surg','other','NA']);
  ensureEnum(req.classification, 'cf', ['1','2','3','NA','unknown']);
  ensureNum(req.age, 'ag');
  ensureNum(req.bmi, 'bm');
  ensureNum(req.asa, 'as');
  ensureBool(req.smoker, 'sm');
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.diagnostic_count, 'dc');
  ensureStr(req.provider, 'pr');
  return { cn_id: `oms_${Date.now()}`, patient_id: req.patient_id, indication: req.indication };
}
function extraction(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['simple','surgical','impacted','erupted','residual_root','supernumerary','deciduous','other']);
  ensureNum(req.tooth_number, 'tn');
  ensureEnum(req.arch, 'ar', ['upper_right','upper_left','lower_right','lower_left','NA','unknown']);
  ensureEnum(req.difficulty, 'df', ['easy','moderate','difficult','complex','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.sections, 'sc');
  ensureEnum(req.complications, 'cp', ['none','dry_socket','infection','bleeding','fracture_root','fracture_bone','nerve_injury','sinus_perforation','other']);
  ensureBool(req.antibiotic, 'ab');
  ensureNum(req.healing_weeks, 'hw');
  ensureStr(req.provider, 'pr');
  return { ex_id: `ext_${Date.now()}`, patient_id: req.patient_id, tooth: req.tooth_number };
}
function orthognathic(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['LeFort_I','BSSO','IVRO','genioplasty','TMJ_reconstruction','zygomatic_reduction','mandible_reduction','combined','segmental','SLA','other','NA']);
  ensureEnum(req.indication, 'in', ['class_II','class_III','asymmetry','open_bite','long_face','short_face','sleep_apnea','TMJ','congenital','trauma','other','NA']);
  ensureNum(req.maxillary_advancement_mm, 'ma');
  ensureNum(req.mandibular_advancement_mm, 'mn');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureEnum(req.fixation, 'fx', ['miniplates','screws','hybrid','wires','combination','NA']);
  ensureBool(req.distraction_done, 'di');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { og_id: `ogn_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function trauma(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['mandible_fx','maxilla_fx','zygoma_fx','orbital_fx','nasal_fx','frontal_sinus','naso_orbito_ethmoid','panfacial','LeFort_I','LeFort_II','LeFort_III','dentoalveolar','soft_tissue_laceration','other','NA']);
  ensureEnum(req.side, 'si', ['left','right','bilateral','midline','NA','unknown']);
  ensureBool(req.open_fx, 'of');
  ensureBool(req.displaced, 'di');
  ensureEnum(req.airway_compromise, 'ac', ['none','mild','moderate','severe','NA']);
  ensureNum(req.broken_teeth, 'bt');
  ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.or_surgery, 'or');
  ensureNum(req.duration_hr, 'dh');
  ensureBool(req.postop_trismus, 'pt');
  ensureNum(req.healing_weeks, 'hw');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { tr_id: `trs_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function oral_pathology(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.site, 'st');
  ensureEnum(req.lesion_type, 'lt', ['cyst','tumor','ulcer','leukoplakia','erythroplakia','lichen_planus','fibroma','papilloma','mucocele','ranula','ameloblastoma','SCC','verrucous_carcinoma','other','NA','unknown']);
  ensureNum(req.size_mm, 'sz');
  ensureEnum(req.diagnosis, 'dx', ['benign','malignant','premalignant','reactive','inflammatory','congenital','NA','pending']);
  ensureBool(req.biopsied, 'bi');
  ensureNum(req.path_number, 'pn');
  ensureNum(req.tnm_t, 'tt');
  ensureEnum(req.margin, 'mg', ['negative','close','positive','NA','unknown']);
  ensureBool(req.refer_oncology, 'ro');
  ensureNum(req.followup_months, 'fm');
  ensureStr(req.provider, 'pr');
  return { op_id: `opl_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}

function funcs() { return { consult, extraction, orthognathic, trauma, oral_pathology }; }
module.exports = { funcs, ValidationError };