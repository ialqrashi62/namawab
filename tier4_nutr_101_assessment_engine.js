'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { who_diet: 'WHO Healthy Diet 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function dietQuality(input) {
  ensureObj(input, 'input');
  const fruits_servings_per_day = ensureNumber(input.fruits_servings_per_day, 'fruits_servings_per_day');
  const vegetables_servings_per_day = ensureNumber(input.vegetables_servings_per_day, 'vegetables_servings_per_day');
  const whole_grains = ensureEnum(input.whole_grains, ['none','1_2','3_4','5plus'], 'whole_grains');
  const processed_meat = !!input.processed_meat;
  const sugary_drinks = ensureNumber(input.sugary_drinks, 'sugary_drinks');
  const fish_per_week = ensureNumber(input.fish_per_week, 'fish_per_week');
  let score = 0;
  if (fruits_servings_per_day >= 2) { score += 1; }
  if (vegetables_servings_per_day >= 3) { score += 1; }
  if (whole_grains === '3_4' || whole_grains === '5plus') { score += 1; }
  if (!processed_meat) { score += 1; }
  if (sugary_drinks <= 1) { score += 1; }
  if (fish_per_week >= 2) { score += 1; }
  let quality;
  if (score >= 5) { quality = 'excellent'; }
  else if (score >= 3) { quality = 'good'; }
  else { quality = 'needs_improvement'; }
  return { fruits_servings_per_day, vegetables_servings_per_day, whole_grains, processed_meat, sugary_drinks, fish_per_week, score, quality, citations:['who_diet'] };
}

function mediterraneanScore(input) {
  ensureObj(input, 'input');
  const olive_oil = !!input.olive_oil;
  const vegetables_servings = ensureNumber(input.vegetables_servings, 'vegetables_servings');
  const fruits_servings = ensureNumber(input.fruits_servings, 'fruits_servings');
  const red_meat_per_week = ensureNumber(input.red_meat_per_week, 'red_meat_per_week');
  const fish_per_week = ensureNumber(input.fish_per_week, 'fish_per_week');
  const nuts_per_week = ensureNumber(input.nuts_per_week, 'nuts_per_week');
  const wine_per_day = ensureNumber(input.wine_per_day, 'wine_per_day');
  const legumes_per_week = ensureNumber(input.legumes_per_week, 'legumes_per_week');
  let score = 0;
  if (olive_oil) { score += 1; }
  if (vegetables_servings >= 2) { score += 1; }
  if (fruits_servings >= 2) { score += 1; }
  if (red_meat_per_week < 1) { score += 1; }
  if (fish_per_week >= 2) { score += 1; }
  if (nuts_per_week >= 3) { score += 1; }
  if (wine_per_day <= 1) { score += 1; }
  if (legumes_per_week >= 3) { score += 1; }
  let adherence;
  if (score >= 6) { adherence = 'high'; }
  else if (score >= 4) { adherence = 'moderate'; }
  else { adherence = 'low'; }
  return { olive_oil, vegetables_servings, fruits_servings, red_meat_per_week, fish_per_week, nuts_per_week, wine_per_day, legumes_per_week, score, adherence };
}

module.exports = { dietQuality, mediterraneanScore, CITATIONS, ValidationError };
