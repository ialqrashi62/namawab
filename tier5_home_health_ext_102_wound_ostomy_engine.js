// filepath: tier5_home_health_ext_102_wound_ostomy_engine.js
// TIER5_HOME_HEALTH_EXT-102: Home wound / ostomy / continence
'use strict';

const CITATIONS = [
  'Wound_Ostomy_Continence_Nurs_2018',
  'WOCN_Ostomy_2020',
  'Hartmann_CBI_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ostomy_pouch_select(req) {
  ensureStr(req.stoma_type, 'stoma_type');
  ensureEnum(req.stoma_type, 'stoma_type', ['colostomy_ascending','colostomy_descending','colostomy_transverse','ileostomy','urostomy','jejunostomy','low_output_bowel_stoma']);
  ensureNumber(req.stoma_height_skin_cm, 'stoma_height_skin_cm');
  ensureNumber(req.peristomal_skin_status, 'peristomal_skin_status'); // 0 healthy, 1 mild irritation, 2 weepy, 3 severe
  ensureStr(req.stoma_output_consistency, 'stoma_output_consistency');
  ensureEnum(req.stoma_output_consistency, 'stoma_output_consistency', ['formed','thick','loose','watery','mixed']);

  let bag;
  if (req.stoma_height_skin_cm < 1 && req.stoma_type === 'urostomy') bag = 'urostomy_two_piece_with_high_output_bag';
  else if (req.peristomal_skin_status >= 2) bag = 'two_piece_with_paste_or_strong_seal_wafer_then_clinician_review';
  else if (req.stoma_height_skin_cm < 1 && req.stoma_type.includes('ileostomy')) bag = 'drainable_two_piece_microsten_with_irrigation_for_high_output';
  else if (req.stoma_output_consistency === 'watery') bag = 'drainable_high_volume';
  else if (req.stoma_output_consistency === 'formed' && req.stoma_type.includes('colostomy')) bag = 'closed_end_two_piece';
  else bag = 'two_piece_drainable_per_system_protocol';

  return {
    stoma_type: req.stoma_type,
    bag,
    peristomal_skin_status: req.peristomal_skin_status,
    stoma_height_skin_cm: req.stoma_height_skin_cm,
  };
}

function wound_care_home(req) {
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['arterial','venous','diabetic_neuropathic','pressure','surgical','traumatic','other']);
  ensureNumber(req.size_cm2, 'size_cm2');
  ensureNumber(req.depth_mm, 'depth_mm');
  ensureNumber(req.exudate_amount, 'exudate_amount'); // 0..3
  ensureBool(req.infection_signs, 'infection_signs');
  ensureBool(req.tunneling_or_undermining, 'tunneling_or_undermining');

  let dressing;
  let frequency;
  if (req.infection_signs) { dressing = 'silver_dressing_or_iodosorb'; frequency = 'every_2_days'; }
  else if (req.exudate_amount >= 2) { dressing = 'hydrofiber_alginate_absorbent_foam'; frequency = 'every_3_days'; }
  else if (req.size_cm2 < 4) { dressing = 'transparent_film_or_hydrocolloid'; frequency = 'every_5_7_days'; }
  else { dressing = 'hydrocolloid_or_foam'; frequency = 'every_4_5_days'; }

  if (req.tunneling_or_undermining) dressing += '_with_routine_cavity_packing_then_reassess_in_48h';

  return {
    dressing,
    change_frequency: frequency,
    size_cm2: req.size_cm2,
    depth_mm: req.depth_mm,
    wound_type: req.wound_type,
    infection_signs: req.infection_signs,
  };
}

function wound_healing_curve(req) {
  ensureNumber(req.area_initial, 'area_initial');
  ensureNumber(req.area_week_1, 'area_week_1');
  ensureNumber(req.area_week_2, 'area_week_2');
  ensureNumber(req.area_week_4, 'area_week_4');

  const slope_4w = (req.area_week_4 - req.area_initial) / Math.max(1, 4);
  let trend;
  if (slope_4w < -0.5) trend = 'rapid_healing';
  else if (slope_4w < -0.1) trend = 'appropriate_healing';
  else if (slope_4w < 0) trend = 'slow_healing';
  else trend = 'no_healing_or_advancing';

  let action;
  if (trend === 'no_healing_or_advancing') action = 'escalate_to_wound_specialty_and_review_for_biopsy_hbo';
  else if (trend === 'slow_healing') action = 'review_compression_offloading_dm_control_and_dressing_choice';
  else action = 'continue_with_current_plan_then_reassess_in_7_days';

  return { slope_4w: Math.round(slope_4w * 100) / 100, trend, action };
}

function continence_home(req) {
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['stress','urge','mixed','overflow','functional','continuous_incontinence']);
  ensureBool(req.implementation_of_bowel_or_bladder_program_today, 'implementation_of_bowel_or_bladder_program_today');
  ensureNumber(req.episodes_per_day, 'episodes_per_day');
  ensureBool(req.skin_breakdown, 'skin_breakdown');
  ensureNumber(req.fluid_intake_per_day_ml, 'fluid_intake_per_day_ml');

  let action;
  if (req.type === 'urge' && req.episodes_per_day >= 4) action = 'bladder_train_then_oxytrol_review';
  else if (req.type === 'stress') action = 'pelvic_floor_muscle_rehab_with_pt_or_women_health_referral';
  else if (req.type === 'overflow') action = 'pvr_ultrasound_assessment_then_catheter_management';
  else if (req.type === 'continuous_incontinence') action = 'uro_study_referral_with_continuous_catheter_options';
  else action = 'standard_pt_based_conservative_management';

  if (req.skin_breakdown) action += '_skin_care_with_barrier';
  if (req.fluid_intake_per_day_ml < 1500) action += '_review_hydration_status_with_patient';

  return { action };
}

function virtual_wound_consult(req) {
  ensureNumber(req.photos_quality_score, 'photos_quality_score'); // 0..10
  ensureNumber(req.required_images_for_dx, 'required_images_for_dx');
  ensureNumber(req.dressing_refilled_kit, 'dressing_refilled_kit');
  ensureBool(req.referring_clinician_wound_certified, 'referring_clinician_wound_certified');
  ensureBool(req.consult_to_wocn_completed_today, 'consult_to_wocn_completed_today');

  let decision;
  if (!req.consult_to_wocn_completed_today) decision = 'schedule_wocn_videoconference_with_patient_in_home';
  else if (req.photos_quality_score < 6) decision = 'additional_images_required_documentation_then_wocn_consult';
  else if (req.dressing_refilled_kit <= 0) decision = 'refill_dressing_kit_for_next_48h_then_wound_specialty_visit';
  else if (!req.referring_clinician_wound_certified) decision = 'continue_with_referring_clinician_education';
  else decision = 'continue_with_current_wound_clinician_team';

  return { decision };
}

function funcs() { return { ostomy_pouch_select, wound_care_home, wound_healing_curve, continence_home, virtual_wound_consult }; }
module.exports = { funcs, CITATIONS, ValidationError };
