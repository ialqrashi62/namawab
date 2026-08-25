// filepath: tier74_onc_ext_396_onc_ext_symptom_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_pain_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pain_id, 'pid');
  ensureEnum(req.pain_type, 'pt', ['somatic','visceral','neuropathic','incident','breakthrough','incident_related','other','mixed','psychogenic']);
  ensureNum(req.severity, 'sev');
  ensureStr(req.location, 'loc');
  ensureEnum(req.nociceptive_neuropathic, 'nn', ['nociceptive','neuropathic','mixed','unknown','other']);
  ensureStr(req.current_medication, 'cm');
  ensureNum(req.breakthrough_doses, 'bd');
  ensureStr(req.side_effects, 'se');
  ensureStr(req.non_opioid_adjuvent, 'noa');
  ensureStr(req.provider, 'pr');
  ensureStr(req.functional_goal, 'fg');
  return { pain: req.pain_id };
}
function nausea_management_chemo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.regimen, 'reg');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high','minimal','unknown']);
  ensureStr(req.pre_meds, 'pm');
  ensureNum(req.breakthrough_count, 'bc');
  ensureEnum(req.current_severity, 'cs', ['none','mild','moderate','severe','none_last_24h','minimal','unknown']);
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.non_pharmacologic, 'np');
  ensureStr(req.next_chemo_date, 'ncd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.follow_up, 'fu');
  return { regimen: req.regimen };
}
function fatigue_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.fatigue_score, 'fs');
  ensureNum(req.duration_weeks, 'dw');
  ensureEnum(req.tscore_impact, 'ti', ['low','moderate','high','severe','minimal','unknown']);
  ensureNum(req.hemoglobin, 'hgb');
  ensureEnum(req.thyroid, 'thy', ['normal','hyperthyroid','hypothyroid','subclinical','elevated_tsh','unknown','other']);
  ensureEnum(req.depression_screen, 'ds', ['negative','positive','mild','moderate','severe','unknown','other']);
  ensureEnum(req.sleep_quality, 'sq', ['excellent','good','moderate','poor','very_poor','unknown','other']);
  ensureStr(req.interventions, 'int');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cancer_associated_thrombosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureStr(req.cancer_type, 'ct');
  ensureNum(req.risk_score, 'rs');
  ensureBool(req.dvt_present, 'dvt');
  ensureBool(req.pe_present, 'pe');
  ensureBool(req.anticoag_planned, 'ap');
  ensureEnum(req.anticoagulant, 'ac', ['apixaban','rivaroxaban','edoxaban','dabigatran','heparin','enoxaparin','fondaparinux','warfarin','other']);
  ensureNum(req.renal_function, 'rf');
  ensureStr(req.provider, 'pr');
  ensureNum(req.treatment_duration_min_months, 'tdm');
  ensureBool(req.recurrence_risk_stratified, 'rrs');
  ensureBool(req.education_provided, 'ed');
  return { event: req.event_id };
}
function cachexia_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.weight_loss_pct_6mo, 'wlp');
  ensureNum(req.bmi, 'bmi');
  ensureBool(req.muscle_loss_assessed, 'mla');
  ensureNum(req.appetite_score, 'as');
  ensureBool(req.metabolic_alterations, 'ma');
  ensureBool(req.anorexia_present, 'ap');
  ensureStr(req.interventions, 'int');
  ensureStr(req.provider, 'pr');
  ensureNum(req.reassessment_weeks, 'rw');
  ensureBool(req.caregiver_education, 'ce');
  ensureBool(req.nutrition_consult, 'nc');
  return { bmi: req.bmi };
}

function funcs() { return { cancer_pain_management, nausea_management_chemo, fatigue_assessment, cancer_associated_thrombosis, cachexia_assessment }; }
module.exports = { funcs, ValidationError };