// filepath: tier8_rc_ext_101_coding_engine.js
// TIER8_RC_EXT-101: Medical coding (ICD-10, CPT, HCC risk adjustment)
'use strict';

const CITATIONS = [
  'WHO_ICD10_2024',
  'AMA_CPT_2024',
  'CMS_HCC_RA_2024',
];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function coding_icd10_suggest(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.clinical_text, 'clinical_text');
  ensureEnum(req.context, 'context', ['inpatient','outpatient','emergency','pren','genetic','dental','mental_health','rehab']);
  ensureBool(req.allow_unspecified, 'allow_unspecified');
  ensureNumber(req.max_codes, 'max_codes');

  let band;
  if (req.max_codes > 10) band = 'excessive_max_capped_at_10';
  else if (req.context === 'inpatient' && req.max_codes < 5) band = 'inpatient_coding_too_low_recommend_5_plus';
  else if (req.allow_unspecified && req.context === 'outpatient') band = 'unspecified_codes_reduce_re_avoid';
  else band = 'request_acceptable';

  return { suggestion_status: band, max: req.max_codes, context: req.context };
}

function coding_cpt_assign(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.service_type, 'service_type', ['office_visit','procedure','imaging','lab','consult','preventive','behavioral','ed_visit','critical_care','surgery','anesthesia','pathology','rehab','home_visit','tele_visit']);
  ensureNumber(req.complexity_minutes, 'complexity_minutes');
  ensureNumber(req.estimated_documentation, 'estimated_documentation');
  ensureEnum(req.patient_status, 'patient_status', ['new','established','consult_new','consult_established']);

  let code_range;
  if (req.service_type === 'office_visit' && req.patient_status === 'new') {
    if (req.complexity_minutes >= 60) code_range = '99205';
    else if (req.complexity_minutes >= 45) code_range = '99204';
    else if (req.complexity_minutes >= 30) code_range = '99203';
    else if (req.complexity_minutes >= 15) code_range = '99202';
    else code_range = '99201';
  } else if (req.service_type === 'office_visit' && req.patient_status === 'established') {
    if (req.complexity_minutes >= 40) code_range = '99215';
    else if (req.complexity_minutes >= 25) code_range = '99214';
    else if (req.complexity_minutes >= 15) code_range = '99213';
    else if (req.complexity_minutes >= 10) code_range = '99212';
    else code_range = '99211';
  } else if (req.service_type === 'ed_visit') {
    if (req.complexity_minutes >= 60) code_range = '99285';
    else if (req.complexity_minutes >= 40) code_range = '99284';
    else if (req.complexity_minutes >= 25) code_range = '99283';
    else code_range = '99281_99282';
  } else code_range = 'specialty_specific';

  return { cpt_range: code_range, service: req.service_type };
}

function coding_hcc_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.hcc_count, 'hcc_count');
  ensureNumber(req.hcc_weighted_score, 'hcc_weighted_score');
  ensureBool(req.medicaid_status, 'medicaid_status');
  ensureBool(req.disabled, 'disabled');
  ensureEnum(req.gender, 'gender', ['male','female','other','unknown']);

  let risk_band;
  if (req.disabled) risk_band = 'disabled_high_complex_care';
  else if (req.medicaid_status) risk_band = 'medicaid_dual_with_high_acuity';
  else if (req.hcc_weighted_score >= 3) risk_band = 'very_high_commercial_top_decile';
  else if (req.hcc_weighted_score >= 1.5) risk_band = 'high_commercial';
  else if (req.hcc_weighted_score >= 0.7) risk_band = 'moderate';
  else if (req.hcc_weighted_score >= 0.3) risk_band = 'low';
  else risk_band = 'healthy_minimal';

  return { risk_band, weighted: req.hcc_weighted_score, hcc_count: req.hcc_count };
}

function coding_drg_assign(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.primary_dx, 'primary_dx');
  ensureNumber(req.secondary_dx_count, 'secondary_dx_count');
  ensureNumber(req.procedures_count, 'procedures_count');
  ensureEnum(req.discharge_status, 'discharge_status', ['home','home_health','snf','transfer','expired','ama','rehab']);
  ensureNumber(req.los_days, 'los_days');

  let severity;
  if (req.secondary_dx_count >= 8) severity = 'MCC_plus_severe';
  else if (req.secondary_dx_count >= 4) severity = 'MCC_moderate_severe';
  else if (req.secondary_dx_count >= 2) severity = 'CC';
  else severity = 'no_CC';

  let drg_complexity;
  if (req.procedures_count >= 3) drg_complexity = 'major_procedure_high';
  else if (req.procedures_count >= 1) drg_complexity = 'procedure_medium';
  else drg_complexity = 'medical_only';

  return { severity, complexity: drg_complexity, los_days: req.los_days };
}

function coding_audit(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureNumber(req.codes_submitted, 'codes_submitted');
  ensureNumber(req.codes_supported_by_docs, 'codes_supported_by_docs');
  ensureNumber(req.codes_unsupported, 'codes_unsupported');
  ensureNumber(req.upcoding_risk_codes, 'upcoding_risk_codes');
  ensureNumber(req.undercoding_missed, 'undercoding_missed');

  const support_rate = req.codes_submitted > 0 ? req.codes_supported_by_docs / req.codes_submitted : 0;
  let summary;
  if (req.upcoding_risk_codes >= 2) summary = 'high_upcoding_risk_requires_review';
  else if (req.undercoding_missed >= 3) summary = 'significant_undercoding_re_review_documentation';
  else if (support_rate < 0.8) summary = 'documentation_gap_review_with_provider';
  else summary = 'coding_compliant';

  return { summary, support_pct: Math.round(support_rate * 1000) / 10, upcoding: req.upcoding_risk_codes };
}

function funcs() { return { coding_icd10_suggest, coding_cpt_assign, coding_hcc_risk, coding_drg_assign, coding_audit }; }
module.exports = { funcs, CITATIONS, ValidationError };