// filepath: tier8_rc_ext_103_denial_engine.js
// TIER8_RC_EXT-103: Denial management (categorization, appeal, recovery, prevention)
'use strict';

const CITATIONS = ['CMS_DENIAL_MGMT_2023','HFMA_DENIAL_2024','MGMA_RECOVERY_2023'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function denial_categorize(req) {
  ensureStr(req.denial_id, 'denial_id');
  ensureEnum(req.denial_reason, 'denial_reason', ['authorization_missing','timely_filing','medical_necessity','coordination_of_benefits','eligibility_expired','coding_invalid','bundling','duplicate','noncovered_service','provider_out_of_network','documentation_insufficient','credentialing']);
  ensureNumber(req.denial_amount, 'denial_amount');
  ensureBool(req.payer_appeal_allowed, 'payer_appeal_allowed');
  ensureNumber(req.days_remaining_to_appeal, 'days_remaining_to_appeal');

  let action;
  if (req.days_remaining_to_appeal < 30) action = 'urgent_appeal_now';
  else if (req.denial_reason === 'authorization_missing') action = 'request_retroauth_then_appeal';
  else if (req.denial_reason === 'coding_invalid') action = 'recoded_resubmit_with_correct_codes';
  else if (req.denial_reason === 'medical_necessity') action = 'gather_clinical_evidence_appeal';
  else if (req.denial_reason === 'coordination_of_benefits') action = 'verify_other_insurance';
  else action = 'standard_appeal_process';

  return { action, denial: req.denial_reason, amount: req.denial_amount };
}

function denial_appeal(req) {
  ensureStr(req.denial_id, 'denial_id');
  ensureEnum(req.appeal_level, 'appeal_level', ['first_internal','second_external','iiro','alj','mac','federal_district','none']);
  ensureNumber(req.days_to_submit, 'days_to_submit');
  ensureStr(req.clinical_evidence_summary, 'clinical_evidence_summary');
  ensureBool(req.provider_support_letter, 'provider_support_letter');
  ensureBool(req.peer_to_peer_requested, 'peer_to_peer_requested');

  let readiness;
  if (req.days_to_submit < 7) readiness = 'urgent_appeal_imminent_deadline';
  else if (!req.provider_support_letter) readiness = 'obtain_provider_letter_first';
  else if (req.appeal_level === 'iiro' || req.appeal_level === 'alj') readiness = 'formal_hearing_prep_required';
  else if (req.appeal_level === 'first_internal') readiness = 'first_level_appeal_draft';
  else readiness = 'standard_appeal';

  return { readiness, level: req.appeal_level };
}

function denial_recovery(req) {
  ensureStr(req.denial_id, 'denial_id');
  ensureNumber(req.original_denied_amount, 'original_denied_amount');
  ensureNumber(req.recovered_amount, 'recovered_amount');
  ensureNumber(req.recovery_cost, 'recovery_cost');
  ensureNumber(req.recovery_days, 'recovery_days');
  ensureEnum(req.recovery_method, 'recovery_method', ['appeal','resubmission','corrected_c','direct_bill','write_off','settlement']);

  const net_recovery = req.recovered_amount - req.recovery_cost;
  const roi = req.recovery_cost > 0 ? net_recovery / req.recovery_cost : 0;
  let summary;
  if (net_recovery > 0 && roi >= 3) summary = 'high_roi_recovery';
  else if (net_recovery > 0) summary = 'positive_recovery';
  else if (net_recovery === 0) summary = 'breakeven';
  else summary = 'loss_review_workflow';

  return { summary, net_recovery, roi: Math.round(roi * 100) / 100 };
}

function denial_prevent(req) {
  ensureStr(req.denial_id, 'denial_id');
  ensureEnum(req.root_cause, 'root_cause', ['registration_error','eligibility_gap','authorization_missing','coding_error','documentation_gap','charge_capture_miss','provider_credentialing','duplicate_billing','timely_filing_miss','no_root_cause_identified']);
  ensureNumber(req.recurrence_count_30d, 'recurrence_count_30d');
  ensureBool(req.system_fix_deployed, 'system_fix_deployed');
  ensureStr(req.prevention_owner, 'prevention_owner');

  let priority;
  if (req.recurrence_count_30d >= 5 && !req.system_fix_deployed) priority = 'high_immediate_system_fix';
  else if (req.recurrence_count_30d >= 3) priority = 'moderate_education_audit';
  else if (req.root_cause === 'authorization_missing') priority = 'prior_auth_process_audit';
  else if (req.root_cause === 'coding_error') priority = 'coder_education';
  else priority = 'monitor_low_priority';

  return { priority, root_cause: req.root_cause, recurrence: req.recurrence_count_30d };
}

function denial_dashboard(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.claims_submitted, 'claims_submitted');
  ensureNumber(req.claims_denied, 'claims_denied');
  ensureNumber(req.denial_dollars, 'denial_dollars');
  ensureNumber(req.recovered_dollars, 'recovered_dollars');
  ensureNumber(req.open_denials, 'open_denials');

  const denial_rate = req.claims_submitted > 0 ? req.claims_denied / req.claims_submitted : 0;
  const recovery_rate = req.denial_dollars > 0 ? req.recovered_dollars / req.denial_dollars : 0;
  let summary;
  if (denial_rate >= 0.1) summary = 'high_denial_rate_priority_action';
  else if (denial_rate >= 0.05) summary = 'above_industry_average';
  else if (denial_rate >= 0.02) summary = 'within_average';
  else summary = 'top_quartile_low_denial';

  return { denial_rate_pct: Math.round(denial_rate * 1000) / 10, recovery_pct: Math.round(recovery_rate * 1000) / 10, summary, open: req.open_denials };
}

function funcs() { return { denial_categorize, denial_appeal, denial_recovery, denial_prevent, denial_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };