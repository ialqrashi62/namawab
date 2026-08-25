// filepath: tier70_img_diag_379_img_interp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function radiologist_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','nuclear_med','pet_ct','fluoroscopy','mammography','angiography','dexa','interventional','other']);
  ensureStr(req.anatomical_area, 'aa');
  ensureStr(req.findings, 'find');
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.comparison_study, 'cs');
  ensureBool(req.critical_finding, 'cf');
  ensureStr(req.signed_by, 'sb');
  ensureStr(req.signed_at, 'sa');
  return { report: req.report_id };
}
function coding_radiology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.cpt_code, 'cpt');
  ensureStr(req.icd10_code, 'icd');
  if (req.modifiers !== undefined && req.modifiers !== '') ensureStr(req.modifiers, 'mod');
  ensureStr(req.coder, 'coder');
  ensureStr(req.coded_at, 'ca');
  ensureBool(req.reviewed, 'rev');
  ensureBool(req.queried_physician, 'qp');
  ensureBool(req.audit_trail_complete, 'atc');
  return { cpt: req.cpt_code };
}
function critical_finding_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.critical_finding, 'cf');
  ensureStr(req.communicated_to_provider, 'cp');
  ensureStr(req.communication_time, 'ct');
  ensureBool(req.read_back_done, 'rbd');
  ensureStr(req.provider_response, 'pr');
  ensureStr(req.follow_up_imaging, 'fui');
  ensureEnum(req.resolution, 'res', ['resolved','ongoing','pending','patient_expired','transfer','manual_followup','escalated','closed']);
  return { finding: req.critical_finding };
}
function second_opinion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.original_reader, 'or');
  ensureStr(req.second_reader, 'sr');
  ensureStr(req.original_impression, 'oi');
  ensureStr(req.second_impression, 'si');
  ensureBool(req.agreement, 'agr');
  ensureNum(req.second_read_cost, 'src');
  ensureNum(req.time_taken_days, 'ttd');
  ensureBool(req.report_combined, 'rc');
  return { second_reader: req.second_reader };
}
function ai_imaging_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.ai_model, 'aim', ['chest_xray_ai','mammo_ai','ct_lung_ai','ct_ribs_ai','brain_ai','ccta_ai','echo_ai','xray_frac_ai','stroke_ai','hemorrhage_ai','pulmonary_embolism_ai','lung_nodule_ai','other']);
  ensureStr(req.ai_finding, 'aif');
  ensureNum(req.confidence, 'conf');
  ensureEnum(req.priority_flag, 'pf', ['low','moderate','high','urgent','critical','none']);
  ensureBool(req.radiologist_reviewed, 'rred');
  ensureBool(req.radiologist_concurred, 'rcon');
  ensureStr(req.follow_up_action, 'fua');
  ensureBool(req.audit_log_complete, 'alc');
  return { ai_model: req.ai_model };
}

function funcs() { return { radiologist_report, coding_radiology, critical_finding_followup, second_opinion, ai_imaging_review }; }
module.exports = { funcs, ValidationError };