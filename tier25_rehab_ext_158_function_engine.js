// filepath: tier25_rehab_ext_158_function_engine.js
// TIER25_REHAB-158: Functional assessment (FIM, Barthel, mobility)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function fim_score(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.eating, 'eating');
  ensureNumber(req.grooming, 'grooming');
  ensureNumber(req.bathing, 'bathing');
  ensureNumber(req.dressing_upper, 'dressing_upper');
  ensureNumber(req.dressing_lower, 'dressing_lower');
  ensureNumber(req.toileting, 'toileting');
  ensureNumber(req.bladder_control, 'bladder');
  ensureNumber(req.bowel_control, 'bowel');
  ensureNumber(req.chair_bed_transfer, 'transfer');
  ensureNumber(req.toilet_transfer, 'toilet_tx');
  ensureNumber(req.tub_shower_transfer, 'tub_tx');
  ensureNumber(req.walk_wheelchair, 'walk');
  ensureNumber(req.stairs, 'stairs');
  const motor = req.eating + req.grooming + req.bathing + req.dressing_upper + req.dressing_lower + req.toileting + req.bladder_control + req.bowel_control + req.chair_bed_transfer + req.toilet_transfer + req.tub_shower_transfer + req.walk_wheelchair + req.stairs;
  ensureNumber(req.comprehension, 'comprehension');
  ensureNumber(req.expression, 'expression');
  ensureNumber(req.social_interaction, 'social');
  ensureNumber(req.problem_solving, 'problem');
  ensureNumber(req.memory, 'memory');
  const cognitive_score = req.comprehension + req.expression + req.social_interaction + req.problem_solving + req.memory;
  const total = motor + cognitive_score;
  let status;
  if (total >= 100) status = 'fim_independent_modified_independence';
  else if (total >= 60) status = 'fim_moderate_assistance';
  else if (total >= 40) status = 'fim_maximal_assistance';
  else status = 'fim_total_dependency';
  return { status, total };
}

function barthel(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.feeding, 'feeding');
  ensureNumber(req.bathing, 'bathing');
  ensureNumber(req.grooming, 'grooming');
  ensureNumber(req.dressing, 'dressing');
  ensureNumber(req.bowels, 'bowels');
  ensureNumber(req.bladder, 'bladder');
  ensureNumber(req.toilet_use, 'toilet');
  ensureNumber(req.chair_bed_transfer, 'chair_bed');
  ensureNumber(req.mobility, 'mobility');
  ensureNumber(req.stairs, 'stairs');
  const total = req.feeding + req.bathing + req.grooming + req.dressing + req.bowels + req.bladder + req.toilet_use + req.chair_bed_transfer + req.mobility + req.stairs;
  let status;
  if (total >= 85) status = 'barthel_mostly_independent';
  else if (total >= 60) status = 'barthel_moderate_dependency';
  else if (total >= 35) status = 'barthel_severe_dependency';
  else status = 'barthel_total_dependency';
  return { status, total };
}

function mobility_index(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.mobility_level, 'mobility_level', ['bedbound','sitting_unsupported','sitting_supported','standing_unsupported','standing_supported','transfers','household_ambulator','community_ambulator','stairs_independent','stairs_with_assist','unknown','other']);
  ensureNumber(req.distance_m, 'distance');
  ensureEnum(req.aid, 'aid', ['none','single_cane','two_canest','crutches','walker','wheelchair','powered_wheelchair','other']);
  ensureBool(req.falls_history, 'falls');
  ensureNumber(req.timed_up_and_go_sec, 'tug');
  let status;
  if (req.mobility_level === 'bedbound') status = 'bedbound_immediate_mobility_plan';
  else if (req.mobility_level === 'community_ambulator' && req.timed_up_and_go_sec < 12) status = 'community_ambulator_low_fall_risk';
  else if (req.timed_up_and_go_sec >= 30) status = 'high_fall_risk_review_aid';
  else if (req.falls_history && req.aid === 'none') status = 'fall_history_aid_recommended';
  else status = 'mobility_appropriate';
  return { status, level: req.mobility_level };
}

function grip_strength(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.left_kg, 'left');
  ensureNumber(req.right_kg, 'right');
  ensureEnum(req.dominant_hand, 'dominant', ['left','right','ambidextrous','unknown','other']);
  ensureNumber(req.age, 'age');
  ensureEnum(req.gender, 'gender', ['male','female','other','unknown','other']);
  let avg = (req.left_kg + req.right_kg) / 2;
  let status;
  if (req.age > 70 && avg < 20) status = 'low_grip_sarcopenia_review';
  else if (req.age <= 70 && avg < 30) status = 'low_grip_reassess';
  else status = 'grip_strength_normal';
  return { status, avg };
}

function rom(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.joint, 'joint', ['shoulder','elbow','wrist','hip','knee','ankle','cervical','thoracic','lumbar','other']);
  ensureNumber(req.flexion_degrees, 'flex');
  ensureNumber(req.extension_degrees, 'ext');
  ensureNumber(req.abduction_degrees, 'abd');
  ensureBool(req.pain_present, 'pain');
  ensureEnum(req.end_feel, 'end_feel', ['normal','firm','hard','soft','empty','boggy','spasm','other']);
  let status;
  if (req.pain_present && req.end_feel === 'empty') status = 'empty_end_feel_serious_pathology';
  else if (req.flexion_degrees < 90 && req.joint === 'shoulder') status = 'shoulder_flexion_limited_review';
  else if (req.flexion_degrees < 90 && req.joint === 'knee') status = 'knee_flexion_limited_review';
  else status = 'rom_appropriate';
  return { status, joint: req.joint };
}

const CITATIONS = { FIM_2024: 'FIM 2024', BARTHEL_2024: 'Barthel 2024', EWGSOP_SARC_2024: 'EWGSOP Sarcopenia 2024' };

function funcs() { return { fim_score, barthel, mobility_index, grip_strength, rom }; }
module.exports = { funcs, CITATIONS, ValidationError };