// filepath: tier12_emr_ext_102_template_engine.js
// TIER12_EMR_EXT-102: Dynamic clinical templates & smart forms
'use strict';

const CITATIONS = ['HL7_CDA_2_2024','SMART_HEALTHCARDS_2024','IHE_SDC_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function tpl_validate(req) {
  ensureStr(req.template_id, 'template_id');
  ensureEnum(req.template_type, 'template_type', ['progress_note','h_and_p','consult','procedure','operative','discharge','referral','nursing_assessment','sbar','handoff','icu_daily','ed_triage','obstetric','newborn','screening','intake','consent','other']);
  ensureNumber(req.fields_total, 'fields_total');
  ensureNumber(req.fields_required, 'fields_required');
  ensureNumber(req.fields_with_value, 'fields_with_value');
  ensureNumber(req.fields_with_data_source, 'fields_with_data_source');

  let completeness;
  const missing_required = req.fields_required - req.fields_with_value;
  const auto_populated_ratio = req.fields_total > 0 ? req.fields_with_data_source / req.fields_total : 0;
  if (missing_required > 0) completeness = 'missing_required_fields_' + missing_required;
  else if (auto_populated_ratio >= 0.7) completeness = 'highly_auto_populated';
  else if (auto_populated_ratio >= 0.4) completeness = 'partially_auto_populated';
  else completeness = 'all_required_present';
  return { completeness, auto_populated_ratio: Math.round(auto_populated_ratio * 1000) / 10 };
}

function tpl_render(req) {
  ensureStr(req.template_id, 'template_id');
  ensureEnum(req.format, 'format', ['html','pdf','cda_xml','fhir_questionnaire','json','docx','rtf']);
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.variables_available, 'variables_available');
  ensureNumber(req.variables_required, 'variables_required');
  ensureBool(req.has_signature_block, 'has_signature_block');

  let render_status;
  if (req.format === 'cda_xml' && !req.has_signature_block) render_status = 'cda_requires_signature_block';
  else if (req.variables_available < req.variables_required) render_status = 'missing_variables_' + missing_required(req);
  else if (req.format === 'fhir_questionnaire') render_status = 'fhir_questionnaire_rendered';
  else render_status = 'rendered';
  return { render_status, format: req.format };
}

function tpl_data_source(req) {
  ensureStr(req.field_id, 'field_id');
  ensureEnum(req.source_type, 'source_type', ['vital_signs','lab_results','medications','allergies','problems','immunizations','social_history','family_history','surgical_history','assessment','plan','chief_complaint','manual_entry','calculated','none','other']);
  ensureEnum(req.auto_populate_strategy, 'auto_populate_strategy', ['most_recent','24h_average','all_visits','first_visit','calculated_trend','specific_date','user_select']);
  ensureBool(req.is_clinically_validated, 'is_clinically_validated');

  let source_status;
  if (req.source_type === 'none' && req.auto_populate_strategy !== 'user_select') source_status = 'invalid_source_for_strategy';
  else if (!req.is_clinically_validated) source_status = 'requires_clinical_validation';
  else if (req.source_type === 'calculated' && req.auto_populate_strategy === 'user_select') source_status = 'calculated_field_no_user_select';
  else source_status = 'data_source_appropriate';
  return { source_status, source_type: req.source_type };
}

function tpl_version(req) {
  ensureStr(req.template_id, 'template_id');
  ensureStr(req.version, 'version');
  ensureEnum(req.status, 'status', ['draft','in_review','approved','retired','archived','in_use','deprecated']);
  ensureNumber(req.usage_count_30d, 'usage_count_30d');
  ensureBool(req.has_change_log, 'has_change_log');

  let version_status;
  if (req.status === 'draft' && req.usage_count_30d > 0) version_status = 'draft_but_in_use_review';
  else if (req.status === 'deprecated' && req.usage_count_30d > 0) version_status = 'deprecated_but_in_use_force_migrate';
  else if (!req.has_change_log && req.status === 'in_use') version_status = 'in_use_template_requires_change_log';
  else version_status = 'version_appropriate';
  return { version_status, version: req.version };
}

function tpl_share(req) {
  ensureStr(req.template_id, 'template_id');
  ensureEnum(req.share_scope, 'share_scope', ['facility_only','system_wide','cross_facility','research_consortium','public_library','vendor_partner']);
  ensureBool(req.contains_phi_logic, 'contains_phi_logic');
  ensureBool(req.governance_approved, 'governance_approved');
  ensureEnum(req.phi_scrubbing, 'phi_scrubbing', ['automatic','manual_review','not_required','pending_review','blocked']);

  let share_status;
  if (!req.governance_approved) share_status = 'governance_approval_blocking';
  else if (req.contains_phi_logic && req.phi_scrubbing === 'not_required') share_status = 'phi_review_required';
  else if (req.share_scope === 'public_library' && req.phi_scrubbing === 'pending_review') share_status = 'phi_pending_review_blocking_public';
  else if (req.share_scope === 'public_library' && req.governance_approved && req.phi_scrubbing === 'automatic') share_status = 'public_share_eligible';
  else share_status = 'share_eligible';
  return { share_status, share_scope: req.share_scope };
}

function missing_required(req) { return Math.max(0, req.variables_required - req.variables_available); }

function funcs() { return { tpl_validate, tpl_render, tpl_data_source, tpl_version, tpl_share }; }
module.exports = { funcs, CITATIONS, ValidationError };