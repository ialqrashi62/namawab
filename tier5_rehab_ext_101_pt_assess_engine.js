// filepath: tier5_rehab_ext_101_pt_assess_engine.js
// TIER5_REHAB_EXT-101: Physical Therapy assessment (FIM, AM-PAC, 6MWT, Berg, MRC)
'use strict';

const CITATIONS = [
  'APTA_Guidelines_Geri_2018',
  'CMS_FIM_Instrument_2019',
  'AM_PAC_Activity_Measure_Post_Acute_Care_2018',
  'Berg_Balance_Scale_Validation',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureInt(v, f, lo, hi) {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < lo || v > hi) throw new ValidationError(`${f} must be integer in [${lo}..${hi}]`, f);
}

function fim_total(req) {
  ensureNumber(req.eating, 'eating'); ensureNumber(req.grooming, 'grooming'); ensureNumber(req.bathing, 'bathing');
  ensureNumber(req.upper_body_dressing, 'upper_body_dressing'); ensureNumber(req.lower_body_dressing, 'lower_body_dressing');
  ensureNumber(req.toileting, 'toileting'); ensureNumber(req.bladder, 'bladder'); ensureNumber(req.bowel, 'bowel');
  ensureNumber(req.chair_bed_transfer, 'chair_bed_transfer'); ensureNumber(req.toilet_transfer, 'toilet_transfer');
  ensureNumber(req.tub_shower_transfer, 'tub_shower_transfer');
  ensureNumber(req.walk_wheelchair, 'walk_wheelchair'); ensureNumber(req.stairs, 'stairs');
  ensureNumber(req.comprehension, 'comprehension'); ensureNumber(req.expression, 'expression');
  ensureNumber(req.social_interaction, 'social_interaction'); ensureNumber(req.problem_solving, 'problem_solving');
  ensureNumber(req.memory, 'memory');
  const fields = ['eating','grooming','bathing','upper_body_dressing','lower_body_dressing','toileting','bladder','bowel','chair_bed_transfer','toilet_transfer','tub_shower_transfer','walk_wheelchair','stairs','comprehension','expression','social_interaction','problem_solving','memory'];
  for (const f of fields) {
    const v = req[f];
    if (!Number.isInteger(v) || v < 1 || v > 7) throw new ValidationError(`${f} must be integer in [1..7]`, f);
  }
  const motor = req.eating + req.grooming + req.bathing + req.upper_body_dressing + req.lower_body_dressing + req.toileting + req.bladder + req.bowel + req.chair_bed_transfer + req.toilet_transfer + req.tub_shower_transfer + req.walk_wheelchair + req.stairs;
  const cognitive = req.comprehension + req.expression + req.social_interaction + req.problem_solving + req.memory;
  const total = motor + cognitive;
  let category;
  if (total >= 100) category = 'minimal_assistance_independent';
  else if (total >= 75) category = 'modified_independence';
  else if (total >= 50) category = 'moderate_assistance_rehab_potential';
  else if (total >= 25) category = 'maximal_assistance_long_term_care';
  else category = 'total_assistance_skilled_nursing';

  return { fim_total: total, motor_score: motor, cognitive_score: cognitive, category, citations: CITATIONS };
}

function berg_balance(req) {
  const item_names = ['sitting_balance','standing_from_sitting','standing_unsupported','sitting_to_standing','transfers','standing_with_eyes_closed','standing_with_feet_together','reaching_forward','picking_up_object','turning_to_look_behind','turning_360_degrees','placing_alternate_foot_on_stool','standing_with_one_foot_in_front','standing_on_one_foot'];
  for (const n of item_names) {
    const v = req[n];
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 4) throw new ValidationError(`${n} must be integer in [0..4]`, n);
  }
  const total = item_names.reduce((s, n) => s + req[n], 0);
  let fall_risk;
  if (total >= 45) fall_risk = 'low';
  else if (total >= 36) fall_risk = 'medium';
  else if (total >= 20) fall_risk = 'high';
  else fall_risk = 'very_high_imminent_fall_risk';

  return { berg_total: total, fall_risk, citations: CITATIONS };
}

function six_min_walk(req) {
  ensureNumber(req.baseline_distance_m, 'baseline_distance_m');
  ensureNumber(req.current_distance_m, 'current_distance_m');
  ensureNumber(req.predicted_distance_m, 'predicted_distance_m');
  if (req.baseline_distance_m <= 0 || req.predicted_distance_m <= 0) throw new ValidationError('distances must be >0', 'baseline_distance_m');

  const change_pct = ((req.current_distance_m - req.baseline_distance_m) / req.baseline_distance_m) * 100;
  const pct_predicted = (req.current_distance_m / req.predicted_distance_m) * 100;
  return {
    baseline_m: req.baseline_distance_m,
    current_m: req.current_distance_m,
    predicted_m: req.predicted_distance_m,
    change_pct: Math.round(change_pct * 10) / 10,
    pct_predicted: Math.round(pct_predicted * 10) / 10,
    clinically_significant_change: Math.abs(change_pct) >= 14,
    citations: CITATIONS,
  };
}

function mrc_strength(req) {
  const muscle_groups = ['shoulder_abduction','elbow_flexion','wrist_extension','hip_flexion','knee_extension','ankle_dorsiflexion'];
  for (const m of muscle_groups) {
    const v = req[m];
    if (!Number.isInteger(v) || v < 0 || v > 5) throw new ValidationError(`${m} must be integer in [0..5]`, m);
  }
  const total = muscle_groups.reduce((s, m) => s + req[m], 0);
  const mean = total / muscle_groups.length;
  let icu_weakness;
  if (mean < 3) icu_weakness = 'severe_icu_acquired_weakness';
  else if (mean < 4) icu_weakness = 'moderate_weakness';
  else icu_weakness = 'adequate_strength';

  return { mrc_total: total, mean_grade: Math.round(mean * 100) / 100, icu_weakness, citations: CITATIONS };
}

function educate_home_program(req) {
  ensureNumber(req.functional_goals_met_pct, 'functional_goals_met_pct');
  ensureNumber(req.sessions_attended, 'sessions_attended');
  ensureNumber(req.sessions_prescribed, 'sessions_prescribed');
  ensureNumber(req.knowledge_test_pct, 'knowledge_test_pct');
  ensureStr(req.caregiver_able, 'caregiver_able');
  ensureEnum(req.caregiver_able, 'caregiver_able', ['yes','partial','no']);
  if (req.sessions_prescribed <= 0) throw new ValidationError('sessions_prescribed >0', 'sessions_prescribed');
  if (req.knowledge_test_pct < 0 || req.knowledge_test_pct > 100) throw new ValidationError('knowledge_test_pct 0..100', 'knowledge_test_pct');

  const adherence = (req.sessions_attended / req.sessions_prescribed) * 100;
  const ready_discharge = req.functional_goals_met_pct >= 80 && adherence >= 80 && req.knowledge_test_pct >= 80 && req.caregiver_able !== 'no';
  return {
    functional_goals_met_pct: req.functional_goals_met_pct,
    session_adherence_pct: Math.round(adherence * 10) / 10,
    knowledge_test_pct: req.knowledge_test_pct,
    caregiver_able: req.caregiver_able,
    ready_for_discharge: ready_discharge,
    citation: CITATIONS[0],
  };
}

function funcs() {
  return { fim_total, berg_balance, six_min_walk, mrc_strength, educate_home_program };
}

module.exports = { funcs, CITATIONS, ValidationError };
