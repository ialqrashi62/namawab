// filepath: tier5_sdoh_ext_105_functional_engine.js
// TIER5_SDOH_EXT-105: Functional disability (Katz ADL, Lawton IADL, WHODAS, PEDI, FIM)
'use strict';

const CITATIONS = [
  'Katz_ADL_1963',
  'Lawton_IADL_1969',
  'WHODAS_2_2010',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function katz_adl(req) {
  const items = ['bathing','dressing','toileting','transfer','continence','feeding'];
  let total = 0;
  for (const i of items) {
    const v = req[i];
    if (!Number.isInteger(v) || v < 0 || v > 1) throw new ValidationError(`${i} 0..1`, i);
    total += v;
  }
  let level;
  if (total === 0) level = 'A_dependent';
  else if (total <= 2) level = 'B_severely_dependent';
  else if (total <= 4) level = 'C_moderately_dependent';
  else if (total <= 5) level = 'D_minimally_dependent';
  else level = 'E_independent';
  return { katz_total: total, level };
}

function lawton_iadl_v2(req) {
  const items = ['use_telephone','shopping','managing_finance','handle_medication','laundry','transportation','food_preparation','housekeeping'];
  let total = 0;
  for (const i of items) {
    const v = req[i];
    if (!Number.isInteger(v) || v < 0 || v > 1) throw new ValidationError(`${i} 0..1`, i);
    total += v;
  }
  return { lawton_total: total, level: total >= 6 ? 'independent_to_mild' : total >= 3 ? 'moderate' : 'severe' };
}

function whodas(req) {
  const items = ['understanding','getting_around','self_care','getting_along','life_activities','participation'];
  for (const i of items) {
    const v = req[i];
    if (!Number.isInteger(v) || v < 0 || v > 4) throw new ValidationError(`${i} 0..4`, i);
  }
  const total = items.reduce((s, i) => s + req[i], 0);
  let category;
  if (total === 0) category = 'no_disability';
  else if (total <= 5) category = 'mild_disability';
  else if (total <= 14) category = 'moderate_disability';
  else if (total <= 19) category = 'severe_disability';
  else category = 'extreme_disability';
  return { whodas_total: total, category };
}

function pedi_class(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.fine_motor, 'fine_motor');
  ensureNumber(req.gross_motor, 'gross_motor');
  ensureNumber(req.self_care_domain, 'self_care_domain');
  ensureNumber(req.social_emotional_domain, 'social_emotional_domain');
  if (req.age_years < 2 || req.age_years > 21) throw new ValidationError('age 2..21', 'age_years');

  const composite = req.fine_motor + req.gross_motor + req.self_care_domain + req.social_emotional_domain;
  let category;
  if (composite < 30) category = 'moderate_to_severe_below_age_expectation';
  else if (composite < 60) category = 'mild_below_age_expectation';
  else category = 'within_or_above_age_expectation';

  return { pedi_composite: composite, category };
}

function fim(req) {
  const items = ['eating','grooming','bathing','upper_dressing','lower_dressing','toileting','bladder','bowel','chair_bed_transfer','toilet_transfer','tub_shower_transfer','walk_wheelchair','stairs','comprehension','expression','social','problem_solving','memory'];
  for (const i of items) {
    const v = req[i];
    if (!Number.isInteger(v) || v < 1 || v > 7) throw new ValidationError(`${i} 1..7`, i);
  }
  const motor = ['eating','grooming','bathing','upper_dressing','lower_dressing','toileting','bladder','bowel','chair_bed_transfer','toilet_transfer','tub_shower_transfer','walk_wheelchair','stairs'].reduce((s, i) => s + req[i], 0);
  const cognitive = ['comprehension','expression','social','problem_solving','memory'].reduce((s, i) => s + req[i], 0);
  const total = motor + cognitive;
  let goal;
  if (total >= 100) goal = 'modified_independence_goal_resume_community_or_modification';
  else if (total >= 70) goal = 'rehabilitate_towards_modified_independence';
  else if (total >= 50) goal = 'rehabilitate_within_an_inpatient_facility';
  else if (total >= 25) goal = 'maximal_assistance_setup_for_long_term_care';
  else goal = 'total_assistance_setup_for_snf_long_term_care';

  return { fim_total: total, motor, cognitive, goal };
}

function funcs() { return { katz_adl, lawton_iadl_v2, whodas, pedi_class, fim }; }
module.exports = { funcs, CITATIONS, ValidationError };
