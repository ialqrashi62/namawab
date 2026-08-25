// filepath: tier31_nephrology_ext_190_transplant_immuno_engine.js
// TIER31_NEPHROLOGY-190: Transplant immunology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function crossmatch_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.donor_id, 'donor_id');
  ensureEnum(req.crossmatch, 'xm', ['negative','positive','equivocal']);
  ensureEnum(req.virtual_crossmatch, 'vxm', ['negative','positive','equivocal']);
  ensureEnum(req.flow, 'flow', ['negative','positive','equivocal']);
  ensureEnum(req.cdc, 'cdc', ['negative','positive','equivocal']);
  let status;
  if (req.crossmatch === 'positive') status = 'positive_crossmatch_no_transplant_consider_treatment';
  else if (req.virtual_crossmatch === 'positive') status = 'positive_vxm_review_unacceptable_antigen';
  else if (req.crossmatch === 'equivocal') status = 'equivocal_xm_review_sensitization';
  else status = 'crossmatch_compatible_proceed_transplant';
  return { status, xm: req.crossmatch };
}

function donor_specific_ab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.dsa_present, 'dsa');
  ensureNumber(req.mfi, 'mfi');
  ensureEnum(req.antibody_class, 'ab_class', ['class_i','class_ii','both','other']);
  ensureEnum(req.monitoring, 'mon', ['monthly','3_month','6_month','annual','none']);
  ensureEnum(req.treatment, 'treatment', ['observation','rituximab_review','plasmapheresis','bortezomib','ivig','combination','other']);
  let status;
  if (req.dsa_present && req.mfi >= 5000) status = 'high_mfi_dsa_pre_transplant_treatment';
  else if (req.dsa_present && req.mfi >= 1000 && req.treatment === 'observation') status = 'low_mfi_dsa_monitor_review';
  else if (req.dsa_present && req.mfi < 1000) status = 'low_mfi_dsa_monitor';
  else if (!req.dsa_present) status = 'no_dsa_current';
  else status = 'dsa_appropriate_management';
  return { status, mfi: req.mfi };
}

function immunosuppression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.regimen, 'reg', ['tacrolimus_mmf_prednisone','cyclosporine_mmf_prednisone','tacrolimus_everolimus','belatacept_mmf_prednisone','other']);
  ensureNumber(req.tacrolimus_trough, 'tacro');
  ensureNumber(req.mmf_dose, 'mmf');
  ensureNumber(req.pred_dose, 'pred');
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor']);
  let status;
  if (req.adherence === 'poor') status = 'adherence_poor_intervention_review_graft_loss_risk';
  else if (req.tacrolimus_trough > 12) status = 'tacrolimus_high_toxicity_review';
  else if (req.tacrolimus_trough < 5) status = 'tacrolimus_low_under_immunosuppression';
  else if (req.adherence === 'excellent' && req.tacrolimus_trough >= 5 && req.tacrolimus_trough <= 10) status = 'immunosuppression_appropriate';
  else status = 'immunosuppression_review_dose';
  return { status, t: req.tacrolimus_trough };
}

function rejection_surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.creatinine_baseline, 'cr_base');
  ensureNumber(req.creatinine_current, 'cr_curr');
  ensureBool(req.biopsy_indicated, 'bx_ind');
  ensureEnum(req.biopsy_result, 'bx_res', ['normal','borderline','acute_t_cell_mediated_grade_1a','acute_t_cell_mediated_grade_1b','acute_t_cell_mediated_grade_2a','acute_t_cell_mediated_grade_2b','acute_t_cell_mediated_grade_3','acute_ab_med_grade_1','acute_ab_med_grade_2','acute_ab_med_grade_3','chronic_active','chronic_inactive','other','not_done']);
  ensureEnum(req.treatment, 'treatment', ['observation','steroid_pulse','thymoglobulin','rituximab','plasmapheresis_ivig','combination','other']);
  let status;
  if (req.biopsy_result === 'acute_ab_med_grade_3') status = 'severe_ab_med_rejection_aggressive_treatment';
  else if (req.creatinine_current > req.creatinine_baseline * 2) status = 'significant_creatinine_rise_urgent_workup';
  else if (req.creatinine_current > req.creatinine_baseline * 1.3) status = 'creatinine_rise_review_dsa_biopsy';
  else if (req.biopsy_result === 'normal' || req.biopsy_result === 'borderline') status = 'no_significant_rejection';
  else status = 'rejection_appropriate_management';
  return { status, cr_rise: req.creatinine_current - req.creatinine_baseline };
}

function graft_loss(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.graft_function, 'gf', ['stable','declining','failed','unknown']);
  ensureNumber(req.egfr_current, 'egfr');
  ensureBool(req.return_dialysis, 'dialysis');
  ensureEnum(req.cause, 'cause', ['rejection_chronic','rejection_acute','non_adherence','recurrent_disease','surgical_complication','infection','cardiovascular','unknown','other']);
  ensureNumber(req.time_to_loss_years, 'years');
  let status;
  if (req.graft_function === 'failed' && req.return_dialysis) status = 'graft_loss_return_dialysis_initiated';
  else if (req.cause === 'non_adherence') status = 'graft_loss_non_adherence_psych_review';
  else if (req.graft_function === 'declining' && req.egfr_current < 20) status = 'declining_graft_prepare_dialysis';
  else if (req.graft_function === 'stable') status = 'graft_function_stable';
  else status = 'graft_loss_review_appropriate';
  return { status, egfr: req.egfr_current };
}

function funcs() { return { crossmatch_transplant, donor_specific_ab, immunosuppression, rejection_surveillance, graft_loss }; }
module.exports = { funcs, ValidationError };