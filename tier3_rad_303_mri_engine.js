/**
 * TIER3_RAD-303 MRI (Magnetic Resonance Imaging) Engine
 * MRI safety screening + Pacemaker MRI conditional check + Contrast (Gadolinium) nephrogenic screening + Spine MRI interpretation + MS brain MRI (McDonald)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR_MRI: 'ACR MRI Safety 2024', RSNA_MRI: 'RSNA MRI Safety Manual 2024' };

function mriSafetyScreening(input) {
  const { has_pacemaker, has_implantable_defibrillator, has_cochlear_implant, has_neurostimulator, has_metallic_foreign_body, has_aneurysm_clip, pregnancy, claustrophobia, weight_kg, eGFR_for_gad } = input;
  const absolute_contraindications = [];
  const relative_contraindications = [];
  if (has_pacemaker === 'non_mri_conditional') absolute_contraindications.push('non_mri_conditional_pacemaker');
  else if (has_pacemaker === 'mri_conditional') relative_contraindications.push('mri_conditional_pacemaker_need_protocol_review');
  if (has_implantable_defibrillator === 'yes' && has_pacemaker === 'mri_conditional') absolute_contraindications.push('icd_combination');
  if (has_cochlear_implant === 'non_mri_conditional') absolute_contraindications.push('non_mri_conditional_cochlear_implant');
  if (has_neurostimulator === 'non_mri_conditional') absolute_contraindications.push('non_mri_conditional_neurostimulator');
  if (has_metallic_foreign_body === 'yes' && has_metallic_foreign_body === 'orbital') absolute_contraindications.push('orbital_metallic_foreign_body');
  if (has_aneurysm_clip === 'non_mri_conditional') absolute_contraindications.push('non_mri_conditional_aneurysm_clip');
  return {
    absolute_contraindications, relative_contraindications,
    safety_status: absolute_contraindications.length > 0 ? 'unsafe_for_MRI' : relative_contraindications.length > 0 ? 'conditional_consult_MRI_safety_officer' : 'safe_for_MRI',
    claustrophobia_preparation: claustrophobia === 'yes' ? 'consider_oral_or_IV_sedation_prone_positioning_or_open_MRI' : 'none_needed',
    weight_limit: weight_kg && weight_kg >= 200 ? 'consider_open_MRI_or_alternative_imaging' : 'standard_MRI_acceptable',
    citation: CITATIONS.ACR_MRI,
  };
}

function gadoliniumScreening(input) {
  const { egfr_ml_min_1_73m2, age_years, on_dialysis, prior_reaction_to_gadolinium } = input;
  let risk = 'low';
  if (egfr_ml_min_1_73m2 && egfr_ml_min_1_73m2 < 30) risk = 'high_nsf_risk';
  else if (egfr_ml_min_1_73m2 && egfr_ml_min_1_73m2 < 60) risk = 'moderate_risk';
  if (on_dialysis === 'yes') risk = 'high_nsf_risk_with_dialysis';
  return {
    risk, egfr_ml_min_1_73m2, age_years,
    macrocyclic_agents_preferred: risk === 'high_nsf_risk' ? 'yes_use_macrocyclic_gadolinium_agents_only' : 'standard_agent_acceptable',
    dialysis_timing: on_dialysis === 'yes' ? 'schedule_MRI_immediately_before_or_after_dialysis_session' : 'no_special_timing',
    prior_reaction: prior_reaction_to_gadolinium === 'yes' ? 'consider_alternative_imaging_or_premedication_with_corticosteroids_and_antihistamines' : 'no_premedication_needed',
    citation: CITATIONS.ACR_MRI,
  };
}

function spineMriInterpretation(input) {
  const { disc_herniation_present, level_of_herniation, central_canal_stenosis, neural_foraminal_stenosis, cord_signal_change, cord_compression, cauda_equina_signs } = input;
  let impression = 'normal_spine_mri';
  if (cauda_equina_signs === 'yes' && cord_compression === 'yes') impression = 'cauda_equina_syndrome_emergent_neurosurgical_consultation';
  else if (cord_signal_change === 'yes') impression = 'myelopathy_with_cord_signal_change_neurosurgical_consultation';
  else if (cord_compression === 'yes') impression = 'cord_compression_neurosurgical_consultation';
  else if (central_canal_stenosis === 'severe') impression = 'severe_canal_stenosis_with_clinical_correlation';
  else if (disc_herniation_present === 'yes') impression = 'disc_herniation_with_corresponding_nerve_root_compression';
  return {
    impression, disc_herniation_present, level_of_herniation, central_canal_stenosis, neural_foraminal_stenosis, cord_signal_change, cord_compression,
    next_step: impression === 'cauda_equina_syndrome_emergent_neurosurgical_consultation' ? 'emergent_neurosurgical_consultation_within_24h' : impression === 'cord_compression_neurosurgical_consultation' ? 'urgent_neurosurgical_consultation' : 'continue_observation_follow_up_imaging_Q6_to_12_months',
    citation: CITATIONS.RSNA_MRI,
  };
}

function msBrainMriMcdonald(input) {
  const { t2_hyperintense_lesions_count, gadolinium_enhancing_lesions_count, periventricular_lesions, juxtacortical_lesions, infratentorial_lesions, spinal_cord_lesions, clinical_attacks_count, primary_progressive_course } = input;
  const dissemination_in_space = [periventricular_lesions, juxtacortical_lesions, infratentorial_lesions, spinal_cord_lesions].filter(v => v === 'yes').length >= 2;
  const dissemination_in_time = gadolinium_enhancing_lesions_count >= 1 || (t2_hyperintense_lesions_count >= 2 && clinical_attacks_count >= 2);
  const mcdonald_diagnosis_possible = dissemination_in_space && dissemination_in_time;
  return {
    dissemination_in_space, dissemination_in_time,
    mcdonald_criteria_met: mcdonald_diagnosis_possible || (primary_progressive_course === 'yes' && dissemination_in_space && spinal_cord_lesions === 'yes'),
    next_step: 'neurology_consultation_for_MS_workup_lumbar_puncture_oligoclonal_bands_visual_evoked_potentials',
    citation: CITATIONS.RSNA_MRI,
  };
}

function mriCardiacViability(input) {
  const { lvef_pct, late_gadolinium_enhancement_pct, infarct_size_pct, microvascular_obstruction, viable_myocard_pct, ischemia_on_stress } = input;
  return {
    lvef_pct: lvef_pct || null, late_gadolinium_enhancement_pct: late_gadolinium_enhancement_pct || null, infarct_size_pct: infarct_size_pct || null,
    viable_myocard_pct: viable_myocard_pct || null, microvascular_obstruction: microvascular_obstruction === 'yes',
    interpretation: late_gadolinium_enhancement_pct && late_gadolinium_enhancement_pct >= 15 ? 'large_infarct_size_unfavorable_for_recovery' : late_gadolinium_enhancement_pct && late_gadolinium_enhancement_pct <= 5 ? 'small_infarct_favorable_for_recovery' : 'moderate_infarct_size',
    indication_for_revascularization: viable_myocard_pct && viable_myocard_pct >= 50 ? 'yes_significant_viable_myocard' : 'no_insignificant_viable_myocard',
    citation: CITATIONS.ACR_MRI,
  };
}

module.exports = { mriSafetyScreening, gadoliniumScreening, spineMriInterpretation, msBrainMriMcdonald, mriCardiacViability, CITATIONS, ValidationError };