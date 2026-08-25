// filepath: tier5_forensic_ext_103_work_engine.js
// TIER5_FORENSIC_EXT-103: Occupational forensic (workplace injury, exposure, return to work, fitness)
'use strict';

const CITATIONS = [
  'OSHA_Recordable_2019',
  'NIOSH_Exposure_2018',
  'AMA_Fitness_for_Return_2018',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function workplace_injury(req) {
  ensureNumber(req.osha_recordable, 'osha_recordable'); // 0/1
  ensureNumber(req.employee_injury_or_illness_type, 'employee_injury_or_illness_type'); // 0 injury, 1 illness
  ensureNumber(req.days_away_from_work, 'days_away_from_work');
  ensureNumber(req.days_with_job_restriction, 'days_with_job_restriction');
  ensureBool(req.witness_present, 'witness_present');

  let verdict;
  if (req.osha_recordable === 1 && req.days_away_from_work === 0 && req.days_with_job_restriction === 0) verdict = 'recordable_no_lost_days_complete_osha_log';
  else if (req.osha_recordable === 1 && req.days_with_job_restriction > 0) verdict = 'osha_recordable_plus_restricted_duty_then_track_until_resolution';
  else if (req.osha_recordable === 1 && req.days_away_from_work >= 1) verdict = 'osha_recordable_with_lost_days_then_setup_for_fitness_clearance';
  else if (req.witness_present && req.employee_injury_or_illness_type === 0) verdict = 'consider_internal_employee_health_review_then_follow_3_5_days';
  else verdict = 'no_osha_reporting_required_documented_through_employee_health';

  return { osha_recordable: req.osha_recordable, days_away_from_work: req.days_away_from_work, days_with_job_restriction: req.days_with_job_restriction, verdict };
}

function occ_exposure(req) {
  ensureStr(req.exposure_type, 'exposure_type');
  ensureEnum(req.exposure_type, 'exposure_type', ['solvent','pesticide','asbestos','silica','metal_fume','biological','radiation','noise','ergonomic_repetitive']);
  ensureNumber(req.exposure_metric, 'exposure_metric');
  ensureStr(req.exposure_unit, 'exposure_unit');
  ensureEnum(req.exposure_unit, 'exposure_unit', ['ppm','mg_per_m3','dB','Sv','cGy','pcs_per_hour','workdays_per_year']);
  ensureNumber(req.osha_pel_estimate, 'osha_pel_estimate');
  ensureBool(req.ppe_used_correctly, 'ppe_used_correctly');
  ensureNumber(req.years_exposure_total, 'years_exposure_total');

  let action;
  if (!req.ppe_used_correctly) action = 'urgent_targeted_ppe_replacement_and_jsa_jjs_to_reduce_further';
  else if (req.exposure_metric * req.years_exposure_total / req.osha_pel_estimate > 3) action = 'highly_overexposed_then_surveillance_then_specialist_clinic_referral';
  else if (req.exposure_metric * req.years_exposure_total / req.osha_pel_estimate > 1) action = 'overexposure_run_specialist_clinic_then_redux';
  else if (req.exposure_metric === req.osha_pel_estimate) action = 'at_pel_review_engineering_controls_then_rescreen_every_2_years';
  else if (req.exposure_metric < req.osha_pel_estimate) action = 'within_safe_levels_apply_health_surveillance_every_3_years';

  return { action };
}

function return_to_duty(req) {
  ensureStr(req.role, 'role');
  ensureEnum(req.role, 'role', ['surgery','er_nursing_shift','ambulance_field','icu_rotating','office_or_sed_vle_laptop_consult','warehouse_picking','construction','vdu_only','driver_commercial','pediatric_inpatient','operating_room_nurse','firefighter','lab_technician','pharmacy']);
  ensureNumber(req.weeks_off, 'weeks_off');
  ensureBool(req.medical_release_with_restrictions, 'medical_release_with_restrictions');
  ensureNumber(req.strength_capacity_pct, 'strength_capacity_pct');
  ensureNumber(req.endurance_capacity_pct, 'endurance_capacity_pct');

  let plan;
  if (req.weeks_off <= 1 && !req.medical_release_with_restrictions) plan = 'mod_return_allowed_with_resume_duties_in_full';
  else if (req.weeks_off <= 6 && req.medical_release_with_restrictions && req.strength_capacity_pct >= 80) plan = 'mod_duty_shortened_with_resume_full_duties_in_4_weeks';
  else if (req.weeks_off <= 12 && req.strength_capacity_pct >= 50) plan = 'extended_period_with_limited_duty_then_consider_return_to_full';
  else if (req.weeks_off > 12) plan = 'case_conference_with_work_conditioning_or_duty_modification_discussion';
  else plan = 'consult_human_resources_about_medical_separation_or_partial_disability_management';

  if (req.endurance_capacity_pct < 50 && req.role === 'firefighter') plan = 'specialty_fire_medical_disability_with_return_to_walk_through';
  return { plan };
}

function workplace_discrim(req) {
  ensureBool(req.disclose_to_management, 'disclose_to_management');
  ensureStr(req.disability_status, 'disability_status');
  ensureEnum(req.disability_status, 'disability_status', ['none','visible','invisible','mental_health_or_other','active_claims_or_wage_dispute']);
  ensureBool(req.retaliation_reported, 'retaliation_reported');
  ensureBool(req.discrimination_or_disparate_treatment_reported, 'discrimination_or_disparate_treatment_reported');

  let action;
  if (req.discrimination_or_disparate_treatment_reported) action = 'consult_legal_aid_or_labor_relations_then_refer_to_hr_legal_review';
  else if (req.retaliation_reported) action = 'document_discussion_then_immediate_investigation_by_manager_or_skilled_neutral';
  else if (req.disability_status === 'active_claims_or_wage_dispute') action = 'continue_with_doc_through_employee_health_supports_or_reasonable_modifications';
  else action = 'consider_internal_employee_assistance_offering_then_continue_support';
  return { action };
}

function employee_health(req) {
  ensureNumber(req.pre_employment_clearance, 'pre_employment_clearance'); // 0 none, 1 pass, 2 follow_up
  ensureNumber(req.blood_titer_count, 'blood_titer_count');
  ensureNumber(req.osha_check_age_required, 'osha_check_age_required');
  ensureNumber(req.missed_doses_recorded, 'missed_doses_recorded');

  let verdict;
  if (req.blood_titer_count >= 3 && req.missed_doses_recorded === 0 && req.pre_employment_clearance >= 1) verdict = 'employee_health_records_complete_with_bbp_then_okay_to_work';
  else if (req.blood_titer_count < 3) verdict = 'titer_check_required_per_cdc_per_employee_role';
  else if (req.missed_doses_recorded > 0) verdict = 'vaccination_followup_or_have_employee_health_complete_per_protocol';
  else verdict = 'verify_records_with_osha_for_current_state';

  return { verdict };
}

function funcs() { return { workplace_injury, occ_exposure, return_to_duty, workplace_discrim, employee_health }; }
module.exports = { funcs, CITATIONS, ValidationError };
