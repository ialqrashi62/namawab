// filepath: tier32_pulmonology_ext_194_asthma_engine.js
// TIER32_PULMONOLOGY-194: Asthma
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function asthma_control(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.act_score, 'act');
  ensureNumber(req.fev1_pct, 'fev1');
  ensureNumber(req.nocturnal_symptoms, 'noc');
  ensureNumber(req.reliever_use_per_week, 'reliever');
  ensureEnum(req.control_level, 'ctrl', ['well_controlled','partially_controlled','uncontrolled','other']);
  let status;
  if (req.control_level === 'uncontrolled' && req.reliever_use_per_week >= 4) status = 'uncontrolled_step_up_treatment';
  else if (req.act_score < 16) status = 'act_score_low_review_control';
  else if (req.control_level === 'well_controlled' && req.reliever_use_per_week <= 2) status = 'well_controlled_maintain';
  else if (req.control_level === 'partially_controlled') status = 'partially_controlled_step_up_consider';
  else status = 'asthma_control_review';
  return { status, ctrl: req.control_level };
}

function biologic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.biologic, 'bio', ['omalizumab','mepolizumab','benralizumab','dupilumab','tezepelumab','reslizumab','other']);
  ensureNumber(req.ige_level, 'ige');
  ensureNumber(req.eosinophil_count, 'eos');
  ensureEnum(req.response, 'resp', ['excellent','partial','poor','no_response','unknown']);
  ensureNumber(req.duration_months, 'months');
  let status;
  if (req.response === 'excellent' && req.duration_months >= 6) status = 'biologic_response_excellent_continue';
  else if (req.response === 'poor' && req.duration_months >= 6) status = 'biologic_poor_response_consider_switch';
  else if (req.biologic === 'omalizumab' && req.ige_level < 30) status = 'omalizumab_low_ige_review_eligibility';
  else if (req.response === 'partial') status = 'biologic_partial_response_review';
  else status = 'biologic_therapy_appropriate';
  return { status, resp: req.response };
}

function severe_asthma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gina_step, 'step');
  ensureNumber(req.exacerbations_per_year, 'exa');
  ensureBool(req.maintenance_ocs, 'ocs');
  ensureBool(req.biologic_indicated, 'biologic');
  ensureEnum(req.comorbidities, 'comorb', ['none','rhinosinusitis','gerd','obesity','allergic_rhinitis','multiple','other']);
  let status;
  if (req.gina_step >= 5 && req.exacerbations_per_year >= 4 && req.biologic_indicated && !req.maintenance_ocs) status = 'severe_asthma_biologic_indicated_refer';
  else if (req.maintenance_ocs && req.exacerbations_per_year >= 3) status = 'severe_asthma_consider_biologic_wean_ocs';
  else if (req.gina_step >= 5 && !req.biologic_indicated) status = 'severe_asthma_biologic_evaluation';
  else status = 'severe_asthma_review';
  return { status, step: req.gina_step };
}

function asthma_action_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.plan_in_writing, 'plan');
  ensureNumber(req.peak_flow_personal_best, 'pf_best');
  ensureNumber(req.green_zone_pct, 'green');
  ensureEnum(req.yellow_zone_trigger, 'yellow', ['reliever_use_increase','peak_flow_drop','nocturnal_awakening','symptoms_increase','other']);
  ensureEnum(req.red_zone_action, 'red', ['start_ocs_call','start_ocs_seek_emergency','call_911','other']);
  let status;
  if (!req.plan_in_writing) status = 'action_plan_needed_provide';
  else if (req.green_zone_pct < 80) status = 'green_zone_too_low_recording';
  else if (req.red_zone_action === 'start_ocs_seek_emergency') status = 'action_plan_complete_red_clear';
  else status = 'action_plan_appropriate';
  return { status, plan: req.plan_in_writing };
}

function occupational_asthma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.workplace_exposure, 'expo', ['isocyanates','flour','wood_dust','latex','animals','chemicals','other']);
  ensureNumber(req.pft_baseline, 'pft_b');
  ensureNumber(req.pft_work, 'pft_w');
  ensureEnum(req.sensitization_test, 'sens', ['positive','negative','inconclusive','not_done']);
  ensureBool(req.workplace_modification, 'mod');
  let status;
  if (req.pft_baseline - req.pft_work >= 20) status = 'occupational_asthma_significant_work_change';
  else if (req.sensitization_test === 'positive' && !req.workplace_modification) status = 'positive_sensitization_workplace_modify';
  else if (req.workplace_modification && req.pft_work >= 80) status = 'occupational_asthma_controlled';
  else status = 'occupational_review';
  return { status, drop: req.pft_baseline - req.pft_work };
}

function funcs() { return { asthma_control, biologic_therapy, severe_asthma, asthma_action_plan, occupational_asthma }; }
module.exports = { funcs, ValidationError };