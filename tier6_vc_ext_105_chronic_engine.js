// filepath: tier6_vc_ext_105_chronic_engine.js
// TIER6_VC_EXT-105: Chronic care management via telehealth (enrollment, care plan, coaching, medication, outcomes)
'use strict';

const CITATIONS = ['CMS_CCM_2022','AHA_CHRONIC_2021'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ccm_enroll(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.chronic_conditions_count, 'chronic_conditions_count');
  ensureBool(req.consent_to_ccm, 'consent_to_ccm');
  ensureStr(req.primary_care_physician_id, 'primary_care_physician_id');
  ensureEnum(req.care_coordinator_role, 'care_coordinator_role', ['rn','lpn','ma','pharmacist','social_worker','np','pa']);
  ensureBool(req.family_caregiver_involved, 'family_caregiver_involved');

  let eligible;
  if (!req.consent_to_ccm) eligible = 'consent_required_first';
  else if (req.chronic_conditions_count < 2) eligible = 'does_not_meet_ccm_two_conditions_criteria';
  else eligible = 'ccm_eligible';

  return { eligibility: eligible, coordinator: req.care_coordinator_role };
}

function ccm_care_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.problem_list_summary, 'problem_list_summary');
  ensureNumber(req.goals_count, 'goals_count');
  ensureEnum(req.care_plan_complexity, 'care_plan_complexity', ['low','moderate','high','very_high']);
  ensureBool(req.social_determinants_addressed, 'social_determinants_addressed');
  ensureBool(req.medication_reconciliation_completed, 'medication_reconciliation_completed');

  let plan;
  if (!req.medication_reconciliation_completed) plan = 'med_reconciliation_required_before_plan_activation';
  else if (req.care_plan_complexity === 'very_high' && !req.social_determinants_addressed) plan = 'address_sdoh_before_high_complex_plan';
  else if (req.goals_count < 3) plan = 'minimum_3_goals_required_per_ccm';
  else plan = 'plan_active_with_monthly_review';

  return { plan_status: plan, complexity: req.care_plan_complexity };
}

function ccm_coaching(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.topic, 'topic', ['diet','exercise','medication_adherence','smoking_cessation','stress','sleep','diabetes_self_care','heart_failure_self_care','copd_self_care']);
  ensureNumber(req.sessions_completed, 'sessions_completed');
  ensureNumber(req.knowledge_score_pre, 'knowledge_score_pre');
  ensureNumber(req.knowledge_score_post, 'knowledge_score_post');
  ensureBool(req.behavior_change_reported, 'behavior_change_reported');

  let improvement;
  const delta = req.knowledge_score_post - req.knowledge_score_pre;
  if (delta >= 30) improvement = 'excellent_progress';
  else if (delta >= 15) improvement = 'good_progress';
  else if (delta >= 5) improvement = 'modest_progress';
  else if (delta > 0) improvement = 'minimal_progress_consider_alternate_approach';
  else improvement = 'no_improvement_re_evaluate';

  return { improvement, behavior_change: req.behavior_change_reported, sessions: req.sessions_completed };
}

function ccm_medication_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.medications_count, 'medications_count');
  ensureBool(req.duplicate_therapy_found, 'duplicate_therapy_found');
  ensureBool(req.drug_interaction_found, 'drug_interaction_found');
  ensureBool(req.adherence_barrier_identified, 'adherence_barrier_identified');
  ensureBool(req.deprescribing_opportunity, 'deprescribing_opportunity');

  let action;
  if (req.duplicate_therapy_found) action = 'contact_prescriber_to_discontinue_duplicate';
  else if (req.drug_interaction_found) action = 'pharmacist_review_within_24h';
  else if (req.adherence_barrier_identified) action = 'address_adherence_with_patient_and_caregiver';
  else if (req.deprescribing_opportunity) action = 'consider_deprescribing_with_prescriber';
  else action = 'no_action_med_list_appropriate';

  return { action, meds_count: req.medications_count };
}

function ccm_outcomes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.days_in_program, 'days_in_program');
  ensureNumber(req.ed_visits_pre, 'ed_visits_pre');
  ensureNumber(req.ed_visits_post, 'ed_visits_post');
  ensureNumber(req.hba1c_pre, 'hba1c_pre');
  ensureNumber(req.hba1c_post, 'hba1c_post');
  ensureNumber(req.bp_systolic_pre, 'bp_systolic_pre');
  ensureNumber(req.bp_systolic_post, 'bp_systolic_post');

  const ed_reduction = req.ed_visits_pre > 0 ? (req.ed_visits_pre - req.ed_visits_post) / req.ed_visits_pre : 0;
  const hba1c_reduction = req.hba1c_pre - req.hba1c_post;
  const bp_reduction = req.bp_systolic_pre - req.bp_systolic_post;

  let summary;
  if (ed_reduction >= 0.5 || hba1c_reduction >= 1 || bp_reduction >= 10) summary = 'strong_clinical_outcomes';
  else if (ed_reduction >= 0.25 || hba1c_reduction >= 0.5 || bp_reduction >= 5) summary = 'moderate_clinical_outcomes';
  else summary = 'limited_clinical_outcomes_re_evaluate_program';

  return { outcome_summary: summary, ed_reduction_pct: Math.round(ed_reduction * 100), hba1c_delta: hba1c_reduction, bp_delta: bp_reduction };
}

function funcs() { return { ccm_enroll, ccm_care_plan, ccm_coaching, ccm_medication_review, ccm_outcomes }; }
module.exports = { funcs, CITATIONS, ValidationError };