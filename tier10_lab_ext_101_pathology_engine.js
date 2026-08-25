// filepath: tier10_lab_ext_101_pathology_engine.js
// TIER10_LAB_EXT-101: Anatomic pathology (specimen, grossing, microscopic, IHC, frozen section)
'use strict';

const CITATIONS = ['CAP_CHECKLIST_2024','WHO_PATH_TUMOR_5TH','RCPath_UK_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function patho_specimen_accession(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.specimen_type, 'specimen_type', ['biopsy_excisional','biopsy_incisional','biopsy_core_needle','biopsy_punch','surgical_resection','cytology_fna','cytology_pap','body_fluid','bone_marrow','autopsy','organ','tissue_block','unstained_slide']);
  ensureEnum(req.fixative, 'fixative', ['formalin_10','formalin_4','bouin','zenker','glutaraldehyde','alcohol','rna_later','cytolyte','none','other']);
  ensureBool(req.chain_of_custody, 'chain_of_custody');
  ensureBool(req.clinical_history_attached, 'clinical_history_attached');

  let readiness;
  if (!req.clinical_history_attached) readiness = 'clinical_history_missing_blocking';
  else if (!req.chain_of_custody) readiness = 'chain_of_custody_incomplete_blocking';
  else if (req.fixative === 'none' && req.specimen_type.includes('biopsy')) readiness = 'fixative_required_for_biopsy';
  else readiness = 'accessioned_for_processing';

  return { readiness, specimen: req.specimen_type, fixative: req.fixative };
}

function patho_grossing(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.grossing_quality, 'grossing_quality', ['optimal','acceptable','suboptimal','inadequate','rejected']);
  ensureNumber(req.blocks_count, 'blocks_count');
  ensureNumber(req.cassettes_count, 'cassettes_count');
  ensureNumber(req.total_dimension_cm, 'total_dimension_cm');
  ensureBool(req.margin_inked, 'margin_inked');

  let adequacy;
  if (req.grossing_quality === 'rejected') adequacy = 'specimen_rejected_re_request';
  else if (!req.margin_inked && req.specimen_type?.includes('resection')) adequacy = 'margin_inking_required_for_resection';
  else if (req.blocks_count < 1) adequacy = 'no_blocks_taken_insufficient';
  else if (req.total_dimension_cm > 25) adequacy = 'large_specimen_serialize_fully';
  else adequacy = 'grossed_adequately';
  return { adequacy, blocks: req.blocks_count, quality: req.grossing_quality };
}

function patho_microscopic(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.diagnosis_category, 'diagnosis_category', ['benign_non_neoplastic','benign_neoplastic','atypia_uncertain','in_situ','malignant_in_situ','invasive_malignant','metastatic','non_diagnostic','defer_to_expert','re_review_requested']);
  ensureEnum(req.margins, 'margins', ['clear_optimal','close_1mm_to_5mm','close_less_than_1mm','involved','not_assessable','not_applicable']);
  ensureNumber(req.lymph_nodes_examined, 'lymph_nodes_examined');
  ensureNumber(req.lymph_nodes_positive, 'lymph_nodes_positive');

  let stage_hint;
  if (req.lymph_nodes_examined >= 12) stage_hint = 'adequate_lymph_node_sampling_for_staging';
  else if (req.lymph_nodes_examined >= 1) stage_hint = 'limited_lymph_node_sampling_re_review';
  else stage_hint = 'no_lymph_nodes_submit_additional';

  return { stage_hint, diagnosis: req.diagnosis_category, margins: req.margins };
}

function patho_ihc(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.marker_count, 'marker_count');
  ensureEnum(req.marker_panel, 'marker_panel', ['breast_panel','lung_panel','gi_panel','gyn_panel','lymphoma_panel','melanoma_panel','soft_tissue_panel','neuro_panel','thyroid_panel','prostate_panel','kidney_panel','liver_panel']);
  ensureNumber(req.positive_marker_count, 'positive_marker_count');
  ensureBool(req.has_controls, 'has_controls');
  ensureBool(req.has_interpretation, 'has_interpretation');

  let ihc_status;
  if (!req.has_controls) ihc_status = 'controls_missing_or_invalid_blocking';
  else if (!req.has_interpretation) ihc_status = 'interpretation_required';
  else if (req.positive_marker_count >= 1) ihc_status = 'positive_findings_review_dx';
  else ihc_status = 'negative_findings_review_dx';
  return { ihc_status, panel: req.marker_panel, positive: req.positive_marker_count };
}

function patho_frozen_section(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.frozen_purpose, 'frozen_purpose', ['intraoperative_margin','diagnostic','lymph_node_status','tissue_adequacy','research','not_performed']);
  ensureNumber(req.turnaround_minutes, 'turnaround_minutes');
  ensureEnum(req.agreement_with_final, 'agreement_with_final', ['concordant','discordant','pending','deferred']);
  ensureBool(req.amended_final_required, 'amended_final_required');

  let fs_status;
  if (req.turnaround_minutes > 30 && req.frozen_purpose === 'intraoperative_margin') fs_status = 'exceeds_target_30min_review_workflow';
  else if (req.amended_final_required) fs_status = 'amended_report_required_priority';
  else if (req.agreement_with_final === 'discordant') fs_status = 'discordant_investigate_root_cause';
  else fs_status = 'frozen_section_complete';
  return { fs_status, turnaround: req.turnaround_minutes };
}

function funcs() { return { patho_specimen_accession, patho_grossing, patho_microscopic, patho_ihc, patho_frozen_section }; }
module.exports = { funcs, CITATIONS, ValidationError };