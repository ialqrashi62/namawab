// filepath: tier74_onc_ext_394_onc_ext_followup_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancer_type, 'ct');
  ensureNum(req.years_post_treatment, 'ypt');
  ensureStr(req.imaging_done, 'id');
  ensureNum(req.cea_level, 'cea');
  ensureStr(req.cea_trend, 'ct2');
  ensureStr(req.last_visit_date, 'lvd');
  ensureNum(req.next_visit, 'nv');
  ensureBool(req.surveillance_protocol_active, 'spa');
  ensureBool(req.recurrence_signs, 'rs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.follow_up_lab_due, 'fuld');
  return { cancer: req.cancer_type };
}
function recurrence_detection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancer_type, 'ct');
  ensureStr(req.concerning_symptoms, 'cs');
  ensureStr(req.imaging_ordered, 'io');
  ensureBool(req.biopsy_ordered, 'bo');
  ensureNum(req.symptom_onset_days, 'sod');
  ensureStr(req.imaging_date, 'id');
  ensureStr(req.imaging_finding, 'if');
  ensureBool(req.stage_reevaluation_needed, 'srn');
  ensureStr(req.provider, 'pr');
  ensureStr(req.next_step, 'ns');
  return { cancer: req.cancer_type };
}
function survivorship_care_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.years_survivorship, 'ys');
  ensureStr(req.late_effects_monitored, 'lem');
  ensureBool(req.screening_uptodate, 'sut');
  ensureBool(req.healthy_behaviors_counseled, 'hbc');
  ensureBool(req.psychosocial_needs_assessed, 'pna');
  ensureStr(req.care_plan_shared, 'cps');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { plan: req.plan_id };
}
function late_effects_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancer_type, 'ct');
  ensureStr(req.treatment_history, 'th');
  ensureNum(req.years_post_treatment, 'ypt');
  ensureBool(req.cardiac_function_assessed, 'cfa');
  ensureNum(req.ef_pct, 'ef');
  ensureStr(req.secondary_malignancy_screening, 'sms');
  ensureStr(req.chemo_brain_assessment, 'cba');
  ensureStr(req.fertility_status, 'fs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_screening, 'ns');
  return { cancer: req.cancer_type };
}
function palliative_care_integration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.palliative_id, 'pid');
  ensureStr(req.referral_reason, 'rr');
  ensureBool(req.consult_completed, 'cc');
  ensureBool(req.goals_of_care_documented, 'goc');
  ensureBool(req.advance_directive_signed, 'ads');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.dyspnea_score, 'ds');
  ensureBool(req.spiritual_needs_addressed, 'sna');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.integration_trajectory, 'it', ['concurrent_care','early_integration','late_integration','hospice_only','none','other']);
  return { palliative_id: req.palliative_id };
}

function funcs() { return { cancer_surveillance, recurrence_detection, survivorship_care_plan, late_effects_screening, palliative_care_integration }; }
module.exports = { funcs, ValidationError };