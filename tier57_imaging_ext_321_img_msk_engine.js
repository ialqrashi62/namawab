// filepath: tier57_imaging_ext_321_img_msk_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function joint_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.joint, 'jt', ['knee','shoulder','hip','ankle','elbow','wrist','temporomandibular']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureStr(req.ligaments, 'lig');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { joint: req.joint };
}
function spine_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.region, 'rg', ['cervical','thoracic','lumbar','sacral','cervicothoracic','thoracolumbar','lumbosacral','whole']);
  ensureEnum(req.modality, 'mod', ['mri','ct','xr','myelogram','discogram']);
  ensureStr(req.findings, 'find');
  ensureEnum(req.disc_height, 'dh', ['preserved','mild_loss','moderate_loss','severe_loss','collapse']);
  ensureStr(req.nerve_root_compression, 'nrc');
  ensureStr(req.recommendation, 'rec');
  return { region: req.region };
}
function bone_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tracer, 'tr');
  ensureStr(req.indication, 'ind');
  ensureBool(req.whole_body, 'wb');
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { tracer: req.tracer };
}
function three_tesla_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.area, 'area');
  ensureStr(req.findings, 'find');
  ensureBool(req.contrast_used, 'cu');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { area: req.area };
}
function arthrogram_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.joint, 'jt', ['shoulder','hip','knee','wrist','ankle','elbow']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.contrast, 'ct');
  ensureStr(req.findings, 'find');
  ensureStr(req.recommendation, 'rec');
  return { joint: req.joint };
}

function funcs() { return { joint_mri, spine_imaging, bone_scan, three_tesla_mri, arthrogram_mri }; }
module.exports = { funcs, ValidationError };