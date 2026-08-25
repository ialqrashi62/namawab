// filepath: tier108_imaging_quality_570_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function accreditation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.accreditation_id, 'aid');
  ensureEnum(req.agency, 'ag', ['acr','jcaho','iac','other','unknown']);
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','pet','mammography','nuclear','other','unknown']);
  ensureEnum(req.status, 'st', ['accredited','pending','denied','conditional','expired','other','unknown']);
  ensureStr(req.next_renewal, 'nr');
  ensureNum(req.deficiencies, 'def');
  ensureStr(req.provider, 'pr');
  return { aid: req.accreditation_id };
}
function dose_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dose_id, 'did');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','pet','mammography','fluoro','other','unknown']);
  ensureEnum(req.dose_metric, 'dm', ['ctdi','dlp','dose_length_product','entrance_dose','effective_dose','other','unknown']);
  ensureNum(req.threshold, 'th');
  ensureNum(req.current_dose, 'cd');
  ensureEnum(req.dose_trend, 'dt', ['increasing','stable','decreasing','other','unknown']);
  ensureBool(req.alert_triggered, 'at');
  ensureStr(req.provider, 'pr');
  return { did: req.dose_id };
}
function image_quality(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.quality_id, 'qid');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.image_quality_score, 'iqs');
  ensureEnum(req.motion_artifact, 'ma', ['none','minimal','moderate','severe','uninterpretable','other','unknown']);
  ensureEnum(req.contrast_timing, 'ct', ['optimal','suboptimal','poor','other','unknown','none']);
  ensureEnum(req.interpretation_quality, 'iq', ['excellent','good','adequate','limited','poor','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { qid: req.quality_id };
}
function report_turnaround(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.turnaround_id, 'tid');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','pet','mammography','other','unknown']);
  ensureNum(req.target_turnaround, 'tt');
  ensureNum(req.actual_turnaround, 'at');
  ensureEnum(req.priority, 'pr', ['stat','urgent','routine','other','unknown']);
  ensureEnum(req.status, 'st', ['pending','in_progress','completed','delayed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.turnaround_id };
}
function peer_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.peer_review_id, 'pid');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.reviewer, 'rev');
  ensureStr(req.original_interpretation, 'oi');
  ensureEnum(req.review_finding, 'rf', ['agree','minor_discrepancy','major_discrepancy','disagree','other','unknown']);
  ensureNum(req.discrepancy_score, 'ds');
  ensureNum(req.learning_points, 'lp');
  ensureStr(req.provider, 'pr');
  return { pid: req.peer_review_id };
}

function funcs() { return { accreditation, dose_monitoring, image_quality, report_turnaround, peer_review }; }
module.exports = { funcs, ValidationError };