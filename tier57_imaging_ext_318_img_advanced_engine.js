// filepath: tier57_imaging_ext_318_img_advanced_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pet_ct(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.tracer, 'tr', ['fdg','psma_dotatate','fes_fluciclovine','fapi','amyloid_pittsburgh']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.area, 'area');
  ensureNum(req.suv_max_lesion, 'suv');
  ensureStr(req.interpretation, 'intp');
  ensureStr(req.follow_up, 'fu');
  return { suv: req.suv_max_lesion };
}
function pet_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tracer, 'tr');
  ensureStr(req.indication, 'ind');
  ensureStr(req.area, 'area');
  ensureStr(req.mri_sequences, 'ms');
  ensureStr(req.interpretation, 'intp');
  ensureNum(req.follow_up_imaging, 'fu');
  return { tracer: req.tracer };
}
function spect_ct(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tracer, 'tr');
  ensureStr(req.indication, 'ind');
  ensureStr(req.area, 'area');
  ensureStr(req.findings, 'find');
  ensureStr(req.interpretation, 'intp');
  return { tracer: req.tracer };
}
function mr_spectroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.voxel_location, 'vl');
  ensureNum(req.choline, 'cho');
  ensureNum(req.naa, 'naa');
  ensureNum(req.creatine, 'cr');
  ensureStr(req.interpretation, 'intp');
  return { cho: req.choline, naa: req.naa };
}
function fusion_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['pet_ct_mri','pet_ct','spect_ct','mr_us_fusion','mr_ct_fusion']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.registration_accuracy_mm, 'reg');
  ensureStr(req.findings, 'find');
  ensureStr(req.staging, 'staging');
  return { type: req.type };
}

function funcs() { return { pet_ct, pet_mri, spect_ct, mr_spectroscopy, fusion_imaging }; }
module.exports = { funcs, ValidationError };