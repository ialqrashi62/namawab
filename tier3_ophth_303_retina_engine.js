/**
 * TIER3_OPHTH-303 Retina / Vitreous Engine
 * Age-related macular degeneration (AMD) + Diabetic retinopathy + Retinal detachment + Central retinal artery occlusion (CRAO) + Intravitreal injection planning
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_RET: 'AAO Retina Preferred Practice 2024' };

function amdEvaluation(input) {
  const { drusen_present, drusen_size, pigmentary_changes, geographic_atrophy_present, neovascularization_present, vision_loss_pattern, oct_findings } = input;
  let classification = 'no_amd';
  if (neovascularization_present === 'yes') classification = 'wet_amd_with_choroidal_neovascularization';
  else if (geographic_atrophy_present === 'yes') classification = 'advanced_dry_amd_with_ga';
  else if (drusen_size === 'large' && pigmentary_changes === 'yes') classification = 'intermediate_amd';
  else if (drusen_present === 'yes' && drusen_size === 'medium') classification = 'early_amd';
  return {
    classification, drusen_present, drusen_size, pigmentary_changes, geographic_atrophy_present, neovascularization_present,
    treatment: classification === 'wet_amd_with_choroidal_neovascularization' ? ['intravitreal_anti_VEGF_aflibercept_or_ranibizumab_or_faricimab_per_loading_dose_protocol', 'monitor_visual_acuity_and_anatomic_response', 'OCT_Q4_to_8_weeks_for_re_treatment_decision'] : classification === 'advanced_dry_amd_with_ga' ? ['AREDS2_vitamins_for_neovascular_risk_reduction', 'observation', 'consider_pegcetacoplan_or_avacincaptad_for_GA_where_approved'] : 'observation_with_annual_exam_and_smoking_cessation',
    citation: CITATIONS.AAO_RET,
  };
}

function diabeticRetinopathy(input) {
  const { diabetes_type, hba1c_pct, diabetes_duration_years, retinopathy_grade, dme_present, vision_changes } = input;
  let treatment = 'observation_with_annual_dilated_exam';
  if (retinopathy_grade === 'severe_nonproliferative') treatment = 'close_follow_up_Q3_to_4_months_with_consideration_of_PRP';
  else if (retinopathy_grade === 'proliferative') treatment = 'urgent_PRP_or_anti_VEGF_then_anti_VEGF_for_maintenance';
  if (dme_present === 'yes' && vision_changes === 'yes') treatment += '_plus_anti_VEGF_for_DME';
  return {
    retinopathy_grade, dme_present, diabetes_type, hba1c_pct,
    treatment, follow_up: retinopathy_grade === 'no_DR' ? 'Q1_to_2_years' : retinopathy_grade === 'mild' ? 'Q12M' : retinopathy_grade === 'moderate' ? 'Q6_to_12M' : 'Q3_to_4M',
    referral_criteria: ['severe_NPDR', 'PDR', 'DME_with_central_involvement', 'any_neovascularization'],
    citation: CITATIONS.AAO_RET,
  };
}

function retinalDetachment(input) {
  const { flashes, floaters, curtain_over_visual_field, peripheral_or_macula_on, oct_finding, proliferative_vitreoretinopathy_grade } = input;
  let urgency = 'urgent_within_24_to_48h';
  if (macula_on === 'macula_off') urgency = 'emergent_within_24h_for_vision_preservation';
  if (oct_finding === 'macula_sparing') urgency = 'urgent_within_24_to_48h';
  return {
    urgency, flashes, floaters, curtain_over_visual_field, macula_status: peripheral_or_macula_on,
    surgical_options: ['pneumatic_retinopexy_for_superior_break_no_PVR', 'scleral_buckle_for_young_phakic_patients', 'vitrectomy_with_endolaser_for_complex_PVR_or_macula_off', 'combination_for_advanced_disease'],
    follow_up: 'Q1_day_Q1_week_Q1_month_Q3_month_then_Q6_to_12M',
    citation: CITATIONS.AAO_RET,
  };
}

function craoAcute(input) {
  const { vision_loss_sudden, cherry_red_spot_present, relative_afferent_pupillary_defect, time_since_onset_hours, carotid_stenosis_risk } = input;
  let window_for_treatment = time_since_onset_hours <= 4.5;
  return {
    acute_crao_likely: vision_loss_sudden === 'yes' && cherry_red_spot_present === 'yes',
    treatment_window: window_for_treatment ? 'within_4.5h_consider_anterior_chamber_paracentesis_ocular_massage_cornea_decompression' : 'outside_treatment_window_no_evidence_for_intervention',
    urgent_workup: ['urgent_ophthalmology_consultation', 'carotid_doppler', 'echocardiogram_for_embolic_source', 'ECG_for_atrial_fibrillation', 'lipid_panel_and_HbA1c', 'ESR_CRP_to_rule_out_arteritis'],
    vision_prognosis: 'generally_poor_for_full_recovery_with_only_10_to_20pct_regaining_useful_vision',
    citation: CITATIONS.AAO_RET,
  };
}

function intravitrealInjectionPlanning(input) {
  const { indication, drug_choice, prior_injection_count, iop_pressure_mmhg, intraocular_inflammation_present } = input;
  let regimen = 'loading_dose_monthly_x_3_then_Q8_weeks_PRN';
  if (indication === 'wet_amd') regimen = 'T_and_E_or_fixed_dosing_per_protocol';
  if (indication === 'diabetic_macular_edema') regimen = 'Q4_weeks_loading_then_extend_per_response';
  return {
    regimen, drug_choice, indication, prior_injection_count,
    pre_injection: ['topical_anesthesia', '5pct_povidone_iodine_prep', 'specular_microscope_optional_for_cornea_assessment', 'check_iop_pre_and_post'],
    post_injection: ['monitor_Iop_30_min_post_injection', 'instruct_on_endophthalmitis_warning_signs', 'reschedule_per_regimen'],
    contraindication: intraocular_inflammation_present === 'active_uveitis' ? 'defer_injection_until_inflammation_resolved' : 'no_contraindication',
    citation: CITATIONS.AAO_RET,
  };
}

module.exports = { amdEvaluation, diabeticRetinopathy, retinalDetachment, craoAcute, intravitrealInjectionPlanning, CITATIONS, ValidationError };