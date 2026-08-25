'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aact: 'American Academy of Clinical Toxicology 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function acetaminophen(input) {
  ensureObj(input, 'input');
  const serum_level_ug_ml = ensureNumber(input.serum_level_ug_ml, 'serum_level_ug_ml');
  const hours_post_ingestion = ensureNumber(input.hours_post_ingestion, 'hours_post_ingestion');
  const on_rumack_line = ensureNumber(input.on_rumack_line, 'on_rumack_line');
  let treatment;
  if (on_rumack_line >= 1) { treatment = 'n_acetylcysteine_20hr'; }
  else if (serum_level_ug_ml >= 75 && hours_post_ingestion >= 4) { treatment = 'n_acetylcysteine_per_protocol'; }
  else if (serum_level_ug_ml >= 10) { treatment = 'monitoring_repeat_levels'; }
  else { treatment = 'observation_no_treatment'; }
  return { serum_level_ug_ml, hours_post_ingestion, on_rumack_line, treatment };
}

function opioid(input) {
  ensureObj(input, 'input');
  const respiratory_rate = ensureNumber(input.respiratory_rate, 'respiratory_rate');
  const pupil_size = ensureEnum(input.pupil_size, ['miotic','normal','mydriatic'], 'pupil_size');
  const gcs = ensureNumber(input.gcs, 'gcs');
  const suspected = !!input.suspected;
  let intervention;
  if (respiratory_rate < 12 || gcs < 8) { intervention = 'naloxone_0_04_0_1mg_iv'; }
  else if (suspected && pupil_size === 'miotic' && respiratory_rate < 16) { intervention = 'observe_consider_naloxone'; }
  else { intervention = 'monitor_observation'; }
  return { respiratory_rate, pupil_size, gcs, suspected, intervention };
}

module.exports = { acetaminophen, opioid, CITATIONS, ValidationError };
