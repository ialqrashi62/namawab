/**
 * TIER3_RAD-305 Interventional Radiology Engine
 * TIPS procedure + Percutaneous biopsy + Vascular stent planning + Drainage catheter + Tumor ablation (RFA/MWA)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SIR: 'Society of Interventional Radiology 2024', CIRSE: 'CIRSE Standards 2024' };

function tipsProcedureAssessment(input) {
  const { indication, meld_score, child_pugh_score, hepatic_encephalopathy, refractory_ascites, variceal_bleeding_history, portal_hypertension } = input;
  let indication_met = false;
  let reason_list = [];
  if (refractory_ascites === 'yes') { indication_met = true; reason_list.push('refractory_ascites'); }
  if (variceal_bleeding_history === 'yes' && hepatic_encephalopathy !== 'recurrent_severe') { indication_met = true; reason_list.push('secondary_prevention_variceal_bleeding'); }
  if (hepatic_encephalopathy === 'recurrent_severe' || portal_hypertension === 'hepatic_hydrothorax') { indication_met = true; reason_list.push('hepatic_hydrothorax_or_other_complication'); }
  return {
    indication_met, reason_list, meld_score, child_pugh_score,
    contraindications: ['severe_hepatic_failure', 'severe_right_heart_failure', 'uncontrolled_infection_or_sepsis', 'uncontrolled_hepatic_encephalopathy', 'polycystic_liver_disease', 'extensive_hepatocellular_carcinoma'],
    technique: 'transjugular_approach_with_stent_from_hepatic_to_portal_vein_portosystemic_shunt',
    post_procedure_care: ['monitor_for_hepatic_encephalopathy', 'monitor_liver_function', 'ultrasound_Q3M_for_shunt_patentcy'],
    citation: CITATIONS.SIR,
  };
}

function percutaneousBiopsy(input) {
  const { lesion_size_cm, lesion_location, suspected_pathology, platelet_count, inr_value, anticoagulation_status, lesion_visible_on_imaging, safe_path_available } = input;
  const coagulopathy_ok = (platelet_count >= 50000) && (inr_value <= 1.5) && (anticoagulation_status === 'no_or_reversed');
  let feasibility = 'high';
  if (!coagulopathy_ok) feasibility = 'low_correct_coagulopathy_first';
  else if (lesion_size_cm < 1) feasibility = 'moderate_targeting_challenging';
  else if (safe_path_available !== 'yes') feasibility = 'moderate_or_low';
  return {
    feasibility, coagulopathy_ok, lesion_size_cm, lesion_location,
    modality_choice: lesion_location === 'superficial_soft_tissue' ? 'US_guided' : lesion_location === 'deep_abdomen' ? 'CT_guided' : lesion_location === 'lung' ? 'CT_guided' : 'case_by_case',
    needle_selection: suspected_pathology === 'lymphoma_or_sarcoma' ? 'core_needle_14_to_18_gauge' : suspected_pathology === 'fna_only' ? 'fine_needle_aspiration_22_to_25_gauge' : 'core_needle_preferred',
    complications: ['bleeding', 'pneumothorax_for_lung', 'infection', 'tumor_seeding_rare', 'organ_injury'],
    citation: CITATIONS.SIR,
  };
}

function vascularStentPlanning(input) {
  const { vessel, stenosis_pct, lesion_length_cm, reference_vessel_diameter_mm, symptom_severity, endovascular_access, runoff_vessels } = input;
  let recommendation = 'continue_medical_therapy';
  if (stenosis_pct >= 70 && lesion_length_cm < 15) recommendation = 'endovascular_stenting_recommended';
  else if (stenosis_pct >= 50 && symptom_severity === 'severe_claudication_or_rest_pain') recommendation = 'endovascular_stenting_recommended';
  return {
    recommendation, vessel, stenosis_pct, lesion_length_cm, reference_vessel_diameter_mm,
    stent_choice: lesion_length_cm > 10 ? 'long_stent_or_overlap_multiple_stents' : 'single_short_stent',
    access_route: endovascular_access === 'femoral' ? 'femoral_artery_access' : endovascular_access === 'radial' ? 'radial_artery_access' : 'case_by_case',
    post_procedure: ['dual_antiplatelet_therapy_minimum_1_to_6_months', 'stent_patency_follow_up_ultrasound_Q6M_first_year_then_Q12M'],
    citation: CITATIONS.CIRSE,
  };
}

function drainageCatheterPlacement(input) {
  const { collection_type, collection_size_cm, viscosity_thin_thick, location, fever_or_leukocytosis } = input;
  let indication = 'observation_or_antibiotics_alone';
  if (collection_size_cm >= 3 && fever_or_leukocytosis === 'yes') indication = 'percutaneous_drainage_indicated';
  else if (collection_size_cm >= 5) indication = 'percutaneous_drainage_even_without_systemic_symptoms';
  return {
    indication, collection_type, collection_size_cm, viscosity_thin_thick, location, fever_or_leukocytosis,
    catheter_size: viscosity_thin_thick === 'thin' ? '8_to_10_Fr_catheter' : viscosity_thin_thick === 'thick' ? '12_to_14_Fr_catheter' : '8_to_10_Fr_catheter',
    approach: location === 'percutaneous' ? 'percutaneous_image_guided' : location === 'transrectal' ? 'transrectal_approach' : 'case_by_case',
    monitoring: 'output_Q8h_imaging_follow_up_catheter_removal_when_output_less_than_20mL_per_24h',
    citation: CITATIONS.SIR,
  };
}

function tumorAblation(input) {
  const { tumor_size_cm, tumor_count, location, modality, proximity_to_vessels_or_bile_ducts } = input;
  let ablation_choice = modality || 'RFA';
  if (location === 'liver' && proximity_to_vessels_or_bile_ducts === 'yes') ablation_choice = 'MWA_microwave_preferred_over_RFA';
  if (location === 'lung' && tumor_size_cm <= 3) ablation_choice = 'RFA_lung';
  if (location === 'kidney' && tumor_size_cm <= 4) ablation_choice = 'RFA_or_cryoablation';
  return {
    ablation_choice, tumor_size_cm, tumor_count, location,
    indication: (tumor_size_cm <= 3 && tumor_count <= 3) ? 'curative_intent' : 'palliative_or_bridging',
    technique: 'image_guided_percutaneous_approach_with_real_time_imaging_monitoring',
    follow_up: 'contrast_enhanced_MRI_or_CT_at_1_3_6_12_months_then_Q6M_for_2_years',
    citation: CITATIONS.SIR,
  };
}

module.exports = { tipsProcedureAssessment, percutaneousBiopsy, vascularStentPlanning, drainageCatheterPlacement, tumorAblation, CITATIONS, ValidationError };