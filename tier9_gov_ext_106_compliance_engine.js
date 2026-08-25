// filepath: tier9_gov_ext_106_compliance_engine.js
// TIER9_GOV_EXT-106: Regulatory compliance (CBAHI, ZATCA, NPHIES, MoH)
'use strict';

const CITATIONS = ['CBAHI_NATIONAL_2024','ZATCA_PHASE2_2024','NPHIES_2024','MOH_KSA_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function compliance_assess(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.standard, 'standard', ['cbahi_national_hospital','cbahi_primary_care','cbahi_lab','cbahi_imaging','zatca_phase1','zatca_phase2','nphies_claim','nphies_eligibility','moh_facility_license','moh_dental','moh_pharmacy','moh_lab_quality','jci_hospital','iso_9001','iso_27001','iso_27799']);
  ensureNumber(req.chapters_total, 'chapters_total');
  ensureNumber(req.chapters_met, 'chapters_met');
  ensureNumber(req.chapters_partial, 'chapters_partial');
  ensureNumber(req.chapters_not_met, 'chapters_not_met');

  const met_rate = req.chapters_total > 0 ? req.chapters_met / req.chapters_total : 0;
  let accreditation_band;
  if (req.standard === 'cbahi_national_hospital') {
    if (met_rate >= 0.95) accreditation_band = 'excellent_3_year_accreditation';
    else if (met_rate >= 0.85) accreditation_band = 'good_2_year_accreditation';
    else if (met_rate >= 0.75) accreditation_band = 'conditional_1_year';
    else if (met_rate >= 0.6) accreditation_band = 'conditional_6_months';
    else accreditation_band = 'denied_action_required';
  } else if (req.standard === 'zatca_phase2') {
    if (met_rate >= 0.95) accreditation_band = 'phase2_ready';
    else if (met_rate >= 0.8) accreditation_band = 'phase2_90_days_to_comply';
    else accreditation_band = 'phase2_not_ready_risk';
  } else {
    if (met_rate >= 0.9) accreditation_band = 'accreditation_ready';
    else if (met_rate >= 0.75) accreditation_band = 'near_ready';
    else accreditation_band = 'significant_gaps';
  }
  return { accreditation_band, met_pct: Math.round(met_rate * 1000) / 10, standard: req.standard };
}

function compliance_gap(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureStr(req.requirement_id, 'requirement_id');
  ensureStr(req.description, 'description');
  ensureEnum(req.priority, 'priority', ['critical','major','minor','observation']);
  ensureNumber(req.estimated_remediation_days, 'estimated_remediation_days');
  ensureNumber(req.estimated_cost, 'estimated_cost');
  ensureBool(req.dependent_on_third_party, 'dependent_on_third_party');

  let remediation_plan;
  if (req.priority === 'critical' && req.estimated_remediation_days > 30) remediation_plan = 'critical_priority_escalate_executive';
  else if (req.dependent_on_third_party && req.estimated_remediation_days < 60) remediation_plan = 'third_party_blocked_extend_timeline';
  else if (req.estimated_cost > 1000000) remediation_plan = 'high_cost_need_executive_approval';
  else if (req.estimated_remediation_days <= 90) remediation_plan = 'remediation_plan_within_3_months';
  else remediation_plan = 'remediation_plan_extended_6_months';
  return { remediation_plan, priority: req.priority };
}

function compliance_submit(req) {
  ensureStr(req.submission_id, 'submission_id');
  ensureEnum(req.regulator, 'regulator', ['cbahi','zatca','nphies','moh','sfda','cchi','gaht','other']);
  ensureEnum(req.submission_type, 'submission_type', ['self_declaration','audit_report','corrective_action','license_renewal','incident_disclosure','data_request','quality_metrics']);
  ensureNumber(req.days_to_deadline, 'days_to_deadline');
  ensureBool(req.complete_documentation, 'complete_documentation');
  ensureBool(req.management_signoff, 'management_signoff');

  let submission_status;
  if (!req.management_signoff) submission_status = 'management_signoff_required_blocking';
  else if (!req.complete_documentation) submission_status = 'documentation_incomplete_blocking';
  else if (req.days_to_deadline < 7) submission_status = 'urgent_submit_immediately';
  else if (req.days_to_deadline < 30) submission_status = 'submit_within_2_weeks';
  else submission_status = 'ready_submit_planned';
  return { submission_status, regulator: req.regulator };
}

function compliance_followup(req) {
  ensureStr(req.submission_id, 'submission_id');
  ensureNumber(req.days_since_submission, 'days_since_submission');
  ensureBool(req.regulator_response_received, 'regulator_response_received');
  ensureEnum(req.response_type, 'response_type', ['approved','conditional_approval','rejected','queries_raised','acknowledged','no_response_yet']);
  ensureNumber(req.action_items_count, 'action_items_count');

  let followup_status;
  if (!req.regulator_response_received && req.days_since_submission > 30) followup_status = 'overdue_followup_with_regulator';
  else if (req.response_type === 'queries_raised' && req.action_items_count > 0) followup_status = 'address_queries_priority';
  else if (req.response_type === 'rejected') followup_status = 'appeal_or_re_submission_review';
  else if (req.regulator_response_received) followup_status = 'received_archived';
  else followup_status = 'awaiting_response_normal';
  return { followup_status, days: req.days_since_submission };
}

function compliance_dashboard(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.assessments_total, 'assessments_total');
  ensureNumber(req.assessments_passed, 'assessments_passed');
  ensureNumber(req.open_findings_critical, 'open_findings_critical');
  ensureNumber(req.open_findings_major, 'open_findings_major');
  ensureNumber(req.upcoming_deadlines, 'upcoming_deadlines');
  ensureNumber(req.upcoming_renewals, 'upcoming_renewals');

  let summary;
  if (req.open_findings_critical >= 5) summary = 'critical_findings_priority_executive_review';
  else if (req.upcoming_deadlines >= 5) summary = 'deadline_burden_allocate_resources';
  else if (req.upcoming_renewals >= 3) summary = 'multiple_renewals_coordinate';
  else if (req.assessments_passed / Math.max(req.assessments_total, 1) >= 0.9) summary = 'high_compliance_posture';
  else summary = 'maintain_current_posture';
  return { summary, critical_findings: req.open_findings_critical, deadlines: req.upcoming_deadlines };
}

function funcs() { return { compliance_assess, compliance_gap, compliance_submit, compliance_followup, compliance_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };