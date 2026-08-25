'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm: 'American Academy of Sleep Medicine 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function psqi(input) {
  ensureObj(input, 'input');
  const subjective_quality = ensureNumber(input.subjective_quality, 'subjective_quality');
  const sleep_latency = ensureNumber(input.sleep_latency, 'sleep_latency');
  const sleep_duration = ensureNumber(input.sleep_duration, 'sleep_duration');
  const sleep_efficiency = ensureNumber(input.sleep_efficiency, 'sleep_efficiency');
  const sleep_disturbances = ensureNumber(input.sleep_disturbances, 'sleep_disturbances');
  const use_sleep_meds = ensureNumber(input.use_sleep_meds, 'use_sleep_meds');
  const daytime_dysfunction = ensureNumber(input.daytime_dysfunction, 'daytime_dysfunction');
  const total = subjective_quality + sleep_latency + sleep_duration + sleep_efficiency + sleep_disturbances + use_sleep_meds + daytime_dysfunction;
  let quality;
  if (total >= 5) { quality = 'poor_sleeper'; }
  else { quality = 'good_sleeper'; }
  return { subjective_quality, sleep_latency, sleep_duration, sleep_efficiency, sleep_disturbances, use_sleep_meds, daytime_dysfunction, total, quality, citations:['aasm'] };
}

function epworth(input) {
  ensureObj(input, 'input');
  const sitting_reading = ensureNumber(input.sitting_reading, 'sitting_reading');
  const watching_tv = ensureNumber(input.watching_tv, 'watching_tv');
  const sitting_inactive = ensureNumber(input.sitting_inactive, 'sitting_inactive');
  const passenger = ensureNumber(input.passenger, 'passenger');
  const lying_afternoon = ensureNumber(input.lying_afternoon, 'lying_afternoon');
  const sitting_talking = ensureNumber(input.sitting_talking, 'sitting_talking');
  const lunch = ensureNumber(input.lunch, 'lunch');
  const driving = ensureNumber(input.driving, 'driving');
  const total = sitting_reading + watching_tv + sitting_inactive + passenger + lying_afternoon + sitting_talking + lunch + driving;
  let category;
  if (total >= 16) { category = 'excessive_daytime_sleepiness'; }
  else if (total >= 11) { category = 'mild_sleepiness'; }
  else if (total >= 6) { category = 'normal_upper'; }
  else { category = 'normal'; }
  return { sitting_reading, watching_tv, sitting_inactive, passenger, lying_afternoon, sitting_talking, lunch, driving, total, category };
}

module.exports = { psqi, epworth, CITATIONS, ValidationError };
