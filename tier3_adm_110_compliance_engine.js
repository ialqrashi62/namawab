/**
 * TIER3_ADM-110 Regulatory / Compliance Engine
 * Regulatory dashboard + Accreditation readiness + Privacy compliance + Mandatory reporting + Contracts
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CBAHI_STANDARDS: 'CBAHI Hospital Standards 4th Edition', JCI_HOSP: 'JCI Hospital Standards 8th Edition', PDPL: 'Saudi PDPL 2024' };

function regulatoryComplianceDashboard(input) {
  const { license_valid, licenses_expiring_30d, inspection_findings_open, regulatory_violations, license_status, certificate_validity, statutory_compliance_pct } = input;
  let dashboard = {
    licenses: { valid: license_valid, expiring_30d: licenses_expiring_30d, status: license_status },
    inspections: { findings_open: inspection_findings_open },
    violations: regulatory_violations,
    certificates_valid: certificate_validity,
    compliance_pct: statutory_compliance_pct + 'pct'
  };
  let alert_level = 'green_all_current';
  if (licenses_expiring_30d >= 3) alert_level = 'yellow_imminent_expirations_renewal_required';
  if (license_valid === 'no' || regulatory_violations === 'critical') alert_level = 'RED_immediate_action';
  return {
    dashboard, alert_level,
    action_items: ['renew_expiring_licenses_Q3_months_before_expiry', 'address_open_inspection_findings_with_CAPA', 'maintain_certificates_with_audit_Q_month', 'document_compliance_with_evidence_per_standard'],
    citation: CITATIONS.CBAHI_STANDARDS,
  };
}

function accreditationReadiness(input) {
  const { cbihi_or_jci_standard, chapter_or_function_assessed, evidence_collection_pct, tracers_planned, mock_survey_recent_findings, leadership_walkthroughs, gemba_walks, time_to_survey_months } = input;
  let readiness = 'not_ready_evidence_collection_less_than_50pct';
  if (evidence_collection_pct >= 90) readiness = 'READY_for_survey_submission_with_trace_documentation';
  else if (evidence_collection_pct >= 70) readiness = 'near_ready_close_gaps_in_4_to_8_weeks';
  else if (evidence_collection_pct >= 50) readiness = 'developing_continue_evidence_collection_and_tracer_preparation';
  let tracer_methodology = tracers_planned === 'yes' ? 'individual_patient_tracer_with_follow_through_care_delivery_services' : 'develop_tracer_methodology_with_Q12_individual_patients_Q4_system_tracers';
  return {
    readiness, tracer_methodology,
    preparation: ['chapter_function_review_with_evidence_per_measurable_element', 'leadership_walkthroughs_with_quality_team_Q_month', 'mock_survey_with_experienced_surveyor', 'closing_gaps_from_mock_findings_with_CAPA'],
    time_to_survey: time_to_survey_months + '_months',
    citation: CITATIONS.JCI_HOSP,
  };
}

function privacyComplianceCheck(input) {
  const { phi_access_logged, encryption_at_rest, encryption_in_transit, access_controls_in_place, breach_notification_process, pdpl_consent_obtained, data_subject_rights_process, third_party_data_sharing_agreements, retention_policy_defined } = input;
  let compliance = {
    phi_logging: phi_access_logged === 'yes',
    encryption_rest: encryption_at_rest === 'yes',
    encryption_transit: encryption_in_transit === 'yes',
    access_controls: access_controls_in_place === 'yes',
    breach_notification: breach_notification_process === 'yes',
    pdpl_consent: pdpl_consent_obtained === 'yes',
    dpo_appointed: data_subject_rights_process === 'yes',
    third_party_agreements: third_party_data_sharing_agreements === 'yes',
    retention_policy: retention_policy_defined === 'yes'
  };
  let gaps = Object.entries(compliance).filter(([k, v]) => !v).map(([k]) => k);
  return {
    compliance, gaps,
    pdpl_requirements: ['appoint_data_protection_officer', 'obtain_explicit_consent_for_phi_processing', 'provide_data_subject_access_rights_access_correction_erasure', 'maintain_phi_in_Saudi_Arabia_data_residency_per_regulation', 'breach_notification_within_72h_to_authority', 'third_party_agreements_with_data_processors'],
    citation: CITATIONS.PDPL,
  };
}

function mandatoryReportingRequirements(input) {
  const { report_type, due_date, reporting_authority, format_required, prior_report_history, automated_reporting_in_place, escalation_required_for_late } = input;
  let types = [
    'CBAHI_quality_indicators_Q_quarter',
    'MOH_administrative_data_Q_month',
    'communicable_diseases_within_24h_per_public_health_law',
    'adverse_drug_events_per_NPC_pharmacovigilance',
    'medical_device_adverse_events_per_SFDA',
    'birth_and_death_registration_within_30d',
    'occupational_health_incidents_to_MOL',
    'radiation_safety_events_to_king_fahd_nuclear_authority',
    'PHI_breach_within_72h_to_SDAIA_per_PDPL'
  ];
  let plan = reporting_authority + ' by ' + due_date + ' in ' + format_required;
  if (automated_reporting_in_place === 'yes') plan = plan + ' automated_extract_and_submit';
  return {
    plan, types,
    compliance_status: 'review_Q_month_Q_year_audit_with_evidence_of_submission_and_authority_acknowledgment',
    escalation: escalation_required_for_late === 'yes' ? 'compliance_team_or_DPO_review_for_root_cause_and_CAPA' : 'monitored_dashboard_with_due_date_alerts',
    citation: CITATIONS.CBAHI_STANDARDS,
  };
}

function contractManagement(input) {
  const { contract_type, expiry_within_90d, auto_renewal_clause, performance_metrics_in_contract, financial_terms_documented, insurance_coverage_requirements_met, termination_clause_reviewed, annual_review_completed } = input;
  let status = 'current_active';
  if (expiry_within_90d === 'yes') status = 'EXPIRING_within_90d_renewal_initiated';
  if (auto_renewal_clause === 'yes' && expiry_within_90d === 'yes') status = 'EXPIRING_auto_renewal_with_review_required';
  if (annual_review_completed !== 'yes') status = 'REVIEW_PENDING_Q_quarter_review_with_legal_and_finance';
  return {
    status,
    elements: ['scope_of_services_and_obligations', 'performance_metrics_and_SLA_with_penalties_or_bonuses', 'financial_terms_payment_schedule_rate_adjustments', 'insurance_coverage_professional_liability_and_general_liability', 'termination_clause_with_notice_period', 'dispute_resolution_mechanism', 'data_protection_PDPL_compliance_clauses', 'annual_review_for_renewal_or_amendment'],
    citation: CITATIONS.JCI_HOSP,
  };
}

module.exports = { regulatoryComplianceDashboard, accreditationReadiness, privacyComplianceCheck, mandatoryReportingRequirements, contractManagement, CITATIONS, ValidationError };