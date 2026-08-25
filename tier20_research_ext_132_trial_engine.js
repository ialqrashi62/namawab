// filepath: tier20_research_ext_132_trial_engine.js
// TIER20_RESEARCH_EXT-132: Clinical trial protocol & enrollment
'use strict';

const CITATIONS = ['ICH_GCP_E6_2024','FDA_21CFR50_2024','NIH_INVEST_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function trial_enrollment(req) {
  ensureStr(req.trial_id, 'trial_id');
  ensureStr(req.subject_id, 'subject_id');
  ensureEnum(req.phase, 'phase', ['phase_1','phase_1_2','phase_2','phase_2_3','phase_3','phase_4','observational','registry','expanded_access','compassionate_use','other']);
  ensureNumber(req.target_enrollment, 'target_enrollment');
  ensureNumber(req.current_enrollment, 'current_enrollment');
  ensureNumber(req.screening_failures_30d, 'screening_failures');
  ensureBool(req.informed_consent_documented, 'consent_documented');
  ensureEnum(req.consent_type, 'consent_type', ['study','consent_for_future_research','consent_for_genetic','consent_for_data','consent_for_tissue','consent_for_imaging','waiver','other']);

  let status;
  if (!req.informed_consent_documented) status = 'consent_documented_required_blocking';
  else if (req.current_enrollment >= req.target_enrollment) status = 'target_met_close_to_accrual';
  else if (req.screening_failures > req.current_enrollment * 0.5) status = 'over_50pct_screen_fail_review_protocol';
  else status = 'enrollment_appropriate';
  return { status, phase: req.phase };
}

function trial_eligibility(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureBool(req.inclusion_criteria_met, 'inclusion_met');
  ensureBool(req.exclusion_criteria_absent, 'exclusion_absent');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.pregnancy_excluded, 'pregnancy_excluded');
  ensureBool(req.investigator_signoff, 'investigator_signoff');
  ensureNumber(req.number_exclusion_violated, 'exclusion_violated_count');

  let status;
  if (!req.inclusion_criteria_met) status = 'inclusion_criteria_not_met_blocking';
  else if (!req.exclusion_criteria_absent) status = 'exclusion_criteria_present_blocking';
  else if (!req.consent_signed) status = 'consent_required_blocking';
  else if (!req.pregnancy_excluded && !req.investigator_signoff) status = 'pregnancy_excluded_required_or_signoff';
  else if (req.number_exclusion_violated > 0) status = 'violations_present_review_pi';
  else status = 'eligible_to_enroll';
  return { status, eligible: true };
}

function trial_adverse(req) {
  ensureStr(req.event_id, 'event_id');
  ensureEnum(req.event_type, 'event_type', ['ae','sae','serious_related_unexpected','death','life_threatening','disability','congenital_anomaly','medically_significant','other']);
  ensureEnum(req.causality, 'causality', ['not_related','unlikely','possible','probable','definite','unknown','other']);
  ensureEnum(req.expectedness, 'expectedness', ['expected','unexpected','unknown','other']);
  ensureNumber(req.days_from_start, 'days_from_start');
  ensureBool(req.reported_to_irb, 'reported_to_irb');
  ensureBool(req.reported_to_sponsor, 'reported_to_sponsor');
  ensureBool(req.serious_documented, 'serious_documented');

  let status;
  if (req.event_type === 'sae' && req.expectedness === 'unexpected' && req.causality !== 'not_related') status = 'suspicious_susar_24h_to_irb';
  else if (req.event_type === 'death' && req.causality !== 'not_related') status = 'death_24h_ind_required';
  else if (req.event_type === 'sae' && !req.reported_to_irb) status = 'sae_24h_report_required';
  else if (req.event_type === 'sae' && !req.reported_to_sponsor) status = 'sponsor_report_required_with_24h';
  else status = 'ae_sae_documented';
  return { status, type: req.event_type };
}

function trial_protocol_deviation(req) {
  ensureStr(req.deviation_id, 'deviation_id');
  ensureEnum(req.deviation_type, 'deviation_type', ['inclusion_violation','exclusion_violation','consent_not_obtained','wrong_dose','missed_visit','late_lab','missed_lab','unapproved_concomitant_med','visit_outside_window','sample_processing','other']);
  ensureEnum(req.severity, 'severity', ['minor','major','critical','serious','other']);
  ensureBool(req.safety_impact, 'safety_impact');
  ensureBool(req.reported_to_irb, 'reported_to_irb');
  ensureNumber(req.days_until_documented, 'days_until_documented');

  let status;
  if (req.severity === 'serious' && !req.reported_to_irb) status = 'serious_deviation_immediate_irb_review';
  else if (req.severity === 'critical' && req.days_until_documented > 5) status = 'critical_over_5d_late_review';
  else if (req.safety_impact && req.severity !== 'minor') status = 'safety_impact_review_pi';
  else status = 'deviation_documented';
  return { status, type: req.deviation_type };
}

function trial_closeout(req) {
  ensureStr(req.trial_id, 'trial_id');
  ensureBool(req.queries_resolved, 'queries_resolved');
  ensureBool(req.database_locked, 'database_locked');
  ensureBool(req.cra_signed_off, 'cra_signed_off');
  ensureBool(req.pi_signed_off, 'pi_signed_off');
  ensureBool(req.biospecimens_finalized, 'biospecimens_finalized');
  ensureBool(req.irb_closure_letter, 'irb_closure');

  let status;
  if (!req.queries_resolved) status = 'queries_must_be_resolved_first';
  else if (!req.database_locked) status = 'database_lock_required_for_closeout';
  else if (!req.pi_signed_off) status = 'pi_signoff_required';
  else if (!req.cra_signed_off) status = 'cra_signoff_required';
  else if (!req.irb_closure_letter) status = 'irb_closure_letter_required';
  else if (!req.biospecimens_finalized) status = 'biospecimens_finalization_required';
  else status = 'trial_closeout_complete';
  return { status, trial: req.trial_id };
}

function funcs() { return { trial_enrollment, trial_eligibility, trial_adverse, trial_protocol_deviation, trial_closeout }; }
module.exports = { funcs, CITATIONS, ValidationError };