// filepath: tier5_dental_ext_102_ortho_engine.js
// TIER5_DENTAL_EXT-102: Orthodontics
'use strict';

const CITATIONS = [
  'AAO_Orthodontic_Classification_2023',
  'Angle_Classification_1899',
  'WFO_Orthognathic_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function angle_class(req) {
  ensureStr(req.molar_class, 'molar_class');
  ensureEnum(req.molar_class, 'molar_class', ['class_i','class_ii_division_1','class_ii_division_2','class_iii']);
  ensureNumber(req.overjet_mm, 'overjet_mm');
  ensureNumber(req.overbite_mm, 'overbite_mm');
  ensureBool(req.skeletal_origin, 'skeletal_origin');

  let recommendation;
  if (req.molar_class === 'class_ii_division_1' && req.overjet_mm >= 6) recommendation = 'consider_camouflage_or_orthognathic_then_review';
  else if (req.molar_class === 'class_iii' && req.skeletal_origin) recommendation = 'consider_orthognathic_surgery_review';
  else if (req.molar_class === 'class_ii_division_2') recommendation = 'continue_with_fixed_appliance_or_aligner';
  else if (req.molar_class === 'class_i') recommendation = 'continue_with_routine_orthodontic_review';
  else recommendation = 'continue_with_review';
  return { recommendation };
}

function crossbite(req) {
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['anterior_posterior_unilateral','anterior_posterior_bilateral','posterior_unilateral','posterior_bilateral','buccal','lingual']);
  ensureBool(req.skeletal_origin, 'skeletal_origin');
  ensureNumber(req.age, 'age');
  ensureBool(req.fixed_appliance, 'fixed_appliance');
  ensureBool(req.expander_planned, 'expander_planned');

  let plan;
  if (req.skeletal_origin && req.age >= 16) plan = 'continue_with_orthognathic_review';
  else if (req.age < 14 && req.expander_planned) plan = 'continue_with_expansion_review';
  else if (req.fixed_appliance) plan = 'continue_with_fixed_appliance_review';
  else plan = 'continue_with_standard_orthodontic_review';
  return { plan };
}

function openbite(req) {
  ensureNumber(req.openbite_mm, 'openbite_mm');
  ensureBool(req.skeletal_origin, 'skeletal_origin');
  ensureBool(req.tongue_thrust_present, 'tongue_thrust_present');
  ensureNumber(req.age, 'age');
  ensureBool(req.habit_breaker_planned, 'habit_breaker_planned');

  let plan;
  if (req.skeletal_origin && req.openbite_mm >= 4) plan = 'continue_with_orthognathic_review';
  else if (req.tongue_thrust_present && req.habit_breaker_planned) plan = 'continue_with_myo_then_orthodontic';
  else if (req.age < 12) plan = 'continue_with_early_interceptive_review';
  else plan = 'continue_with_standard_orthodontic_review';
  return { plan };
}

function deepbite(req) {
  ensureNumber(req.deepbite_mm, 'deepbite_mm');
  ensureBool(req.traumatic_gingival_injury_present, 'traumatic_gingival_injury_present');
  ensureBool(req.palatal_trauma_to_maxillary, 'palatal_trauma_to_maxillary');
  ensureNumber(req.age, 'age');

  let plan;
  if (req.deepbite_mm >= 6 && req.traumatic_gingival_injury_present) plan = 'continue_with_intrusion_or_orthognathic_review';
  else if (req.deepbite_mm >= 4) plan = 'continue_with_intrusion_or_orthodontic_review';
  else if (req.palatal_trauma_to_maxillary) plan = 'continue_with_intrusion_review';
  else plan = 'continue_with_review';
  return { plan };
}

function orthognathic(req) {
  ensureBool(req.skeletal_discrepancy_confirmed, 'skeletal_discrepancy_confirmed');
  ensureNumber(req.anb_angle_degrees, 'anb_angle_degrees');
  ensureNumber(req.sna_angle_degrees, 'sna_angle_degrees');
  ensureNumber(req.snb_angle_degrees, 'snb_angle_degrees');
  ensureNumber(req.age, 'age');
  ensureBool(req.presurgical_orthodontics_planned, 'presurgical_orthodontics_planned');

  let plan;
  if (!req.skeletal_discrepancy_confirmed) plan = 'continue_with_orthodontic_only_review';
  else if (req.age < 18) plan = 'consider_deferring_surgery_until_growth_complete';
  else if (req.anb_angle_degrees >= 5 && req.presurgical_orthodontics_planned) plan = 'continue_with_orthognathic_then_orthodontic';
  else if (req.anb_angle_degrees <= -2) plan = 'continue_with_mandibular_setback_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function retainer(req) {
  ensureStr(req.retainer_type, 'retainer_type');
  ensureEnum(req.retainer_type, 'retainer_type', ['hawley','clear_essix','fixed_bonded_lower','fixed_bonded_upper','spring_aligner','wraparound']);
  ensureNumber(req.retention_years_planned, 'retention_years_planned');
  ensureBool(req.lifelong_retention_desired, 'lifelong_retention_desired');
  ensureBool(req.occlusal_settling_acceptable, 'occlusal_settling_acceptable');

  let recommendation;
  if (req.lifelong_retention_desired && req.fixed_bonded_lower !== undefined) recommendation = 'continue_with_lifelong_fixed_retainer_review';
  else if (req.retainer_type === 'fixed_bonded_upper') recommendation = 'continue_with_standard_fixed_review';
  else if (req.retention_years_planned >= 5) recommendation = 'continue_with_long_term_retention_review';
  else recommendation = 'continue_with_standard_retention_review';
  return { recommendation };
}

function funcs() { return { angle_class, crossbite, openbite, deepbite, orthognathic, retainer }; }
module.exports = { funcs, CITATIONS, ValidationError };
