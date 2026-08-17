// filepath: tier47_radiology_ext_272_rad_interv_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function biopsy_ct_guided(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'tgt');
  ensureStr(req.approach, 'app');
  ensureNum(req.needles, 'n');
  ensureNum(req.core_samples, 'cs');
  ensureStr(req.complication, 'comp');
  ensureBool(req.histology_pending, 'hp');
  return { target: req.target, cores: req.core_samples };
}
function drainage_catheter(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.collection, 'coll');
  ensureStr(req.approach, 'app');
  ensureNum(req.catheter_size_fr, 'fr');
  ensureEnum(req.output, 'out', ['increasing','stable','decreasing','minimal','none']);
  ensureEnum(req.follow_up, 'fu', ['serial_imaging','repeat_drainage','removal_planned','clinic_2_weeks','none']);
  return { collection: req.collection };
}
function embolization_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'tgt');
  ensureStr(req.material, 'mat');
  ensureBool(req.success, 'succ');
  ensureStr(req.complications, 'comp');
  ensureNum(req.follow_up_imaging, 'fu');
  return { target: req.target, success: req.success };
}
function tumor_ablation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'tgt');
  ensureEnum(req.modality, 'mod', ['microwave','radiofrequency','cryoablation','irreversible_electroporation','laser']);
  ensureEnum(req.approach, 'app', ['percutaneous','laparoscopic','open']);
  ensureBool(req.success, 'succ');
  ensureStr(req.complications, 'comp');
  ensureNum(req.follow_up_imaging, 'fu');
  return { target: req.target, modality: req.modality };
}
function vertebroplasty(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.level, 'lvl');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'app', ['transpedicular_bilateral','transpedicular_unilateral','costovertebral']);
  ensureNum(req.cement_ml, 'cm');
  ensureStr(req.complications, 'comp');
  ensureBool(req.pain_improvement, 'pi');
  return { level: req.level, cement: req.cement_ml };
}

function funcs() { return { biopsy_ct_guided, drainage_catheter, embolization_therapy, tumor_ablation, vertebroplasty }; }
module.exports = { funcs, ValidationError };