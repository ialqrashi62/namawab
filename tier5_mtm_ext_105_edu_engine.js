// filepath: tier5_mtm_ext_105_edu_engine.js
// TIER5_MTM_EXT-105: Patient education & counseling (teach-back, MDI, insulin, glucometer)
'use strict';

const CITATIONS = [
  'AHRQ_Health_Literacy_2020',
  'CDC_Diabetes_Education_2022',
  'AARC_MDI_Counseling_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function teach_back(req) {
  ensureNumber(req.topic_count, 'topic_count');
  ensureNumber(req.topics_understood_count, 'topics_understood_count');
  ensureNumber(req.topics_re_explained_count, 'topics_re_explained_count');
  ensureBool(req.patient_demonstrates_confidence, 'patient_demonstrates_confidence');
  ensureNumber(req.health_literacy_score, 'health_literacy_score');

  let plan;
  if (req.topics_understood_count === req.topic_count) plan = 'continue_with_comprehension_achieved';
  else if (req.topics_re_explained_count >= 2 && req.health_literacy_score < 4) plan = 'continue_with_simplified_education_review';
  else if (!req.patient_demonstrates_confidence) plan = 'continue_with_reteach_then_review';
  else plan = 'continue_with_re_education';
  return { plan };
}

function mdi_spacer(req) {
  ensureBool(req.priming_done, 'priming_done');
  ensureBool(req.shake_done, 'shake_done');
  ensureBool(req.exhale_done, 'exhale_done');
  ensureBool(req.spacer_attached, 'spacer_attached');
  ensureBool(req.breath_hold_done, 'breath_hold_done');
  ensureBool(req.second_puff_wait, 'second_puff_wait');

  let pass;
  const all_done = [req.priming_done, req.shake_done, req.exhale_done, req.spacer_attached, req.breath_hold_done, req.second_puff_wait].every(Boolean);
  pass = all_done;
  return { technique_passed: pass };
}

function insulin_pen(req) {
  ensureBool(req.priming_done, 'priming_done');
  ensureBool(req.dial_to_dose, 'dial_to_dose');
  ensureBool(req.clean_injection_site, 'clean_injection_site');
  ensureBool(req.rotation_sites, 'rotation_sites');
  ensureBool(req.needle_disposal_done, 'needle_disposal_done');
  ensureBool(req.hypoglycemia_management_known, 'hypoglycemia_management_known');

  let pass;
  const all = [req.priming_done, req.dial_to_dose, req.clean_injection_site, req.rotation_sites, req.needle_disposal_done, req.hypoglycemia_management_known].every(Boolean);
  pass = all;
  return { technique_passed: pass };
}

function glucometer(req) {
  ensureBool(req.hand_washing, 'hand_washing');
  ensureBool(req.test_strip_in_date, 'test_strip_in_date');
  ensureBool(req.coding_aligned, 'coding_aligned');
  ensureBool(req.control_solution_run, 'control_solution_run');
  ensureBool(req.blood_applied_correctly, 'blood_applied_correctly');
  ensureBool(req.logging_done, 'logging_done');

  let pass;
  const all = [req.hand_washing, req.test_strip_in_date, req.coding_aligned, req.control_solution_run, req.blood_applied_correctly, req.logging_done].every(Boolean);
  pass = all;
  return { technique_passed: pass };
}

function inh_counseling(req) {
  ensureNumber(req.days_per_week, 'days_per_week');
  ensureBool(req.bactericidal_versus_static_understood, 'bactericidal_versus_static_understood');
  ensureBool(req.monthly_lfts_acknowledged, 'monthly_lfts_acknowledged');
  ensureBool(req.drug_interactions_reviewed, 'drug_interactions_reviewed');
  ensureBool(req.adherence_plan_in_place, 'adherence_plan_in_place');

  let plan;
  if (req.days_per_week < 7) plan = 'continue_with_direct_observed_review';
  else if (!req.adherence_plan_in_place) plan = 'continue_with_adherence_plan_review';
  else if (!req.drug_interactions_reviewed) plan = 'continue_with_interactions_review';
  else plan = 'continue_with_review';
  return { plan };
}

function warfarin_education(req) {
  ensureBool(req.food_interactions_acknowledged, 'food_interactions_acknowledged');
  ensureBool(req.inr_followup_understood, 'inr_followup_understood');
  ensureBool(req.bleeding_signs_reviewed, 'bleeding_signs_reviewed');
  ensureBool(req.missed_dose_management_known, 'missed_dose_management_known');
  ensureBool(req.interaction_review_acknowledged, 'interaction_review_acknowledged');

  let pass;
  const all = [req.food_interactions_acknowledged, req.inr_followup_understood, req.bleeding_signs_reviewed, req.missed_dose_management_known, req.interaction_review_acknowledged].every(Boolean);
  pass = all;
  return { technique_passed: pass };
}

function funcs() { return { teach_back, mdi_spacer, insulin_pen, glucometer, inh_counseling, warfarin_education }; }
module.exports = { funcs, CITATIONS, ValidationError };
