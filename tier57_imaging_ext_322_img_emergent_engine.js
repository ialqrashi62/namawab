// filepath: tier57_imaging_ext_322_img_emergent_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_trauma_full(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.scans, 'scans');
  ensureEnum(req.contrast, 'ct', ['with','without','with_and_without','none']);
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up_imaging, 'fu');
  return { scans: req.scans };
}
function ct_angio_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { indication: req.indication };
}
function ct_perfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.penumbra, 'pen');
  ensureNum(req.core_volume_ml, 'core');
  ensureBool(req.mismatch, 'mm');
  ensureStr(req.recommendation, 'rec');
  return { penumbra: req.penumbra_volume_ml };
}
function xr_portable_intraop(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.view, 'view', ['ap','lateral','oblique','portable_ap','portable_lateral']);
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up_imaging, 'fu');
  return { view: req.view };
}
function mri_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.region, 'rg', ['brain','cervical_spine','thoracic_spine','lumbar_spine','whole_spine','whole_body']);
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { indication: req.indication };
}

function funcs() { return { ct_trauma_full, ct_angio_emergent, ct_perfusion, xr_portable_intraop, mri_emergent }; }
module.exports = { funcs, ValidationError };