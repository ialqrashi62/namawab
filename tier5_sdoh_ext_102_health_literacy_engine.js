// filepath: tier5_sdoh_ext_102_health_literacy_engine.js
// TIER5_SDOH_EXT-102: Health literacy (REALM, teach-back, language, education, ehealth)
'use strict';

const CITATIONS = [
  'AHRQ_Health_Literacy_2017',
  'REALM_Validation_1991',
  'Pew_Health_Literacy_2016',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function realm_score(req) {
  ensureNumber(req.realm_correct, 'realm_correct');
  if (req.realm_correct < 0 || req.realm_correct > 66) throw new ValidationError('realm_correct 0..66', 'realm_correct');
  let grade;
  if (req.realm_correct <= 18) grade = 'third_grade_and_below';
  else if (req.realm_correct <= 44) grade = '4th_to_6th_grade';
  else if (req.realm_correct <= 60) grade = '7th_to_8th_grade';
  else grade = 'high_school_and_above';
  return { realm_correct: req.realm_correct, reading_grade_level: grade, citation: CITATIONS[1] };
}

function teach_back(req) {
  ensureNumber(req.teach_back_total_5, 'teach_back_total_5');
  ensureNumber(req.num_teach_backs_done, 'num_teach_backs_done');
  ensureNumber(req.num_consent_problems, 'num_consent_problems');
  ensureBool(req.sworn_teach_back_for_research, 'sworn_teach_back_for_research');
  if (req.teach_back_total_5 < 0 || req.teach_back_total_5 > 5) throw new ValidationError('0..5', 'teach_back_total_5');
  return {
    teach_back_score: req.teach_back_total_5,
    teaching_points: req.num_consent_problems,
    counsel_recommended: req.teach_back_total_5 < 4,
    citation: CITATIONS[0],
  };
}

function language_access(req) {
  ensureStr(req.primary_language, 'primary_language');
  ensureEnum(req.primary_language, 'primary_language', ['arabic','english','urdu','french','tagalog','other']);
  ensureBool(req.bilingual_provider_available, 'bilingual_provider_available');
  ensureNumber(req.wait_for_interpreter_in_past_3m, 'wait_for_interpreter_in_past_3m');
  ensureBool(req.minor_consent_required, 'minor_consent_required');

  let plan;
  if (!req.bilingual_provider_available && req.wait_for_interpreter_in_past_3m >= 2) plan = 'structure_a_local_vetted_interpreter_pool_throughout_clinic';
  else if (!req.bilingual_provider_available) plan = 'use_qualified_medical_interpreter_or_teleconference';
  else if (req.bilingual_provider_available) plan = 'use_bilingual_provider_for_consent_and_teaching';
  if (req.minor_consent_required) plan += '_engage_legal_guardian_with_document_translation';

  return { language: req.primary_language, plan, citation: CITATIONS[2] };
}

function education(req) {
  ensureNumber(req.years_schooling, 'years_schooling');
  ensureStr(req.highest_degree, 'highest_degree');
  ensureEnum(req.highest_degree, 'highest_degree', ['no_schooling','primary','secondary','vocational','associate','bachelor','graduate','professional']);
  ensureBool(req.health_occupation_training, 'health_occupation_training');
  ensureNumber(req.reading_problems, 'reading_problems');

  let plan;
  if (req.years_schooling <= 6) plan = 'strong_visual_teaching_and_pictograms_instead_of_text';
  else if (req.years_schooling <= 12) plan = 'simple_text_5th_grade_reading_with_short_sentences';
  else if (req.highest_degree === 'associate' || req.highest_degree === 'bachelor') plan = 'standard_teaching_through_clinical_teach_back';
  else if (req.health_occupation_training) plan = 'use_existing_literacy_with_quick_clarification';
  else if (req.reading_problems >= 1) plan = 'screening_for_dyslexia_then_patient_empathy_with_audio_instruction';

  if (req.reading_problems === 0) plan += '_confirm_literacy_level_then_continue';

  return { years_schooling: req.years_schooling, plan, citation: CITATIONS[0] };
}

function ehealth_literacy(req) {
  ensureNumber(req.eheals_score, 'eheals_score');
  ensureNumber(req.years_internet_for_health, 'years_internet_for_health');
  ensureStr(req.device_type, 'device_type');
  ensureEnum(req.device_type, 'device_type', ['phone_only','smartphone','tablet','laptop','desktop_or_dual','no_device_regular_known_access']);
  ensureNumber(req.successful_videoconference_use, 'successful_videoconference_use');

  let tier;
  if (req.eheals_score >= 26 && req.successful_videoconference_use >= 3) tier = 'high_ehealth_literacy_candidate_for_tele_health';
  else if (req.device_type === 'no_device_regular_known_access') tier = 'no_ehealth_continue_in_person_following';
  else if (req.eheals_score >= 18) tier = 'moderate_with_orientation_session_then_in_offering_telehealth';
  else tier = 'low_use_phone_visit_or_in_person';

  return { eheals_score: req.eheals_score, device_type: req.device_type, tier, citation: CITATIONS[2] };
}

function funcs() {
  return { realm_score, teach_back, language_access, education, ehealth_literacy };
}

module.exports = { funcs, CITATIONS, ValidationError };
