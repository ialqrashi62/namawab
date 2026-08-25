/**
 * TIER3_NEPHRO-303 Dialysis Access & Prescription Engine
 * Hemodialysis access planning + Peritoneal dialysis candidacy + HD prescription (URR/Kt/V) + Dialysis adequacy + Vascular access complications
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDOQI: 'KDOQI HD Adequacy 2024', ISPD: 'ISPD Peritoneal Dialysis 2022' };

function hemodialysisAccessPlanning(input) {
  const { dialysis_initiation_timing, expected_dialysis_duration_years, age_years, comorbidities, anatomy_av_fistula_feasibility, vein_mapping_done } = input;
  let preferred_access = 'AV_fistula_radiocephalic_or_brachiocephalic';
  if (expected_dialysis_duration_years < 1 || anatomy_av_fistula_feasibility === 'poor') preferred_access = 'AV_graft_if_no_fistula_possible_then_tunneled_cuffed_catheter_if_urgent';
  if (comorbidities === 'severe_cardiac_or_short_life_expectancy') preferred_access = 'tunneled_cuffed_catheter';
  return {
    preferred_access, dialysis_initiation_timing,
    avf_first_choice: 'radiocephalic_wrist_AVF_preferred_due_to_lowest_complication_rate_then_brachiocephalic_then_brachiobasilic_with_superficialization',
    preoperative_workup: ['physical_examination_for_pulse_and_vein_mapping', 'duplex_ultrasound_vein_mapping', 'arterial_evaluation_with_allen_test_or_duplex', 'avoid_ip_l_line_placement_preserves_vein_for_AVF'],
    time_to_maturity: 'radiocephalic_AVF_6_weeks_brachiocephalic_6_weeks_brachiobasilic_2_to_3_months_after_superficialization',
    citation: CITATIONS.KDOQI,
  };
}

function peritonealDialysisCandidacy(input) {
  const { prior_abdominal_surgery, history_of_peritonitis, abdominal_hernia_present, obesity_bmi, mental_capacity_for_self_care, home_environment, catheter_umdex_drainage_capacity } = input;
  let candidate = true;
  if (prior_abdominal_surgery === 'major' || history_of_peritonitis === 'recurrent_severe' || mental_capacity_for_self_care === 'no' || home_environment === 'unsuitable_for_PD') candidate = false;
  return {
    candidate, prior_abdominal_surgery, history_of_peritonitis,
    preferred_modality: 'continuous_ambulatory_PD_CAPD_or_automated_PD_APD_per_lifestyle_preference',
    contraindications: ['omental_peritoneal_adhesions', 'severe_active_diverticulitis_or_recent_abdominal_surgery', 'inflammatory_bowel_disease_active', 'uncorrectable_hernias', 'severe_obesity_BMI_above_45', 'patient_unable_to_perform_self_care_or_no_caregiver'],
    relative_considerations: obesity_bmi >= 35 ? 'higher_PD_failure_risk_due_to_decreased_clearance' : 'standard_PD_clearance',
    catheter_placement: 'laparoscopic_or_open_tenckhoff_catheter_placement_x_2_weeks_before_use',
    citation: CITATIONS.ISPD,
  };
}

function hdAdequacyUrrKtV(input) {
  const { pre_dialysis_bun, post_dialysis_bun, target_kt_v, dialysis_duration_minutes_per_session, dialyzer_koA, dry_weight_kg } = input;
  const urr = ((pre_dialysis_bun - post_dialysis_bun) / pre_dialysis_bun) * 100;
  let kt_v = 0;
  if (post_dialysis_bun > 0 && pre_dialysis_bun > 0) kt_v = -1 * Math.log(post_dialysis_bun / pre_dialysis_bun - 0.008 * (dialysis_duration_minutes_per_session / 60)) + (4 - 3.5 * (post_dialysis_bun / pre_dialysis_bun)) * (dry_weight_kg - 0.5);
  let adequacy = 'inadequate';
  if (urr >= 65 || kt_v >= 1.2) adequacy = 'adequate_target_per_KDOQI';
  return {
    urr_pct: urr.toFixed(1), kt_v: kt_v.toFixed(2), adequacy,
    target: 'URR_greater_than_65pct_or_Kt_V_greater_than_1.2_for_thrice_weekly_HD',
    prescription_modifications: adequacy === 'inadequate' ? ['increase_dialysis_time_per_session', 'increase_blood_flow_rate', 'consider_higher_efficiency_dialyzer_high_KoA', 'consider_hemodiafiltration_for_convective_clearance', 'consider_increased_frequency_of_5x_per_week_HD'] : 'maintain_current_prescription',
    monitoring: 'URR_or_Kt_V_monthly_pre_and_post_dialysis_BUN_drawn_',
    citation: CITATIONS.KDOQI,
  };
}

function dialysisAdequacyComprehensive(input) {
  const { kt_v, hemoglobin_g_dl, phosphorus_mg_dl, calcium_mg_dl, intact_pth_pg_ml, dry_weight_change_kg_per_month, systolic_bp_pre_post_dialysis, dialysis_vintage_years } = input;
  let comprehensive_assessment = 'met_dialysis_adequacy_targets';
  if (kt_v < 1.2) comprehensive_assessment = 'inadequate_dialysis_review_prescription';
  if (dry_weight_change_kg_per_month >= 3 || dry_weight_change_kg_per_month <= -3) comprehensive_assessment += '_review_volume_status_and_dry_weight';
  return {
    comprehensive_assessment, kt_v, hemoglobin_g_dl, phosphorus_mg_dl, intact_pth_pg_ml,
    targets: ['Kt_V_greater_than_1.2', 'hemoglobin_10_to_11', 'phosphorus_3.5_to_5.5', 'intact_PTH_per_KDIGO_target', 'dry_weight_stable', 'pre_dialysis_BP_under_140_over_90'],
    interventions_for_failure_to_meet_targets: ['dry_weight_adjustment', 'nutrition_consultation_for_low_albumin', 'review_dialysis_adequacy_and_modality', 'consider_intensified_dialysis_increased_frequency_or_hemodiafiltration'],
    citation: CITATIONS.KDOQI,
  };
}

function vascularAccessComplications(input) {
  const { thrombosis_present, infection_signs_redness_discharge, stenosis_evidence_high_dialysis_venous_pressure, aneurysm_present, steal_syndrome_signs, bleeding_from_puncture_site } = input;
  let intervention = 'observation_with_Q1_month_surveillance';
  if (thrombosis_present === 'yes') intervention = 'urgent_thrombectomy_or_fistulogram_with_thrombolysis_or_revision';
  else if (infection_signs_redness_discharge === 'yes') intervention = 'IV_antibiotics_with_access_culture_if_graft_or_catheter_consider_excision_if_sepsis_or_recurrent';
  else if (stenosis_evidence_high_dialysis_venous_pressure === 'yes') intervention = 'fistulogram_with_angioplasty_with_or_without_stenting';
  return {
    intervention, thrombosis_present, infection_signs_redness_discharge,
    access_surveillance_protocol: ['physical_exam_Q1_month_pulse_thrill_bruit', 'Q1_month_Qb_per_Qa_pressure_ratio_target_under_0.5', 'access_flow_Q3_months_target_above_650mL_per_min_or_decline_above_25pct', 'consider_angiography_if_any_abnormality'],
    steal_syndrome_management: steal_syndrome_signs === 'yes' ? 'evaluate_with_angiography_consider_distal_revascularization_and_interval_ligation_DRIL_or_revision_to_proximal_inflow' : 'monitor_only',
    citation: CITATIONS.KDOQI,
  };
}

module.exports = { hemodialysisAccessPlanning, peritonealDialysisCandidacy, hdAdequacyUrrKtV, dialysisAdequacyComprehensive, vascularAccessComplications, CITATIONS, ValidationError };