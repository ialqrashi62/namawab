// filepath: tier47_radiology_ext_268_rad_body_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_chest(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.findings, 'find');
  ensureNum(req.birads, 'bir');
  ensureNum(req.follow_up, 'fu');
  return { birads: req.birads, follow_up: req.follow_up };
}
function mri_abdomen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.findings, 'find');
  ensureStr(req.li_rads, 'lir');
  ensureNum(req.follow_up, 'fu');
  return { li_rads: req.li_rads };
}
function ct_abdomen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.findings, 'find');
  ensureStr(req.radiation_dose, 'rd');
  ensureStr(req.outcome, 'out');
  return { outcome: req.outcome };
}
function us_abdomen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureNum(req.gallbladder_wall_mm, 'gw');
  ensureNum(req.common_duct_mm, 'cd');
  ensureEnum(req.follow_up, 'fu', ['none_needed','6_weeks','3_months','6_months','surgical_referral']);
  return { gallbladder_wall: req.gallbladder_wall_mm };
}
function us_pelvis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureBool(req.free_fluid, 'ff');
  ensureEnum(req.follow_up, 'fu', ['none','gyn_referral','surgical_referral','repeat_in_6_weeks']);
  return { findings: req.findings };
}

function funcs() { return { ct_chest, mri_abdomen, ct_abdomen, us_abdomen, us_pelvis }; }
module.exports = { funcs, ValidationError };