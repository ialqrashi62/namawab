// filepath: tier12_emr_ext_105_cda_engine.js
// TIER12_EMR_EXT-105: CDA document generation & exchange
'use strict';

const CITATIONS = ['HL7_CDA_R2_2024','IHE_XDS_2024','ONC_CURES_CDA_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function cda_header(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.template_id, 'template_id', ['CCD','CCDA_R2','Discharge_Summary','History_Physical','Consult_Note','Operative_Note','Procedure_Note','Progress_Note','Referral_Note','Care_Plan','Transfer_Summary','Imaging_Order','Lab_Order','Immunization','Other']);
  ensureStr(req.realm, 'realm');
  ensureStr(req.confidentiality_code, 'confidentiality_code');
  ensureNumber(req.section_count, 'section_count');
  ensureEnum(req.template_id_root, 'template_id_root', ['2.16.840.1.113883.10.20.22','2.16.840.1.113883.10.20.22.1','2.16.840.1.113883.10.20.22.4','2.16.840.1.113883.10.20.22.5','2.16.840.1.113883.10.20.22.6','2.16.840.1.113883.10.20.22.7','2.16.840.1.113883.10.20.22.8','custom']);
  ensureBool(req.has_record_target, 'has_record_target');

  let header_status;
  if (!req.has_record_target) header_status = 'record_target_required_blocking';
  else if (req.template_id_root === 'custom') header_status = 'custom_template_must_be_registered';
  else if (req.confidentiality_code !== 'N' && req.confidentiality_code !== 'R' && req.confidentiality_code !== 'V') header_status = 'invalid_confidentiality_code_use_N_R_V';
  else if (req.section_count < 1) header_status = 'at_least_one_section_required';
  else header_status = 'header_valid';
  return { header_status, template: req.template_id };
}

function cda_section_build(req) {
  ensureStr(req.section_id, 'section_id');
  ensureEnum(req.section_type, 'section_type', ['reason_for_visit','history_present_illness','medications','allergies','problems','results','vital_signs','procedures','assessment','plan','immunizations','family_history','social_history','review_of systems','physical_exam','functional_status','advance_directives','encounters','medical_equipment','payers','discharge_medications','discharge_instructions','hospital_course','other']);
  ensureNumber(req.entries_count, 'entries_count');
  ensureBool(req.narrative_required, 'narrative_required');
  ensureBool(req.has_narrative, 'has_narrative');

  let section_status;
  if (req.entries_count === 0 && !req.has_narrative) section_status = 'section_requires_entries_or_narrative';
  else if (req.narrative_required && !req.has_narrative) section_status = 'narrative_required_blocking';
  else if (req.entries_count === 0 && req.has_narrative) section_status = 'narrative_only_valid';
  else section_status = 'section_valid';
  return { section_status, section_type: req.section_type };
}

function cda_validate(req) {
  ensureStr(req.document_id, 'document_id');
  ensureNumber(req.section_count, 'section_count');
  ensureNumber(req.entry_count, 'entry_count');
  ensureNumber(req.code_validation_errors, 'code_validation_errors');
  ensureNumber(req.template_validation_errors, 'template_validation_errors');
  ensureBool(req.has_realm_code, 'has_realm_code');

  let valid_status;
  const total_errors = req.code_validation_errors + req.template_validation_errors;
  if (!req.has_realm_code) valid_status = 'realm_code_required_blocking';
  else if (total_errors >= 5) valid_status = 'multiple_validation_errors_blocking';
  else if (total_errors >= 1) valid_status = 'single_validation_error_review';
  else if (req.section_count < 3) valid_status = 'minimal_ccd_review_completeness';
  else if (req.entry_count < 5) valid_status = 'minimal_entries_review_clinical_content';
  else valid_status = 'cda_valid';
  return { valid_status, total_errors };
}

function cda_share_xds(req) {
  ensureStr(req.document_id, 'document_id');
  ensureStr(req.repository_id, 'repository_id');
  ensureEnum(req.classification_code, 'classification_code', ['51852-2','51851-4','51848-0','51850-6','51844-9','51847-2','51845-6','18842-5','11485-0','34099-2','34746-0','18776-5','57016-8','other']);
  ensureNumber(req.size_kb, 'size_kb');
  ensureBool(req.has_phi_consent, 'has_phi_consent');
  ensureEnum(req.sharing_recipient, 'sharing_recipient', ['hie','nphies','referral_provider','patient','cdac_other_facility','vendor','archive','patient_portal','research','other']);

  let xds_status;
  if (req.size_kb > 50000) xds_status = 'cda_too_large_split_or_attach_binary';
  else if (!req.has_phi_consent) xds_status = 'phi_consent_required_blocking';
  else if (req.sharing_recipient === 'patient' && req.classification_code === '18842-5') xds_status = 'patient_sharing_review_restricted_class';
  else xds_status = 'xds_submit_eligible';
  return { xds_status, repository: req.repository_id };
}

function cda_parse_incoming(req) {
  ensureStr(req.raw_xml_id, 'raw_xml_id');
  ensureEnum(req.source_format, 'source_format', ['ccd_2_1','ccd_3','ccda_r2_1','ccda_r2_2','cda_custom','hl7v3_cda','unknown']);
  ensureNumber(req.section_count_detected, 'section_count_detected');
  ensureNumber(req.entry_count_detected, 'entry_count_detected');
  ensureNumber(req.parse_errors, 'parse_errors');
  ensureBool(req.template_id_recognized, 'template_id_recognized');

  let parse_status;
  if (req.source_format === 'unknown') parse_status = 'unknown_format_manual_review';
  else if (req.parse_errors > 0) parse_status = 'parse_errors_'+req.parse_errors+'_review_xml';
  else if (!req.template_id_recognized) parse_status = 'template_not_recognized_using_generic';
  else parse_status = 'cda_parsed_and_mapped';
  return { parse_status, section_count: req.section_count_detected, entry_count: req.entry_count_detected };
}

function funcs() { return { cda_header, cda_section_build, cda_validate, cda_share_xds, cda_parse_incoming }; }
module.exports = { funcs, CITATIONS, ValidationError };