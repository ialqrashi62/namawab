'use strict';
// TIER4_RAD_EXT2-102: Abdomen - free air, obstruction, mass
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['RSNA_Bowel_2018', 'RSNA_Pneumoperitoneum_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function free_air(req) {
  ensureBool(req.peritoneal_free_air, 'peritoneal_free_air');
  ensureBool(req.acute_abdomen, 'acute_abdomen');
  ensureBool(req.peritonitis, 'peritonitis');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.heart_rate, 'heart_rate');

  const surgical = req.peritoneal_free_air || req.peritonitis || req.acute_abdomen && (req.sbp < 90 || req.heart_rate > 120);
  return {
    surgical_emergency: surgical,
    action: surgical ? 'emergent_laparoscopy_or_laparotomy_within_2h' :
      'urgent_ct_with_oral_and_iv_contrast_then_general_surgery_consult',
    imaging: surgical ? 'upright_cxr_then_ct_if_unstable' : 'ct_abdomen_pelvis_with_contrast',
    citations: CITATIONS,
  };
}

function obstruction(req) {
  ensureBool(req.distended_loops, 'distended_loops');
  ensureNumber(req.transition_point, 'transition_point'); // 0=none, 1=present
  ensureBool(req.free_air, 'free_air');
  ensureBool(req.recent_surgery, 'recent_surgery');
  ensureNumber(req.lactate, 'lactate');

  let severity = 'mild';
  if (req.lactate >= 2 || req.free_air) severity = 'ischemic_or_perforated_surgical';
  else if (req.recent_surgery) severity = 'post_op_adhesions_likely';
  const management = severity === 'ischemic_or_perforated_surgical' ? 'emergent_surgical_exploration' :
    severity === 'post_op_adhesions_likely' ? 'ng_tube_iv_fluids_serial_exams_water_soluble_contrast' : 'conservative_admit_ng_decompression_iv_fluids';
  return {
    severity,
    transition_point: req.transition_point === 1,
    management,
    surgery: severity === 'ischemic_or_perforated_surgical' ? 'yes_emergent' : 'if_conservative_fails_or_worsens_48h',
    citations: CITATIONS,
  };
}

function mass(req) {
  ensureBool(req.liver_lesion, 'liver_lesion');
  ensureBool(req.pancreatic_lesion, 'pancreatic_lesion');
  ensureBool(req.renal_lesion, 'renal_lesion');
  ensureNumber(req.size_mm, 'size_mm');
  ensureBool(req.enhancement, 'enhancement');

  return {
    liver: req.liver_lesion ? 'mri_liver_with_hepatocyte_specific_agent_or_multiphase_ct' : 'no_liver_lesion',
    pancreas: req.pancreatic_lesion ? 'eusa_fna_and_mri_pancreas_protocol' : 'no_pancreas_lesion',
    kidney: req.renal_lesion ? 'renal_mass_protocol_mri_if_enhanced_cystic_or_solid' : 'no_renal_lesion',
    followup: req.size_mm >= 10 && req.enhancement ? 'multidisciplinary_review_for_biopsy_or_resection' : 'no_immediate_action',
    citations: CITATIONS,
  };
}

module.exports = { free_air, obstruction, mass, CITATIONS, ValidationError };