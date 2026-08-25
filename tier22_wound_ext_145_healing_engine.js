// filepath: tier22_wound_ext_145_healing_engine.js
// TIER22_WOUND_EXT-145: Wound healing trajectory, predictive
'use strict';

const CITATIONS = ['NPUAP_2024','WUWHS_2024','CMS_WOUND_30D_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function wound_healing_trajectory(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.days_since_onset, 'days_since_onset');
  ensureNumber(req.healing_pct, 'healing_pct');
  ensureNumber(req.area_initial, 'area_initial');
  ensureNumber(req.area_current, 'area_current');
  ensureBool(req.trending_healing, 'trending_healing');
  ensureEnum(req.trajectory_status, 'trajectory_status', ['on_track','lagging','stalled','worsening','healed','reopened','unknown','other']);

  let status;
  if (req.trajectory_status === 'healed') status = 'wound_healed_documented';
  else if (req.trajectory_status === 'reopened') status = 'wound_reopened_review_cause';
  else if (req.days_since_onset >= 30 && req.healing_pct < 30 && req.trajectory_status !== 'worsening') status = '30d_under_30pct_healing_alert_cms';
  else if (req.trajectory_status === 'stalled') status = 'stalled_4wk_review_aggressive_treatment';
  else if (req.trajectory_status === 'lagging') status = 'lagging_reassess_advance_interventions';
  else if (req.trending_healing) status = 'trending_healing_continue_plan';
  else status = 'trajectory_documented';
  return { status, trajectory: req.trajectory_status };
}

function wound_healing_target(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.target_days_to_heal, 'target_days');
  ensureNumber(req.current_days, 'current_days');
  ensureNumber(req.healing_pct, 'healing_pct');
  ensureNumber(req.target_heal_pct_30d, 'target_30d_pct');
  ensureBool(req.on_track_30d, 'on_track_30d');
  ensureBool(req.reassessment_at_30d_documented, '30d_reassessment');

  let status;
  if (req.on_track_30d) status = 'on_track_30d_review_less_frequent';
  else if (req.healing_pct < req.target_30d_pct && req.current_days >= 30 && !req.reassessment_at_30d_documented) status = 'under_30d_target_no_reassessment_required';
  else if (req.healing_pct < req.target_30d_pct && !req.on_track_30d) status = 'off_track_review_treatment_changes';
  else status = 'target_documented';
  return { status, on_track: req.on_track_30d };
}

function wound_healing_failure(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureBool(req.pressure_offloaded, 'pressure_offloaded');
  ensureBool(req.diabetes_controlled, 'diabetes_controlled');
  ensureBool(req.smoking_cessation, 'smoking_cessation');
  ensureBool(req.infection_treated, 'infection_treated');
  ensureBool(req.medications_reviewed, 'meds_reviewed');
  ensureBool(req.advanced_therapy_considered, 'advanced_therapy');

  let status;
  if (!req.infection_treated) status = 'infection_treat_first';
  else if (req.etiology === 'pressure_injury' && !req.pressure_offloaded) status = 'pressure_offloading_required_first';
  else if (req.etiology === 'neuropathic_diabetic' && !req.diabetes_controlled) status = 'diabetes_control_required_hba1c_under_8';
  else if (req.smoking === 'active' && !req.smoking_cessation) status = 'smoking_cessation_recommended';
  else if (!req.medications_reviewed) status = 'medications_review_steroids_nsaids';
  else if (!req.advanced_therapy_considered) status = 'advanced_therapy_consider_npwt_hbo_growth_factor';
  else status = 'failure_causes_addressed';
  return { status, healing_failure: true };
}

function wound_recurrence(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureBool(req.recurrence, 'recurrence');
  ensureNumber(req.days_since_healed, 'days_since_healed');
  ensureEnum(req.location, 'location', ['sacrum','coccyx','heel','trochanter_hip','ischium','ankle','knee','calf','thigh','buttock','back','elbow','shoulder','occiput','ear','abdomen','chest','groin','forearm','hand','foot','multiple','other']);
  ensureBool(req.preventive_measures, 'preventive');
  ensureBool(req.pressure_offloaded, 'pressure_offloaded');

  let status;
  if (req.recurrence && req.days_since_healed < 30) status = 'rapid_recurrence_within_30d_review_prevention';
  else if (req.recurrence && !req.preventive_measures) status = 'recurrence_without_prevention';
  else if (req.recurrence && req.location === 'heel' && !req.pressure_offloaded) status = 'heel_recurrence_offload_required';
  else status = 'no_recurrence';
  return { status, recurrence: req.recurrence };
}

function wound_lifestyle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.smoking, 'smoking');
  ensureBool(req.smoking_cessation_offered, 'cessation_offered');
  ensureBool(req.nutrition_adequate, 'nutrition');
  ensureBool(req.mobility, 'mobility');
  ensureBool(req.mobility_adequate, 'mobility_adequate');
  ensureBool(req.pressure_offloading_capability, 'pressure_offloading');

  let status;
  if (req.smoking && !req.smoking_cessation_offered) status = 'smoking_cessation_offered_required';
  else if (!req.nutrition) status = 'nutrition_optimize_consult_dietitian';
  else if (!req.mobility && !req.mobility_adequate) status = 'mobility_required_for_offloading';
  else if (!req.pressure_offloading_capability) status = 'patient_cannot_offload_review_care_setting';
  else status = 'lifestyle_factors_addressed';
  return { status, smoking: req.smoking };
}

function funcs() { return { wound_healing_trajectory, wound_healing_target, wound_healing_failure, wound_recurrence, wound_lifestyle }; }
module.exports = { funcs, CITATIONS, ValidationError };
