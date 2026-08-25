// filepath: tier5_forensic_ext_106_bioethics_engine.js
// TIER5_FORENSIC_EXT-106: Bioethics (capacity, surrogate, DNR, dispute, transplant)
'use strict';

const CITATIONS = [
  'ASPEN_2017_Capacity',
  'AABB_Transplant_Ethics_2019',
  'IRB_Guidelines_2018',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function capacity(req) {
  ensureNumber(req.understanding_pct, 'understanding_pct');
  ensureNumber(req.appreciation_pct, 'appreciation_pct');
  ensureNumber(req.reasoning_pct, 'reasoning_pct');
  ensureNumber(req.communication_of_choice_pct, 'communication_of_choice_pct');
  ensureNumber(req.consistency_with_values_pct, 'consistency_with_values_pct');

  let decision;
  if (req.understanding_pct >= 80 && req.appreciation_pct >= 80 && req.reasoning_pct >= 80 && req.communication_of_choice_pct >= 80) decision = 'full_capacity';
  else if (req.understanding_pct >= 60 && req.appreciation_pct >= 60 && req.reasoning_pct >= 60) decision = 'partial_capacity_help_through_simplified_consent';
  else if (req.understanding_pct <= 40 || req.appreciation_pct <= 40) decision = 'no_full_capacity_need_surrogate_or_legal_guardian';
  else decision = 'capacity_uncertain_refer_to_ethics_or_psychiatry';

  return { decision };
}

function surrogate_decisions(req) {
  ensureStr(req.surrogate, 'surrogate');
  ensureEnum(req.surrogate, 'surrogate', ['patient_documented_durable_legal_power_of_attorney','spouse_if_no_dpoa','adult_child','parent','sibling','court_appointed_guardian','patient_self']);
  ensureNumber(req.relation_to_patient_score, 'relation_to_patient_score');
  ensureBool(req.knew_wishes_of_patient, 'knew_wishes_of_patient');
  ensureBool(req.legal_authority_verified, 'legal_authority_verified');

  let priority;
  if (req.surrogate === 'patient_documented_durable_legal_power_of_attorney' && req.legal_authority_verified) priority = 'top_priority';
  else if (req.surrogate === 'spouse_if_no_dpoa' && req.knew_wishes_of_patient) priority = 'second_priority';
  else if (req.surrogate === 'adult_child' && req.relation_to_patient_score >= 2) priority = 'third_priority';
  else if (req.surrogate === 'parent' && req.relation_to_patient_score >= 1) priority = 'fourth_priority';
  else if (req.surrogate === 'court_appointed_guardian') priority = 'court_appointed_guardian';
  else priority = 'consider_resolution_through_ethics_committee';

  return { priority };
}

function dnr(req) {
  ensureBool(req.documented_dnr_present, 'documented_dnr_present');
  ensureStr(req.dnr_kind, 'dnr_kind');
  ensureEnum(req.dnr_kind, 'dnr_kind', ['full_code','dnar','limited_code_with_skilled_intervention','comfort_only_or_allow_natural_death']);
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.most_recent_dnr_in_chart, 'most_recent_dnr_in_chart');
  ensureNumber(req.months_old, 'months_old');

  let plan;
  if (req.documented_dnr_present && req.most_recent_dnr_in_chart && req.months_old <= 12) plan = 'valid_dnr_respected';
  else if (req.documented_dnr_present && req.months_old > 12) plan = 'discuss_dnr_renewal_with_legal_guardian_or_patient_if_possible';
  else if (req.dnr_kind === 'comfort_only_or_allow_natural_death') plan = 'follow_comfort_only_orders_with_palliative_team';
  else if (req.family_informed && req.dnr_kind === 'dnar') plan = 'continue_dnar_with_palliative_team';
  else plan = 'continue_full_code';

  return { plan };
}

function clinical_dispute(req) {
  ensureBool(req.dispute_exists, 'dispute_exists');
  ensureNumber(req.months_in_dispute, 'months_in_dispute');
  ensureBool(req.multiple_team_inputs_exist, 'multiple_team_inputs_exist');
  ensureStr(req.medical_decision_kind, 'medical_decision_kind');
  ensureEnum(req.medical_decision_kind, 'medical_decision_kind', ['life_sustaining_treatment','withdraw_life_sustaining_treatment','other_high_stakes_decision']);
  ensureBool(req.ethics_consultation_done, 'ethics_consultation_done');

  let plan;
  if (req.dispute_exists && req.months_in_dispute >= 1 && req.medical_decision_kind === 'life_sustaining_treatment') plan = 'urgent_ethics_consultation_then_2nd_physician_opinion_then_legal_consult';
  else if (req.dispute_exists && req.months_in_dispute >= 1) plan = 'ethics_consult_then_family_meeting';
  else if (req.dispute_exists && !req.ethics_consultation_done) plan = 'arrange_ethics_consultation_within_24h';
  else plan = 'continue_with_normal_care';

  if (req.multiple_team_inputs_exist && req.medical_decision_kind === 'withdraw_life_sustaining_treatment') plan += '_review_chart_documented_family_response';

  return { plan };
}

function transplant_ethics(req) {
  ensureStr(req.donor_type, 'donor_type');
  ensureEnum(req.donor_type, 'donor_type', ['deceased_donor_cardiac_death','living_related_donor','living_unrelated_donor','paired_exchange']);
  ensureNumber(req.donor_age, 'donor_age');
  ensureNumber(req.donor_consent_or_proxy, 'donor_consent_or_proxy');
  ensureBool(req.recipient_life_expectancy_increased, 'recipient_life_expectancy_increased');
  ensureBool(req.donor_full_disclosure_of_short_and_long_term_risks, 'donor_full_disclosure_of_short_and_long_term_risks');

  let ethical;
  if (req.donor_type === 'living_unrelated_donor' && req.donor_full_disclosure_of_short_and_long_term_risks && req.donor_age >= 18) ethical = 'standard_unrelated_evaluation_with_disclosure';
  else if (req.donor_type === 'living_related_donor' && req.donor_full_disclosure_of_short_and_long_term_risks) ethical = 'standard_living_related_donor';
  else if (req.donor_type === 'deceased_donor_cardiac_death') ethical = 'continue_with_deceased_donor_after_consent_or_legal_authority';
  else if (req.donor_age < 18) ethical = 'consult_pediatric_specialist_for_minor_donor_evaluation';
  else if (req.recipient_life_expectancy_increased && req.donor_consent_or_proxy >= 1) ethical = 'high_ethics_committee_review_then_assignment';
  else ethical = 'consult_ethics_and_review_then_re_assignment';

  return { ethical_decision: ethical };
}

function funcs() { return { capacity, surrogate_decisions, dnr, clinical_dispute, transplant_ethics }; }
module.exports = { funcs, CITATIONS, ValidationError };
