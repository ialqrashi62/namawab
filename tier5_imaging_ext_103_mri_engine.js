// filepath: tier5_imaging_ext_103_mri_engine.js
// TIER5_IMAGING_EXT-103: MRI protocols (DWI, contrast, MSK, cardiac, fMRI, spectroscopy)
'use strict';

const CITATIONS = [
  'ACR_MRI_Safety_2023',
  'ASHNR_Stroke_MRI_2023',
  'ISMRM_MR_Spectroscopy_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dwi_stroke(req) {
  ensureNumber(req.last_known_well_hours, 'last_known_well_hours');
  ensureBool(req.dwi_positive, 'dwi_positive');
  ensureNumber(req.dwi_volume_ml, 'dwi_volume_ml');
  ensureBool(req.dwi_flair_mismatch, 'dwi_flair_mismatch');
  ensureNumber(req.nihss, 'nihss');

  let impression;
  if (req.dwi_positive && req.dwi_volume_ml >= 70) impression = 'large_core_then_review_thrombectomy_options';
  else if (req.dwi_flair_mismatch && req.last_known_well_hours >= 4.5 && req.last_known_well_hours <= 24) impression = 'dwi_flair_mismatch_then_consider_thrombolysis';
  else if (req.dwi_positive && req.dwi_volume_ml < 30) impression = 'small_core_then_continue_with_imaging_review';
  else if (!req.dwi_positive && req.last_known_well_hours <= 24) impression = 'continue_with_perfusion_assessment';
  else impression = 'continue_with_standard_imaging';
  return { impression };
}

function contrast_mri(req) {
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.nsf_history, 'nsf_history');
  ensureBool(req.allergy_gadolinium, 'allergy_gadolinium');
  ensureNumber(req.first_trimester_pregnancy, 'first_trimester_pregnancy');
  ensureBool(req.brain_enhanced_needed, 'brain_enhanced_needed');

  let protocol;
  if (req.nsf_history) protocol = 'avoid_group_ii_gadolinium_then_consider_alternative';
  else if (req.egfr < 30) protocol = 'consider_macrocyclic_then_review_renal_function';
  else if (req.allergy_gadolinium) protocol = 'premedicate_then_continue_with_contrast';
  else if (req.first_trimester_pregnancy === 1) protocol = 'defer_contrast_then_continue_with_non_contrast';
  else if (req.brain_enhanced_needed) protocol = 'continue_with_standard_contrast_protocol';
  else protocol = 'continue_with_non_contrast';
  return { protocol };
}

function msk_mri(req) {
  ensureStr(req.joint, 'joint');
  ensureEnum(req.joint, 'joint', ['knee_internal_derangement','shoulder_rotator_cuff','ankle_ligament','hip_labrum','wrist_tfcc','spine_disc']);
  ensureNumber(req.field_strength_tesla, 'field_strength_tesla');
  ensureBool(req.prior_surgery, 'prior_surgery');
  ensureBool(req.metal_hardware_present, 'metal_hardware_present');
  ensureBool(req.contrast_needed, 'contrast_needed');

  let protocol_choice;
  if (req.metal_hardware_present) protocol_choice = 'use_metal_suppression_then_continue';
  else if (req.contrast_needed) protocol_choice = 'intra_articular_or_iv_contrast_then_continue';
  else if (req.prior_surgery) protocol_choice = 'consider_arthrogram_with_imaging_review';
  else if (req.field_strength_tesla < 1.5) protocol_choice = 'continue_with_low_field_imaging_review';
  else protocol_choice = 'continue_with_standard_protocol';
  return { protocol_choice };
}

function cardiac_mri(req) {
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['myocarditis','viability_ischemia','cardiomyopathy','congenital','mass','pericardial_disease']);
  ensureNumber(req.lvef_pct, 'lvef_pct');
  ensureBool(req.lge_present, 'lge_present');
  ensureNumber(req.t1_mapping_ms, 't1_mapping_ms');
  ensureNumber(req.t2_mapping_ms, 't2_mapping_ms');

  let impression;
  if (req.indication === 'myocarditis' && req.t2_mapping_ms > 60) impression = 'edema_present_then_review_with_cardiologist';
  else if (req.lge_present && req.indication === 'viability_ischemia') impression = 'scar_present_then_review_viability';
  else if (req.lvef_pct < 35) impression = 'reduced_lvef_then_continue_medical_therapy';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function fmri_brain(req) {
  ensureStr(req.task, 'task');
  ensureEnum(req.task, 'task', ['motor_mapping','language_mapping','memory_task','resting_state','visual_cortex','pre_surgical_planning']);
  ensureBool(req.cooperation_achieved, 'cooperation_achieved');
  ensureNumber(req.motion_correction_applied, 'motion_correction_applied');
  ensureBool(req.contrast_administered, 'contrast_administered');

  let quality_flag;
  if (!req.cooperation_achieved) quality_flag = 'poor_cooperation_then_consider_repeat_or_alternative';
  else if (req.motion_correction_applied === 0) quality_flag = 'consider_motion_correction_then_continue';
  else quality_flag = 'continue_with_standard_protocol';
  return { quality_flag };
}

function mr_spectroscopy(req) {
  ensureStr(req.region, 'region');
  ensureEnum(req.region, 'region', ['brain_tumor','brain_infarct','muscle','liver','prostate','breast']);
  ensureNumber(req.cho_peak_value, 'cho_peak_value');
  ensureNumber(req.naa_peak_value, 'naa_peak_value');
  ensureNumber(req.creatine_peak_value, 'creatine_peak_value');
  ensureBool(req.lipid_lactate_present, 'lipid_lactate_present');

  let interpretation;
  if (req.cho_peak_value === 0 || req.naa_peak_value === 0 || req.creatine_peak_value === 0) throw new ValidationError('peaks must be >0');
  const cho_n = req.cho_peak_value / req.creatine_peak_value;
  const naa_n = req.naa_peak_value / req.creatine_peak_value;
  if (req.region === 'brain_tumor' && cho_n > 2 && naa_n < 1) interpretation = 'high_grade_lesion_then_review_neurosurgery';
  else if (req.lipid_lactate_present) interpretation = 'necrosis_then_continue_review';
  else interpretation = 'continue_with_spectroscopy_review';
  return { interpretation };
}

function funcs() { return { dwi_stroke, contrast_mri, msk_mri, cardiac_mri, fmri_brain, mr_spectroscopy }; }
module.exports = { funcs, CITATIONS, ValidationError };
