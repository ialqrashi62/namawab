/**
 * TIER3_PEDS-304 Pediatric Cardiology Engine
 * Pediatric ECG interpretation + Kawasaki disease + congenital heart disease (CHD) screening + pediatric HTN + Murmur classification
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHA_PED: 'AHA Pediatric Heart 2024', AAP_KAWASAKI: 'AAP Kawasaki 2017' };

function pediatricEcgInterpretation(input) {
  const { age_months, heart_rate_bpm, pr_interval_ms, qrs_duration_ms, qt_corrected_ms, axis_degrees, rhythm, rv1_mv, sv6_mv } = input;
  const tachycardia_threshold = age_months < 12 ? 160 : age_months < 60 ? 140 : 120;
  const bradycardia_threshold = age_months < 12 ? 100 : age_months < 60 ? 80 : 60;
  let interpretation = 'normal_age_appropriate';
  if (heart_rate_bpm > tachycardia_threshold) interpretation = 'tachycardia_for_age';
  else if (heart_rate_bpm < bradycardia_threshold) interpretation = 'bradycardia_for_age';
  const prolonged_qt = qt_corrected_ms > 460;
  return {
    heart_rate_bpm, normal_for_age: heart_rate_bpm >= bradycardia_threshold && heart_rate_bpm <= tachycardia_threshold,
    pr_interval_ms, qrs_duration_ms, qt_corrected_ms, prolonged_qt, axis_degrees, rhythm,
    interpretation: prolonged_qt ? 'prolonged_QTc_refer_cardiology' : interpretation === 'normal_age_appropriate' ? 'normal_age_appropriate' : 'abnormal_refer_cardiology',
    citation: CITATIONS.AHA_PED,
  };
}

function kawasakiDisease(input) {
  const { fever_days, conjunctival_injection, oral_mucosal_changes, peripheral_changes, cervical_lymphadenopathy, polymorphous_rash, echocardiogram_coronary_aneurysm } = input;
  const criteria_count = [fever_days >= 5, conjunctival_injection === 'yes', oral_mucosal_changes === 'yes', peripheral_changes === 'yes', cervical_lymphadenopathy === 'yes', polymorphous_rash === 'yes'].filter(Boolean).length;
  let diagnosis = 'incomplete_kawasaki_possible';
  if (criteria_count >= 5) diagnosis = 'classic_kawasaki_disease';
  return {
    diagnosis, criteria_count,
    initial_treatment: ['IVIG_2g_per_kg_infused_over_10_to_12h', 'high_dose_aspirin_initial_then_low_dose_after_defervescence', 'echocardiogram_baseline_2_to_4_weeks_after_discharge'],
    echo_indicated: echocardiogram_coronary_aneurysm === 'yes' ? 'urgent_for_coronary_status' : 'baseline_at_diagnosis_then_Q2W_x_2_weeks_then_Q_month_x_6_months',
    citation: CITATIONS.AAP_KAWASAKI,
  };
}

function congenitalHeartDiseaseScreening(input) {
  const { age_hours, oxygen_saturation_pre_ductal_pct, oxygen_saturation_post_ductal_pct, murmur_present, cyanosis, four_extremity_bp_difference } = input;
  const failed_screen = oxygen_saturation_pre_ductal_pct < 90 || Math.abs(oxygen_saturation_pre_ductal_pct - oxygen_saturation_post_ductal_pct) >= 3;
  let suspected_chd = [];
  if (failed_screen) suspected_chd.push('cyanotic_congenital_heart_disease_cchd');
  if (four_extremity_bp_difference >= 20) suspected_chd.push('coarctation_of_aorta');
  if (murmur_present === 'holosystolic_radiating_to_back') suspected_chd.push('ventricular_septal_defect');
  if (murmur_present === 'continuous_machine_like') suspected_chd.push('patent_ductus_arteriosus');
  return {
    cchd_screen_failed: failed_screen,
    suspected_chd,
    next_step: 'echocardiogram_within_24_to_72h_AND_pediatric_cardiology_consultation',
    citation: CITATIONS.AHA_PED,
  };
}

function pediatricHypertension(input) {
  const { age_years, sex, systolic_bp, diastolic_bp, height_percentile } = input;
  const systolic_95th_percentile = age_years < 13 ? 120 : 130;
  const diastolic_95th_percentile = age_years < 13 ? 80 : 85;
  const hypertensive = systolic_bp >= systolic_95th_percentile || diastolic_bp >= diastolic_95th_percentile;
  return {
    hypertensive, severity: hypertensive ? (systolic_bp >= 30 || diastolic_bp >= 95 ? 'stage_2' : 'stage_1') : 'normal',
    workup: ['renal_doppler', 'renal_function', 'echo_for_coarctation', 'thyroid_function', 'urinalysis', 'plasma_renin_aldosterone'],
    treatment_consideration: 'lifestyle_then_pharmacotherapy_ace_inhibitor_or_amlodipine',
    citation: CITATIONS.AHA_PED,
  };
}

function innocentVsPathologicMurmur(input) {
  const { age_years, murmur_type, location, intensity_grade, radiation, change_with_position, fixed_splitting, click_present } = input;
  let classification = 'innocent';
  if (intensity_grade >= 3 || radiation === 'radiates_to_back' || fixed_splitting || click_present === 'yes') classification = 'pathologic_refer_echo';
  return {
    classification,
    criteria_innocent: ['asymptomatic_normal_growth', 'grade_1_to_2_only', 'no_radiation', 'no_diastolic_component', 'no_click', 'normal_splitting'],
    criteria_pathologic: ['symptomatic_failure_to_thrive', 'grade_3_or_more', 'holosystolic_or_diastolic', 'radiation_to_back', 'fixed_splitting_S2', 'click_present'],
    next_step: classification === 'pathologic_refer_echo' ? 'echocardiogram_and_pediatric_cardiology_consultation' : 'continue_routine_monitoring',
    citation: CITATIONS.AHA_PED,
  };
}

module.exports = { pediatricEcgInterpretation, kawasakiDisease, congenitalHeartDiseaseScreening, pediatricHypertension, innocentVsPathologicMurmur, CITATIONS, ValidationError };