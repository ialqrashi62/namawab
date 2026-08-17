// filepath: tier57_imaging_ext_319_img_us_ext_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function us_musculoskeletal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.joint, 'jt', ['shoulder','elbow','wrist','hip','knee','ankle','foot']);
  ensureStr(req.findings, 'find');
  ensureStr(req.bursa, 'bur');
  ensureStr(req.biceps, 'bi');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { joint: req.joint };
}
function us_thyroid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.finding, 'find');
  ensureNum(req.size_mm, 'sz');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.lymph_nodes, 'ln', ['normal','abnormal','not_assessed']);
  ensureNum(req.follow_up_imaging, 'fu');
  return { size: req.size_mm };
}
function us_vascular_dvt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureStr(req.finding, 'find');
  ensureEnum(req.compressibility, 'comp', ['compressible','not_compressible','partial']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { site: req.site };
}
function us_obstetric_advanced(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gestational_age_weeks, 'ga');
  ensureStr(req.anatomy_scan, 'as');
  ensureNum(req.growth_percentile, 'gp');
  ensureNum(req.cervical_length_mm, 'cl');
  ensureEnum(req.placenta, 'pl', ['fundal','anterior','posterior','low_lying','previa_partial','previa_complete']);
  ensureStr(req.recommendation, 'rec');
  return { ga: req.gestational_age_weeks };
}
function us_contrast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.lesion_count, 'lc');
  ensureStr(req.enhancement_pattern, 'ep');
  ensureStr(req.interpretation, 'intp');
  ensureStr(req.recommendation, 'rec');
  return { lesion_count: req.lesion_count };
}

function funcs() { return { us_musculoskeletal, us_thyroid, us_vascular_dvt, us_obstetric_advanced, us_contrast }; }
module.exports = { funcs, ValidationError };