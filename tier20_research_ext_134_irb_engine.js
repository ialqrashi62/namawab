// filepath: tier20_research_ext_134_irb_engine.js
// TIER20_RESEARCH_EXT-134: IRB review, amendments, continuing review
'use strict';

const CITATIONS = ['45CFR46_2024','21CFR56_2024','OHRP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function irb_submission(req) {
  ensureStr(req.submission_id, 'submission_id');
  ensureEnum(req.review_type, 'review_type', ['expedited','full_board','exempt','convened','emergency','other']);
  ensureEnum(req.submission_status, 'submission_status', ['drafted','submitted','acknowledged','under_review','pending_response','approved','conditionally_approved','deferred','rejected','withdrawn','expired','other']);
  ensureNumber(req.target_review_days, 'target_review_days');
  ensureBool(req.study_complete_submitted, 'complete');
  ensureBool(req.consent_draft_attached, 'consent_attached');
  ensureBool(req.pi_signature_attached, 'pi_signature');

  let status;
  if (!req.study_complete_submitted) status = 'complete_submission_required';
  else if (!req.consent_draft_attached) status = 'consent_draft_required';
  else if (!req.pi_signature_attached) status = 'pi_signature_required';
  else if (req.review_type === 'exempt' && req.submission_status === 'approved') status = 'exempt_approved_faster';
  else status = 'submission_documented';
  return { status, type: req.review_type };
}

function irb_continuing_review(req) {
  ensureStr(req.review_id, 'review_id');
  ensureNumber(req.days_until_continuing_review, 'days_until_review');
  ensureNumber(req.last_continuing_review_days, 'last_review_days');
  ensureNumber(req.enrollment_to_date, 'enrollment_to_date');
  ensureBool(req.last_review_submitted, 'last_review_submitted');
  ensureBool(req.adverse_summary_attached, 'ae_summary');
  ensureEnum(req.status, 'status', ['on_track','approaching_due','overdue','suspended','closed','not_applicable','other']);

  let status;
  if (req.status === 'overdue') status = 'overdue_immediate_submission_required';
  else if (req.days_until_continuing_review < 30 && req.last_review_days > 365) status = 'over_year_since_last_review';
  else if (!req.last_review_submitted) status = 'last_submission_required';
  else if (!req.adverse_summary_attached) status = 'adverse_summary_required';
  else status = 'continuing_review_on_track';
  return { status, days: req.days_until_continuing_review };
}

function irb_adverse_report(req) {
  ensureStr(req.report_id, 'report_id');
  ensureEnum(req.report_type, 'report_type', ['sae_summary','suspicious_susar','protocol_violation_serious','annual_safety','withdrawal_summary','other']);
  ensureNumber(req.days_to_report, 'days_to_report');
  ensureBool(req.irb_notified, 'irb_notified');
  ensureBool(req.acknowledgment_received, 'acknowledgment');
  ensureEnum(req.acknowledgment_status, 'acknowledgment_status', ['acknowledged','acknowledged_with_action','no_response','pending','rejected','other']);

  let status;
  if (req.report_type === 'suspicious_susar' && req.days_to_report > 10) status = 'susar_over_10d_immediate_review';
  else if (!req.irb_notified) status = 'irb_notification_required';
  else if (req.acknowledgment_status === 'rejected') status = 'irb_rejected_review_response';
  else if (!req.acknowledgment) status = 'acknowledgment_required';
  else status = 'irb_adverse_report_documented';
  return { status, days: req.days_to_report };
}

function irb_review_quorum(req) {
  ensureStr(req.review_id, 'review_id');
  ensureNumber(req.members_present, 'members_present');
  ensureNumber(req.quorum_required, 'quorum_required');
  ensureBool(req.diverse_membership, 'diverse');
  ensureBool(req.unaffiliated_present, 'unaffiliated');
  ensureBool(req.scientific_member_present, 'scientific');
  ensureBool(req.conflict_of_interest_review, 'coi_review');
  ensureBool(req.minutes_recorded, 'minutes');

  let status;
  if (req.members_present < req.quorum_required) status = 'quorum_not_met_review_invalid';
  else if (!req.diverse_membership) status = 'diverse_membership_required';
  else if (!req.unaffiliated_present) status = 'unaffiliated_member_required';
  else if (!req.scientific_member_present) status = 'scientific_member_required';
  else if (!req.coi_review) status = 'coi_review_required';
  else if (!req.minutes_recorded) status = 'minutes_required';
  else status = 'quorum_and_review_complete';
  return { status, present: req.members_present };
}

function irb_decision(req) {
  ensureStr(req.submission_id, 'submission_id');
  ensureEnum(req.decision, 'decision', ['approved','conditionally_approved','deferred','rejected','withdrawn','not_required','pending','other']);
  ensureBool(req.decision_documented, 'decision_documented');
  ensureBool(req.decision_letter_sent, 'letter_sent');
  ensureNumber(req.conditions_count, 'conditions_count');
  ensureBool(req.investigator_reviewed, 'investigator_reviewed');

  let status;
  if (req.decision === 'pending') status = 'decision_pending';
  else if (!req.decision_documented) status = 'decision_documentation_required';
  else if (!req.decision_letter_sent) status = 'decision_letter_required';
  else if (req.decision === 'conditionally_approved' && !req.investigator_reviewed) status = 'conditional_requires_investigator_acceptance';
  else if (req.decision === 'rejected') status = 'rejected_documented';
  else status = 'irb_decision_documented';
  return { status, decision: req.decision };
}

function funcs() { return { irb_submission, irb_continuing_review, irb_adverse_report, irb_review_quorum, irb_decision }; }
module.exports = { funcs, CITATIONS, ValidationError };