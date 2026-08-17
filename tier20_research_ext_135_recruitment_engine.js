// filepath: tier20_research_ext_135_recruitment_engine.js
// TIER20_RESEARCH_EXT-135: Trial recruitment, screening, eligibility pre-check
'use strict';

const CITATIONS = ['NIH_INVEST_2024','ICH_GCP_E6_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function recruit_screening(req) {
  ensureStr(req.screening_id, 'screening_id');
  ensureStr(req.trial_id, 'trial_id');
  ensureNumber(req.criteria_count, 'criteria_count');
  ensureNumber(req.criteria_met_count, 'criteria_met');
  ensureNumber(req.criteria_violated_count, 'criteria_violated');
  ensureBool(req.pre_screen_done, 'pre_screen');
  ensureEnum(req.screening_outcome, 'screening_outcome', ['eligible','ineligible','deferred','screen_fail','screen_pass','pending','other']);
  ensureBool(req.subject_consent_to_contact, 'consent_to_contact');

  let status;
  if (!req.pre_screen_done) status = 'pre_screen_required';
  else if (!req.subject_consent_to_contact) status = 'consent_to_contact_required_pre_screen';
  else if (req.screening_outcome === 'ineligible' && req.criteria_violated_count === 0) status = 'ineligible_no_violation_documented';
  else if (req.screening_outcome === 'screen_fail') status = 'screen_fail_documented_with_reasons';
  else if (req.screening_outcome === 'pending') status = 'pending_completion';
  else status = 'screening_complete';
  return { status, outcome: req.screening_outcome };
}

function recruit_eligibility_check(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureStr(req.trial_id, 'trial_id');
  ensureBool(req.age_match, 'age_match');
  ensureBool(req.diagnosis_match, 'dx_match');
  ensureBool(req.prior_treatment_match, 'tx_match');
  ensureBool(req.lab_match, 'lab_match');
  ensureBool(req.exclusion_clear, 'exclusion_clear');
  ensureNumber(req.mismatch_count, 'mismatch_count');

  let status;
  if (req.mismatch_count > 2) status = 'multiple_mismatches_ineligible';
  else if (!req.age_match) status = 'age_in_exclusion_review';
  else if (!req.exclusion_clear) status = 'exclusion_present_ineligible';
  else if (!req.lab_match) status = 'lab_out_of_window_review';
  else if (!req.diagnosis_match && !req.prior_treatment_match) status = 'dx_and_tx_mismatch_review';
  else status = 'eligibility_pass';
  return { status, mismatches: req.mismatch_count };
}

function recruit_consent_screen(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureBool(req.interest_expressed, 'interest');
  ensureBool(req.pre_screening_consent_signed, 'pre_screen_consent');
  ensureBool(req.privacy_authorization, 'hipaa_auth');
  ensureBool(req.follow_up_contact_agreed, 'follow_up_agreed');
  ensureEnum(req.contact_method, 'contact_method', ['phone','email','text','portal','in_person','mail','none','other']);
  ensureBool(req.pre_screen_questions_asked, 'pre_screen_q');

  let status;
  if (!req.interest_expressed) status = 'no_interest_no_follow_up';
  else if (!req.pre_screen_consent_signed) status = 'pre_screen_consent_required';
  else if (!req.hipaa_auth) status = 'hipaa_authorization_required_for_contact';
  else if (!req.pre_screen_questions_asked) status = 'pre_screen_questions_required';
  else status = 'consent_for_screening_complete';
  return { status, consent: req.pre_screen_consent_signed };
}

function recruit_database_match(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureBool(req.ehr_match_available, 'ehr_available');
  ensureEnum(req.match_type, 'match_type', ['ehr_diagnosis','problem_list','lab_values','medications','comprehensive_query','other']);
  ensureNumber(req.candidates_count, 'candidates_count');
  ensureBool(req.irb_approved_use_of_ehr, 'irb_ehr_use');
  ensureBool(req.privacy_reviewed, 'privacy_review');

  let status;
  if (!req.ehr_match_available) status = 'ehr_match_unavailable';
  else if (!req.irb_approved_use_of_ehr) status = 'irb_ehr_use_approval_required';
  else if (!req.privacy_reviewed) status = 'privacy_review_required_for_ehr_match';
  else if (req.candidates_count > 100) status = 'over_100_candidates_narrow_with_pi';
  else if (req.candidates_count === 0) status = 'no_candidates_match_review_protocol';
  else status = 'ehr_match_documented';
  return { status, candidates: req.candidates_count };
}

function recruit_metrics(req) {
  ensureStr(req.trial_id, 'trial_id');
  ensureNumber(req.screened_count, 'screened');
  ensureNumber(req.enrolled_count, 'enrolled');
  ensureNumber(req.active_subjects, 'active');
  ensureNumber(req.withdrew_count, 'withdrew');
  ensureNumber(req.completed_count, 'completed');

  const conversion = req.screened > 0 ? (req.enrolled / req.screened) * 100 : 0;
  const retention = req.enrolled > 0 ? ((req.enrolled - req.withdrew) / req.enrolled) * 100 : 0;
  let status;
  if (conversion < 10) status = 'under_10pct_conversion_review_recruitment';
  else if (retention < 70) status = 'under_70pct_retention_review';
  else if (conversion > 50) status = 'over_50pct_conversion_excellent';
  else status = 'recruitment_metrics_documented';
  return { status, conversion: Math.round(conversion * 10) / 10, retention: Math.round(retention * 10) / 10 };
}

function funcs() { return { recruit_screening, recruit_eligibility_check, recruit_consent_screen, recruit_database_match, recruit_metrics }; }
module.exports = { funcs, CITATIONS, ValidationError };