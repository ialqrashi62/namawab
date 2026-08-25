// filepath: tier5_ed_ext_106_obs_engine.js
// TIER5_ED_EXT-106: ED Observation (status, CDU, discharge)
'use strict';

const CITATIONS = [
  'ACEP_ED_Observation_2022',
  'CMS_Two_Midnight_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function observation_status(req) {
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['chest_pain_r/o_acs','syncope','asthma_exacerbation','cellulitis','dvt_rule_out','pe_rule_out','gi_bleed_lower','dehydration','pain_management','telemetry_required']);
  ensureNumber(req.expected_observation_hours, 'expected_observation_hours');
  ensureBool(req.inpatient_admission_likely, 'inpatient_admission_likely');
  ensureBool(req.two_midnight_criterion_met, 'two_midnight_criterion_met');

  let recommendation;
  if (req.two_midnight_criterion_met && req.inpatient_admission_likely) recommendation = 'consider_inpatient_admission_review';
  else if (req.diagnosis === 'telemetry_required') recommendation = 'continue_with_observation_review';
  else if (req.expected_observation_hours >= 24) recommendation = 'consider_inpatient_review';
  else recommendation = 'continue_with_observation_status';
  return { recommendation };
}

function clinical_decision_unit(req) {
  ensureBool(req.chest_pain_protocol, 'chest_pain_protocol');
  ensureBool(req.short_stay_protocol, 'short_stay_protocol');
  ensureNumber(req.los_hours_in_cdu, 'los_hours_in_cdu');
  ensureNumber(req.los_limit_hours, 'los_limit_hours');
  ensureBool(req.transferred_to_inpatient, 'transferred_to_inpatient');

  let plan;
  if (req.transferred_to_inpatient) plan = 'continue_with_inpatient_pathway';
  else if (req.los_hours_in_cdu > req.los_limit_hours) plan = 'continue_with_discharge_or_admit_review';
  else if (req.chest_pain_protocol) plan = 'continue_with_chest_pain_protocol';
  else if (req.short_stay_protocol) plan = 'continue_with_short_stay_protocol';
  else plan = 'continue_with_cdu_pathway';
  return { plan };
}

function discharge_readiness(req) {
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.ambulating, 'ambulating');
  ensureBool(req.tolerating_po, 'tolerating_po');
  ensureBool(req.vitals_normal, 'vitals_normal');
  ensureBool(req.follow_up_planned, 'follow_up_planned');
  ensureBool(req.discharge_instructions_given, 'discharge_instructions_given');

  let plan;
  if (!req.vitals_normal) plan = 'continue_with_observation';
  else if (!req.ambulating) plan = 'continue_with_ambulation_review';
  else if (!req.tolerating_po) plan = 'continue_with_po_intake_review';
  else if (!req.follow_up_planned) plan = 'continue_with_follow_up_planning';
  else if (!req.discharge_instructions_given) plan = 'continue_with_discharge_instructions';
  else plan = 'continue_with_discharge_review';
  return { plan };
}

function discharge_instructions(req) {
  ensureBool(req.diagnosis_explained, 'diagnosis_explained');
  ensureBool(req.medication_reconciliation, 'medication_reconciliation');
  ensureBool(req.warning_signs_reviewed, 'warning_signs_reviewed');
  ensureBool(req.return_precaution_reviewed, 'return_precaution_reviewed');
  ensureBool(req.follow_up_appointment_set, 'follow_up_appointment_set');

  let plan;
  if (!req.diagnosis_explained) plan = 'continue_with_diagnosis_explanation';
  else if (!req.medication_reconciliation) plan = 'continue_with_med_rec';
  else if (!req.warning_signs_reviewed) plan = 'continue_with_warning_signs_review';
  else if (!req.return_precaution_reviewed) plan = 'continue_with_return_precaution_review';
  else if (!req.follow_up_appointment_set) plan = 'continue_with_follow_up_appointment';
  else plan = 'continue_with_discharge_review';
  return { plan };
}

function revisit_risk(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.comorbidity_count_above_3, 'comorbidity_count_above_3');
  ensureBool(req.polypharmacy, 'polypharmacy');
  ensureBool(req.social_support_documented, 'social_support_documented');
  ensureBool(req.lives_alone, 'lives_alone');
  ensureBool(req.access_to_transport, 'access_to_transport');

  let risk;
  if (req.age >= 75 && req.comorbidity_count_above_3) risk = 'continue_with_extended_observation';
  else if (req.lives_alone && req.social_support_documented === false) risk = 'continue_with_social_work_review';
  else if (!req.access_to_transport) risk = 'continue_with_transport_assistance';
  else if (req.polypharmacy) risk = 'continue_with_pharmacy_review';
  else risk = 'continue_with_routine_review';
  return { risk };
}

function observation_continuity(req) {
  ensureBool(req.receiving_team_identified, 'receiving_team_identified');
  ensureBool(req.observation_orders_written, 'observation_orders_written');
  ensureBool(req.observation_protocol_documented, 'observation_protocol_documented');
  ensureBool(req.expected_observation_goals_documented, 'expected_observation_goals_documented');

  let plan;
  if (!req.receiving_team_identified) plan = 'continue_with_team_identification';
  else if (!req.observation_orders_written) plan = 'continue_with_order_entry';
  else if (!req.observation_protocol_documented) plan = 'continue_with_protocol_documentation';
  else if (!req.expected_observation_goals_documented) plan = 'continue_with_goals_documentation';
  else plan = 'continue_with_observation_review';
  return { plan };
}

function funcs() { return { observation_status, clinical_decision_unit, discharge_readiness, discharge_instructions, revisit_risk, observation_continuity }; }
module.exports = { funcs, CITATIONS, ValidationError };
