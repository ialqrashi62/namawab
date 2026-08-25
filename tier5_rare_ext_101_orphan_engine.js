// filepath: tier5_rare_ext_101_orphan_engine.js
// TIER5_RARE_EXT-101: Orphan drug/rare disease (gating, compassionate use, registry)
'use strict';

const CITATIONS = [
  'FDA_Orphan_Drug_Designation_2013',
  'EMA_Orphan_Regulation_1999_2000',
  'GAO_Orphan_Drug_Report',
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

function prevalence_gating(req) {
  ensureStr(req.disease, 'disease');
  ensureStr(req.country, 'country');
  ensureEnum(req.country, 'country', ['us','eu','ksa','gcc']);
  ensureNumber(req.us_prevalence_per_100k, 'us_prevalence_per_100k');
  if (req.us_prevalence_per_100k <= 0) throw new ValidationError('prevalence >0', 'us_prevalence_per_100k');

  const thresholds = { us: 200, eu: 50, ksa: 200, gcc: 200 };
  const threshold = thresholds[req.country];
  const eligible = req.us_prevalence_per_100k < threshold;
  return {
    disease: req.disease,
    country: req.country,
    prevalence_per_100k: req.us_prevalence_per_100k,
    threshold_per_100k: threshold,
    eligible,
    notes: eligible ? 'orphan_designation_eligible_with_no_alternative_therapy' : 'not_orphan_in_country_likely_standard_pathway',
    citations: CITATIONS,
  };
}

function compassionate_use(req) {
  ensureStr(req.disease, 'disease');
  ensureBool(req.fda_approved_alternative, 'fda_approved_alternative');
  ensureBool(req.documented_response_to_drug, 'documented_response_to_drug');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureNumber(req.physician_investigator_experience_yrs, 'physician_investigator_experience_yrs');
  ensureNumber(req.expected_burden_qol, 'expected_burden_qol');

  if (!req.consent_signed) return { verdict: 'consent_required_before_drug_dispensing', citation: CITATIONS[0] };
  if (req.fda_approved_alternative && !req.documented_response_to_drug) return { verdict: 'must_have_documented_failure_of_approved_therapy' };

  let eligible;
  if (req.documented_response_to_drug || req.fda_approved_alternative === false || (req.expected_burden_qol >= 7 && req.physician_investigator_experience_yrs >= 2)) eligible = true;

  return { verdict: eligible ? 'compassionate_use_appropriate' : 'explore_other_pathway_eg_clinical_trial', eligible, citation: CITATIONS[0] };
}

function orphan_registry(req) {
  ensureStr(req.registry_name, 'registry_name');
  ensureStr(req.funding_source, 'funding_source');
  ensureEnum(req.funding_source, 'funding_source', ['government','manufacturer','academic','patient_foundation']);
  ensureStr(req.region, 'region');
  ensureEnum(req.region, 'region', ['us','eu','gcc','global']);
  ensureNumber(req.expected_data_points_per_patient, 'expected_data_points_per_patient');

  return {
    registry_name: req.registry_name,
    funding_source: req.funding_source,
    region: req.region,
    site: 'nama_medical',
    data_points_per_patient: req.expected_data_points_per_patient,
    notes: 'enroll_minor_consent_previously_obtained_listed_in_EHR_patient_summary',
    citations: CITATIONS,
  };
}

function genetic_testing_referral(req) {
  ensureNumber(req.degree_affected_first_relatives, 'degree_affected_first_relatives');
  ensureBool(req.diagnosis_unknown, 'diagnosis_unknown');
  ensureBool(req.multisystem_involvement, 'multisystem_involvement');
  ensureBool(req.congenital_onset, 'congenital_onset');
  ensureNumber(req.exome_sequencing_results_status, 'exome_sequencing_results_status'); // 0 pending, 1 done, 2 inconclusive

  let referral;
  if (req.diagnosis_unknown && (req.congenital_onset || req.multisystem_involvement || req.degree_affected_first_relatives >= 2)) referral = 'WES_or_WGS_high_priority_with_genetic_counseling';
  else if (req.diagnosis_unknown) referral = 'consider_trio_exome_or_panel';
  else referral = 'no_genetic_testing_needed_for_diagnostic_decision';

  return {
    diagnosis_unknown: req.diagnosis_unknown,
    affected_first_relatives: req.degree_affected_first_relatives,
    referral_priority: referral,
    citation: CITATIONS[1],
  };
}

function clinical_trial_match(req) {
  ensureStr(req.disease_code, 'disease_code');
  ensureStr(req.phase, 'phase');
  ensureEnum(req.phase, 'phase', ['I','II','III','IV']);
  ensureNumber(req.age, 'age');
  ensureBool(req.trial_in_country, 'trial_in_country');
  ensureStr(req.trial_line_of_therapy, 'trial_line_of_therapy');
  ensureEnum(req.trial_line_of_therapy, 'trial_line_of_therapy', ['first_line','second_line','third_or_more_line','maintenance','any']);

  if (!req.trial_in_country) return { verdict: 'refer_to_international_centers_via_genetic_counseling' };

  return {
    verdict: 'eligible_match',
    disease_code: req.disease_code,
    phase: req.phase,
    age: req.age,
    line: req.trial_line_of_therapy,
    next_step: 'clinical_team_screening_and_scheduled_consent_within_2_weeks',
    citation: CITATIONS[2],
  };
}

function funcs() {
  return { prevalence_gating, compassionate_use, orphan_registry, genetic_testing_referral, clinical_trial_match };
}

module.exports = { funcs, CITATIONS, ValidationError };
