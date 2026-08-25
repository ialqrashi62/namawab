// filepath: tier5_mtm_ext_106_outcomes_engine.js
// TIER5_MTM_EXT-106: MTM outcomes & documentation (PDC, CMR completion)
'use strict';

const CITATIONS = [
  'CMS_PDC_MTM_2023',
  'PQA_Measures_2022',
  'AHRQ_MTM_Outcome_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pdc(req) {
  ensureNumber(req.days_covered, 'days_covered');
  ensureNumber(req.days_in_period, 'days_in_period');
  ensureStr(req.drug_class, 'drug_class');
  ensureEnum(req.drug_class, 'drug_class', ['diabetes','statins','ace_arb','beta_blocker','asthma_controller','copd_lama','mental_health','hiv_antiretroviral','anticoagulation']);

  let pdc_pct;
  if (req.days_in_period === 0) throw new ValidationError('days_in_period>0');
  else pdc_pct = (req.days_covered / req.days_in_period) * 100;
  let rating;
  if (pdc_pct >= 80) rating = 'pdc_at_goal';
  else if (pdc_pct >= 70) rating = 'pdc_below_goal_then_continue_with_intervention';
  else rating = 'pdc_well_below_goal_then_continue_with_targeted_intervention';
  return { pdc_pct: Math.round(pdc_pct * 10) / 10, rating };
}

function cmr_completion(req) {
  ensureBool(req.patient_consented, 'patient_consented');
  ensureNumber(req.med_count_reviewed, 'med_count_reviewed');
  ensureNumber(req.drp_identified_count, 'drp_identified_count');
  ensureBool(req.mtm_action_plan_documented, 'mtm_action_plan_documented');
  ensureBool(req.action_plan_sent_to_provider, 'action_plan_sent_to_provider');

  let completion;
  if (req.mtm_action_plan_documented && req.action_plan_sent_to_provider) completion = 'cmr_completed';
  else if (req.drp_identified_count === 0) completion = 'continue_with_completion_review';
  else if (!req.action_plan_sent_to_provider) completion = 'continue_with_provider_letter_review';
  else if (!req.mtm_action_plan_documented) completion = 'continue_with_plan_documentation_review';
  else completion = 'continue_with_review';
  return { completion };
}

function intervention_acceptance(req) {
  ensureNumber(req.interventions_proposed, 'interventions_proposed');
  ensureNumber(req.interventions_accepted, 'interventions_accepted');
  ensureNumber(req.interventions_rejected, 'interventions_rejected');
  ensureBool(req.action_plan_acted_on, 'action_plan_acted_on');
  ensureNumber(req.interventions_pending, 'interventions_pending');

  let acceptance_pct;
  if (req.interventions_proposed === 0) acceptance_pct = 0;
  else acceptance_pct = (req.interventions_accepted / req.interventions_proposed) * 100;
  let recommendation;
  if (acceptance_pct >= 80) recommendation = 'continue_with_positive_trend';
  else if (acceptance_pct >= 50) recommendation = 'continue_with_moderate_acceptance_review';
  else if (acceptance_pct >= 25) recommendation = 'continue_with_low_acceptance_review';
  else recommendation = 'continue_with_targeted_outreach_review';
  return { acceptance_pct: Math.round(acceptance_pct * 10) / 10, recommendation };
}

function cost_savings(req) {
  ensureNumber(req.drug_cost_pre_mtm_usd, 'drug_cost_pre_mtm_usd');
  ensureNumber(req.drug_cost_post_mtm_usd, 'drug_cost_post_mtm_usd');
  ensureNumber(req.hospitalizations_pre, 'hospitalizations_pre');
  ensureNumber(req.hospitalizations_post, 'hospitalizations_post');
  ensureNumber(req.cost_per_hospitalization_usd, 'cost_per_hospitalization_usd');

  const drug_savings = req.drug_cost_pre_mtm_usd - req.drug_cost_post_mtm_usd;
  const hosp_savings = (req.hospitalizations_pre - req.hospitalizations_post) * req.cost_per_hospitalization_usd;
  const total_savings = drug_savings + hosp_savings;
  return { total_savings_usd: Math.round(total_savings * 100) / 100 };
}

function clinical_outcomes(req) {
  ensureNumber(req.a1c_pre, 'a1c_pre');
  ensureNumber(req.a1c_post, 'a1c_post');
  ensureNumber(req.systolic_pre, 'systolic_pre');
  ensureNumber(req.systolic_post, 'systolic_post');
  ensureNumber(req.ldl_pre, 'ldl_pre');
  ensureNumber(req.ldl_post, 'ldl_post');

  return {
    a1c_delta: Math.round((req.a1c_post - req.a1c_pre) * 10) / 10,
    systolic_delta: Math.round((req.systolic_post - req.systolic_pre) * 10) / 10,
    ldl_delta: Math.round((req.ldl_post - req.ldl_pre) * 10) / 10,
  };
}

function documentation_completeness(req) {
  ensureBool(req.intervention_documented, 'intervention_documented');
  ensureBool(req.outcome_documented, 'outcome_documented');
  ensureBool(req.communication_sent_to_provider, 'communication_sent_to_provider');
  ensureBool(req.patient_education_documented, 'patient_education_documented');
  ensureBool(req.soap_note_signed, 'soap_note_signed');

  let plan;
  if (!req.intervention_documented) plan = 'continue_with_intervention_documentation';
  else if (!req.outcome_documented) plan = 'continue_with_outcome_documentation';
  else if (!req.communication_sent_to_provider) plan = 'continue_with_provider_communication';
  else if (!req.patient_education_documented) plan = 'continue_with_patient_education_documentation';
  else if (!req.soap_note_signed) plan = 'continue_with_signature_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { pdc, cmr_completion, intervention_acceptance, cost_savings, clinical_outcomes, documentation_completeness }; }
module.exports = { funcs, CITATIONS, ValidationError };
