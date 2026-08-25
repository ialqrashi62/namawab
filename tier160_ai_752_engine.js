// filepath: tier160_ai_752_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.trigger, 'tr', ['drug_drug','drug_allergy','drug_disease','drug_age','drug_dose','drug_route','drug_duplication','lab_abnormal','order_set','preventive','clinical_pathway','risk_score','imaging_dose','cost','NA','other']);
  ensureEnum(req.severity, 'sv', ['info','low','moderate','high','critical','NA']);
  ensureBool(req.alert_fired, 'af');
  ensureBool(req.overridden, 'ov');
  ensureEnum(req.override_reason, 'or', ['none','will_monitor','patient_choice','not_applicable','cost','benefit_outweighs','shared_decision','provider_disagrees','NA','other']);
  ensureNum(req.override_pct, 'op');
  ensureStr(req.message, 'mg');
  ensureStr(req.action, 'ac');
  ensureBool(req.fired_correctly, 'fc');
  ensureBool(req.fatigue_alert, 'fa');
  ensureStr(req.provider, 'pr');
  return { cd_id: `cds_${Date.now()}`, patient_id: req.patient_id, severity: req.severity };
}
function risk_score(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.model, 'mo', ['mortality_30d','readmission_30d','sepsis_onset','pressure_injury','falls','suicide','ckd_progression','chads_vasc','hasbled','wells_dvt','wells_pe','timi_stemi','timi_ua','nihss','apache_II','sofa','qsofa','rockall','child_pugh','meld','NA','other']);
  ensureNum(req.score_value, 'sv');
  ensureEnum(req.risk_category, 'rc', ['very_low','low','moderate','high','very_high','NA','unknown']);
  ensureNum(req.probability_pct, 'pp');
  ensureNum(req.calibration, 'ca');
  ensureNum(req.discrimination_auc, 'da');
  ensureNum(req.feature_count, 'fc');
  ensureBool(req.shapley_explainable, 'se');
  ensureBool(req.fairness_audit, 'fa');
  ensureNum(req.inference_time_ms, 'it');
  ensureStr(req.provider, 'pr');
  return { rs_id: `rsk_${Date.now()}`, patient_id: req.patient_id, score: req.score_value };
}
function chatbot(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.session_id, 'si');
  ensureNum(req.user_message, 'um');
  ensureNum(req.assistant_message, 'am');
  ensureEnum(req.intent, 'in', ['symptom_check','medication_info','appointment','lab_result','general','emotional','other','NA']);
  ensureEnum(req.sentiment, 'se', ['positive','neutral','negative','NA']);
  ensureBool(req.safety_alert, 'sa');
  ensureBool(req.handoff_human, 'hh');
  ensureNum(req.turn_count, 'tc');
  ensureNum(req.resolution_score, 'rs');
  ensureEnum(req.escalation, 'es', ['none','urgent','suicide','abuse','medical','other','NA']);
  ensureStr(req.provider, 'pr');
  return { cb_id: `chb_${Date.now()}`, patient_id: req.patient_id, intent: req.intent };
}
function imaging_ai(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.study_id, 'si');
  ensureEnum(req.modality, 'mo', ['X_ray','CT','MRI','US','mammo','PET','fundus','derm','pathology','ECG','echo','other','NA']);
  ensureEnum(req.ai_model, 'am', ['stroke_detect','PE_detect','lung_nodule','breast_cancer','diabetic_retino','fracture','pneumonia','tumor_seg','chest_xray_class','echo_seg','ECG_arrhythmia','ECG_LVH','ECG_QT','other','NA']);
  ensureNum(req.finding_count, 'fc');
  ensureNum(req.confidence_avg, 'ca');
  ensureNum(req.sensitivity_pct, 'sp');
  ensureNum(req.specificity_pct, 'ssp');
  ensureBool(req.finding_acted, 'fa');
  ensureBool(req.finding_confirmed, 'fc2');
  ensureNum(req.processing_sec, 'ps');
  ensureStr(req.provider, 'pr');
  return { im_id: `imi_${Date.now()}`, study_id: req.study_id, model: req.ai_model };
}
function genomic_ai(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.panel, 'pn', ['WES','WGS','targeted','pharmacogenomics','cancer_panel','prenatal','carrier','mtDNA','microbiome','other','NA']);
  ensureNum(req.variants_found, 'vf');
  ensureEnum(req.actionable_count, 'ac', ['0','1','2','3','4','5','6+','NA','unknown']);
  ensureEnum(req.clinvar_pathogenic, 'cp', ['0','1','2','3','4','5+','NA','unknown']);
  ensureNum(req.drug_recommendations, 'dr');
  ensureNum(req.disease_risk_pct, 'rp');
  ensureNum(req.reanalysis_days, 'rd');
  ensureBool(req.consent, 'co');
  ensureBool(req.family_cascade, 'fc');
  ensureStr(req.provider, 'pr');
  return { ga_id: `gai_${Date.now()}`, patient_id: req.patient_id, panel: req.panel };
}

function funcs() { return { cds, risk_score, chatbot, imaging_ai, genomic_ai }; }
module.exports = { funcs, ValidationError };