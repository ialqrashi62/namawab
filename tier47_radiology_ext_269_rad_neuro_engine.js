// filepath: tier47_radiology_ext_269_rad_neuro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_head(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureBool(req.mass_effect, 'me');
  ensureBool(req.hemorrhage, 'h');
  ensureEnum(req.follow_up, 'fu', ['discharge_with_precautions','mri_recommended','admit','urgent_consult','none']);
  return { hemorrhage: req.hemorrhage, mass_effect: req.mass_effect };
}
function mri_brain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.findings, 'find');
  ensureNum(req.white_matter_lesions, 'wml');
  ensureNum(req.follow_up, 'fu');
  return { white_matter_lesions: req.white_matter_lesions };
}
function mri_spine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.level, 'lvl');
  ensureStr(req.findings, 'find');
  ensureEnum(req.disc_height, 'dh', ['preserved','mild_loss','moderate_loss','severe_loss']);
  ensureEnum(req.cord_signal, 'cs', ['normal','abnormal']);
  ensureEnum(req.recommendation, 'rec', ['conservative','epidural_injection','surgical_referral','urgent_surgical']);
  return { level: req.level, recommendation: req.recommendation };
}
function ct_angiography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureEnum(req.collaterals, 'col', ['poor','fair','good','excellent']);
  ensureEnum(req.recommendation, 'rec', ['thrombectomy_candidate','medical_management','monitor','urgent_consult']);
  ensureStr(req.complications, 'comp');
  return { recommendation: req.recommendation };
}
function mra_head(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureStr(req.variants, 'var');
  ensureEnum(req.recommendation, 'rec', ['no_follow_up_needed','follow_up_1_year','follow_up_2_years','further_workup']);
  return { findings: req.findings };
}

function funcs() { return { ct_head, mri_brain, mri_spine, ct_angiography, mra_head }; }
module.exports = { funcs, ValidationError };