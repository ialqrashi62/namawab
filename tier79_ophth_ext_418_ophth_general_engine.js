// filepath: tier79_ophth_ext_418_ophth_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vision_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.va_right, 'var');
  ensureNum(req.va_left, 'val');
  ensureNum(req.va_both, 'vab');
  ensureNum(req.sph_right, 'sr');
  ensureNum(req.sph_left, 'sl');
  ensureNum(req.cyl_right, 'cr');
  ensureNum(req.cyl_left, 'cl');
  ensureNum(req.add_power, 'ap');
  ensureNum(req.iop_right, 'ipr');
  ensureNum(req.iop_left, 'ipl');
  ensureStr(req.glasses_recommendation, 'gr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function refraction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.sph_right, 'sr');
  ensureNum(req.sph_left, 'sl');
  ensureNum(req.cyl_right, 'cr');
  ensureNum(req.cyl_left, 'cl');
  ensureNum(req.axis_right, 'ar');
  ensureNum(req.axis_left, 'al');
  ensureNum(req.add_right, 'adr');
  ensureNum(req.add_left, 'adl');
  ensureEnum(req.refraction_method, 'rm', ['retinoscopy','autorefraction','manifest','cycloplegic','subjective','other']);
  ensureNum(req.va_right_final, 'vrf');
  ensureNum(req.va_left_final, 'vlf');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function iop_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.iop_right, 'ipr');
  ensureNum(req.iop_left, 'ipl');
  ensureNum(req.pachymetry_right, 'par');
  ensureNum(req.pachymetry_left, 'pal');
  ensureEnum(req.method, 'm', ['gton','nct','iat','rebound','other']);
  ensureBool(req.corneal_compensation, 'cc');
  ensureEnum(req.gla_risk, 'gr', ['low','moderate','high','very_high','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function dilate_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.dilating_agent, 'da', ['tropicamide','cyclopentolate','atropine','phenylephrine','combination','other']);
  ensureNum(req.pupil_size_mm, 'ps');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.lens_findings, 'lf');
  ensureStr(req.fundus_findings, 'ff');
  ensureBool(req.fundus_photo_taken, 'fpt');
  ensureBool(req.oct_taken, 'oct');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function routine_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.va_right, 'var');
  ensureNum(req.va_left, 'val');
  ensureNum(req.iop_right, 'ipr');
  ensureNum(req.iop_left, 'ipl');
  ensureStr(req.anterior_segment, 'as');
  ensureStr(req.posterior_segment, 'ps');
  ensureStr(req.impression, 'imp');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { vision_screening, refraction, iop_check, dilate_exam, routine_exam }; }
module.exports = { funcs, ValidationError };