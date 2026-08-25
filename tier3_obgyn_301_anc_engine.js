/**
 * TIER3_OBGYN-301 Antenatal Care Engine
 * ANC booking + WHO risk stratification + visit schedule + GDM screening + preeclampsia prevention + NST/BPP interpretation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_ANC_2016: 'WHO ANC Model 2016', ACOG_2024: 'ACOG Obstetric 2024' };

function ancBooking(input) {
  const { gestational_age_weeks, last_menstrual_period, ultrasound_date, gravida, para, miscarriages, medical_history } = input;
  let booking_trimester = 1;
  if (gestational_age_weeks >= 13 && gestational_age_weeks < 28) booking_trimester = 2;
  else if (gestational_age_weeks >= 28) booking_trimester = 3;
  return {
    edd_by_lmp: last_menstrual_period ? new Date(new Date(last_menstrual_period).getTime() + 280 * 24 * 60 * 60 * 1000).toISOString() : null,
    edd_by_us: ultrasound_date ? new Date(ultrasound_date).toISOString() : null,
    recommended_visits: '8_contacts_per_WHO_ANC_model_2016',
    booking_trimester, gravida, para,
    booking_labs: ['CBC', 'blood_group_rh_antibody_screen', 'rubella_igg', 'hepatitis_B_HBsAg', 'hepatitis_C_antibody', 'HIV_4th_gen', 'syphilis_RPR', 'urine_culture', 'rubella_varicella_parvo_igg'],
    citation: CITATIONS.WHO_ANC_2016,
  };
}

function riskStratification(input) {
  const { age, bmi, prior_preeclampsia, prior_gestational_diabetes, chronic_hypertension, multiple_gestation, prior_cesarean, anemia_hgb } = input;
  let risk_level = 'low_risk';
  let referrals = [];
  if (prior_preeclampsia || chronic_hypertension || age >= 35 || bmi >= 35) {
    risk_level = 'high_risk';
    referrals.push('maternal_fetal_medicine_subspecialist');
  }
  if (prior_gestational_diabetes || bmi >= 30) referrals.push('endocrinology_for_gdm_screening');
  if (multiple_gestation) referrals.push('maternal_fetal_medicine_for_twin_management');
  if (prior_cesarean) referrals.push('vbac_counseling_or_repeat_cesarean_decision');
  if (anemia_hgb < 7) referrals.push('hematology_for_severe_anemia_workup');
  return {
    risk_level, referrals,
    high_risk_clinic_frequency: risk_level === 'high_risk' ? 'Q2_4W_until_32W_then_Q1_2W' : 'standard_per_WHO_2016',
    citation: CITATIONS.WHO_ANC_2016,
  };
}

function ancVisitSchedule(input) {
  const { gestational_age_weeks } = input;
  let next_visit_weeks;
  if (gestational_age_weeks < 12) next_visit_weeks = 12;
  else if (gestational_age_weeks < 20) next_visit_weeks = 20;
  else if (gestational_age_weeks < 28) next_visit_weeks = 28;
  else if (gestational_age_weeks < 36) next_visit_weeks = 32;
  else next_visit_weeks = gestational_age_weeks + 1;
  return {
    next_visit_weeks,
    ultrasound_recommended: gestational_age_weeks >= 18 && gestational_age_weeks <= 22 ? 'anatomy_scan_Q20W' : gestational_age_weeks >= 28 && gestational_age_weeks <= 32 ? 'growth_scan_Q28W' : 'per_indication',
    citation: CITATIONS.WHO_ANC_2016,
  };
}

function gestationalDiabetesScreening(input) {
  const { bmi, age, prior_gdm, family_history_dm, first_trimester_glucose } = input;
  const early_screen_indicated = bmi >= 30 || age >= 35 || prior_gdm || family_history_dm === 'positive' || (first_trimester_glucose && first_trimester_glucose >= 92);
  const timing = early_screen_indicated ? 'at_first_visit_then_repeat_24W_to_28W' : 'standard_24W_to_28W_universal_screen';
  const thresholds_24w_to_28w = { fasting: 92, one_hour: 180, two_hour: 153 };
  return {
    early_screen_indicated,
    timing,
    screening_test: '75g_OGTT_2_step_or_1_step_per_protocol',
    diagnostic_thresholds_mg_dl: thresholds_24w_to_28w,
    abnormal_definition: 'one_or_more_values_meet_or_exceed_thresholds',
    citation: CITATIONS.ACOG_2024,
  };
}

function preeclampsiaPrevention(input) {
  const { prior_preeclampsia, chronic_hypertension, bmi, multiple_gestation, age, systolic_bp } = input;
  const high_risk = prior_preeclampsia || chronic_hypertension;
  const moderate_risk = bmi >= 35 || nulliparous || age >= 35 || multiple_gestation;
  return {
    aspirin_recommended: high_risk || moderate_risk ? 'low_dose_aspirin_81mg_daily_starting_12W_continue_until_36W' : 'not_routinely_recommended',
    calcium_supplementation: '1.5g_to_2g_daily_if_low_dietary_intake',
    blood_pressure_monitoring: high_risk || chronic_hypertension ? 'home_BP_Q1W_with_thresholds_140_90' : 'routine_anc_visits',
    citation: CITATIONS.ACOG_2024,
  };
}

function fetalMonitoringInterpretation(input) {
  const { nst_reactive, bpp_score, doppler_ua_pi, fhr_baseline_bpm, accelerations, decelerations } = input;
  const nst_category = nst_reactive ? 'category_I_reassuring' : 'category_II_indeterminate';
  let bpp_category = 'normal_if_bpp_8_or_more';
  if (bpp_score < 6) bpp_category = 'abnormal_resuscitate_or_deliver';
  return {
    nst_category, bpp_category, doppler_ua_pi,
    fhr_baseline_bpm, accelerations, decelerations,
    next_step: nst_reactive && bpp_score >= 8 ? 'continue_routine_anc' : 'escalate_to_bpp_then_doppler_then_consider_delivery',
    citation: CITATIONS.ACOG_2024,
  };
}

module.exports = { ancBooking, riskStratification, ancVisitSchedule, gestationalDiabetesScreening, preeclampsiaPrevention, fetalMonitoringInterpretation, CITATIONS, ValidationError };