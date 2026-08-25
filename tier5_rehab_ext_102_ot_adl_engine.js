// filepath: tier5_rehab_ext_102_ot_adl_engine.js
// TIER5_REHAB_EXT-102: OT/ADL independence (Barthel, Lawton, splint, ergonomics)
'use strict';

const CITATIONS = [
  'AOTA_Standards_2019',
  'Barthel_Index_Validation',
  'Lawton_Brody_IADL_1969',
  'UEFT_Tubingen_Splint_Guidelines',
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

function barthel_index(req) {
  const items = ['feeding','bathing','grooming','dressing_upper','dressing_lower','toileting','transfers_chair_bed','mobility_walk_50m','stairs','bowel_control','bladder_control'];
  const max_map = { feeding: 10, bathing: 5, grooming: 5, dressing_upper: 5, dressing_lower: 5, toileting: 10, transfers_chair_bed: 15, mobility_walk_50m: 15, stairs: 10, bowel_control: 10, bladder_control: 10 };
  for (const i of items) {
    if (typeof req[i] !== 'number' || req[i] < 0 || req[i] > max_map[i]) throw new ValidationError(`${i} must be 0..${max_map[i]}`, i);
  }
  const total = items.reduce((s, i) => s + req[i], 0);
  let category;
  if (total >= 90) category = 'minimal_dependency';
  else if (total >= 70) category = 'slight_dependency';
  else if (total >= 50) category = 'moderate_dependency';
  else if (total >= 25) category = 'severe_dependency';
  else category = 'total_dependency';

  return { barthel_total: total, category, citations: CITATIONS };
}

function lawton_iadl(req) {
  const items = ['use_telephone','shopping','manage_finances','handle_medications','laundry','mode_of_transportation','food_preparation','housekeeping'];
  for (const i of items) {
    if (typeof req[i] !== 'number' || req[i] < 0 || req[i] > 1) throw new ValidationError(`${i} must be 0..1`, i);
  }
  const total = items.reduce((s, i) => s + req[i], 0);
  let level;
  if (total >= 7) level = 'independent';
  else if (total >= 5) level = 'mild_assistance_needed';
  else if (total >= 3) level = 'moderate_assistance';
  else level = 'severe_assistance_full_care';
  return { lawton_total: total, level, citations: CITATIONS };
}

function splint_recommend(req) {
  ensureStr(req.joint, 'joint');
  ensureEnum(req.joint, 'joint', ['wrist','hand_fingers','elbow','knee','ankle','thumb']);
  ensureStr(req.goal, 'goal');
  ensureEnum(req.goal, 'goal', ['resting','functional_serial_cast','anti_spasm','positioning','post_surgical']);
  ensureNumber(req.max_rom_degrees, 'max_rom_degrees');

  let pattern = 'resting_pancake';
  if (req.joint === 'wrist' && req.goal === 'resting') pattern = 'resting_wrist_splint_0_to_30';
  else if (req.joint === 'wrist' && req.goal === 'functional') pattern = 'wrist_cockup_0_to_20';
  else if (req.joint === 'hand_fingers' && req.goal === 'anti_spasm') pattern = 'anti_spasticity_ball';
  else if (req.joint === 'elbow' && req.goal === 'post_surgical') pattern = 'elbow_post_op_90_hinged';
  else if (req.joint === 'knee' && req.goal === 'post_surgical') pattern = 'knee_immobilizer_0deg';
  else if (req.joint === 'ankle' && req.goal === 'positioning') pattern = 'ankle_AFO_plantar_90';
  else if (req.joint === 'thumb' && req.goal === 'functional') pattern = 'thumb_spica_short_opponens';

  return {
    joint: req.joint,
    goal: req.goal,
    pattern,
    wear_schedule: req.goal === 'resting' ? 'nighttime_overnight' : 'daytime_with_intermittent_rest',
    citation: CITATIONS[3],
  };
}

function ergonomics_assess(req) {
  ensureNumber(req.monitor_eye_level_offset_cm, 'monitor_eye_level_offset_cm');
  ensureNumber(req.chair_lumbar_support, 'chair_lumbar_support'); // 0..1
  ensureNumber(req.keyboard_height_cm, 'keyboard_height_cm');
  ensureNumber(req.hours_at_desk_per_day, 'hours_at_desk_per_day');
  ensureStr(req.breaks, 'breaks');
  ensureEnum(req.breaks, 'breaks', ['yes_5min_per_hour','infrequent','no_breaks']);
  if (req.chair_lumbar_support < 0 || req.chair_lumbar_support > 1) throw new ValidationError('chair_lumbar_support 0..1', 'chair_lumbar_support');

  const eye_offset = Math.abs(req.monitor_eye_level_offset_cm);
  const eye_score = eye_offset <= 3 ? 100 : eye_offset <= 6 ? 75 : eye_offset <= 10 ? 50 : 20;
  const kb_score = Math.abs(req.keyboard_height_cm - 73) <= 5 ? 100 : 60;
  const break_score = req.breaks === 'yes_5min_per_hour' ? 100 : req.breaks === 'infrequent' ? 50 : 10;
  const chair_score = req.chair_lumbar_support >= 0.8 ? 100 : req.chair_lumbar_support >= 0.5 ? 60 : 30;
  const composite = Math.round(((eye_score + kb_score + break_score + chair_score) / 4) * 10) / 10;

  return {
    composite_ergo_score: composite,
    risk_band: composite >= 80 ? 'low_risk' : composite >= 50 ? 'moderate_educational_consultation' : 'high_consultation_required',
    recommendations: composite < 80 ? ['adjust_chair_lumbar','relocate_monitor_top_eye_level','set_break_alerts','workstation_assessment'] : ['continue_maintenance'],
    citations: CITATIONS,
  };
}

function adl_training_plan(req) {
  ensureStr(req.care_setting, 'care_setting');
  ensureEnum(req.care_setting, 'care_setting', ['home','community','workplace','assisted_living','long_term_care']);
  ensureNumber(req.targets_count, 'targets_count');
  ensureNumber(req.weeks_planned, 'weeks_planned');

  const session_per_week = Math.min(7, Math.max(2, Math.ceil(req.targets_count * 1.5)));
  return {
    care_setting: req.care_setting,
    targets_count: req.targets_count,
    weeks_planned: req.weeks_planned,
    session_per_week,
    total_sessions: session_per_week * req.weeks_planned,
    notes: 'combine_task_practice_with_caregiver_training_and_home_environment_modifications',
    citations: CITATIONS,
  };
}

function funcs() {
  return { barthel_index, lawton_iadl, splint_recommend, ergonomics_assess, adl_training_plan };
}

module.exports = { funcs, CITATIONS, ValidationError };
