// filepath: tier20_research_ext_133_consent_engine.js
// TIER20_RESEARCH_EXT-133: Research informed consent & re-consent
'use strict';

const CITATIONS = ['FDA_21CFR50_2024','IRB_2024','HIPAA_RESEARCH_2018'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function consent_obtain(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureStr(req.trial_id, 'trial_id');
  ensureBool(req.witness_present, 'witness');
  ensureBool(req.legally_authorized_representative, 'lar');
  ensureBool(req.subject_signed, 'subject_signed');
  ensureBool(req.investigator_signed, 'investigator_signed');
  ensureStr(req.consent_date, 'consent_date');
  ensureEnum(req.consent_version, 'consent_version', ['v1_original','v2_amended','v3_amended','v4_amended','v5_amended','v6_amended','v7_amended','v8_amended','v9_amended','v10_or_higher','not_applicable','other']);
  ensureBool(req.understanding_assessed, 'understanding_assessed');

  let status;
  if (!req.subject_signed) status = 'subject_signature_required_blocking';
  else if (!req.investigator_signed) status = 'investigator_signature_required_blocking';
  else if (!req.witness_present && !req.lar) status = 'witness_or_lar_required';
  else if (!req.understanding_assessed) status = 'understanding_must_be_assessed';
  else status = 'consent_obtained_documented';
  return { status, version: req.consent_version };
}

function consent_amend(req) {
  ensureStr(req.amendment_id, 'amendment_id');
  ensureStr(req.trial_id, 'trial_id');
  ensureBool(req.irb_approved, 'irb_approved');
  ensureBool(req.approval_documented, 'approval_documented');
  ensureBool(req.active_subjects_reconsented, 're_consented');
  ensureNumber(req.days_since_amendment, 'days_since_amendment');
  ensureNumber(req.active_subjects_count, 'active_subjects');

  let status;
  if (!req.irb_approved) status = 'irb_approval_required_before_amendment';
  else if (!req.approval_documented) status = 'amendment_approval_documentation_required';
  else if (!req.reconsented_active && req.days_since_amendment > 30) status = 'reconsent_overdue_30d_for_active_subjects';
  else status = 'consent_amendment_documented';
  return { status, active: req.active_subjects_count };
}

function consent_withdrawal(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureBool(req.withdrawal_documented, 'withdrawal_documented');
  ensureBool(req.subject_notified_investigator, 'subject_notified');
  ensureEnum(req.withdrawal_type, 'withdrawal_type', ['full_withdrawal','partial_data_only','partial_specimen','partial_future_contact','other']);
  ensureNumber(req.days_since_withdrawal, 'days_since_withdrawal');
  ensureBool(req.specimen_disposal_documented, 'specimen_disposal');

  let status;
  if (!req.withdrawal_documented) status = 'withdrawal_documentation_required';
  else if (req.withdrawal_type === 'full_withdrawal' && !req.specimen_disposal) status = 'full_withdrawal_requires_specimen_disposal';
  else if (!req.subject_notified_investigator) status = 'investigator_notification_required';
  else status = 'consent_withdrawal_documented';
  return { status, type: req.withdrawal_type };
}

function consent_minor(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.assent_obtained, 'assent');
  ensureBool(req.parent_consent_signed, 'parent_consent');
  ensureBool(req.second_parent_required, 'second_parent');
  ensureBool(req.second_parent_signed, 'second_parent_signed');
  ensureEnum(req.state_min_age_medical, 'state_min_age', ['infant','toddler','school_age','adolescent','adult','unknown','other']);
  ensureBool(req.mature_minor_documented, 'mature_minor');

  let status;
  if (req.age_years >= 18 && !req.parent_consent_signed && !req.mature_minor_documented) status = 'adult_self_consent_required';
  else if (req.age_years < 18 && !req.parent_consent_signed) status = 'parent_consent_required_for_minor';
  else if (req.second_parent_required && !req.second_parent_signed) status = 'second_parent_required_two_consent';
  else if (!req.assent) status = 'child_assent_required_age_appropriate';
  else status = 'minor_consent_documented';
  return { status, age: req.age_years };
}

function consent_capacity(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureEnum(req.capacity_status, 'capacity_status', ['has_capacity','lacks_capacity','fluctuating_capacity','unknown','minors_ward_of_court','other']);
  ensureBool(req.capability_assessment, 'capability_assessed');
  ensureBool(req.lar_required, 'lar_required');
  ensureBool(req.lar_present, 'lar_present');
  ensureBool(req.lar_relationship_documented, 'lar_relationship');

  let status;
  if (req.capacity_status === 'has_capacity' && req.lar_required) status = 'has_capacity_no_lar_needed';
  else if (req.capacity_status === 'lacks_capacity' && req.lar_required && !req.lar_present) status = 'lar_required_present';
  else if (!req.capability_assessment) status = 'capability_must_be_assessed';
  else if (req.capacity_status === 'fluctuating_capacity') status = 'fluctuating_reassess_each_session';
  else status = 'capacity_documented';
  return { status, status_name: req.capacity_status };
}

function funcs() { return { consent_obtain, consent_amend, consent_withdrawal, consent_minor, consent_capacity }; }
module.exports = { funcs, CITATIONS, ValidationError };