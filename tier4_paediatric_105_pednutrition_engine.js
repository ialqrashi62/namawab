'use strict';
// TIER4_PAEDIATRIC-105 Pediatric Nutrition
const CITATIONS = ['AAP_Pediatric_Nutrition','WHO_Infant_Feeding'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function infantFeeding(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const feeding_type = ensureEnum(input.feeding_type || 'exclusive_breastfeeding', ['exclusive_breastfeeding','mixed','formula_only','complementary_only','table_foods'], 'feeding_type');
  const recommendations = [];
  if (age_months < 6) {
    if (feeding_type !== 'exclusive_breastfeeding') recommendations.push('support_exclusive_breastfeeding_under_6mo');
  } else if (age_months >= 6 && age_months < 12) {
    recommendations.push('introduce_complementary_foods');
    recommendations.push('iron_rich_foods_iron_fortified_cereal');
    recommendations.push('continue_breastfeeding_until_12_months');
  } else if (age_months >= 12 && age_months < 24) {
    recommendations.push('transition_to_cow_milk_whole_milk_until_2_years');
    recommendations.push('limit_juice_under_4_oz_per_day');
  } else {
    recommendations.push('balanced_diet_per_mypyramid');
    recommendations.push('limit_screen_time_with_meals');
  }
  return { age_months, feeding_type, recommendations, citations: CITATIONS };
}

function pickyEaterScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_years = ensureNumber(input.age_years, 'age_years');
  const food_groups_refused = ensureNumber(input.food_groups_refused || 0, 'food_groups_refused');
  const weight_loss = !!input.weight_loss;
  const mealtime_behavior = ensureEnum(input.mealtime_behavior || 'normal', ['normal','refuses_to_sit','tantrums','refuses_textures','avoidance_of_food_group'], 'mealtime_behavior');
  const concern = food_groups_refused >= 4 || weight_loss || mealtime_behavior === 'refuses_textures';
  return { age_years, food_groups_refused, weight_loss, mealtime_behavior, concern, recommendation: concern ? 'feeding_team_evaluation_occupational_therapy_dietitian' : 'continue_structured_meals_repeated_exposure_15_attempts', citations: CITATIONS };
}

module.exports = { infantFeeding, pickyEaterScreen, CITATIONS, ValidationError };