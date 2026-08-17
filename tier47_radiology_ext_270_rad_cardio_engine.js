// filepath: tier47_radiology_ext_270_rad_cardio_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_angio_coronary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.cad_rads, 'cad');
  ensureEnum(req.plaque, 'plq', ['none','minimal','mild','moderate','severe']);
  ensureEnum(req.stenosis, 'sten', ['none','minimal','mild','moderate','severe']);
  ensureEnum(req.recommendation, 'rec', ['no_follow_up_5_years','follow_up_2_years','cath_referral','stress_test','medical_management']);
  return { cad_rads: req.cad_rads, stenosis: req.stenosis };
}
function cardiac_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.findings, 'find');
  ensureNum(req.ef_percent, 'ef');
  ensureBool(req.edema_present, 'ed');
  ensureEnum(req.recommendation, 'rec', ['avoid_exercise_3_months','follow_up_3_months','follow_up_6_months','medical_therapy']);
  return { ef: req.ef_percent };
}
function echo_stress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureNum(req.resting_ef, 'ref');
  ensureNum(req.stress_ef, 'sef');
  ensureEnum(req.wall_motion, 'wm', ['normal','hypokinesis','akinesis','dyskinesis']);
  ensureEnum(req.ischemia, 'isc', ['none','present','equivocal']);
  ensureEnum(req.recommendation, 'rec', ['no_cath','cath_referral','medical_therapy','repeat_test']);
  return { ischemia: req.ischemia };
}
function mri_perfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.rest_perfusion, 'rp', ['normal','defect','equivocal']);
  ensureEnum(req.stress_perfusion, 'sp', ['normal','defect_anterior','defect_inferior','defect_lateral','defect_septal']);
  ensureEnum(req.ischemia, 'isc', ['none','present','equivocal']);
  ensureEnum(req.recommendation, 'rec', ['cath_referral','medical_therapy','monitor','repeat_test']);
  return { ischemia: req.ischemia };
}
function nuclear_cardiology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.protocol, 'prot', ['spect','pet','planar','muga']);
  ensureNum(req.srs, 'srs');
  ensureBool(req.reversible_defect, 'rev');
  ensureBool(req.fixed_defect, 'fix');
  ensureEnum(req.recommendation, 'rec', ['low_risk','moderate_risk','high_risk','cath_referral']);
  return { srs: req.srs };
}

function funcs() { return { ct_angio_coronary, cardiac_mri, echo_stress, mri_perfusion, nuclear_cardiology }; }
module.exports = { funcs, ValidationError };