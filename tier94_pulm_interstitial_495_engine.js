// filepath: tier94_pulm_interstitial_495_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ild_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.ild_pattern, 'ip', ['usual_interstitial_pneumonia','nonspecific_interstitial_pneumonia','desquamative_interstitial_pneumonia','acute_interstitial_pneumonia','lymphocytic_interstitial_pneumonia','organizing_pneumonia','other','unknown']);
  ensureStr(req.hrct_findings, 'hrct');
  ensureBool(req.biopsy_done, 'bd');
  ensureNum(req.crp, 'crp');
  ensureNum(req.esr, 'esr');
  ensureBool(req.oxygen_required, 'or');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ipf_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.fvc_pred, 'fvc');
  ensureNum(req.dlco_pred, 'dlco');
  ensureEnum(req.progression, 'prog', ['slow','moderate','rapid','stable','other','unknown']);
  ensureNum(req.fvc_decline_pct, 'fvd');
  ensureBool(req.honeycombing, 'hon');
  ensureBool(req.tractions_bronchiectasis, 'tb');
  ensureBool(req.antifibrotic, 'af');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function sarcoidosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.scadding_stage, 'ss');
  ensureNum(req.serum_ace, 'ace');
  ensureNum(req.calcium, 'ca');
  ensureBool(req.vdrt_negative, 'vn');
  ensureBool(req.cd4_ratio_normal, 'crn');
  ensureBool(req.lymphocytosis_broncho, 'lbr');
  ensureNum(req.extrathoracic_involvement, 'ei');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hypersensitivity_pneumonitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.antigen_exposure, 'ax');
  ensureBool(req.exposure_history, 'eh');
  ensureBool(req.lymphocytosis, 'ly');
  ensureBool(req.centrilobular_nodules, 'cln');
  ensureBool(req.ground_glass, 'gg');
  ensureNum(req.serum_igg, 'sig');
  ensureBool(req.antigen_avoidance, 'aa');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function connective_tissue_ild(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.ctd_type, 'ct', ['ssc','sle','ra','sjogren','dm_pmy','mixed','other','unknown','none']);
  ensureNum(req.fvc_pred, 'fvc');
  ensureNum(req.dlco_pred, 'dlco');
  ensureBool(req.anti_scl70, 's70');
  ensureBool(req.ground_glass, 'gg');
  ensureBool(req.fibrosis_present, 'fp');
  ensureBool(req.immunosuppression, 'is');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { ild_diagnosis, ipf_diagnosis, sarcoidosis, hypersensitivity_pneumonitis, connective_tissue_ild }; }
module.exports = { funcs, ValidationError };
