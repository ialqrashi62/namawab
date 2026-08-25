'use strict';
// TIER4_RAD_EXT2-103: Neuro - ICH, stroke, trauma
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AHA_Stroke_2021', 'NCS_ICH_2015', 'NICE_Head_Trauma_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function ich(req) {
  ensureNumber(req.gcs, 'gcs');
  ensureNumber(req.ich_volume_ml, 'ich_volume_ml');
  ensureNumber(req.midline_shift_mm, 'midline_shift_mm');
  ensureNumber(req.age, 'age');
  ensureBool(req.anticoagulation, 'anticoagulation');
  ensureBool(req.ventilator, 'ventilator');
  ensureBool(req.aneurysm_suspected, 'aneurysm_suspected');

  const severe = req.gcs < 8 || req.ich_volume_ml >= 30 || req.midline_shift_mm >= 5 || req.ventilator;
  return {
    severity: severe ? 'severe_life_threatening' : 'stable',
    surgical_evaluation: severe ? 'neurosurgery_consult_immediately_consider_evacuation' : 'medical_management',
    reversal: req.anticoagulation ? 'reversal_with_4factor_pcc_vitamin_k_idarucizumab_or_andexanet' : 'no_reversal_needed',
    imaging_followup: req.aneurysm_suspected ? 'cta_or_mra_then_dsa_if_positive' : 'ct_24h_to_assess_expansion',
    prognostic_score: 'ich_score_per_volume_gcs_ivh_age',
    citations: CITATIONS,
  };
}

function stroke(req) {
  ensureNumber(req.nihss, 'nihss');
  ensureNumber(req.hours_since_onset, 'hours_since_onset');
  ensureBool(req.large_vessel_occlusion, 'large_vessel_occlusion');
  ensureBool(req.last_known_well, 'last_known_well');
  ensureNumber(req.cta_done, 'cta_done'); // 0/1

  const tpa_window = req.hours_since_onset <= 4.5 && req.cta_done === 1;
  const thrombectomy_window = req.hours_since_onset <= 24 && req.large_vessel_occlusion;
  return {
    nihss: req.nihss,
    tpa_eligible: tpa_window,
    thrombectomy_eligible: thrombectomy_window,
    stroke_type_evaluation: req.last_known_well ? 'wake_up_stroke_mri_dwi_flairmismatch_then_tpa' : 'clear_time_window',
    treatment: tpa_window && thrombectomy_window ? 'iv_tpa_plus_thrombectomy' :
      tpa_window ? 'iv_tpa_alone' :
        thrombectomy_window ? 'thrombectomy_alone' : 'medical_management_secondary_prevention',
    citations: CITATIONS,
  };
}

function trauma(req) {
  ensureBool(req.gcs_lt_8, 'gcs_lt_8');
  ensureBool(req.anticoagulation, 'anticoagulation');
  ensureBool(req.basal_skull_fracture_signs, 'basal_skull_fracture_signs');
  ensureBool(req.vomiting, 'vomiting');
  ensureNumber(req.age, 'age');

  let ct_indicated = false;
  if (req.gcs_lt_8) ct_indicated = true;
  else if (req.anticoagulation && req.age >= 65) ct_indicated = true;
  else if (req.basal_skull_fracture_signs) ct_indicated = true;
  return {
    ct_head_indicated: ct_indicated,
    ct_modality: ct_indicated ? 'non_contrast_ct_head_within_1h' : 'observe_with_close_followup',
    observation_admission: req.gcs_lt_8 || req.anticoagulation ? 'icu_admission_neuro_obs' : 'consider_observation_unit',
    imaging_followup: 'repeat_ct_in_24h_if_change_in_gcs_or_pupils',
    citations: CITATIONS,
  };
}

module.exports = { ich, stroke, trauma, CITATIONS, ValidationError };