// filepath: tier5_forensic_ext_101_mlc_engine.js
// TIER5_FORENSIC_EXT-101: Medico-legal cases (registration, death cert, autopsy recommendation)
'use strict';

const CITATIONS = [
  'WHO_Dying_Natural_Causes_2019',
  'Indian_Medico_Legal_2019',
  'EFLM_Autopsy_2020',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function mlc_registration(req) {
  ensureStr(req.case_type, 'case_type');
  ensureEnum(req.case_type, 'case_type', ['natural_death','accident_injury','suspicious_circumstances','homicide','suicide','overdose_or_chemical','burn','drowning','poisoning_work_related','motor_vehicle','fall_in_elderly','maternal_death','infant_unexpected']);
  ensureStr(req.law_agency, 'law_agency');
  ensureEnum(req.law_agency, 'law_agency', ['none','red_crescent_police','civil_affairs','municipal','cps','ministry_of_health','municipality_other']);
  ensureBool(req.witness_present, 'witness_present');
  ensureNumber(req.police_acknowledgement_number, 'police_acknowledgement_number');
  ensureBool(req.body_at_hospital, 'body_at_hospital');

  return {
    case_type: req.case_type,
    law_agency: req.law_agency,
    witnesses_present: req.witness_present,
    police_acknowledgement_number: req.police_acknowledgement_number,
    body_in_care_of_hospital: req.body_at_hospital,
    witnessed: req.witness_present && req.police_acknowledgement_number > 0,
  };
}

function death_certificate_check(req) {
  ensureStr(req.primary_cause_of_death, 'primary_cause_of_death');
  ensureNumber(req.interval_onset_to_death_days, 'interval_onset_to_death_days');
  ensureStr(req.contributing_conditions, 'contributing_conditions');
  ensureStr(req.manner_of_death, 'manner_of_death');
  ensureEnum(req.manner_of_death, 'manner_of_death', ['natural','accident','suicide','homicide','undetermined','pending_investigation']);
  ensureBool(req.cannot_be_determined, 'cannot_be_determined');
  ensureBool(req.autopsy_ordered, 'autopsy_ordered');

  if (req.manner_of_death === 'homicide' && !req.autopsy_ordered) {
    return {
      validity_band: 'mandatory_autopsy_required_by_law',
      recommendation: 'mandatory_autopsy_required_within_24h_and_per_law_agency',
      citation: CITATIONS[0],
    };
  }
  if (req.cannot_be_determined) return { validity_band: 'referred_to_coroner', recommendation: 'refer_to_coroner_for_full_autopsy_then_complete_dc' };
  if (req.manner_of_death === 'pending_investigation') return { validity_band: 'pending', recommendation: 'await_law_enforcement_to_complete_dc' };
  if (req.interval_onset_to_death_days < 0) return { validity_band: 'time_inconsistency_correct_then_resubmit_dc' };
  return { validity_band: 'standard', recommendation: 'check_fifth_digit_human_impossible_dx_then_sign_dc' };
}

function autopsy_recommendation(req) {
  ensureBool(req.sudden_unexplained, 'sudden_unexplained');
  ensureBool(req.suspicious_circumstances, 'suspicious_circumstances');
  ensureBool(req.clinical_history_unknown, 'clinical_history_unknown');
  ensureBool(req.organ_procurement_viable, 'organ_procurement_viable');
  ensureBool(req.family_consent_for_autopsy, 'family_consent_for_autopsy');
  ensureStr(req.state_law, 'state_law');
  ensureEnum(req.state_law, 'state_law', ['requires_full_autopsy_pending_investigation','allows_partial_autopsy_with_consent','none_required_for_natural_causes']);

  let decision;
  if (req.sudden_unexplained || req.clinical_history_unknown) decision = 'full_forensic_autopsy_recommended';
  else if (req.suspicious_circumstances || req.state_law === 'requires_full_autopsy_pending_investigation') decision = 'medical_examiner_investigation_required';
  else if (req.family_consent_for_autopsy >= 1) decision = 'with_consent_perform_partial_autopsy_or_virtual';
  else if (req.state_law === 'none_required_for_natural_causes' && !req.sudden_unexplained) decision = 'no_autopsy_required';
  else decision = 'review_state_law_with_medical_examiner';

  if (req.organ_procurement_viable && req.family_consent_for_autopsy) decision += '_consider_organ_procurement_consult';
  return { decision };
}

function evidence_chain(req) {
  ensureNumber(req.case_id, 'case_id');
  ensureNumber(req.collected_at_min_since_event, 'collected_at_min_since_event');
  ensureBool(req.label_intact, 'label_intact');
  ensureBool(req.chain_of_custody_documented, 'chain_of_custody_documented');
  ensureBool(req.specimen_sealed, 'specimen_sealed');

  let integrity;
  if (req.collected_at_min_since_event > 24 * 60 * 2 || !req.specimen_sealed || !req.chain_of_custody_documented || !req.label_intact) integrity = 'chain_broken_documented_then_reject_or_re_collect';
  else integrity = 'chain_intact_document_chain_of_custody_for_each_holder';
  return { chain_integrity: integrity };
}

function medico_legal_writing(req) {
  ensureStr(req.injury_description, 'injury_description');
  ensureNumber(req.injury_count, 'injury_count');
  ensureBool(req.use_of_scientific_phrasing, 'use_of_scientific_phrasing');
  ensureBool(req.mention_source_of_information, 'mention_source_of_information');
  ensureBool(req.confidentiality_maintained, 'confidentiality_maintained');
  ensureBool(req.documented_consent, 'documented_consent');

  let quality;
  if (req.use_of_scientific_phrasing && req.mention_source_of_information && req.confidentiality_maintained && req.documented_consent && req.injury_description.length > 50) quality = 'high_quality_legal_med_report_admissible_in_court';
  else if (req.injury_count >= 1 && (req.mention_source_of_information || req.use_of_scientific_phrasing)) quality = 'adequate_legal_med_report_consider_clarifying_remaining_items';
  else quality = 'inadequate_revise_with_scientific_language_review_chain_of_information_and_consent';

  return { quality_band: quality };
}

function funcs() { return { mlc_registration, death_certificate_check, autopsy_recommendation, evidence_chain, medico_legal_writing }; }
module.exports = { funcs, CITATIONS, ValidationError };
