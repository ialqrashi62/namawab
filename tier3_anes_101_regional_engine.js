/**
 * TIER3_ANES-101 Regional Anesthesia Engine
 * Neuraxial anesthesia + Peripheral nerve blocks + Epidural analgesia + Spinal anesthesia + Block complications
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASRA_REGIONAL: 'ASRA Regional Anesthesia 2023', ESRA_RA: 'ESRA Regional Anesthesia 2024' };

function neuraxialAnesthesia(input) {
  const { procedure_type_surgery, anticoagulation_status, last_dose_lovenox_or_heparin_hours, antiplatelet_use, infection_at_site, patient_consent, coagulation_panel_normal, abnormal_spinal_anatomy, npo_status, monitoring_plan } = input;
  let plan = 'neuraxial_anesthesia_spinal_or_epidural_per_surgical_procedure_with_standard_precautions';
  if (anticoagulation_status === 'on_anticoagulation_within_ban_intervals') plan = plan + '_POSTPONE_until_anticoagulation_interval_per_ASRA_2018_guidelines';
  if (last_dose_lovenox_or_heparin_hours < 12) plan = 'delay_until_12_to_24h_post_LMWH_dose_per_ASRA_prophylaxis_or_treatment_threshold';
  if (antiplatelet_use === 'clopidogrel_or_ticagrelor_within_5_to_7d') plan = 'delay_for_neuraxial_per_ASRA_or_use_alternative_anesthetic_with_antiplatelet_resumption_post_surgery';
  return {
    plan,
    contraindications: ['patient_refusal', 'infection_at_puncture_site', 'elevated_INR_above_1.5_for_spinal_above_1.4_for_epidural', 'active_anticoagulation_outside_safe_window_per_ASRA', 'uncooperative_patient', 'raised_intracranial_pressure_relative', 'severe_aortic_stenosis_relative', 'spinal_anatomy_abnormal_relative'],
    consent: 'detailed_consent_with_risks_headache_neurologic_injury_hematoma_infection_failure_hypotension',
    monitoring: 'standard_ASA_monitoring_with_additional_5_min_Q5min_for_first_30min_then_Q15min_block_assessment',
    citation: CITATIONS.ASRA_REGIONAL,
  };
}

function peripheralNerveBlock(input) {
  const { procedure_type, target_nerve, ultrasound_guidance_used, anticoagulation_status, block_indication, prior_neuropathy, patient_consent, npo_status, operator_experience } = input;
  let plan = 'ultrasound_guided_peripheral_nerve_block_for_surgical_anesthesia_or_post_op_analgesia';
  if (target_nerve === 'interscalene_brachial_plexus') plan = 'interscalene_for_shoulder_surgery_with_risk_of_phrenic_nerve_palsy_and_pneumothorax_have_bronchial_compromise_review';
  if (target_nerve === 'femoral_or_adductor') plan = 'femoral_for_knee_surgery_with_risk_of_falls_quadriceps_weakness_post_op';
  if (target_nerve === 'popliteal_sciatic') plan = 'popliteal_sciatic_for_ankle_foot_surgery_with_risk_of_residual_numbness_falls_post_op';
  if (target_nerve === 'TAP_block') plan = 'TAP_for_abdominal_surgery_with_risk_of_liver_laceration_if_incorrect_plane';
  return {
    plan,
    anticoagulation: 'review_antiplatelet_anticoagulant_timing_per_ASRA_2018_for_deep_blocks_lower_risk_than_neuraxial',
    local_anesthetic: 'ropivacaine_0.5pct_or_bupivacaine_0.25_to_0.5pct_with_epinephrine_1_to_200000_for_prolonged_block_max_dose_per_weight',
    adjuvants: ['dexamethasone_8mg_perineural_for_prolonged_analgesia', 'dexmedetomidine_perineural_or_IV', 'clonidine_perineural', 'bicarbonate_for_faster_onset'],
    citation: CITATIONS.ESRA_RA,
  };
}

function epiduralAnalgesia(input) {
  const { indication, level_of_catheter, local_anesthetic_concentration, opioid_added, infusion_rate, patient_response, motor_block_present, hypotension, pruritus, urinary_retention, breakthrough_pain } = input;
  let plan = 'epidural_PCEA_with_basal_rate_plus_bolus_PCA_with_low_concentration_local_anesthetic_ropivacaine_0.1pct_with_fentanyl_2mcg_per_mL';
  if (motor_block_present === 'yes') plan = 'reduce_concentration_of_local_anesthetic_to_ropivacaine_0.0625pct_or_reduce_infusion_rate';
  if (hypotension === 'yes') plan = 'reduce_infusion_rate_or_bolus_then_assess_volume_status_then_vasopressor_per_protocol';
  if (pruritus === 'yes') plan = 'reduce_opioid_concentration_or_change_to_local_only_with_systemic_pruritus_treatment_diphenhydramine_or_ondansetron';
  if (urinary_retention === 'yes') plan = 'consider_intermittent_catheterization_or_indwelling_catheter_per_protocol';
  if (breakthrough_pain === 'yes') plan = 'assess_bolus_options_then_provider_assessment_then_consider_increasing_concentration_or_adding_adjuvant';
  return {
    plan,
    monitoring: 'pain_score_Q4h_block_assessment_Q4h_vital_signs_Q1h_motor_sensory_Q4h_for_residual_block',
    catheter_removal: 'review_anticoagulation_with_catheter_removal_then_resume_anticoagulation_per_ASRA_protocol',
    complications: ['post_dural_puncture_headache_with_pressor_patch', 'epidural_hematoma_with_neurologic_emergency', 'epidural_abscess_with_fever_back_pain', 'high_block_with_respiratory_compromise', 'intravascular_injection_with_cardiac_toxicity'],
    citation: CITATIONS.ASRA_REGIONAL,
  };
}

function spinalAnesthesia(input) {
  const { surgical_procedure, level_needed, hyperbaric_or_isobaric, local_anesthetic_dose, opioid_added, prior_spine_surgery, positioning_sitting_or_lateral, dural_puncture_occurred } = input;
  let plan = 'single_shot_spinal_anesthesia_with_bupivacaine_0.5pct_hyperbaric_or_isobaric_for_procedure_duration_match';
  if (level_needed === 'saddle_block') plan = 'low_spinal_for_perineal_with_small_dose_isobaric_for_selective_block';
  if (level_needed === 'T10_for_inguinal_hernia') plan = 'T10_sensory_block_with_dose_titration';
  if (level_needed === 'T4_for_upper_abdominal') plan = 'high_spinal_with_hemodynamic_monitoring_aggressive_fluid_vasopressor';
  if (prior_spine_surgery === 'yes') plan = 'consider_alternative_anesthesia_due_to_potential_difficulty_and_unpredictable_spread';
  return {
    plan,
    post_dural_puncture_headache_risk: 'higher_in_young_parturient_and_large_bore_needle_with_conservative_positioning_hydration_caffeine_initial_then_epidural_blood_patch_for_persistent',
    hypotension: 'preload_crystalloid_or_colloid_then_phenylephrine_50_to_100mcg_or_ephedrine_5_to_10mg_IV_with_bradycardia',
    pdph_rate: 'spinal_25G_whitacre_2.5pct_lumbar_puncture_larger_needle_increases_risk',
    citation: CITATIONS.ASRA_REGIONAL,
  };
}

function nerveBlockComplications(input) {
  const { block_type, complication_type, time_to_onset_hours, severity, local_anesthetic_systemic_toxicity_present, nerve_injury_present, hematoma_present, infection_present, intervention_required } = input;
  let management = 'evaluate_complication_type_severity_then_initiate_specific_management';
  if (local_anesthetic_systemic_toxicity_present === 'yes') management = 'LAST_treatment_with_airway_breathing_circulation_support_lipid_emulsion_20pct_bolus_then_infusion_per_ASRA_guidelines';
  if (nerve_injury_present === 'yes') management = 'document_with_neurology_assessment_NCS_EMG_follow_up_Q_quarter_until_resolution_or_stabilization';
  if (hematoma_present === 'yes') management = 'urgent_imaging_MRI_then_urgent_neurosurgical_consult_for_decompression_within_6_to_8h_for_best_neurologic_outcome';
  if (infection_present === 'yes') management = 'antibiotics_then_drainage_for_abscess_then_monitoring_for_neurologic_compromise';
  return {
    management,
    last_protocol: ['airway_management_if_seizure', '100pct_oxygen', 'lipid_emulsion_20pct_bolus_1.5mL_per_kg_over_1_min_then_0.25mL_per_kg_per_min', 'avoid_propofol_or_amide_local_anesthetic', 'seizure_treatment_with_benzodiazepine'],
    documentation: 'full_documentation_in_chart_with_informed_consent_review_follow_up_plan_and_quality_review',
    follow_up: 'Q1_to_2_weeks_for_minor_Q_month_for_major_with_neurology_referral',
    citation: CITATIONS.ASRA_REGIONAL,
  };
}

module.exports = { neuraxialAnesthesia, peripheralNerveBlock, epiduralAnalgesia, spinalAnesthesia, nerveBlockComplications, CITATIONS, ValidationError };