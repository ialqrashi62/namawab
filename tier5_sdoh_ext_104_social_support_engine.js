// filepath: tier5_sdoh_ext_104_social_support_engine.js
// TIER5_SDOH_EXT-104: Social support & caregiver burden (mMOS-SS, Zarit, MOS, OSLO-3)
'use strict';

const CITATIONS = [
  'MOS_Social_Support_1991',
  'Zarit_Burden_1985',
  'Oslo_3_Social_Support',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function mos_ss(req) {
  ensureNumber(req.emotional_support, 'emotional_support');
  ensureNumber(req.informational_support, 'informational_support');
  ensureNumber(req.tangible_support, 'tangible_support');
  ensureNumber(req.positive_interaction, 'positive_interaction');
  ensureNumber(req.affectionate_support, 'affectionate_support');
  for (const f of ['emotional_support','informational_support','tangible_support','positive_interaction','affectionate_support']) {
    const v = req[f];
    if (!Number.isInteger(v) || v < 1 || v > 5) throw new ValidationError(`${f} 1..5`, f);
  }
  const total = req.emotional_support + req.informational_support + req.tangible_support + req.positive_interaction + req.affectionate_support;
  return { mmos_ss_total: total, support_score_band: total >= 19 ? 'high_social_support' : total >= 15 ? 'moderate' : 'low_social_support' };
}

function caregiver_burden(req) {
  ensureNumber(req.zarit_score, 'zarit_score');
  ensureNumber(req.hours_caregiving_week, 'hours_caregiving_week');
  ensureBool(req.patient_dementia, 'patient_dementia');
  ensureBool(req.caregiver_health_worsening, 'caregiver_health_worsening');
  ensureBool(req.social_isolation, 'social_isolation');
  if (req.zarit_score < 0 || req.zarit_score > 88) throw new ValidationError('zarit 0..88', 'zarit_score');

  let burden_band;
  if (req.zarit_score <= 20) burden_band = 'little_or_no_burden';
  else if (req.zarit_score <= 40) burden_band = 'mild_to_moderate_burden';
  else if (req.zarit_score <= 60) burden_band = 'moderate_to_severe_burden';
  else burden_band = 'severe_burden';

  let plan;
  if (burden_band.startsWith('severe') || req.caregiver_health_worsening) plan = 'urgent_respite_care_referral_and_caregiver_psychiatric_referral';
  else if (req.social_isolation || req.patient_dementia) plan = 'respite_care_referral_and_caregiver_support_group';
  else if (req.hours_caregiving_week >= 70) plan = 'consider_compression_caregiver_education_with_respite';
  else if (burden_band === 'mild_to_moderate_burden') plan = 'caregiver_self_care_with_recommendation_of_spiritual_or_community_care';

  return { zarit_total: req.zarit_score, burden_band, plan };
}

function oslo_3(req) {
  ensureNumber(req.easy_access_to_help, 'easy_access_to_help'); // 1..5
  ensureNumber(req.number_of_close_count, 'number_of_close_count');
  ensureNumber(req.concern_from_others, 'concern_from_others'); // 1..5
  for (const f of ['easy_access_to_help','concern_from_others']) {
    if (!Number.isInteger(req[f]) || req[f] < 1 || req[f] > 5) throw new ValidationError(`${f} 1..5`, f);
  }
  const composite = req.easy_access_to_help + req.number_of_close_count + req.concern_from_others;
  let level;
  if (composite >= 14) level = 'strong';
  else if (composite >= 10) level = 'moderate';
  else level = 'poor';
  return { oslo3_total: composite, social_support_level: level };
}

function caregiver_capacity(req) {
  ensureBool(req.patient_dependent_in_adl, 'patient_dependent_in_adl');
  ensureBool(req.caregiver_capacity_personal_time, 'caregiver_capacity_personal_time');
  ensureNumber(req.caregiver_age, 'caregiver_age');
  ensureBool(req.backup_caregiver_present, 'backup_caregiver_present');
  ensureNumber(req.hours_per_week_with_patient, 'hours_per_week_with_patient');
  ensureStr(req.role, 'role');
  ensureEnum(req.role, 'role', ['spouse','parent_adult_child','adult_child_spouse','professional_caregiver','sibling','neighbor']);

  let capacity_band;
  if (req.caregiver_age >= 65 && req.hours_per_week_with_patient >= 40 && !req.backup_caregiver_present) capacity_band = 'failing_respite_required';
  else if (req.hours_per_week_with_patient >= 80 && !req.caregiver_capacity_personal_time) capacity_band = 'overloaded_respite_suggested';
  else if (req.backup_caregiver_present && req.caregiver_capacity_personal_time && req.hours_per_week_with_patient < 60) capacity_band = 'healthy_capacity';
  else if (req.role === 'neighbor' || req.role === 'professional_caregiver') capacity_band = 'consider_frequent_review_or_documented_help';
  else capacity_band = 'evaluate_capacity_annually_with_questionnaire';

  return { capacity_band };
}

function crisis_social(req) {
  ensureBool(req.family_relationship_stressful, 'family_relationship_stressful');
  ensureBool(req.domestic_violence_with_active_injury, 'domestic_violence_with_active_injury');
  ensureBool(req.child_or_adult_protective_concern, 'child_or_adult_protective_concern');
  ensureBool(req.criminal_justice_or_legal, 'criminal_justice_or_legal');

  let priority;
  if (req.domestic_violence_with_active_injury) priority = 'P0_emergency_intervention_dv_safe_house_involve_police';
  else if (req.child_or_adult_protective_concern) priority = 'P0_mandatory_reporting';
  else if (req.family_relationship_stressful) priority = 'P1_social_work_evaluation_within_24h';
  else if (req.criminal_justice_or_legal) priority = 'P1_evaluate_with_specialty_legal_or_refer_to_legal_aid';
  else priority = 'P2_annually_or_at_next_revisit_or_more_often_if_worsening';

  return { priority, actions: priority === 'P0_emergency_intervention_dv_safe_house_involve_police' ? ['emergency_call', 'safe_house', 'social_work_involves'] : priority.startsWith('P1') ? ['refer_social_work', 'document_discussion'] : ['screen_annually'] };
}

function funcs() { return { mos_ss, caregiver_burden, oslo_3, caregiver_capacity, crisis_social }; }
module.exports = { funcs, CITATIONS, ValidationError };
