// filepath: tier11_rad_ext_103_ai_imaging_engine.js
// TIER11_RAD_EXT-103: AI radiology (triage, detection, segmentation, quantification, worklist)
'use strict';

const CITATIONS = ['ACR_AI_2024','FDA_AIRADS_2024','RSNA_AI_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ai_triage(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.modality, 'modality', ['ct_head','ct_chest','ct_abdomen','mri_brain','mri_spine','mri_liver','cxr','mammogram','ct_pulmonary_angio','ct_aorta','mri_prostate','ct_angiography_coronary','ct_lung_screening','other']);
  ensureNumber(req.ai_score, 'ai_score');
  ensureEnum(req.ai_priority, 'ai_priority', ['critical','urgent','semi_urgent','routine','no_action','low']);
  ensureBool(req.human_review_required, 'human_review_required');

  let triage_status;
  if (req.ai_priority === 'critical' && !req.human_review_required) triage_status = 'critical_ai_finding_human_review_mandatory';
  else if (req.ai_priority === 'critical') triage_status = 'critical_expedite_report_within_1h';
  else if (req.ai_priority === 'urgent') triage_status = 'urgent_within_4h';
  else if (req.ai_priority === 'semi_urgent') triage_status = 'semi_urgent_within_24h';
  else if (req.ai_priority === 'routine') triage_status = 'routine_worklist';
  else triage_status = 'no_action_required';
  return { triage_status, ai_priority: req.ai_priority, score: req.ai_score };
}

function ai_detection(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.finding_type, 'finding_type', ['lung_nodule','breast_calcification','breast_mass','brain_hemorrhage','brain_mca_infarct','rib_fracture','spine_fracture','liver_lesion','kidney_lesion','pancreas_lesion','prostate_lesion','aortic_dissection','pulmonary_embolism','coronary_stenosis','lung_consolidation','pneumothorax','pleural_effusion','cardiac_effusion','bone_metastasis','other']);
  ensureNumber(req.confidence, 'confidence');
  ensureEnum(req.category, 'category', ['definitely_benign','probably_benign','indeterminate','probably_malignant','definitely_malignant','artifact','motion_degraded','not_applicable','other']);
  ensureBool(req.ground_truth_label_available, 'ground_truth_label_available');

  let detection_status;
  if (req.confidence < 50 && req.ground_truth_label_available) detection_status = 'low_confidence_send_for_label';
  else if (req.category === 'definitely_benign') detection_status = 'benign_no_further_workup';
  else if (req.category === 'definitely_malignant') detection_status = 'malignant_oncology_referral';
  else if (req.category === 'probably_malignant') detection_status = 'suspicious_short_term_followup';
  else if (req.category === 'indeterminate') detection_status = 'indeterminate_additional_imaging_or_biopsy';
  else detection_status = 'review_required';
  return { detection_status, finding: req.finding_type, category: req.category };
}

function ai_segmentation(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.target, 'target', ['liver','lung','kidney','tumor_generic','cardiac_lv','cardiac_rv','myocardium','pancreas','brain_tumor','brain_hematoma','prostate','breast','thyroid','aorta','pulmonary_artery','coronary_tree','bone','soft_tissue','other']);
  ensureNumber(req.volume_ml, 'volume_ml');
  ensureNumber(req.confidence, 'confidence');
  ensureEnum(req.quality, 'quality', ['excellent','good','acceptable','poor_unusable','needs_rescan']);

  let seg_status;
  if (req.quality === 'poor_unusable') seg_status = 'unusable_rescan_or_redo_manual';
  else if (req.target === 'tumor_generic' && req.confidence < 70) seg_status = 'low_confidence_manual_overlay_required';
  else if (req.target === 'cardiac_lv' || req.target === 'cardiac_rv') seg_status = 'cardiac_segmentation_ejection_fraction_calc';
  else if (req.target.includes('aorta') || req.target.includes('coronary')) seg_status = 'vascular_segmentation_review_diameter';
  else seg_status = 'segmentation_accepted_for_quantification';
  return { seg_status, target: req.target, volume: req.volume_ml };
}

function ai_quantification(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.measure, 'measure', ['lvr_lung_volume_ratio','coronary_ffa','ef_ejection_fraction','wall_thickness','tumor_volume','lymph_node_volume','plaque_volume','bone_density_hu','fat_fraction_liver','liver_stiffness','brain_volume','perfusion_map','adc_value','other']);
  ensureNumber(req.value, 'value');
  ensureEnum(req.units, 'units', ['percent','ml','mm','hu','ms','cm_s','mmol_l','mg_dl','iu_l','index','score','other']);
  ensureBool(req.reproducible_within_threshold, 'reproducible_within_threshold');

  let quant_status;
  if (req.measure === 'ef_ejection_fraction' && (req.value < 30 || req.value > 75)) quant_status = 'abnormal_ef_review_with_cardiologist';
  else if (req.measure === 'lvr_lung_volume_ratio' && req.value < 80) quant_status = 'emphysema_index_elevated_pft_correlate';
  else if (!req.reproducible_within_threshold) quant_status = 'reproducibility_review_manual';
  else quant_status = 'quantification_accepted';
  return { quant_status, measure: req.measure, value: req.value };
}

function ai_worklist(req) {
  ensureStr(req.worklist_id, 'worklist_id');
  ensureNumber(req.pending_studies, 'pending_studies');
  ensureNumber(req.ai_flagged_critical, 'ai_flagged_critical');
  ensureNumber(req.studies_per_radiologist_per_day, 'studies_per_radiologist_per_day');
  ensureNumber(req.turnaround_target_minutes, 'turnaround_target_minutes');
  ensureNumber(req.actual_turnaround_minutes, 'actual_turnaround_minutes');

  const load_ratio = req.ai_flagged_critical / req.pending_studies;
  const turnaround_ratio = req.actual_turnaround_minutes / req.turnaround_target_minutes;
  let worklist_status;
  if (turnaround_ratio >= 2) worklist_status = 'turnaround_critical_additional_radiologists';
  else if (load_ratio >= 0.1 && turnaround_ratio >= 1.5) worklist_status = 'critical_load_high_review_capacity';
  else if (turnaround_ratio >= 1.2) worklist_status = 'turnaround_above_target_optimize_workflow';
  else worklist_status = 'worklist_within_target';
  return { worklist_status, load_pct: Math.round(load_ratio * 1000) / 10, turnaround_ratio: Math.round(turnaround_ratio * 100) / 100 };
}

function funcs() { return { ai_triage, ai_detection, ai_segmentation, ai_quantification, ai_worklist }; }
module.exports = { funcs, CITATIONS, ValidationError };