// filepath: tier57_imaging_ext_320_img_breast_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mammography_diagnostic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.birads, 'bir');
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.follow_up, 'fu');
  return { birads: req.birads };
}
function breast_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.birads, 'bir');
  ensureEnum(req.background_parenchymal_enhancement, 'bpe', ['minimal','mild','moderate','marked']);
  ensureStr(req.incidental_findings, 'if');
  ensureBool(req.follow_up_annual, 'fua');
  return { birads: req.birads };
}
function breast_ultrasound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.birads, 'bir');
  ensureNum(req.lesion_size_mm, 'sz');
  ensureStr(req.features, 'feat');
  ensureStr(req.recommendation, 'rec');
  return { birads: req.birads };
}
function breast_biopsy_stereo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'app', ['stereotactic','tomosynthesis','ultrasound_guided','mri_guided','contrast_enhanced']);
  ensureStr(req.target, 'tgt');
  ensureNum(req.cores, 'cores');
  ensureBool(req.clip_placed, 'clip');
  ensureStr(req.complications, 'comp');
  return { target: req.target };
}
function breast_ductogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { indication: req.indication };
}

function funcs() { return { mammography_diagnostic, breast_mri, breast_ultrasound, breast_biopsy_stereo, breast_ductogram }; }
module.exports = { funcs, ValidationError };