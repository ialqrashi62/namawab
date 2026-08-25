// filepath: tier15_icu_ext_111_icu_admin_engine.js
// TIER15_ICU_EXT-111: ICU admission, triage, bed management
'use strict';

const CITATIONS = ['SCCM_ICU_2024','JSICM_2024','NICE_HSUV_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function icu_admission_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.priority_score, 'priority_score');
  ensureEnum(req.priority_tier, 'priority_tier', ['tier_1_immediate','tier_2_high','tier_3_standard','tier_4_low','tier_5_dni_dnr','icu_not_appropriate','other']);
  ensureNumber(req.icu_beds_available, 'icu_beds_available');
  ensureNumber(req.icu_beds_occupied, 'icu_beds_occupied');
  ensureNumber(req.waiting_for_bed_hours, 'waiting_for_bed_hours');
  ensureBool(req.invasive_vent_needed, 'invasive_vent_needed');
  ensureBool(req.vasoactive_needed, 'vasoactive_needed');

  let status;
  if (req.priority_tier === 'tier_1_immediate' && req.invasive_vent_needed && req.icu_beds_available === 0) status = 'tier_1_no_bed_diversion_review';
  else if (req.priority_tier === 'icu_not_appropriate') status = 'icu_not_appropriate_alternative_level';
  else if (req.waiting_for_bed_hours > 6 && req.priority_tier === 'tier_1_immediate') status = 'tier_1_waiting_over_6h_review';
  else if (req.priority_tier === 'tier_1_immediate') status = 'tier_1_immediate_admit';
  else if (req.priority_tier === 'tier_2_high' && req.vasoactive_needed && req.icu_beds_available === 0) status = 'tier_2_vasoactive_diversion_review';
  else if (req.priority_tier === 'tier_2_high') status = 'tier_2_admit_or_stepdown';
  else status = 'triage_review';
  return { status, tier: req.priority_tier };
}

function icu_bed_assignment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.icu_beds_available, 'icu_beds_available');
  ensureEnum(req.icu_unit, 'icu_unit', ['micu','sicu','cticu','nicu','picu','ccu','burns','neuro','trauma','mixed_adult','other']);
  ensureBool(req.isolation_required, 'isolation_required');
  ensureBool(req.dialysis_chair_required, 'dialysis_chair_required');
  ensureEnum(req.cohort, 'cohort', ['medical','surgical','cardiac','neuro','trauma','transplant','burns','mixed','other']);
  ensureNumber(req.expected_los_days, 'expected_los_days');

  let status;
  if (req.icu_beds_available === 0) status = 'no_bed_diversion';
  else if (req.dialysis_chair_required && req.icu_unit !== 'mixed_adult') status = 'dialysis_chair_mixed_only';
  else if (req.expected_los_days > 14) status = 'long_los_review_rehab_transfer';
  else if (req.isolation_required) status = 'isolation_bed_assign_first';
  else status = 'bed_assigned';
  return { status, unit: req.icu_unit };
}

function icu_handoff(req) {
  ensureStr(req.handoff_id, 'handoff_id');
  ensureStr(req.from_provider, 'from_provider');
  ensureStr(req.to_provider, 'to_provider');
  ensureBool(req.sbat_used, 'sbat_used');
  ensureBool(req.allergies_reviewed, 'allergies_reviewed');
  ensureBool(req.code_status_reviewed, 'code_status_reviewed');
  ensureBool(req.active_problems_reviewed, 'active_problems_reviewed');
  ensureBool(req.lines_tubes_reviewed, 'lines_tubes_reviewed');
  ensureBool(req.family_communication_done, 'family_communication_done');

  let status;
  if (!req.sbat_used) status = 'sbat_used_required';
  else if (!req.allergies_reviewed) status = 'allergies_review_required';
  else if (!req.code_status_reviewed) status = 'code_status_review_required';
  else if (!req.active_problems_reviewed) status = 'active_problems_review_required';
  else if (!req.lines_tubes_reviewed) status = 'lines_and_tubes_review_required';
  else if (!req.family_communication_done) status = 'family_communication_required';
  else status = 'handoff_complete';
  return { status, handoff: req.handoff_id };
}

function icu_ward_readiness(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.score_news2, 'score_news2');
  ensureBool(req.vent_weaned_off, 'vent_weaned_off');
  ensureBool(req.vasopressors_off, 'vasopressors_off');
  ensureBool(req.neuro_intact, 'neuro_intact');
  ensureBool(req.drains_removed, 'drains_removed');
  ensureBool(req.family_briefed, 'family_briefed');
  ensureEnum(req.receiving_unit, 'receiving_unit', ['telemetry','stepdown','surgical_floor','medical_floor','rehab','home','hospice','other']);

  let status;
  if (!req.vent_weaned_off && req.receiving_unit !== 'stepdown' && req.receiving_unit !== 'telemetry') status = 'vent_dependent_needs_stepdown';
  else if (!req.vasopressors_off) status = 'still_on_vasoactive_not_ready';
  else if (req.score_news2 >= 5) status = 'news2_5_plus_not_ready';
  else if (!req.family_briefed) status = 'family_brief_required';
  else if (!req.drains_removed && req.receiving_unit === 'medical_floor') status = 'drains_present_needs_stepdown';
  else status = 'ready_for_transfer';
  return { status, ready: true };
}

function icu_outcomes(req) {
  ensureStr(req.unit_id, 'unit_id');
  ensureNumber(req.bed_occupancy_pct, 'bed_occupancy_pct');
  ensureNumber(req.central_line_days, 'central_line_days');
  ensureNumber(req.ventilator_days, 'ventilator_days');
  ensureNumber(req.mortality_rate_pct, 'mortality_rate_pct');
  ensureNumber(req.readmission_48h_count, 'readmission_48h_count');
  ensureNumber(req.discharges_total, 'discharges_total');
  ensureNumber(req.unexpected_events_count, 'unexpected_events_count');

  let status;
  if (req.bed_occupancy_pct > 90) status = 'overcrowded_diversion_risk';
  else if (req.mortality_rate_pct > 25) status = 'mortality_high_review_outliers';
  else if (req.readmission_48h_count / Math.max(req.discharges_total, 1) > 0.05) status = 'readmission_48h_high';
  else if (req.unexpected_events_count > 5) status = 'unexpected_events_high_review';
  else status = 'icu_outcomes_acceptable';
  return { status, occupancy: req.bed_occupancy_pct };
}

function funcs() { return { icu_admission_triage, icu_bed_assignment, icu_handoff, icu_ward_readiness, icu_outcomes }; }
module.exports = { funcs, CITATIONS, ValidationError };