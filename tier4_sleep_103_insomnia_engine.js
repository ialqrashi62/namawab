'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm_insomnia: 'AASM Insomnia Treatment 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function insomnia(input) {
  ensureObj(input, 'input');
  const sleep_onset_insomnia = !!input.sleep_onset_insomnia;
  const sleep_maintenance_insomnia = !!input.sleep_maintenance_insomnia;
  const early_awakening = !!input.early_awakening;
  const duration_months = ensureNumber(input.duration_months, 'duration_months');
  const daytime_impairment = !!input.daytime_impairment;
  const chronic = duration_months >= 3;
  let therapy;
  if (chronic && daytime_impairment) { therapy = 'cbt_i_first_line'; }
  else if (chronic) { therapy = 'sleep_hygiene_cbt_i'; }
  else if (sleep_onset_insomnia) { therapy = 'sleep_restriction_consider_z_drug_short_term'; }
  else { therapy = 'sleep_hygiene_education'; }
  return { sleep_onset_insomnia, sleep_maintenance_insomnia, early_awakening, duration_months, daytime_impairment, chronic, therapy, citations:['aasm_insomnia'] };
}

function sleepHygiene(input) {
  ensureObj(input, 'input');
  const consistent_bedtime = !!input.consistent_bedtime;
  const no_caffeine_pm = !!input.no_caffeine_pm;
  const no_alcohol_pm = !!input.no_alcohol_pm;
  const exercise_regularly = !!input.exercise_regularly;
  const no_screens_bed = !!input.no_screens_bed;
  const dark_quiet_room = !!input.dark_quiet_room;
  const total = (consistent_bedtime?1:0) + (no_caffeine_pm?1:0) + (no_alcohol_pm?1:0) + (exercise_regularly?1:0) + (no_screens_bed?1:0) + (dark_quiet_room?1:0);
  let quality;
  if (total >= 5) { quality = 'excellent'; }
  else if (total >= 3) { quality = 'good'; }
  else { quality = 'poor'; }
  return { consistent_bedtime, no_caffeine_pm, no_alcohol_pm, exercise_regularly, no_screens_bed, dark_quiet_room, total, quality };
}

module.exports = { insomnia, sleepHygiene, CITATIONS, ValidationError };
