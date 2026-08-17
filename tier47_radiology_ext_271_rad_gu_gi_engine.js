// filepath: tier47_radiology_ext_271_rad_gu_gi_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_urogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureBool(req.mass, 'mass');
  ensureBool(req.stones, 'stones');
  ensureNum(req.follow_up, 'fu');
  return { mass: req.mass, stones: req.stones };
}
function mri_prostate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.psa, 'psa');
  ensureStr(req.protocol, 'prot');
  ensureNum(req.pirads, 'pir');
  ensureStr(req.lesion_location, 'loc');
  ensureEnum(req.recommendation, 'rec', ['fusion_biopsy','systematic_biopsy','follow_up_6_months','follow_up_12_months','no_follow_up']);
  return { pirads: req.pirads };
}
function mri_rectum(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.t_stage, 't', ['t1','t2','t3','t4','tx']);
  ensureEnum(req.n_stage, 'n', ['n0','n1','n2','nx']);
  ensureEnum(req.mesorectal_fascia, 'mrf', ['clear','threatened','involved']);
  ensureEnum(req.neoadjuvant_chemoradiation, 'ncr', ['planned','completed','not_needed','declined']);
  return { t_stage: req.t_stage, n_stage: req.n_stage };
}
function defecography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.finding, 'find');
  ensureEnum(req.recommendation, 'rec', ['biofeedback_consider_surgery','biofeedback','surgical_referral','medical_therapy','observation']);
  ensureNum(req.follow_up, 'fu');
  return { finding: req.finding };
}
function urodynamics_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.finding, 'find');
  ensureEnum(req.recommendation, 'rec', ['anticholinergic_pt','pelvic_floor_pt','surgical_referral','pessary','observation']);
  ensureNum(req.follow_up, 'fu');
  return { finding: req.finding };
}

function funcs() { return { ct_urogram, mri_prostate, mri_rectum, defecography, urodynamics_imaging }; }
module.exports = { funcs, ValidationError };