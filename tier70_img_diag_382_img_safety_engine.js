// filepath: tier70_img_diag_382_img_safety_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function contrast_adverse_event(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureEnum(req.contrast, 'ct', ['iodinated','gadolinium','barium','sulfur_hexafluoride','perflutren','gad_based','mri_contrast','ct_contrast','none','other']);
  ensureEnum(req.reaction_type, 'rt', ['mild_rash','urticaria','angioedema','bronchospasm','anaphylaxis','hypotension','hypertension','nausea_vomiting','flushing','headache','extravasation','nephrogenic_fibrosis','other','no_reaction']);
  ensureEnum(req.severity, 'sev', ['mild','minor','moderate','severe','life_threatening','fatal','minor_intervention','no_intervention','other']);
  ensureStr(req.immediate_treatment, 'it');
  ensureEnum(req.outcome, 'out', ['resolved','resolved_with_residual','ongoing','fatal','life_threatening','hospitalization','transfer','other']);
  ensureNum(req.resolution_time_min, 'rtm');
  ensureBool(req.reported_to_pharmacovigilance, 'rp');
  ensureStr(req.reporting_provider, 'rp2');
  ensureBool(req.follow_up_required, 'fur');
  return { reaction: req.reaction_type };
}
function imaging_dose(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ctdi_vol_mgy, 'cvm');
  ensureNum(req.dose_length_product_mgycm, 'dlpm');
  ensureEnum(req.reference_level, 'rl', ['within','above','below','significantly_above','far_above','unknown','not_applicable']);
  ensureNum(req.cumulative_dose_past_yr_mgy, 'cdp');
  ensureBool(req.dose_reviewed, 'dr');
  ensureStr(req.protocol_used, 'pu');
  ensureStr(req.technologist, 'tech');
  ensureEnum(req.audit_trail, 'at', ['complete','partial','incomplete','pending','remediation','failed','other']);
  ensureBool(req.notifications_alerted, 'na');
  return { dlp: req.dose_length_product_mgycm };
}
function radiology_safety_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureBool(req.safety_checklist_completed, 'scc');
  ensureBool(req.patient_id_verified, 'piv');
  ensureBool(req.procedure_verified, 'pv');
  ensureBool(req.site_marked, 'sm');
  ensureBool(req.timeout_completed, 'tc');
  ensureBool(req.pregnancy_status_confirmed, 'psc');
  ensureStr(req.technologist, 'tech');
  ensureStr(req.supervisor, 'sup');
  ensureBool(req.audit_trail_complete, 'atc');
  return { study: req.study_id };
}
function pregnancy_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.age, 'age');
  ensureBool(req.pregnancy_test_done, 'ptd');
  ensureEnum(req.pregnancy_test_result, 'ptr', ['positive','negative','indeterminate','inconclusive','declined','unable_to_test','other']);
  ensureEnum(req.method, 'method', ['urine','serum','urine_beta','urine_beta_quant','urine_beta_high','urine_beta_super','urine_beta_unknown','urine_unknown','urine_na','urine_na_quant','urine_unknown_quant','urine_unknown_unknown']);
  ensureStr(req.date_taken, 'dt');
  ensureStr(req.ordered_by, 'ob');
  ensureStr(req.technologist, 'tech');
  ensureBool(req.documentation_complete, 'dc');
  ensureBool(req.patient_consent, 'pc');
  return { result: req.pregnancy_test_result };
}
function contrast_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.contrast_type, 'ct', ['iodinated','gadolinium','barium','sulfur_hexafluoride','perflutren','gad_based','mri_contrast','ct_contrast','none','other']);
  ensureNum(req.egfr, 'egfr');
  ensureStr(req.allergy_history, 'ah');
  ensureBool(req.recent_chemo, 'rc');
  ensureBool(req.metformin_held, 'mh');
  ensureNum(req.risk_score, 'rs');
  ensureBool(req.cleared_for_contrast, 'cfc');
  ensureStr(req.provider, 'pr');
  ensureBool(req.documentation_complete, 'dc');
  ensureBool(req.follow_up_required, 'fur');
  return { cleared: req.cleared_for_contrast };
}

function funcs() { return { contrast_adverse_event, imaging_dose, radiology_safety_check, pregnancy_check, contrast_screening }; }
module.exports = { funcs, ValidationError };