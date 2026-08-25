// filepath: tier7_pop_health_ext_101_registry_engine.js
// TIER7_POP_HEALTH_EXT-101: Disease registry management
'use strict';

const CITATIONS = [
  'AHA_REGISTRIES_2021',
  'CDC_DISEASE_REGISTRY_2020',
  'WHO_NCD_REGISTRY_2018',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}

function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function registry_enroll(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.registry_type, 'registry_type', ['diabetes','heart_failure','stroke','cancer_breast','cancer_colorectal','cancer_lung','ckd','copd','asthma','mi','ra','ibs','epilepsy','obesity','hypertension']);
  ensureStr(req.diagnosis_date, 'diagnosis_date');
  ensureNumber(req.confirmation_count, 'confirmation_count');
  ensureBool(req.consent_to_registry, 'consent_to_registry');
  ensureStr(req.enrolling_provider_id, 'enrolling_provider_id');

  let eligibility;
  if (!req.consent_to_registry) eligibility = 'consent_required_first';
  else if (req.confirmation_count < 1) eligibility = 'awaiting_clinical_confirmation';
  else eligibility = 'enrolled';

  return { eligibility, registry: req.registry_type, enrolled_date: req.diagnosis_date };
}

function registry_prevalence(req) {
  ensureEnum(req.registry_type, 'registry_type', ['diabetes','heart_failure','stroke','cancer_breast','cancer_colorectal','cancer_lung','ckd','copd','asthma','mi','ra','ibs','epilepsy','obesity','hypertension']);
  ensureNumber(req.cases_in_population, 'cases_in_population');
  ensureNumber(req.total_population, 'total_population');
  ensureNumber(req.year, 'year');
  ensureEnum(req.demographic, 'demographic', ['all','pediatric','adult','geriatric','female','male','urban','rural']);

  const prevalence_rate = req.cases_in_population / req.total_population;
  let band;
  if (prevalence_rate > 0.2) band = 'very_high_prevalence_public_health_priority';
  else if (prevalence_rate > 0.1) band = 'high_prevalence_targeted_intervention';
  else if (prevalence_rate > 0.05) band = 'moderate_prevalence_monitoring';
  else if (prevalence_rate > 0.01) band = 'low_prevalence_surveillance';
  else band = 'rare_specialized_care';

  return { prevalence_pct: Math.round(prevalence_rate * 10000) / 100, band, year: req.year };
}

function registry_outcomes(req) {
  ensureStr(req.registry_type, 'registry_type');
  ensureNumber(req.enrolled_count, 'enrolled_count');
  ensureNumber(req.deaths_count, 'deaths_count');
  ensureNumber(req.complications_count, 'complications_count');
  ensureNumber(req.readmissions_count, 'readmissions_count');
  ensureNumber(req.followup_years, 'followup_years');

  const mortality_rate = req.enrolled_count > 0 ? req.deaths_count / req.enrolled_count : 0;
  const complication_rate = req.enrolled_count > 0 ? req.complications_count / req.enrolled_count : 0;
  const readmission_rate = req.enrolled_count > 0 ? req.readmissions_count / req.enrolled_count : 0;

  let severity;
  if (mortality_rate > 0.1) severity = 'high_mortality_review_care_pathway';
  else if (complication_rate > 0.2) severity = 'high_complications_quality_review';
  else if (readmission_rate > 0.15) severity = 'high_readmission_review_discharge_planning';
  else severity = 'within_expected_range';

  return { mortality_pct: Math.round(mortality_rate * 1000) / 10, complication_pct: Math.round(complication_rate * 1000) / 10, severity };
}

function registry_quality(req) {
  ensureStr(req.registry_type, 'registry_type');
  ensureNumber(req.total_eligible, 'total_eligible');
  ensureNumber(req.received_standard_care, 'received_standard_care');
  ensureNumber(req.process_measures_passed, 'process_measures_passed');
  ensureNumber(req.outcome_measures_passed, 'outcome_measures_passed');
  ensureNumber(req.patient_reported_passes, 'patient_reported_passes');

  const total = req.total_eligible * 4;
  const passed = req.process_measures_passed + req.outcome_measures_passed + req.patient_reported_passes;
  const compliance_rate = req.total_eligible > 0 ? req.received_standard_care / req.total_eligible : 0;

  let band;
  if (compliance_rate >= 0.9 && passed / total >= 0.8) band = 'excellent_quality_top_quartile';
  else if (compliance_rate >= 0.75) band = 'good_quality';
  else if (compliance_rate >= 0.5) band = 'moderate_improvement_needed';
  else band = 'low_priority_action';

  return { compliance_pct: Math.round(compliance_rate * 1000) / 10, band };
}

function registry_report(req) {
  ensureStr(req.registry_type, 'registry_type');
  ensureStr(req.report_period, 'report_period');
  ensureBool(req.include_phi, 'include_phi');
  ensureEnum(req.format, 'format', ['pdf','csv','json','fhir','registry_native']);
  ensureNumber(req.measure_count, 'measure_count');

  let warning;
  if (req.include_phi && req.format === 'csv') warning = 'phi_in_csv_use_encrypted_channel';
  else if (req.include_phi && req.format === 'json') warning = 'phi_in_json_require_encryption_at_rest';
  else warning = 'no_phi_risk';

  return { report_status: 'queued', format: req.format, measure_count: req.measure_count, warning };
}

function funcs() { return { registry_enroll, registry_prevalence, registry_outcomes, registry_quality, registry_report }; }
module.exports = { funcs, CITATIONS, ValidationError };