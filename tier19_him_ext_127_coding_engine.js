// filepath: tier19_him_ext_127_coding_engine.js
// TIER19_HIM_EXT-127: ICD-10/CPT coding, DRG, HCC
'use strict';

const CITATIONS = ['ICD10_CM_2024','ICD10_PCS_2024','CPT_2024','HCC_RISK_2024','MS_DRG_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function code_icd10cm(req) {
  ensureStr(req.code, 'code');
  ensureStr(req.description, 'description');
  ensureEnum(req.code_type, 'code_type', ['icd10cm','icd10pcs','cpt','hcpcs','snomed','loinc','rxnorm','ndc','other']);
  ensureEnum(req.coding_context, 'coding_context', ['inpatient_primary','inpatient_secondary','outpatient_primary','outpatient_secondary','ed','other']);
  ensureBool(req.specificity_check, 'specificity_check');
  ensureBool(req.is_secondary, 'is_secondary');
  ensureEnum(req.exclude_flag, 'exclude_flag', ['none','excludes1','excludes2','includes','other']);

  let status;
  if (req.code.length < 3 || req.code.length > 7) status = 'invalid_code_length_3_to_7';
  else if (req.exclude_flag === 'excludes1') status = 'excludes1_both_codes_cannot_be_billed';
  else if (!req.specificity_check) status = 'code_specificity_check_required';
  else if (req.is_secondary && req.coding_context === 'inpatient_primary') status = 'secondary_cannot_be_primary_context';
  else status = 'code_validated';
  return { status, code: req.code };
}

function code_cpt(req) {
  ensureStr(req.cpt_code, 'cpt_code');
  ensureStr(req.description, 'description');
  ensureEnum(req.cpt_category, 'cpt_category', ['category_i','category_ii','category_iii','unlisted','add_on','modifier','hcpcs','other']);
  ensureNumber(req.units, 'units');
  ensureNumber(req.modifier_count, 'modifier_count');
  ensureBool(req.medical_necessity_documented, 'medical_necessity');
  ensureEnum(req.modifier_22, 'modifier_22', ['none','22_increased','23_unusual','25_separate_e_m','50_bilateral','51_multiple','59_distinct','62_two_surgeons','other']);

  let status;
  if (req.units < 1) status = 'units_required_min_1';
  else if (req.cpt_category === 'add_on' && req.units === 0) status = 'add_on_must_be_0_or_1_units';
  else if (!req.medical_necessity_documented) status = 'medical_necessity_required_for_billing';
  else if (req.modifier_count > 4) status = 'over_4_modifiers_unusual_review';
  else status = 'cpt_validated';
  return { status, cpt: req.cpt_code };
}

function code_drg(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureEnum(req.drg_class, 'drg_class', ['medical','surgical','cardiac','neuro','vascular','trauma','burns','pediatric','neonate','other']);
  ensureNumber(req.drg_weight, 'drg_weight');
  ensureNumber(req.gmlos, 'gmlos');
  ensureNumber(req.actual_los, 'actual_los');
  ensureBool(req.complication_or_comorbidity, 'cc');
  ensureBool(req.major_cc, 'major_cc');
  ensureBool(req.primary_procedure, 'primary_procedure');

  let status;
  if (req.major_cc && req.cc) status = 'mcc_overrides_cc';
  else if (req.actual_los > req.gmlos * 2) status = 'over_gmlos_2x_outlier_review';
  else if (req.actual_los > req.gmlos * 1.5) status = 'over_gmlos_1.5x_review';
  else if (req.drg_weight < 0.5) status = 'low_drg_weight_review_medical';
  else status = 'drg_assigned';
  return { status, weight: req.drg_weight };
}

function code_hcc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.hcc_category, 'hcc_category', ['cancer_active','cancer_in_remission','diabetes_uncomplicated','diabetes_complicated','copd','heart_failure','ckd_stage_4_5','morbid_obesity','substance_use_disorder','psychiatric_severe','other']);
  ensureNumber(req.risk_score, 'risk_score');
  ensureBool(req.documented_current_year, 'current_year_doc');
  ensureBool(req.suspected_hcc, 'suspected_hcc');

  let status;
  if (req.risk_score >= 3.0) status = 'high_risk_hcc_recapture_review';
  else if (req.suspected_hcc && !req.documented_current_year) status = 'suspected_hcc_must_be_documented';
  else if (req.hcc_category === 'cancer_in_remission') status = 'cancer_in_remission_not_hcc_but_review';
  else status = 'hcc_documented';
  return { status, score: req.risk_score };
}

function code_query(req) {
  ensureStr(req.query_id, 'query_id');
  ensureEnum(req.query_type, 'query_type', ['principal_dx','secondary_dx','procedure','poa_clarification','specify_dx','laterality','severity','other']);
  ensureEnum(req.query_status, 'query_status', ['open','sent_to_provider','provider_responded','pending_review','closed_agreed','closed_disagreed','escalated','other']);
  ensureNumber(req.days_open, 'days_open');
  ensureBool(req.provider_response_required, 'response_required');
  ensureBool(req.clinical_evidence_attached, 'evidence_attached');

  let status;
  if (req.days_open > 30 && req.query_status === 'open') status = 'open_over_30_days_review';
  else if (req.provider_response_required && req.query_status === 'sent_to_provider' && req.days_open > 14) status = 'sent_over_14d_follow_up';
  else if (req.query_status === 'escalated') status = 'escalated_to_medical_director';
  else if (!req.clinical_evidence_attached) status = 'evidence_required_for_query';
  else status = 'query_documented';
  return { status, days: req.days_open };
}

function funcs() { return { code_icd10cm, code_cpt, code_drg, code_hcc, code_query }; }
module.exports = { funcs, CITATIONS, ValidationError };