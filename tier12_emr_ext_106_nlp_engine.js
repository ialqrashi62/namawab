// filepath: tier12_emr_ext_106_nlp_engine.js
// TIER12_EMR_EXT-106: Clinical NLP extraction & clinical decision support
'use strict';

const CITATIONS = ['cTAKES_2024','AWS_COMPREHEND_MEDICAL_2024','AHIMA_NLP_2024','ONC_USCDI_NLP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function nlp_extract_terms(req) {
  ensureStr(req.text_id, 'text_id');
  ensureNumber(req.word_count, 'word_count');
  ensureNumber(req.entities_detected, 'entities_detected');
  ensureEnum(req.entity_types, 'entity_types', ['medications','diseases','symptoms','procedures','lab_values','vital_signs','anatomy','negation','temporal','uncertainty','family_history','social_history','allergies','immunizations','other']);
  ensureNumber(req.negation_count, 'negation_count');
  ensureNumber(req.uncertainty_count, 'uncertainty_count');
  ensureNumber(req.confidence_avg, 'confidence_avg');

  let extract_status;
  if (req.confidence_avg < 60) extract_status = 'low_confidence_review_human';
  else if (req.entities_detected === 0 && req.word_count > 50) extract_status = 'no_entities_detected_short_or_irrelevant_text';
  else if (req.uncertainty_count > req.entities_detected * 0.5) extract_status = 'high_uncertainty_review_context';
  else if (req.negation_count === 0 && req.entities_detected > 10) extract_status = 'no_negation_check_review_section';
  else extract_status = 'term_extraction_complete';
  return { extract_status, entities: req.entities_detected, neg: req.negation_count };
}

function nlp_cds_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.alert_type, 'alert_type', ['drug_allergy','drug_drug','drug_disease','drug_lab','drug_pregnancy','drug_age','duplicate_therapy','lab_critical','lab_trend','vital_sign_critical','guideline_recommendation','preventive_gap','none','other']);
  ensureEnum(req.severity, 'severity', ['informational','low','moderate','high','critical','contraindicated']);
  ensureNumber(req.evidence_strength, 'evidence_strength');
  ensureBool(req.action_required, 'action_required');
  ensureBool(req.suppressed_by_user, 'suppressed_by_user');

  let cds_status;
  if (req.severity === 'contraindicated') cds_status = 'contraindicated_blocking_dispense';
  else if (req.severity === 'critical') cds_status = 'critical_alert_review_immediately';
  else if (req.severity === 'high' && !req.action_required) cds_status = 'high_severity_should_require_action';
  else if (req.suppressed_by_user && req.severity === 'critical') cds_status = 'suppression_overridden_for_critical';
  else if (req.evidence_strength < 50) cds_status = 'low_evidence_show_as_optional';
  else cds_status = 'cds_alert_eligible';
  return { cds_status, alert_type: req.alert_type, severity: req.severity };
}

function nlp_disease_extract(req) {
  ensureStr(req.note_id, 'note_id');
  ensureEnum(req.disease_system, 'disease_system', ['snomed_ct','icd10','icd11','mesh','other']);
  ensureNumber(req.disease_count, 'disease_count');
  ensureNumber(req.explicitated_count, 'explicitated_count');
  ensureNumber(req.negated_count, 'negated_count');
  ensureNumber(req.family_history_count, 'family_history_count');
  ensureBool(req.problem_list_added, 'problem_list_added');

  let dx_status;
  const positive_count = req.explicitated_count - req.negated_count;
  if (req.disease_count === 0) dx_status = 'no_diseases_detected';
  else if (!req.problem_list_added && positive_count >= 1) dx_status = 'detected_but_not_added_review_problem_list';
  else if (req.disease_system === 'other') dx_status = 'use_snomed_or_icd_for_problem_list';
  else if (positive_count === 0) dx_status = 'no_positive_findings_all_negated_or_family';
  else dx_status = 'diseases_extracted_for_review';
  return { dx_status, positive_count, total: req.disease_count };
}

function nlp_med_extract(req) {
  ensureStr(req.note_id, 'note_id');
  ensureNumber(req.medication_count, 'medication_count');
  ensureNumber(req.dose_extracted_count, 'dose_extracted_count');
  ensureNumber(req.frequency_extracted_count, 'frequency_extracted_count');
  ensureNumber(req.route_extracted_count, 'route_extracted_count');
  ensureNumber(req.duration_extracted_count, 'duration_extracted_count');

  let med_status;
  const completeness = req.medication_count > 0 ? (req.dose_extracted_count + req.frequency_extracted_count + req.route_extracted_count + req.duration_extracted_count) / (req.medication_count * 4) : 0;
  if (req.medication_count === 0) med_status = 'no_medications_in_note';
  else if (completeness >= 0.9) med_status = 'medication_extraction_complete';
  else if (completeness >= 0.7) med_status = 'medication_extraction_good_review_missing';
  else if (completeness >= 0.4) med_status = 'medication_partial_review_required';
  else med_status = 'medication_extraction_poor_manual_review';
  return { med_status, completeness: Math.round(completeness * 1000) / 10 };
}

function nlp_summary_quality(req) {
  ensureStr(req.summary_id, 'summary_id');
  ensureEnum(req.summary_type, 'summary_type', ['patient_friendly','clinician_handoff','discharge','consult','referral','second_opinion','research','legal','insurance']);
  ensureNumber(req.input_words, 'input_words');
  ensureNumber(req.output_words, 'output_words');
  ensureNumber(req.facts_preserved, 'facts_preserved');
  ensureNumber(req.facts_original, 'facts_original');
  ensureEnum(req.bias_check, 'bias_check', ['none','basic','comprehensive','ml_model','deidentified','redacted','human_reviewed','other']);

  let quality_status;
  const compression_ratio = req.input_words > 0 ? req.output_words / req.input_words : 0;
  const facts_preserved_ratio = req.facts_original > 0 ? req.facts_preserved / req.facts_original : 0;
  if (req.summary_type === 'legal' && req.bias_check === 'none') quality_status = 'legal_summary_requires_bias_check';
  else if (req.summary_type === 'patient_friendly' && facts_preserved_ratio < 0.8) quality_status = 'patient_friendly_summary_dropped_facts_review';
  else if (compression_ratio < 0.05 && req.facts_original > 10) quality_status = 'over_compression_review_missing_context';
  else if (facts_preserved_ratio >= 0.95 && req.bias_check !== 'none') quality_status = 'high_quality_summary';
  else if (facts_preserved_ratio >= 0.8) quality_status = 'good_quality_summary';
  else quality_status = 'review_summary_quality';
  return { quality_status, compression: Math.round(compression_ratio * 1000) / 10, facts_ratio: Math.round(facts_preserved_ratio * 1000) / 10 };
}

function funcs() { return { nlp_extract_terms, nlp_cds_alert, nlp_disease_extract, nlp_med_extract, nlp_summary_quality }; }
module.exports = { funcs, CITATIONS, ValidationError };