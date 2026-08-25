// filepath: tier60_ai_brain_ext_334_ai_diag_img_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function radiology_ai_assist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.modality, 'mod', ['chest_xray','ct','mri','ultrasound','mammography','pet_ct']);
  ensureStr(req.finding, 'find');
  ensureNum(req.ai_confidence, 'conf');
  ensureBool(req.radiologist_agreement, 'ra');
  ensureStr(req.follow_up, 'fu');
  return { modality: req.modality };
}
function pathology_ai_assist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen, 'spec');
  ensureStr(req.ai_findings, 'find');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.confidence, 'conf');
  ensureBool(req.pathologist_reviewed, 'pr');
  return { diagnosis: req.diagnosis };
}
function dermatology_ai_assist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.lesion_type, 'lt', ['melanocytic','basal_cell','squamous','seborrheic_keratosis','dermatofibroma','unknown']);
  ensureStr(req.ai_classification, 'class');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.confidence, 'conf');
  ensureEnum(req.image_quality, 'iq', ['excellent','good','fair','poor','unreadable']);
  return { classification: req.ai_classification };
}
function ecg_ai_assist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rhythm, 'rh');
  ensureNum(req.rate, 'rate');
  ensureStr(req.abnormalities, 'abn');
  ensureNum(req.ai_confidence, 'conf');
  ensureBool(req.cardiologist_reviewed, 'cr');
  ensureBool(req.urgent_action, 'ua');
  return { rhythm: req.rhythm };
}
function retinal_ai_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.eye, 'eye', ['left','right','both']);
  ensureStr(req.ai_findings, 'find');
  ensureStr(req.severity, 'sev');
  ensureStr(req.referral, 'ref');
  ensureNum(req.follow_up_months, 'fum');
  return { eye: req.eye };
}

function funcs() { return { radiology_ai_assist, pathology_ai_assist, dermatology_ai_assist, ecg_ai_assist, retinal_ai_screening }; }
module.exports = { funcs, ValidationError };