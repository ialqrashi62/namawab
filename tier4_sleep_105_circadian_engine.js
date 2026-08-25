'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm_cs: 'AASM Circadian Disorders 2015' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function morningEveningness(input) {
  ensureObj(input, 'input');
  const wake_time_hr = ensureNumber(input.wake_time_hr, 'wake_time_hr');
  const peak_alertness_hr = ensureNumber(input.peak_alertness_hr, 'peak_alertness_hr');
  const sleep_time_hr = ensureNumber(input.sleep_time_hr, 'sleep_time_hr');
  let chronotype;
  if (peak_alertness_hr < 11) { chronotype = 'definite_morning'; }
  else if (peak_alertness_hr < 14) { chronotype = 'moderate_morning'; }
  else if (peak_alertness_hr < 17) { chronotype = 'intermediate'; }
  else if (peak_alertness_hr < 20) { chronotype = 'moderate_evening'; }
  else { chronotype = 'definite_evening'; }
  return { wake_time_hr, peak_alertness_hr, sleep_time_hr, chronotype };
}

function shiftWork(input) {
  ensureObj(input, 'input');
  const shift_type = ensureEnum(input.shift_type, ['day','night','rotating','split'], 'shift_type');
  const sleep_duration = ensureNumber(input.sleep_duration, 'sleep_duration');
  const caffeine_use = ensureNumber(input.caffeine_use, 'caffeine_use');
  let schedule;
  if (shift_type === 'night' || shift_type === 'rotating') { schedule = 'short_acting_sleep_aid_melatonin'; }
  else { schedule = 'good_sleep_hygiene'; }
  const fatigue_risk = (sleep_duration < 6 || caffeine_use > 3) ? 'high' : 'low';
  return { shift_type, sleep_duration, caffeine_use, schedule, fatigue_risk };
}

module.exports = { morningEveningness, shiftWork, CITATIONS, ValidationError };
