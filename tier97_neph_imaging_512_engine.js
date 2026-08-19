// filepath: tier97_neph_imaging_512_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function renal_ultrasound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.right_kidney_length, 'rkl');
  ensureNum(req.left_kidney_length, 'lkl');
  ensureNum(req.corticomedullary_differentiation, 'cmd');
  ensureNum(req.hydronephrosis, 'hdn');
  ensureNum(req.cyst_count, 'cc');
  ensureNum(req.stone_present, 'sp');
  ensureNum(req.resistive_index, 'ri');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function renal_ct(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['stone','mass','trauma','infection','donor','other','unknown']);
  ensureNum(req.kidney_size, 'ks');
  ensureNum(req.hydronephrosis_grade, 'hg');
  ensureNum(req.stone_size_mm, 'ssm');
  ensureNum(req.stone_count, 'sc');
  ensureNum(req.stone_visibility, 'sv');
  ensureEnum(req.imaging_modality, 'im', ['non_contrast','contrast','cta','other','unknown']);
  ensureEnum(req.findings, 'fd', ['normal','stone','mass','cancer','cyst','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function renal_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.glomeruli_count, 'gc');
  ensureNum(req.global_sclerosis, 'gs');
  ensureNum(req.segmental_sclerosis, 'ss');
  ensureNum(req.fibrosis_pct, 'fp');
  ensureNum(req.tubular_atrophy, 'ta');
  ensureEnum(req.ifta_score, 'is', ['0','1','2','3','unknown','other']);
  ensureEnum(req.diagnosis, 'dx', ['iga_nephropathy','membranous','fsgs','minimal_change','diabetic','lupus','amyloid','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function renal_nuclear(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.l_total_function, 'ltf');
  ensureNum(req.r_total_function, 'rtf');
  ensureNum(req.l_egfr, 'leg');
  ensureNum(req.r_egfr, 'reg');
  ensureNum(req.split_function, 'sf');
  ensureBool(req.obstruction, 'obs');
  ensureNum(req.differential_function, 'df');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function renal_angiography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.renal_artery_stenosis, 'ras');
  ensureNum(req.stenosis_pct, 'sp');
  ensureEnum(req.side, 'sd', ['unilateral','bilateral','left','right','unknown','other']);
  ensureBool(req.angioplasty, 'ang');
  ensureBool(req.stenting, 'stent');
  ensureEnum(req.access_route, 'ar', ['femoral','radial','brachial','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { renal_ultrasound, renal_ct, renal_biopsy, renal_nuclear, renal_angiography }; }
module.exports = { funcs, ValidationError };
