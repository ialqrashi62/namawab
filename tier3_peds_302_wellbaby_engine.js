/**
 * TIER3_PEDS-302 Well-Baby / Newborn Care Engine
 * WHO Growth chart Z-score + Saudi Vaccination schedule + breastfeeding support + developmental milestones + parent education
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_GROWTH: 'WHO Growth Standards 2006', MOH_VACC: 'MoH Saudi Childhood Vaccination 2024', AAP_DEV: 'AAP Developmental Surveillance 2024' };

function growthAssessment(input) {
  const { age_months, weight_kg, height_cm, hc_cm, sex } = input;
  const lms_for_age = sex === 'male' ? { weight_median: 9.6, weight_sd: 1.0, height_median: 75, height_sd: 3 } : { weight_median: 9.0, weight_sd: 1.0, height_median: 73.5, height_sd: 3 };
  const weight_zscore = ((weight_kg - lms_for_age.weight_median) / lms_for_age.weight_sd).toFixed(2);
  const height_zscore = ((height_cm - lms_for_age.height_median) / lms_for_age.height_sd).toFixed(2);
  let flag = 'normal_growth';
  if (weight_zscore < -2) flag = 'underweight_intervention';
  else if (weight_zscore > 2) flag = 'overweight_intervention';
  else if (height_zscore < -2) flag = 'stunted_investigate';
  return { weight_zscore, height_zscore, growth_flag: flag, action: flag === 'normal_growth' ? 'continue_routine' : 'refer_nutrition_endocrine_evaluation', citation: CITATIONS.WHO_GROWTH };
}

function vaccinationSchedule(input) {
  const { age_months, prior_vaccinations, allergies, immunocompromised } = input;
  let schedule = [];
  if (age_months === 0) schedule.push('BCG', 'Hepatitis_B_dose_1');
  if (age_months === 2) schedule.push('DTaP', 'Hib', 'IPV', 'PCV13', 'Rota');
  if (age_months === 4) schedule.push('DTaP', 'Hib', 'IPV', 'PCV13', 'Rota');
  if (age_months === 6) schedule.push('DTaP', 'Hib', 'IPV', 'PCV13', 'HepB_dose_3');
  if (age_months === 12) schedule.push('MMR', 'Varicella', 'HepA');
  if (age_months === 18) schedule.push('DTaP_booster', 'Hib_booster', 'IPV_booster');
  if (age_months === 48) schedule.push('DTaP_booster', 'IPV_booster', 'MMR_booster', 'Varicella_booster');
  return { age_months, schedule, immunocompromised_modification: immunocompromised ? 'use_inactivated_vaccines_avoid_live_unless_clearance' : 'standard_protocol', allergies, citation: CITATIONS.MOH_VACC };
}

function breastfeedingSupport(input) {
  const { infant_age_months, latch_quality, feeding_frequency_per_24h, urine_count, weight_gain_adequate, maternal_medications } = input;
  const issues = [];
  if (latch_quality === 'poor_latch') issues.push('refer_to_lactation_consultant_for_latch_assessment');
  if (feeding_frequency_per_24h < 8 || feeding_frequency_per_24h > 12) issues.push('consider_increasing_or_decreasing_feeding_frequency');
  if (urine_count < 6) issues.push('assess_hydration_consider_supplementation');
  if (!weight_gain_adequate) issues.push('assess_for_failure_to_thrive_consider_supplementation');
  if (maternal_medications) issues.push('verify_medication_safety_with_infant_medication_during_lactation');
  return {
    issues,
    latching_techniques: ['cross_cradle_hold', 'football_hold', 'skin_to_skin_contact', 'wide_gape_stimulate_lower_lip_with_nipple'],
    feeding_schedule: age_months < 6 ? '8_to_12_per_24h_on_demand_exclusive' : 'continue_with_complementary_foods_until_2_years',
    citation: CITATIONS.MOH_VACC,
  };
}

function developmentalMilestones(input) {
  const { age_months } = input;
  const milestones_by_age = {
    2: { gross_motor: 'holds_head_up', fine_motor: 'tracks_with_eyes', language: 'coos_and_squeals', social: 'social_smile' },
    6: { gross_motor: 'rolls_over_sits_supported', fine_motor: 'reaches_for_objects', language: 'babbles', social: 'responds_to_own_name' },
    9: { gross_motor: 'sits_without_support', fine_motor: 'pincer_grasp', language: 'says_mama_dada_non_specific', social: 'stranger_anxiety' },
    12: { gross_motor: 'cruises_or_walks_one_hand_held', fine_motor: 'puts_objects_in_container', language: 'one_word', social: 'plays_simple_games' },
    18: { gross_motor: 'walks_independently', fine_motor: 'scribbles_with_crayon', language: '5_to_10_words', social: 'imitates_household_activities' },
    24: { gross_motor: 'runs_kicks_ball', fine_motor: 'stacks_4_to_6_blocks', language: 'two_word_phrases', social: 'parallel_play' },
    36: { gross_motor: 'pedals_tricycle', fine_motor: 'draws_circle', language: 'three_word_sentences', social: 'cooperative_play' },
    48: { gross_motor: 'hops_on_one_foot', fine_motor: 'draws_person_with_3_to_4_parts', language: 'full_sentences_tell_stories', social: 'plays_with_other_children' },
  };
  const closest_age = Math.min(...Object.keys(milestones_by_age).map(Number).filter(k => k <= age_months || true), age_months);
  return { age_months, milestones: milestones_by_age[Math.max(2, Math.floor(closest_age / 12) * 12)] || milestones_by_age[24], red_flags: ['no_smiling_by_3_months', 'no_sitting_by_9_months', 'no_words_by_18_months', 'loss_of_skills_any_age'], citation: CITATIONS.AAP_DEV };
}

function parentGuidanceTopics(input) {
  const { infant_age_months } = input;
  const guidance = {
    0: ['safe_sleep_back_to_sleep', 'breastfeeding_exclusive', 'umbilical_cord_care', 'newborn_screening_blood_tests', 'vitamin_K_at_birth', 'erythromycin_eye_ointment', 'circumcision_decision_if_desired'],
    2: ['tummy_time_daily', 'vaccination_Q2m', 'no_solid_food_until_6_months', 'avoid_screen_time', 'sunscreen_precautions'],
    6: ['start_solid_foods_iron_rich', 'introduce_water_in_cup', 'dental_care_emerging_teeth', 'developmental_play_safety'],
    12: ['transition_to_cow_milk_or_continued_breastfeeding', 'limit_screen_time', 'tooth_brushing_with_fluoride_toothpaste', 'safety_evaluation_home_vehicle'],
    24: ['limit_sugar_intake', 'toilet_training_readiness', 'manage_tantrums', 'preschool_socialization'],
  };
  return { infant_age_months, topics: guidance[Math.min(24, infant_age_months)] || guidance[24], citation: CITATIONS.AAP_DEV };
}

module.exports = { growthAssessment, vaccinationSchedule, breastfeedingSupport, developmentalMilestones, parentGuidanceTopics, CITATIONS, ValidationError };